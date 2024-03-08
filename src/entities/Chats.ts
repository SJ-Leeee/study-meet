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
import { bool } from 'aws-sdk/clients/signer';
import { RoomEntity } from './Rooms';

@Entity({ schema: 'study_meet', name: 'chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatId' })
  chatId: number;

  @Column('text', { name: 'message' })
  message: string;

  @Column('boolean')
  isSend: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RoomEntity, (room) => room.chats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  room: RoomEntity;
}
