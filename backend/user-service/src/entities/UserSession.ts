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

@Entity('user_sessions')
@Index(['userId', 'deviceFingerprint'], { unique: true })
@Index(['refreshTokenHash'], { unique: true })
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  userId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  deviceFingerprint!: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  refreshTokenHash!: string;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt!: Date;

  @Column({ type: 'boolean', default: false })
  isRevoked!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  revokeReason?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    deviceType?: string;
    os?: string;
    browser?: string;
    location?: string;
    lastActivity?: Date;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, user => user.sessions)
  @JoinColumn({ name: 'userId' })
  user!: User;

  // Virtual properties
  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isActive(): boolean {
    return !this.isRevoked && !this.isExpired;
  }

  get sessionAge(): number {
    return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24)); // days
  }
}
