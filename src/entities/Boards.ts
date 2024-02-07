import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'study-meet', name: 'boards' })
export class Boards {
  @PrimaryGeneratedColumn({ type: 'int', name: 'boardId' })
  boardId: number;

  @Column('varchar', { length: 255, name: 'title' })
  title: string;

  @Column('text', { name: 'title' })
  content: string;

  @Column('int', { name: 'viewCount' })
  viewCount: number;

  @Column('int', { name: 'scrabCount' })
  scrabCount: number;

  // ManyToOne  유저아이디
  // OneToMany  세개
}
