import { HttpStatus, Injectable } from '@nestjs/common';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';
import { PostCommentDto } from '../dto/postCommentReq.dto';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { BoardRepository } from '../repositories/board.repository';
import { BusinessException } from 'src/exception/businessException';
import { CommentRepository } from '../repositories/comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly boardRepo: BoardRepository,
    private readonly cmtRepo: CommentRepository,
  ) {}
  async postComment(
    userDto: ReqUserDto,
    boardId: number,
    cmtDto: PostCommentDto,
  ): Promise<void> {
    try {
      const user = await this.userRepo.findUserById(userDto.userId);
      const board = await this.boardRepo.findBoardById(boardId);
      await this.cmtRepo.createComment(user, board, cmtDto);
    } catch (error) {
      throw new BusinessException(
        'comment',
        error,
        error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
