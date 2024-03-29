import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BusinessException } from 'src/exception/businessException';
import { v4 as uuid, v4 } from 'uuid';
import { UploadResDto } from './dto/uploadRes.dto';
@Injectable()
export class UploadService {
  s3Client: S3Client;

  constructor(private configService: ConfigService) {
    // AWS S3 클라이언트 초기화. 환경 설정 정보를 사용하여 AWS 리전, Access Key, Secret Key를 설정.
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'), // AWS Region
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'), // Access Key
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'), // Secret Key
      },
    });
  }

  async imageUpload(file: Express.Multer.File): Promise<UploadResDto> {
    const imageName = uuid();
    const ext = file.originalname.split('.').pop();
    if (!['png', 'jpg', 'jpeg', 'bmp'].includes(ext)) {
      throw new BusinessException(
        'file',
        'only png, jpg, jpeg, bmp file type',
        'only png, jpg, jpeg, bmp file type',
        HttpStatus.FORBIDDEN,
      );
    }
    const imagePath = await this.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { imageName, imagePath };
  }
  async imageUploadToS3(
    fileName: string, // 업로드될 파일의 이름
    file: Express.Multer.File, // 업로드할 파일
    ext: string, // 파일 확장자
  ) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // S3 버킷 이름
        Key: fileName, // 업로드될 파일의 이름
        Body: file.buffer, // 업로드할 파일
        // ACL: 'public-read',
        ContentType: `image/${ext}`, // 파일 타입
      });

      // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
      await this.s3Client.send(command);
    } catch (err) {
      throw new BusinessException('file', err, err, HttpStatus.BAD_REQUEST);
    }
    return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
    // 업로드된 이미지의 URL을 반환합니다.
  }

  async deleteImageFromS3(imageUrl: string): Promise<void> {
    // 업로드된 이미지의 URL에서 파일 이름을 추출합니다.
    const fileName = imageUrl.split('/').pop();
    console.log(`파일네임 ${fileName}`);
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: fileName,
      });
      await this.s3Client.send(command);
    } catch (err) {
      throw new BusinessException('file', err, err, HttpStatus.BAD_REQUEST);
    }
  }
}
