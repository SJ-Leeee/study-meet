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

@Entity({ schema: 'study-meet', name: 'chats' })
export class Chats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatId' })
  chatId: number;

  @Column('text', { name: 'chatDetail' })
  chatDetail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.senderIds)
  @JoinColumn({ name: 'sender_id' })
  sender_id: Users;

  @ManyToOne(() => Users, (user) => user.receiverIds)
  @JoinColumn({ name: 'reciever_id' })
  reciever_id: Users;
}
