import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'study-meet', name: 'tutor_info' })
export class Tutor_info {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tutorInfoId' })
  tutorInfoId: number;

  @Column('int', { name: 'phoneNumber' })
  phoneNumber: number;

  @Column('text', { name: 'selfIntroduce' })
  selfIntroduce: string;

  //   @OneToOne() user_id
}
