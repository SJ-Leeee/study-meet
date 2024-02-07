import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chats } from './Chats';
import { Boards } from './Boards';
import { Reports } from './Reports';
import { Friends } from './Friends';

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

  //   @OneToMany(() => Chats, (chat) => chat.sender)
  //   sentChats: Chats[];

  //   @OneToMany(() => Chats, (chat) => chat.reciever)
  //   recievedChats: Chats[];

  //   @OneToMany(() => Boards, (board) => board.user)
  //   boards: Boards[];

  //   @OneToMany(() => Reports, (report) => report.user)
  //   reports: Reports[];

  //   @OneToMany(() => Friends, (friend) => friend.my)
  //   friends: Friends[];
}
