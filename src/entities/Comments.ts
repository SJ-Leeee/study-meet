import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'study-meet', name: 'comments' })
export class Comments {
  @PrimaryGeneratedColumn({ type: 'int', name: 'commentId' })
  commentId: number;

  @Column('text', { name: 'comment' })
  comment: string;

  // ManyToOne 보드아이디, 유저아이디
}
