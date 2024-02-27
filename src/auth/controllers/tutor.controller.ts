import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { ApplyTutorDto } from '../dto/applyTutor.dto';
import { TutorService } from '../services/tutor.service';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { UploadResDto } from 'src/upload/dto/uploadRes.dto';

@Controller('tutor')
export class TutorController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly tutorService: TutorService,
  ) {}

  // 튜터 신청 api
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: { fileSize: 1024 * 1024 * 10 },
    }),
  )
  @Post()
  async applyTutor(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() applyTutorDto: ApplyTutorDto,
    @User() user,
  ) {
    const imgPaths = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        return await this.uploadService.tutorImageTest(file);
      }),
    );

    await this.tutorService.applyTutor(user.userId, applyTutorDto, imgPaths);
    return 'ggmg';
  }
}
