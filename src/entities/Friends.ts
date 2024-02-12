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

  @ManyToOne(() => UserEntity, (user) => user.myIds)
  @JoinColumn({ name: 'my_id' })
  my_id: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.targetIds)
  @JoinColumn({ name: 'target_id' })
  target_id: UserEntity;
}
