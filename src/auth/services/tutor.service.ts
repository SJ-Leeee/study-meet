import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplyTutorDto } from '../dto/applyTutor.dto';
import { UserRepository } from '../repositories/user.repository';
import { BusinessException } from 'src/exception/businessException';
import { TutorRepository } from '../repositories/tutor.repository';
import { UserEntity } from 'src/entities/Users';
import { UploadResDto } from 'src/upload/dto/uploadRes.dto';
import { Tutor_infoEntity } from 'src/entities/Tutor_info';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class TutorService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tutorRepo: TutorRepository,
    private readonly uploadService: UploadService,
  ) {}

  async applyTutor(
    userId: number,
    tutorDto: ApplyTutorDto,
    files: Express.Multer.File[],
  ): Promise<void> {
    const imgResDto = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        return await this.uploadService.imageUpload(file);
      }),
    );
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
    await this.saveTutorInfo(user, tutorDto, imgResDto);
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

  async getTutorApplyList(): Promise<Tutor_infoEntity[]> {
    return this.tutorRepo.getTutors();
  }
}
