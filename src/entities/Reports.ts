import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './Users';

@Entity({ schema: 'study_meet', name: 'reports' })
export class ReportEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'reportId' })
  reportId: number;

  @Column('text', { name: 'reportDetail' })
  reportDetail: string;

  @Column('text', { name: 'reportImagePath' })
  reportImagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.reportUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.reportedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reported_user_id' })
  reportedUser: UserEntity;
}
