import { Injectable } from '@nestjs/common';
import { PostCommentDto } from '../dto/postCommentReq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../../entities/Comments';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/Users';
import { BoardEntity } from '../../entities/Boards';

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

  async findAllComments(boardId: number): Promise<CommentEntity[]> {
    return await this.cmtRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'u')
      .select([
        'u.name',
        'u.userRole',
        'c.commentId',
        'c.comment',
        'c.createdAt',
      ])
      .where('c.board.boardId = :boardId', { boardId })
      .getMany();
  }

  async findComment(commentId: number): Promise<CommentEntity> {
    return await this.cmtRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'u')
      .select(['c', 'u.userId'])
      .where('c.commentId = :commentId', { commentId })
      .getOne();
  }

  async editComment(commentId: number, cmtDto: PostCommentDto): Promise<void> {
    await this.cmtRepo
      .createQueryBuilder()
      .update(CommentEntity)
      .set({
        comment: cmtDto.comment,
      })
      .where('commentId = :commentId', { commentId })
      .execute();
  }

  async deleteComment(commentId: number): Promise<void> {
    await this.cmtRepo
      .createQueryBuilder()
      .delete()
      .from(CommentEntity)
      .where('commentId = :commentId', { commentId })
      .execute();
  }
}
