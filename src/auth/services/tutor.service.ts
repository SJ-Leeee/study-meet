import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplyTutorDto } from '../dto/applyTutor.dto';
import { UserRepository } from '../repositories/user.repository';
import { BusinessException } from 'src/exception/businessException';
import { TutorRepository } from '../repositories/tutor.repository';
import { UserEntity, UserRole } from 'src/entities/Users';
import { UploadResDto } from 'src/upload/dto/uploadRes.dto';
import { Tutor_infoEntity } from 'src/entities/Tutor_info';
import { UploadService } from 'src/upload/upload.service';
import { DataSource } from 'typeorm';

@Injectable()
export class TutorService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tutorRepo: TutorRepository,
    private readonly uploadService: UploadService,
    private readonly dataSource: DataSource,
  ) {}

  // 튜터신청
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
    const exTutorInfo = await this.tutorRepo.findTutorInfoByUserId(userId);
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

  // 튜터신청 - 이미지와 튜터 저장
  private async saveTutorInfo(
    user: UserEntity,
    tutorDto: ApplyTutorDto,
    imgObjs: UploadResDto[],
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      const tutorInfoId = await this.tutorRepo.saveTutorInfo(user, tutorDto);
      const tutorInfo =
        await this.tutorRepo.findTutorInfoByTutorInfoId(tutorInfoId);

      await Promise.all(
        imgObjs.map(async (img) => {
          await this.tutorRepo.saveTutorImg(tutorInfo, img);
        }),
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
    } finally {
      await queryRunner.release();
    }
  }

  // 튜터 정보 가져오기
  async getTutorApplyList(): Promise<Tutor_infoEntity[]> {
    return this.tutorRepo.getTutors();
  }

  // 튜터 정보 변경하기 - User의 Role같이 변경
  async editTutorRole(tutorInfoId: number, apply: boolean) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      // 튜터정보변경
      await this.tutorRepo.setApply(tutorInfoId, apply);

      // 유저정보변경
      const role: UserRole = apply ? UserRole.TUTOR : UserRole.USER;
      const tutorInfo =
        await this.tutorRepo.findTutorInfoByTutorInfoId(tutorInfoId);
      await this.userRepo.updateUser(tutorInfo.user.userId, { role });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
