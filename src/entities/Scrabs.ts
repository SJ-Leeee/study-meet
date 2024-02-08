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

@Entity({ schema: 'study-meet', name: 'scrabs' })
export class Scrabs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'scrabId' })
  scrabId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.scrabs)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @ManyToOne(() => Boards, (board) => board.scrabs)
  @JoinColumn({ name: 'board_id' })
  board_id: Boards;
}
