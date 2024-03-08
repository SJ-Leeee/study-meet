import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';
import { ChatReqDto } from '../dto/chatReq.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:roomId')
  async findChatInRoom(
    @User() user: ReqUserDto,
    @Param('roomId') roomId: string,
  ) {
    return await this.chatService.findChatInRoom(user, +roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:roomId')
  async sendChatInRoom(
    @User() user: ReqUserDto,
    @Param('roomId') roomId: string,
    @Body() chatDto: ChatReqDto,
  ) {
    return await this.chatService.sendChatInRoom(user, +roomId, chatDto);
  }
}
