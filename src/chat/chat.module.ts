import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { RoomService } from './services/room.service';
import { RoomController } from './controllers/room.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RoomRepository } from './repositories/room.repository';
import { RoomEntity } from 'src/entities/Rooms';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from './repositories/chat.repository';
import { ChatEntity } from 'src/entities/Chats';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, ChatEntity]), AuthModule],
  controllers: [ChatController, RoomController],
  providers: [ChatService, RoomService, RoomRepository, ChatRepository],
})
export class ChatModule {}
