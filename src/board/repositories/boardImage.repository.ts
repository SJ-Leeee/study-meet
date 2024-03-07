import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board_imageEntity } from 'src/entities/Board_image';
import { BoardEntity } from 'src/entities/Boards';
import { UploadResDto } from 'src/upload/dto/uploadRes.dto';

@Injectable()
export class BoardImageRepository {
  constructor(
    @InjectRepository(Board_imageEntity)
    private readonly boardImgRepo: Repository<Board_imageEntity>,
  ) {}

  async createBoardImg(board: BoardEntity, imgResDto: UploadResDto) {
    const boardImgObj = new Board_imageEntity();
    boardImgObj.board = board;
    boardImgObj.imageName = imgResDto.imageName;
    boardImgObj.imagePath = imgResDto.imagePath;
    await this.boardImgRepo
      .createQueryBuilder()
      .insert()
      .into(Board_imageEntity)
      .values(boardImgObj)
      .execute();
  }

  async deleteImage(imgPath: string) {
    const imageName = imgPath.split('/').pop().split('.')[0];
    await this.boardImgRepo
      .createQueryBuilder()
      .delete()
      .from(Board_imageEntity)
      .where('imageName = :imageName', { imageName })
      .execute();
  }
}
