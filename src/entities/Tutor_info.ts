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

@Entity({ schema: 'study-meet', name: 'tutor_info' })
export class Tutor_infoEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tutorInfoId' })
  tutorInfoId: number;

  @Column('text', { name: 'phoneNumber' })
  phoneNumber: number;

  @Column('text', { name: 'selfIntroduce' })
  selfIntroduce: string;

  @Column('bool', { name: 'apply', default: false })
  apply: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;

  @OneToMany(
    () => Tutor_certification_imageEntity,
    (tutorImage) => tutorImage.tutor_info_id,
    {
      cascade: true,
    },
  )
  tutorImages: Tutor_certification_imageEntity[];
}
