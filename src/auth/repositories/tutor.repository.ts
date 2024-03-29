import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tutor_certification_imageEntity } from '../../entities/Tutor_certification_image';
import { Tutor_infoEntity } from '../../entities/Tutor_info';
import { Repository } from 'typeorm';
import { ApplyTutorDto } from '../dto/applyTutor.dto';
import { UserEntity } from '../../entities/Users';
import { UploadResDto } from 'src/upload/dto/uploadRes.dto';

@Injectable()
export class TutorRepository {
  constructor(
    @InjectRepository(Tutor_infoEntity)
    private readonly tutorInfoRepo: Repository<Tutor_infoEntity>,
    @InjectRepository(Tutor_certification_imageEntity)
    private readonly tutorImgRepo: Repository<Tutor_certification_imageEntity>,
  ) {}

  async findTutorInfoByUserId(userId: number): Promise<Tutor_infoEntity> {
    return await this.tutorInfoRepo
      .createQueryBuilder('info')
      .where('info.user = :userId', { userId })
      .getOne();
  }

  async saveTutorInfo(user: UserEntity, tutorDto: ApplyTutorDto) {
    const tutorInfo = new Tutor_infoEntity();
    tutorInfo.user = user;
    tutorInfo.phoneNumber = tutorDto.phoneNumber;
    tutorInfo.selfIntroduce = tutorDto.selfIntroduce;
    const returning = await this.tutorInfoRepo
      .createQueryBuilder('tutor')
      .insert()
      .into(Tutor_infoEntity)
      .values(tutorInfo)
      .execute();
    const tutorinfoId = returning.identifiers[0].tutorInfoId;
    return tutorinfoId;
  }

  async findTutorInfoByTutorInfoId(
    tutorInfoId: number,
  ): Promise<Tutor_infoEntity> {
    return await this.tutorInfoRepo
      .createQueryBuilder('info')
      .leftJoinAndSelect('info.user', 'user')
      .where('info.tutorInfoId = :tutorInfoId', { tutorInfoId })
      .select(['info', 'user.userId'])
      .getOne();
  }

  async saveTutorImg(
    tutorInfo: Tutor_infoEntity,
    imgResDto: UploadResDto,
  ): Promise<void> {
    const imgEntity = new Tutor_certification_imageEntity();
    imgEntity.imageName = imgResDto.imageName;
    imgEntity.imagePath = imgResDto.imagePath;
    imgEntity.tutorInfo = tutorInfo;
    await this.tutorImgRepo
      .createQueryBuilder()
      .insert()
      .into(Tutor_certification_imageEntity)
      .values(imgEntity)
      .execute();
  }

  async getTutors(): Promise<Tutor_infoEntity[]> {
    return await this.tutorInfoRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.user', 'u')
      .leftJoinAndSelect('t.tutorImages', 'img')
      .select(['t', 'u.userId', 'u.userRole', 'img.imagePath'])
      .getMany();
  }

  async setApply(tutorInfoId: number, apply: boolean) {
    return await this.tutorInfoRepo
      .createQueryBuilder()
      .update(Tutor_infoEntity)
      .set({ apply })
      .where('tutorInfoId = :tutorInfoId', { tutorInfoId })
      .execute();
  }
}
