import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './Users';
import { ChatEntity } from './Chats';

@Entity({ schema: 'study_meet', name: 'rooms' })
export class RoomEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatId' })
  roomId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ChatEntity, (chat) => chat.room, { cascade: true })
  chats: ChatEntity[];

  @ManyToOne(() => UserEntity, (user) => user.firstUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'firstUser' })
  firstUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.secondUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'secondUser' })
  secondUser: UserEntity;
}
