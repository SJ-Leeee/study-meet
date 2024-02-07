import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'study-meet', name: 'scrabs' })
export class Scrabs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'scrabId' })
  scrabId: number;

  //   @ManyToOne() user_id, board_id
}
