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

@Entity({ schema: 'study-meet', name: 'users' })
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

  @Column('boolean', { default: false })
  isTutor: number;

  @Column('integer', { default: 0 })
  reportCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ReportEntity, (report) => report.user_id, { cascade: true })
  reportUserIds: ReportEntity[];

  @OneToMany(() => ReportEntity, (report) => report.reported_user_id, {
    cascade: true,
  })
  reportedUserIds: ReportEntity[];

  @OneToMany(() => FriendEntity, (friend) => friend.my_id, { cascade: true })
  myIds: FriendEntity[];

  @OneToMany(() => FriendEntity, (friend) => friend.target_id, {
    cascade: true,
  })
  targetIds: FriendEntity[];

  @OneToMany(() => RefreshTokenEntity, (token) => token.user_id, {
    cascade: true,
  })
  refreshTokens: RefreshTokenEntity[];

  @OneToMany(() => AccessTokenEntity, (token) => token.user_id, {
    cascade: true,
  })
  accessTokens: AccessTokenEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.sender_id, { cascade: true })
  senderIds: ChatEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.reciever_id, { cascade: true })
  receiverIds: ChatEntity[];

  @OneToMany(() => BoardEntity, (board) => board.user_id, { cascade: true })
  boards: BoardEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user_id, {
    cascade: true,
  })
  comments: CommentEntity[];

  @OneToMany(() => ScrabEntity, (scrab) => scrab.user_id, { cascade: true })
  scrabs: ScrabEntity[];
}
