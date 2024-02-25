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

@Entity({ schema: 'study-meet', name: 'scrabs' })
export class ScrabEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'scrabId' })
  scrabId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.scrabs)
  @JoinColumn({ name: 'user' })
  user: UserEntity;

  @ManyToOne(() => BoardEntity, (board) => board.scrabs)
  @JoinColumn({ name: 'board' })
  board: BoardEntity;
}
