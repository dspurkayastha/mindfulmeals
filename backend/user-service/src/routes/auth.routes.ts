import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthService } from '../services/auth.service';

const router = Router();

// Injected service instance
let authService: AuthService = null as unknown as AuthService;
export const setAuthService = (service: AuthService) => { authService = service; };

// Validation middleware
const validatePhone = body('phone')
  .isMobilePhone('en-IN')
  .withMessage('Please provide a valid Indian phone number');

const validateOTP = body('otp')
  .isLength({ min: 6, max: 6 })
  .isNumeric()
  .withMessage('OTP must be 6 digits');

const validateDeviceFingerprint = body('deviceFingerprint')
  .isLength({ min: 10 })
  .withMessage('Device fingerprint is required');

// Send OTP
router.post('/send-otp',
  validatePhone,
  body('purpose').isIn(['login', 'verification']).withMessage('Invalid purpose'),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
      return;
    }

    const { phone, purpose } = req.body as any;

    const result = await authService.sendSecureOTP(phone, purpose);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  })
);

// Verify OTP and authenticate
router.post('/verify-otp',
  validatePhone,
  validateOTP,
  validateDeviceFingerprint,
  body('ipAddress').optional().isIP().withMessage('Invalid IP address'),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
      return;
    }

    const { phone, otp, deviceFingerprint, ipAddress } = req.body as any;

    const result = await authService.authenticateWithPhone(
      phone,
      otp,
      deviceFingerprint,
      ipAddress || req.ip
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  })
);

// Setup two-factor authentication
router.post('/setup-2fa',
  body('userId').isUUID().withMessage('Valid user ID required'),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
      return;
    }

    const { userId } = req.body as any;

    const result = await authService.setupTwoFactorAuthentication(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  })
);

// Verify two-factor token
router.post('/verify-2fa',
  body('userId').isUUID().withMessage('Valid user ID required'),
  body('token').isLength({ min: 6, max: 6 }).isNumeric().withMessage('Valid 2FA token required'),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
      return;
    }

    const { userId, token } = req.body as any;

    const isValid = await authService.verifyTwoFactorToken(userId, token);

    if (isValid) {
      res.status(200).json({
        success: true,
        message: 'Two-factor authentication successful',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid two-factor token',
        errors: ['INVALID_2FA_TOKEN'],
      });
    }
  })
);

// Refresh token
router.post('/refresh',
  body('refreshToken').notEmpty().withMessage('Refresh token required'),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
      return;
    }

    const { refreshToken } = req.body as any;

    // TODO: Implement refresh token logic
    res.status(501).json({
      success: false,
      message: 'Refresh token functionality not implemented yet',
      errors: ['NOT_IMPLEMENTED'],
    });
  })
);

// Logout (revoke refresh token)
router.post('/logout',
  body('refreshToken').notEmpty().withMessage('Refresh token required'),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
      return;
    }

    const { refreshToken } = req.body as any;

    // TODO: Implement logout logic
    res.status(501).json({
      success: false,
      message: 'Logout functionality not implemented yet',
      errors: ['NOT_IMPLEMENTED'],
    });
  })
);

export { router as authRoutes };
