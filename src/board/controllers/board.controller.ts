import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
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

  @Get()
  async getAllBoards() {
    return await this.boardService.getAllBoards();
  }

  @Get('/:id')
  async getBoard(@Param('id') id: string) {
    return await this.boardService.getBoard(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteBoard(@Param('id') boardId: string, @User() user: ReqUserDto) {
    await this.boardService.deleteBoard(user, +boardId);
    return { message: 'success' };
  }

  @UseGuards(JwtAuthGuard)
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
