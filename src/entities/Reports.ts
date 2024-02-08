import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';

@Entity({ schema: 'study-meet', name: 'reports' })
export class Reports {
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

  @ManyToOne(() => Users, (user) => user.reportUserIds)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @ManyToOne(() => Users, (user) => user.reportedUserIds)
  @JoinColumn({ name: 'reported_user_id' })
  reported_user_id: Users;
}
