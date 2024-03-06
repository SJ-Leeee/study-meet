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

  async postBoard(
    user: UserEntity,
    postBoardDto: PostBoardDto,
  ): Promise<BoardEntity> {
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

  // 모든게시물 조회
  async getAllBoards(): Promise<BoardEntity[]> {
    return this.boardRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.boardImages', 'img')
      .leftJoinAndSelect('b.user', 'u')
      .select([
        'u.name',
        'b.boardId',
        'b.title',
        'b.viewCount',
        'img.imagePath',
      ])
      .getMany();
  }

  // id로 게시물조회
  async getBoardById(id: number): Promise<BoardEntity> {
    return await this.boardRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.boardImages', 'img')
      .leftJoinAndSelect('b.user', 'u')
      .select([
        'u.name',
        'u.userId',
        'b.boardId',
        'b.title',
        'b.content',
        'b.viewCount',
        'b.createdAt',
        'img.imagePath',
      ])
      .where('b.boardId = :id', { id })
      .getOne();
  }

  async deleteBoardById(boardId: number): Promise<void> {
    await this.boardRepo
      .createQueryBuilder()
      .delete()
      .from(BoardEntity)
      .where('boardId = :boardId', { boardId })
      .execute();
  }

  async editBoardById(boardId: number, postBoardDto: PostBoardDto) {
    await this.boardRepo
      .createQueryBuilder()
      .update(BoardEntity)
      .set({ title: postBoardDto.title, content: postBoardDto.content })
      .where('boardId = :boardId', { boardId })
      .execute();
  }
}
