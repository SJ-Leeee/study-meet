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
import { Boards } from './Boards';

@Entity({ schema: 'study-meet', name: 'comments' })
export class Comments {
  @PrimaryGeneratedColumn({ type: 'int', name: 'commentId' })
  commentId: number;

  @Column('text', { name: 'comment' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @ManyToOne(() => Boards, (board) => board.comments)
  @JoinColumn({ name: 'board_id' })
  board_id: Boards;
}
