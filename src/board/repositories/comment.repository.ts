import { Injectable } from '@nestjs/common';
import { PostCommentDto } from '../dto/postCommentReq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/Comments';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/Users';
import { BoardEntity } from 'src/entities/Boards';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly cmtRepo: Repository<CommentEntity>,
  ) {}
  async createComment(
    user: UserEntity,
    board: BoardEntity,
    cmtDto: PostCommentDto,
  ): Promise<void> {
    const comment = new CommentEntity();
    comment.board = board;
    comment.user = user;
    comment.comment = cmtDto.comment;
    await this.cmtRepo
      .createQueryBuilder()
      .insert()
      .into(CommentEntity)
      .values(comment)
      .execute();
  }
}
