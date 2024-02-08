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
import { Users } from './Users';
import { Board_image } from './Board_image';
import { Comments } from './Comments';
import { Scrabs } from './Scrabs';

@Entity({ schema: 'study-meet', name: 'boards' })
export class Boards {
  @PrimaryGeneratedColumn({ type: 'int', name: 'boardId' })
  boardId: number;

  @Column('varchar', { length: 255, name: 'title' })
  title: string;

  @Column('text', { name: 'content' })
  content: string;

  @Column('int', { name: 'viewCount' })
  viewCount: number;

  @Column('int', { name: 'scrabCount' })
  scrabCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.boards)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @OneToMany(() => Board_image, (image) => image.board_id, { cascade: true })
  boardImages: Board_image[];

  @OneToMany(() => Comments, (comment) => comment.board_id, {
    cascade: true,
  })
  comments: Comments[];

  @OneToMany(() => Scrabs, (scrab) => scrab.board_id, { cascade: true })
  scrabs: Scrabs[];
}
