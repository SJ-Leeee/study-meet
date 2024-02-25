import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './Users';

@Entity({ schema: 'study-meet', name: 'friends' })
export class FriendEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'friendId' })
  friendId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.friendUsers)
  @JoinColumn({ name: 'user' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.friendedUsers)
  @JoinColumn({ name: 'targetUser' })
  targetUser: UserEntity;
}
