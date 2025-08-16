import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity('two_factor_secrets')
@Index(['userId'], { unique: true })
export class TwoFactorSecret {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  userId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  secretHash!: string; // Encrypted secret

  @Column({ type: 'varchar', length: 255, nullable: false })
  backupCodesHash!: string; // Encrypted backup codes

  @Column({ type: 'boolean', default: false })
  isEnabled!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  enabledAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt?: Date;

  @Column({ type: 'integer', default: 0 })
  failedAttempts!: number;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil?: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    setupMethod?: 'qr' | 'manual' | 'sms';
    deviceInfo?: string;
    lastSuccessfulVerification?: Date;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, user => user.twoFactorSecrets)
  @JoinColumn({ name: 'userId' })
  user!: User;

  // Virtual properties
  get isLocked(): boolean {
    if (!this.lockedUntil) return false;
    return new Date() < this.lockedUntil;
  }

  get canAttempt(): boolean {
    return !this.isLocked && this.failedAttempts < 5;
  }

  get remainingAttempts(): number {
    return Math.max(0, 5 - this.failedAttempts);
  }
}
