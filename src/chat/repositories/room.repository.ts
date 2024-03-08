import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/entities/Rooms';
import { UserEntity } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepo: Repository<RoomEntity>,
  ) {}

  async findRoomByUserId(firstId: number, secondId: number) {
    return await this.roomRepo
      .createQueryBuilder('room')
      .leftJoin('room.firstUser', 'fu')
      .leftJoin('room.secondUser', 'su')
      .where('(fu.userId = :firstId AND su.userId = :secondId)', {
        firstId,
        secondId,
      })
      .orWhere('(fu.userId = :secondId AND su.userId = :firstId)', {
        firstId,
        secondId,
      })
      .getOne();
  }

  async findRoomByroomId(roomId: number) {
    return await this.roomRepo
      .createQueryBuilder()
      .where('roomId = :roomId', {
        roomId,
      })
      .getOne();
  }

  async createRoom(firstUser: UserEntity, secondUser: UserEntity) {
    const room = new RoomEntity();
    room.firstUser = firstUser;
    room.secondUser = secondUser;
    await this.roomRepo
      .createQueryBuilder()
      .insert()
      .into(RoomEntity)
      .values(room)
      .execute();
  }
}
