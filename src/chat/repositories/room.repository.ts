import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../../entities/Rooms';
import { UserEntity } from '../../entities/Users';
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

  async findRoomByRoomId(roomId: number) {
    return await this.roomRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.firstUser', 'fu')
      .leftJoinAndSelect('r.secondUser', 'su')
      .where('r.roomId = :roomId', {
        roomId,
      })
      .select(['r.roomId', 'fu.userId', 'su.userId'])
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

  async findAllRooms(userId: number) {
    return await this.roomRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.firstUser', 'fu')
      .leftJoinAndSelect('r.secondUser', 'su')
      .where('fu.userId = :userId', { userId })
      .orWhere('su.userId = :userId', { userId })
      .select(['r.roomId', 'fu.userId', 'fu.name', 'su.userId', 'su.name'])
      .getMany();
  }
}
