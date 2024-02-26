import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ChatEntity } from './Chats';
import { BoardEntity } from './Boards';
import { ReportEntity } from './Reports';
import { FriendEntity } from './Friends';
import { CommentEntity } from './Comments';
import { ScrabEntity } from './Scrabs';
import { RefreshTokenEntity } from './Refresh_token';
import { AccessTokenEntity } from './Access_token';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  TUTOR = 'tutor',
}

@Entity({ schema: 'study_meet', name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @Column('varchar', { name: 'email', length: 255, unique: true })
  email: string;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Column('integer', { name: 'age' })
  age: number;

  @Column('enum', { enum: UserRole, default: UserRole.USER })
  userRole: UserRole;

  @Column('integer', { default: 0 })
  reportCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ReportEntity, (report) => report.user, { cascade: true })
  reportUsers: ReportEntity[];

  @OneToMany(() => ReportEntity, (report) => report.reportedUser, {
    cascade: true,
  })
  reportedUsers: ReportEntity[];

  @OneToMany(() => FriendEntity, (friend) => friend.user, { cascade: true })
  friendUsers: FriendEntity[];

  @OneToMany(() => FriendEntity, (friend) => friend.targetUser, {
    cascade: true,
  })
  friendedUsers: FriendEntity[];

  @OneToMany(() => RefreshTokenEntity, (token) => token.user, {
    cascade: true,
  })
  refreshTokens: RefreshTokenEntity[];

  @OneToMany(() => AccessTokenEntity, (token) => token.user, {
    cascade: true,
  })
  accessTokens: AccessTokenEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.sender, { cascade: true })
  senders: ChatEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.reciever, { cascade: true })
  receivers: ChatEntity[];

  @OneToMany(() => BoardEntity, (board) => board.user, { cascade: true })
  boards: BoardEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    cascade: true,
  })
  comments: CommentEntity[];

  @OneToMany(() => ScrabEntity, (scrab) => scrab.user, { cascade: true })
  scrabs: ScrabEntity[];
}
