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
import { Board_imageEntity } from './Board_image';
import { CommentEntity } from './Comments';
import { ScrabEntity } from './Scrabs';

@Entity({ schema: 'study-meet', name: 'boards' })
export class BoardEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'boardId' })
  boardId: number;

  @Column('varchar', { length: 255, name: 'title' })
  title: string;

  @Column('text', { name: 'content' })
  content: string;

  @Column('integer', { name: 'viewCount' })
  viewCount: number;

  @Column('integer', { name: 'scrabCount' })
  scrabCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.boards)
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;

  @OneToMany(() => Board_imageEntity, (image) => image.board_id, {
    cascade: true,
  })
  boardImages: Board_imageEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.board_id, {
    cascade: true,
  })
  comments: CommentEntity[];

  @OneToMany(() => ScrabEntity, (scrab) => scrab.board_id, { cascade: true })
  scrabs: ScrabEntity[];
}
