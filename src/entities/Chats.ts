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

@Entity({ schema: 'study_meet', name: 'chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatId' })
  chatId: number;

  @Column('text', { name: 'chatDetail' })
  chatDetail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.senders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reciever' })
  reciever: UserEntity;
}
