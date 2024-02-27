import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenEntity } from 'src/entities/Access_token';
import { Tutor_certification_imageEntity } from 'src/entities/Tutor_certification_image';
import { Tutor_infoEntity } from 'src/entities/Tutor_info';
import { Repository } from 'typeorm';
import { ApplyTutorDto } from '../dto/applyTutor.dto';
import { UserEntity } from 'src/entities/Users';
import { UploadResDto } from 'src/upload/dto/uploadRes.dto';

@Injectable()
export class TutorRepository {
  constructor(
    @InjectRepository(Tutor_infoEntity)
    private readonly tutorInfoRepo: Repository<Tutor_infoEntity>,
    @InjectRepository(Tutor_certification_imageEntity)
    private readonly tutorImgRepo: Repository<Tutor_certification_imageEntity>,
  ) {}

  async findTutorInfoById(userId: number): Promise<Tutor_infoEntity> {
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

  async getTutorInfoById(tutorInfoId: number) {
    return await this.tutorInfoRepo
      .createQueryBuilder('info')
      .where('info.tutorInfoId = :tutorInfoId', { tutorInfoId })
      .getOne();
  }

  async saveTutorImg(tutorInfo: Tutor_infoEntity, imgResDto: UploadResDto) {
    console.log('빈배열인데 하겠냐고');
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
}
