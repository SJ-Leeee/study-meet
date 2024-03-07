import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostBoardDto } from '../dto/postBoardReq.dto';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { BoardRepository } from '../repositories/board.repository';
import { UploadService } from 'src/upload/upload.service';
import { BoardImageRepository } from '../repositories/boardImage.repository';
import { DataSource } from 'typeorm';
import { BoardEntity } from 'src/entities/Boards';
import { BusinessException } from 'src/exception/businessException';
import { Board_imageEntity } from 'src/entities/Board_image';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';

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
      const board = await this.boardRepo.createBoard(user, postBoardDto);
      await Promise.all(
        imgResDto.map(async (img) => {
          await this.boardImgRepo.createBoardImg(board, img);
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
    return await this.boardRepo.findAllBoards();
  }
  // id로 게시물조회
  async getBoard(id: number): Promise<BoardEntity> {
    return await this.boardRepo.findBoardById(id);
  }

  // 게시물삭제
  async deleteBoard(user: ReqUserDto, boardId: number): Promise<void> {
    const board = await this.boardRepo.findBoardById(boardId);
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
    await this.deleteBoardImg(board.boardImages);
    await this.boardRepo.deleteBoardById(boardId);
  }

  // 게시물 수정
  async editBoard(
    user: ReqUserDto,
    boardId: number,
    postBoardDto: PostBoardDto,
    files: Express.Multer.File[],
  ) {
    const board = await this.boardRepo.findBoardById(boardId);
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
    // 이미지삭제 여기서 s3와 db에서 삭제
    await this.deleteBoardImg(board.boardImages);
    // 여기서 보드수정
    await this.boardRepo.editBoardById(boardId, postBoardDto);
    // 여기서 새로운 이미지 추가
    await this.postBoardImg(files, board);
  }

  // 게시물 이미지 추가, s3와 데이터베이스에서
  private async postBoardImg(files: Express.Multer.File[], board: BoardEntity) {
    const imgResDto = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        return await this.uploadService.imageUpload(file);
      }),
    );
    await Promise.all(
      imgResDto.map(async (img) => {
        await this.boardImgRepo.createBoardImg(board, img);
      }),
    );
  }
  // 게시물 이미지삭제, s3와 데이터베이스에서
  private async deleteBoardImg(boardImg: Board_imageEntity[]): Promise<void> {
    const imagePaths: string[] = boardImg.map((img) => img.imagePath);

    Promise.all([
      imagePaths.map(async (img) => {
        await this.uploadService.deleteImageFromS3(img);
        await this.boardImgRepo.deleteImage(img);
      }),
    ]);
  }
}
