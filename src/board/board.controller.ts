import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { PostBoardDto } from './dto/postBoardReq.dto';
import { User } from 'src/common/decorator/user.decorator';
import { BoardService } from './board.service';

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
    return await this.boardService.postBoard(user.userId, postBoardDto, files);
  }
}
