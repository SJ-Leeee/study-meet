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

  @ManyToOne(() => UserEntity, (user) => user.senderIds)
  @JoinColumn({ name: 'sender_id' })
  sender_id: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receiverIds)
  @JoinColumn({ name: 'reciever_id' })
  reciever_id: UserEntity;
}
