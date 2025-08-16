import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { UserSession } from '../entities/UserSession';
import { TwoFactorSecret } from '../entities/TwoFactorSecret';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ApiResponse } from '@/shared/types';

export interface AuthenticationResult {
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  deviceTrusted: boolean;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export class AuthService {
  private readonly accessTokenRateLimiter: RateLimiterMemory;
  private readonly loginAttemptLimiter: RateLimiterMemory;
  private readonly otpRateLimiter: RateLimiterMemory;

  constructor(
    private userRepo: Repository<User>,
    private sessionRepo: Repository<UserSession>,
    private twoFactorRepo: Repository<TwoFactorSecret>,
  ) {
    // Rate limiters for security
    this.accessTokenRateLimiter = new RateLimiterMemory({
      points: 10, // Number of attempts
      duration: 900, // Per 15 minutes
    });

    this.loginAttemptLimiter = new RateLimiterMemory({
      points: 5, // 5 attempts
      duration: 900, // Per 15 minutes
      blockDuration: 1800, // Block for 30 minutes
    });

    this.otpRateLimiter = new RateLimiterMemory({
      points: 3, // 3 OTP requests
      duration: 300, // Per 5 minutes
    });
  }

  async authenticateWithPhone(
    phone: string,
    otp: string,
    deviceFingerprint: string,
    ipAddress: string
  ): Promise<ApiResponse<AuthenticationResult>> {
    try {
      // Rate limiting check
      try {
        await this.loginAttemptLimiter.consume(phone);
      } catch (rateLimitReached) {
        return {
          success: false,
          message: 'Too many login attempts. Please try again later.',
          errors: ['RATE_LIMIT_EXCEEDED'],
        };
      }

      // Verify OTP (implement OTP verification logic)
      const isValidOTP = await this.verifyOTP(phone, otp);
      if (!isValidOTP) {
        return {
          success: false,
          message: 'Invalid OTP',
          errors: ['INVALID_OTP'],
        };
      }

      // Get or create user
      const user = await this.findOrCreateUser(phone);
      if (!user) {
        return {
          success: false,
          message: 'Failed to create or find user',
          errors: ['USER_CREATION_FAILED'],
        };
      }

      // Device tracking for security
      await this.trackDeviceLogin(user.id, deviceFingerprint, ipAddress);

      // Generate secure tokens
      const tokens = await this.generateSecureTokens(user);

      // Log successful authentication
      await this.logAuthenticationEvent(user.id, 'login_success', {
        device: deviceFingerprint,
        ip: ipAddress,
        timestamp: new Date(),
      });

      return {
        success: true,
        data: {
          user: this.sanitizeUserData(user),
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: 3600, // 1 hour
          deviceTrusted: await this.isDeviceTrusted(user.id, deviceFingerprint),
        },
        message: 'Authentication successful',
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: 'Authentication failed',
        errors: ['INTERNAL_ERROR'],
      };
    }
  }

  async generateSecureTokens(user: User): Promise<TokenPair> {
    // JWT payload with minimal data
    const payload = {
      sub: user.id,
      householdId: user.householdId,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      jti: this.generateJTI(), // Unique token ID for revocation
    };

    // Short-lived access token
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'fallback-secret', {
      expiresIn: '1h',
    });

    // Longer-lived refresh token
    const refreshToken = jwt.sign(
      { 
        sub: user.id, 
        type: 'refresh',
        jti: this.generateJTI(),
      },
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      {
        expiresIn: '30d',
      }
    );

    // Store refresh token hash for revocation capability
    await this.storeRefreshTokenHash(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async setupTwoFactorAuthentication(userId: string): Promise<ApiResponse<TwoFactorSetup>> {
    try {
      // Generate TOTP secret
      const secret = speakeasy.generateSecret({
        name: 'MindfulMeals',
        account: userId,
        issuer: 'MindfulMeals App',
      });

      // Store secret (encrypted) in database
      await this.storeTwoFactorSecret(userId, secret.base32);

      // Generate backup codes
      const backupCodes = await this.generateBackupCodes(userId);

      return {
        success: true,
        data: {
          secret: secret.base32,
          qrCode: secret.otpauth_url,
          backupCodes,
        },
        message: 'Two-factor authentication setup complete',
      };
    } catch (error) {
      console.error('2FA setup error:', error);
      return {
        success: false,
        message: 'Failed to setup two-factor authentication',
        errors: ['SETUP_FAILED'],
      };
    }
  }

  async verifyTwoFactorToken(userId: string, token: string): Promise<boolean> {
    try {
      const userSecret = await this.getTwoFactorSecret(userId);
      if (!userSecret) return false;
      
      return speakeasy.totp.verify({
        secret: userSecret,
        encoding: 'base32',
        token,
        window: 1, // Allow 1 step tolerance for clock skew
      });
    } catch (error) {
      console.error('2FA verification error:', error);
      return false;
    }
  }

  // Secure OTP implementation
  async sendSecureOTP(phone: string, purpose: 'login' | 'verification'): Promise<ApiResponse<void>> {
    try {
      // Rate limiting
      try {
        await this.otpRateLimiter.consume(phone);
      } catch (rateLimitReached) {
        return {
          success: false,
          message: 'Too many OTP requests. Please wait before trying again.',
          errors: ['OTP_RATE_LIMIT_EXCEEDED'],
        };
      }

      // Generate cryptographically secure OTP
      const otp = this.generateSecureOTP(6);
      
      // Store OTP with expiration (implement OTP storage)
      await this.storeOTP(phone, otp, purpose, 300); // 5-minute expiry

      // Send via SMS (implement SMS provider integration)
      await this.sendSMS(phone, `Your MindfulMeals OTP: ${otp}. Valid for 5 minutes. Do not share.`);

      // Log OTP generation (without storing actual OTP)
      await this.logSecurityEvent('otp_generated', {
        phone: this.maskPhone(phone),
        purpose,
        timestamp: new Date(),
      });

      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      console.error('OTP sending error:', error);
      return {
        success: false,
        message: 'Failed to send OTP',
        errors: ['SMS_FAILED'],
      };
    }
  }

  // Private helper methods
  private generateSecureOTP(length: number): string {
    const crypto = require('crypto');
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      otp += digits[randomIndex];
    }
    
    return otp;
  }

  private generateJTI(): string {
    return require('crypto').randomBytes(16).toString('hex');
  }

  private sanitizeUserData(user: User): Partial<User> {
    const { 
      // Remove sensitive fields
      ...safeUser 
    } = user;
    return safeUser;
  }

  private maskPhone(phone: string): string {
    return phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
  }

  // Placeholder methods - implement based on your requirements
  private async verifyOTP(phone: string, otp: string): Promise<boolean> {
    // Implement OTP verification logic
    return true; // Placeholder
  }

  private async findOrCreateUser(phone: string): Promise<User | null> {
    // Implement user creation/finding logic
    return null; // Placeholder
  }

  private async trackDeviceLogin(userId: string, deviceFingerprint: string, ipAddress: string): Promise<void> {
    // Implement device tracking logic
  }

  private async isDeviceTrusted(userId: string, deviceFingerprint: string): Promise<boolean> {
    // Implement device trust logic
    return false; // Placeholder
  }

  private async storeRefreshTokenHash(userId: string, refreshToken: string): Promise<void> {
    // Implement refresh token storage logic
  }

  private async storeTwoFactorSecret(userId: string, secret: string): Promise<void> {
    // Implement 2FA secret storage logic
  }

  private async generateBackupCodes(userId: string): Promise<string[]> {
    // Implement backup codes generation logic
    return ['123456', '234567', '345678', '456789', '567890']; // Placeholder
  }

  private async getTwoFactorSecret(userId: string): Promise<string | null> {
    // Implement 2FA secret retrieval logic
    return null; // Placeholder
  }

  private async storeOTP(phone: string, otp: string, purpose: string, expirySeconds: number): Promise<void> {
    // Implement OTP storage logic
  }

  private async sendSMS(phone: string, message: string): Promise<void> {
    // Implement SMS sending logic
  }

  private async logAuthenticationEvent(userId: string, event: string, metadata: any): Promise<void> {
    // Implement authentication logging logic
  }

  private async logSecurityEvent(event: string, metadata: any): Promise<void> {
    // Implement security event logging logic
  }
}
