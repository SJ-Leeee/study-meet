import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/common/decorator/user.decorator';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { RoomService } from '../services/room.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // 내 룸 조회api
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '내가 속한 방 조회',
    description: 'jwt로 인증된 사용자가 본인이 속한 모든 방 조회',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '모든 방 조회',
  })
  @HttpCode(200)
  @Get()
  async findMyRooms(@User() user: ReqUserDto) {
    return await this.roomService.findAllRooms(+user.userId);
  }

  // 룸 만들기 api
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '새로운 방 생성',
    description: 'jwt로 인증된 사용자가 상대방과의 방 생성',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: '새로운 방 생성',
  })
  @HttpCode(201)
  @ApiParam({
    name: 'targetUserId',
    description: '상대방의 userId',
    example: 3,
  })
  @Post('/:targetUserId')
  async createRoom(
    @User() user: ReqUserDto,
    @Param('targetUserId') targetUserId: string,
  ) {
    await this.roomService.createRoom(user, +targetUserId);
  }
}
