import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../../common/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ default: false })
  isActive!: boolean;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ default: Role.BUYER })
  role!: string;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempts!: number;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
