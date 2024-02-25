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
import { BoardEntity } from './Boards';

@Entity({ schema: 'study-meet', name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'commentId' })
  commentId: number;

  @Column('text', { name: 'comment' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'user' })
  user: UserEntity;

  @ManyToOne(() => BoardEntity, (board) => board.comments)
  @JoinColumn({ name: 'board' })
  board: BoardEntity;
}
