import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: { fileSize: 1024 * 1024 * 10 },
    }),
  )
  async fileTest(@UploadedFiles() files: Express.Multer.File[]) {
    const imgurls: object[] = [];
    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const imgurl = await this.uploadService.imageUpload(file);
        imgurls.push(imgurl);
      }),
    );
    return imgurls;
  }
}
