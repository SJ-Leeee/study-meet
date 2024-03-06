import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostBoardDto } from './dto/postBoardReq.dto';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { BoardRepository } from './repositories/board.repository';
import { UploadService } from 'src/upload/upload.service';
import { BoardImageRepository } from './repositories/boardImage.repository';
import { DataSource } from 'typeorm';
import { BoardEntity } from 'src/entities/Boards';
import { reqUserDto } from 'src/common/dto/requser.dto';
import { BusinessException } from 'src/exception/businessException';
import { Board_imageEntity } from 'src/entities/Board_image';

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
    return await this.boardRepo.getBoardById(id);
  }

  // 게시물삭제
  async deleteBoard(user: reqUserDto, boardId: number): Promise<void> {
    const board = await this.boardRepo.getBoardById(boardId);
    if (!board)
      throw new BusinessException(
        'board',
        'not found',
        'not found',
        HttpStatus.NOT_FOUND,
      );
    if (board.user.userId !== user.userId && user.userRole !== 'admin') {
      throw new BusinessException(
        'board',
        `Don't have permission`,
        `Don't have permission`,
        HttpStatus.FORBIDDEN,
      );
    }
    await this.deleteBoardImg(board);
    await this.boardRepo.deleteBoardById(boardId);
  }

  // 게시물 삭제 - 이미지삭제
  private async deleteBoardImg(board: BoardEntity): Promise<void> {
    const imagePaths: string[] = board.boardImages.map(
      (image) => image.imagePath,
    );

    Promise.all([
      imagePaths.map(async (img) => {
        await this.uploadService.deleteImageFromS3(img);
      }),
    ]);
  }
}
