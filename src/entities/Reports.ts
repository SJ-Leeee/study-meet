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

@Entity({ schema: 'study-meet', name: 'reports' })
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

  @ManyToOne(() => UserEntity, (user) => user.reportUserIds)
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.reportedUserIds)
  @JoinColumn({ name: 'reported_user_id' })
  reported_user_id: UserEntity;
}
