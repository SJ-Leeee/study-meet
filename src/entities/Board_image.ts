import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardEntity } from './Boards';

@Entity({ schema: 'study-meet', name: 'board_image' })
export class Board_imageEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'boardImageId' })
  boardImageId: number;

  @Column('varchar', { length: 255, name: 'imageName' })
  imageName: string;

  @Column('text', { name: 'imagePath' })
  imagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => BoardEntity, (board) => board.boardImages)
  @JoinColumn({ name: 'board_id' })
  board_id: BoardEntity;
}
