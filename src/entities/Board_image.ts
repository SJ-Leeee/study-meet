import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'study-meet', name: 'board_image' })
export class Board_image {
  @PrimaryGeneratedColumn({ type: 'int', name: 'boardImageId' })
  boardImageId: number;

  @Column('varchar', { length: 255, name: 'imageName' })
  imageName: string;

  @Column('text', { name: 'imagePath' })
  imagePath: string;

  // ManyToOne 보드아이디
}
