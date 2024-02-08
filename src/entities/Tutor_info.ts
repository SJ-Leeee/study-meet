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
import { Users } from './Users';
import { Tutor_certification_image } from './Tutor_certification_image';

@Entity({ schema: 'study-meet', name: 'tutor_info' })
export class Tutor_info {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tutorInfoId' })
  tutorInfoId: number;

  @Column('int', { name: 'phoneNumber' })
  phoneNumber: number;

  @Column('text', { name: 'selfIntroduce' })
  selfIntroduce: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Users, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @OneToMany(
    () => Tutor_certification_image,
    (tutorImage) => tutorImage.tutor_info_id,
    {
      cascade: true,
    },
  )
  tutorImages: Tutor_certification_image[];
}
