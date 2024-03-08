import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';
import { RoomService } from './room.service';
import { RoomRepository } from '../repositories/room.repository';
import { BusinessException } from 'src/exception/businessException';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatReqDto } from '../dto/chatReq.dto';
import { RoomEntity } from 'src/entities/Rooms';

@Injectable()
export class ChatService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly chatRepository: ChatRepository,
  ) {}

  // 채팅내역찾기
  async findChatInRoom(userDto: ReqUserDto, roomId: number) {
    try {
      await this.roomValidate(roomId, userDto);

      return await this.chatRepository.findChatByRoomId(roomId);
    } catch (err) {
      throw err;
    }
  }

  async sendChatInRoom(
    userDto: ReqUserDto,
    roomId: number,
    chatDto: ChatReqDto,
  ) {
    let isSend: boolean;
    const room = await this.roomValidate(roomId, userDto);
    isSend = room.firstUser.userId === userDto.userId ? true : false;
    await this.chatRepository.saveChat(room, chatDto, isSend);
  }

  private async roomValidate(
    roomId: number,
    userDto: ReqUserDto,
  ): Promise<RoomEntity> {
    const room = await this.roomRepository.findRoomByRoomId(roomId);

    if (!room)
      throw new HttpException('room does not exists', HttpStatus.NOT_FOUND);

    if (
      room.firstUser.userId !== userDto.userId &&
      room.secondUser.userId !== userDto.userId
    ) {
      throw new BusinessException(
        'chat',
        'Permission does not exist.',
        'Permission does not exist.',
        HttpStatus.FORBIDDEN,
      );
    }

    return room;
  }
}
