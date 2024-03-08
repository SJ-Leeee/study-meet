import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/auth/services/user.service';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';
import { RoomRepository } from '../repositories/room.repository';

@Injectable()
export class RoomService {
  constructor(
    private readonly userService: UserService,
    private readonly roomRepository: RoomRepository,
  ) {}

  async createRoom(userDto: ReqUserDto, secondId: number) {
    if (userDto.userId === secondId)
      throw new HttpException('same User', HttpStatus.BAD_REQUEST);
    const user = await this.userService.getUserById(userDto.userId);
    const targetUser = await this.userService.getUserById(secondId);
    if (!targetUser || !user)
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND);
    const room = await this.roomRepository.findRoomByUserId(
      user.userId,
      secondId,
    );
    if (room) throw new HttpException('room exists', HttpStatus.CONFLICT);

    await this.roomRepository.createRoom(user, targetUser);
  }
}
