import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from 'src/entities/Boards';
import { UserEntity } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { PostBoardDto } from '../dto/postBoardReq.dto';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepo: Repository<BoardEntity>,
  ) {}

  async postBoard(user: UserEntity, postBoardDto: PostBoardDto) {
    const boardEntity = new BoardEntity();
    boardEntity.title = postBoardDto.title;
    boardEntity.content = postBoardDto.content;
    boardEntity.user = user;
    const result = await this.boardRepo
      .createQueryBuilder()
      .insert()
      .into(BoardEntity)
      .values(boardEntity)
      .execute();

    return await this.boardRepo
      .createQueryBuilder()
      .where('boardId = :boardId', { boardId: result.identifiers[0].boardId })
      .getOne();
  }
}
