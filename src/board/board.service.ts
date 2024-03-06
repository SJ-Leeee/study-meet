import { Injectable } from '@nestjs/common';
import { PostBoardDto } from './dto/postBoardReq.dto';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { BoardRepository } from './repositories/board.repository';
import { UploadService } from 'src/upload/upload.service';
import { BoardImageRepository } from './repositories/boardImage.repository';
import { DataSource } from 'typeorm';
import { BoardEntity } from 'src/entities/Boards';

@Injectable()
export class BoardService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly boardRepo: BoardRepository,
    private readonly boardImgRepo: BoardImageRepository,
    private readonly uploadService: UploadService,
    private readonly dataSource: DataSource,
  ) {}

  // 게시물 게시
  async postBoard(
    userId: number,
    postBoardDto: PostBoardDto,
    files: Express.Multer.File[],
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const imgResDto = await Promise.all(
        files.map(async (file: Express.Multer.File) => {
          return await this.uploadService.imageUpload(file);
        }),
      );
      const user = await this.userRepo.findUserById(userId);
      // 이미지와 보드저장
      const board = await this.boardRepo.postBoard(user, postBoardDto);
      await Promise.all(
        imgResDto.map(async (img) => {
          await this.boardImgRepo.postBoardImg(board, img);
        }),
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 모든게시물조회
  async getAllBoards(): Promise<BoardEntity[]> {
    return await this.boardRepo.getAllBoards();
  }
  // id로 게시물조회
  async getBoard(id: number): Promise<BoardEntity> {
    try {
      return await this.boardRepo.getBoardById(id);
    } catch (err) {
      console.error(err);
    }
  }
}
