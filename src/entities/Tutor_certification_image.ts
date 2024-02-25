import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tutor_infoEntity } from './Tutor_info';

@Entity({ schema: 'study-meet', name: 'tutor_certification_image' })
export class Tutor_certification_imageEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tutorCertificationImageId' })
  tutorCertificationImageId: number;

  @Column('varchar', { length: 255, name: 'imageName' })
  imageName: string;

  @Column('text', { name: 'imagePath' })
  imagePath: string;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tutor_infoEntity, (tutor_info) => tutor_info.tutorImages)
  tutorInfo: Tutor_infoEntity;
}
