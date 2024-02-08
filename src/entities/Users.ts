import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Chats } from './Chats';
import { Boards } from './Boards';
import { Reports } from './Reports';
import { Friends } from './Friends';
import { Comments } from './Comments';
import { Scrabs } from './Scrabs';

@Entity({ schema: 'study-meet', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @Column('varchar', { name: 'email', length: 255, unique: true })
  email: string;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Column('int', { name: 'age' })
  age: number;

  @Column('boolean', { default: false })
  isTutor: number;

  @Column('int', { default: 0 })
  reportCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reports, (report) => report.user_id, { cascade: true })
  reportUserIds: Reports[];

  @OneToMany(() => Reports, (report) => report.reported_user_id, {
    cascade: true,
  })
  reportedUserIds: Reports[];

  @OneToMany(() => Friends, (friend) => friend.my_id, { cascade: true })
  myIds: Friends[];

  @OneToMany(() => Friends, (friend) => friend.target_id, { cascade: true })
  targetIds: Friends[];

  @OneToMany(() => Chats, (chat) => chat.sender_id, { cascade: true })
  senderIds: Chats[];

  @OneToMany(() => Chats, (chat) => chat.reciever_id, { cascade: true })
  receiverIds: Chats[];

  @OneToMany(() => Boards, (board) => board.user_id, { cascade: true })
  boards: Boards[];

  @OneToMany(() => Comments, (comment) => comment.user_id, { cascade: true })
  comments: Comments[];

  @OneToMany(() => Scrabs, (scrab) => scrab.user_id, { cascade: true })
  scrabs: Scrabs[];
}
