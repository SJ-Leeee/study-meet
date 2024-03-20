import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';
import { ChatReqDto } from '../dto/chatReq.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 채팅내역 전체조회 api
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '채팅내역 조회',
    description: 'jwt로 인증된 작성자가 채팅내역 전체조회',
  })
  @ApiParam({ name: 'roomId', description: '방 id로 검색', example: 5 })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '채팅 조회',
  })
  @HttpCode(200)
  @Get('/:roomId')
  async findChatInRoom(
    @User() user: ReqUserDto,
    @Param('roomId') roomId: string,
  ) {
    return await this.chatService.findChatInRoom(user, +roomId);
  }

  // 채팅 생성 api
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '채팅생성',
    description: 'jwt로 인증된 작성자가 채팅작성',
  })
  @ApiParam({ name: 'roomId', description: '방 id로 검색', example: 5 })
  @ApiBearerAuth()
  @ApiBody({ type: ChatReqDto })
  @ApiResponse({
    status: 201,
    description: '채팅 작성',
  })
  @HttpCode(201)
  @Post('/:roomId')
  async sendChatInRoom(
    @User() user: ReqUserDto,
    @Param('roomId') roomId: string,
    @Body() chatDto: ChatReqDto,
  ) {
    return await this.chatService.sendChatInRoom(user, +roomId, chatDto);
  }
}
