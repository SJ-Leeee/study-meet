import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'study-meet', name: 'tutor_certification_image' })
export class Tutor_certification_image {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tutorCertificationImageId' })
  tutorCertificationImageId: number;

  @Column('varchar', { length: 255, name: 'imageName' })
  imageName: string;

  @Column('text', { name: 'imagePath' })
  imagePath: string;

  //   @ManyToOne() tutor_info_id
}
