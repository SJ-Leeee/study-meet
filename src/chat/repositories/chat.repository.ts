import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from '../../entities/Chats';
import { RoomEntity } from '../../entities/Rooms';
import { Repository } from 'typeorm';
import { ChatReqDto } from '../dto/chatReq.dto';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepo: Repository<ChatEntity>,
  ) {}

  async findChatByRoomId(roomId: number) {
    return await this.chatRepo
      .createQueryBuilder('c')
      .leftJoin('c.room', 'r')
      .where('r.roomId = :roomId', { roomId })
      .select(['c.isSend', 'c.message', 'c.createdAt'])
      .getMany();
  }

  async saveChat(room: RoomEntity, chatDto: ChatReqDto, isSend: boolean) {
    const chat = new ChatEntity();
    chat.room = room;
    chat.message = chatDto.message;
    chat.isSend = isSend;

    await this.chatRepo
      .createQueryBuilder()
      .insert()
      .into(ChatEntity)
      .values(chat)
      .execute();
  }
}
