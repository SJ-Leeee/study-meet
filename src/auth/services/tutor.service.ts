import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplyTutorDto } from '../dto/applyTutor.dto';
import { UserRepository } from '../repositories/user.repository';
import { BusinessException } from 'src/exception/businessException';
import { TutorRepository } from '../repositories/tutor.repository';
import { UserEntity } from 'src/entities/Users';
import { UploadResDto } from 'src/upload/dto/uploadRes.dto';

@Injectable()
export class TutorService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tutorRepo: TutorRepository,
  ) {}

  async applyTutor(
    userId: number,
    tutorDto: ApplyTutorDto,
    imgObjs: UploadResDto[],
  ) {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new BusinessException(
        'tutor',
        'user is not exist',
        'user is not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const exTutorInfo = await this.tutorRepo.findTutorInfoById(userId);
    if (exTutorInfo) {
      throw new BusinessException(
        'tutor',
        'already apply tutor',
        'already apply tutor',
        HttpStatus.CONFLICT,
      );
    }
    const result = await this.saveTutorInfo(user, tutorDto, imgObjs);
    // console.log(result);
  }

  private async saveTutorInfo(
    user: UserEntity,
    tutorDto: ApplyTutorDto,
    imgObjs: UploadResDto[],
  ) {
    try {
      const tutorInfoId = await this.tutorRepo.saveTutorInfo(user, tutorDto);
      const tutorInfo = await this.tutorRepo.getTutorInfoById(tutorInfoId);

      await Promise.all(
        imgObjs.map(async (img) => {
          await this.tutorRepo.saveTutorImg(tutorInfo, img);
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }
}
