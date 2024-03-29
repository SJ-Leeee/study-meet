import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './Users';
import { Tutor_certification_imageEntity } from './Tutor_certification_image';

@Entity({ schema: 'study_meet', name: 'tutor_info' })
export class Tutor_infoEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tutorInfoId' })
  tutorInfoId: number;

  @Column('text', { name: 'phoneNumber' })
  phoneNumber: string;

  @Column('text', { name: 'selfIntroduce' })
  selfIntroduce: string;

  @Column('bool', { name: 'apply', default: false })
  apply: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: UserEntity;

  @OneToMany(
    () => Tutor_certification_imageEntity,
    (tutorImage) => tutorImage.tutorInfo,
    {
      cascade: true,
    },
  )
  tutorImages: Tutor_certification_imageEntity[];
}
