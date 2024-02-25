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

@Entity({ schema: 'study-meet', name: 'chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatId' })
  chatId: number;

  @Column('text', { name: 'chatDetail' })
  chatDetail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.senders)
  @JoinColumn({ name: 'sender' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivers)
  @JoinColumn({ name: 'reciever' })
  reciever: UserEntity;
}
