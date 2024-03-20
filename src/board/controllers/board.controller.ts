import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { PostBoardDto } from '../dto/postBoardReq.dto';
import { User } from 'src/common/decorator/user.decorator';
import { BoardService } from '../services/board.service';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 게시물 생성 api
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '게시물 생성',
    description: 'jwt로 인증된 사용자가 게시물을 생성, 이미지 선택',
  })
  @ApiBody({ type: PostBoardDto })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: '게시물 생성',
  })
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: { fileSize: 1024 * 1024 * 10 },
    }),
  )
  @Post()
  async postBoard(
    @Body() postBoardDto: PostBoardDto,
    @UploadedFiles() files: Express.Multer.File[],
    @User() user,
  ) {
    await this.boardService.postBoard(user.userId, postBoardDto, files);
    return { message: 'success' };
  }

  // 게시물 전체 조회 api
  @ApiOperation({
    summary: '게시물 전체 조회',
    description: '게시물 전체 조회',
  })
  @ApiResponse({
    status: 200,
    description: '게시물 전체 조회 성공',
  })
  @HttpCode(200)
  @Get()
  async getAllBoards() {
    return await this.boardService.getAllBoards();
  }

  // 특정 게시물 조회 api
  @ApiOperation({
    summary: '게시물 생성',
    description: 'jwt로 인증된 사용자가 게시물을 생성, 이미지 선택',
  })
  @ApiParam({ name: 'id', description: '게시물 id로 검색', example: 5 })
  @ApiResponse({
    status: 200,
    description: '게시물 조회',
  })
  @HttpCode(200)
  @Get('/:id')
  async getBoard(@Param('id') id: string) {
    return await this.boardService.getBoard(+id);
  }

  // 게시물 삭제
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '게시물 삭제',
    description: 'jwt로 인증된 관리자 또는 작성자가 게시물을 삭제',
  })
  @ApiParam({ name: 'id', description: '게시물 id로 검색', example: 5 })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '게시물 삭제',
  })
  @HttpCode(200)
  @Delete('/:id')
  async deleteBoard(@Param('id') boardId: string, @User() user: ReqUserDto) {
    await this.boardService.deleteBoard(user, +boardId);
    return { message: 'success' };
  }

  // 게시물 수정 api
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '게시물 삭제',
    description: 'jwt로 인증된 관리자 또는 작성자가 게시물을 수정',
  })
  @ApiParam({ name: 'id', description: '게시물 id로 검색', example: 5 })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '게시물 수정',
  })
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: { fileSize: 1024 * 1024 * 10 },
    }),
  )
  @Put('/:id')
  async editBoard(
    @Body() postBoardDto: PostBoardDto,
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: ReqUserDto,
    @Param('id') boardId: string,
  ) {
    await this.boardService.editBoard(user, +boardId, postBoardDto, files);
  }
}
