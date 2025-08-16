import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Household } from './Household';
import { UserSession } from './UserSession';
import { TwoFactorSecret } from './TwoFactorSecret';

export enum HouseholdRole {
  PRIMARY_COOK = 'primary_cook',
  FAMILY_MEMBER = 'family_member',
  CHILD = 'child',
  ELDER = 'elder',
}

export enum AgeGroup {
  CHILD = 'child',
  TEEN = 'teen',
  ADULT = 'adult',
  ELDER = 'elder',
}

export enum DietaryRestriction {
  DIABETIC = 'diabetic',
  HYPERTENSION = 'hypertension',
  CELIAC = 'celiac',
  LACTOSE_INTOLERANT = 'lactose_intolerant',
  NUT_ALLERGY = 'nut_allergy',
  NONE = 'none',
}

export enum HealthGoal {
  WEIGHT_LOSS = 'weight_loss',
  MUSCLE_GAIN = 'muscle_gain',
  MAINTENANCE = 'maintenance',
  ENERGY_BOOST = 'energy_boost',
  GUT_HEALTH = 'gut_health',
  NONE = 'none',
}

@Entity('users')
@Index(['phone'], { unique: true })
@Index(['email'], { unique: true, where: "email IS NOT NULL" })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
  phone!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: HouseholdRole.FAMILY_MEMBER })
  role!: HouseholdRole;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ageGroup?: AgeGroup;

  @Column({ type: 'text', array: true, default: [] })
  dietaryRestrictions!: DietaryRestriction[];

  @Column({ type: 'text', array: true, default: [] })
  healthGoals!: HealthGoal[];

  @Column({ type: 'varchar', length: 10, default: 'english' })
  languagePreference!: 'hindi' | 'english';

  @Column({ type: 'varchar', length: 36, nullable: false })
  householdId!: string;

  @Column({ type: 'boolean', default: false })
  isPhoneVerified!: boolean;

  @Column({ type: 'boolean', default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePictureUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    notifications: {
      mealReminders: boolean;
      breathingReminders: boolean;
      mindfulnessTips: boolean;
    };
    privacy: {
      shareData: boolean;
      allowAnalytics: boolean;
    };
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Household, household => household.members)
  @JoinColumn({ name: 'householdId' })
  household!: Household;

  @OneToMany(() => UserSession, session => session.user)
  sessions!: UserSession[];

  @OneToMany(() => TwoFactorSecret, secret => secret.user)
  twoFactorSecrets!: TwoFactorSecret[];

  // Virtual properties (not stored in database)
  get fullName(): string {
    return this.name;
  }

  get isPrimaryCook(): boolean {
    return this.role === HouseholdRole.PRIMARY_COOK;
  }

  get hasDietaryRestrictions(): boolean {
    return this.dietaryRestrictions.length > 0 && 
           !this.dietaryRestrictions.includes(DietaryRestriction.NONE);
  }

  get hasHealthGoals(): boolean {
    return this.healthGoals.length > 0 && 
           !this.healthGoals.includes(HealthGoal.NONE);
  }
}
