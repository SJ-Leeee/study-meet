import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';

@Entity({ schema: 'study-meet', name: 'friends' })
export class Friends {
  @PrimaryGeneratedColumn({ type: 'int', name: 'friendId' })
  friendId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.myIds)
  @JoinColumn({ name: 'my_id' })
  my_id: Users;

  @ManyToOne(() => Users, (user) => user.targetIds)
  @JoinColumn({ name: 'target_id' })
  target_id: Users;
}
