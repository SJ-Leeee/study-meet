import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { User } from 'src/common/decorator/user.decorator';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';
import { PostCommentDto } from '../dto/postCommentReq.dto';

@Controller('board/:boardId/comment')
export class CommentController {
  constructor(private readonly cmtService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async postComment(
    @Param('boardId') boardId: string,
    @User() user: ReqUserDto,
    @Body() cmtDto: PostCommentDto,
  ): Promise<any> {
    await this.cmtService.postComment(user, +boardId, cmtDto);
    return { message: 'success' };
  }

  @Get()
  async getComments(@Param('boardId') boardId: string) {
    return await this.cmtService.getAllComments(+boardId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:commentId')
  async editComment(
    @Param() ids,
    @Body() cmtDto: PostCommentDto,
    @User() user: ReqUserDto,
  ): Promise<any> {
    await this.cmtService.editComment(
      user,
      cmtDto,
      +ids.boardId,
      +ids.commentId,
    );

    return { message: 'success' };
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/:commentId')
  async deleteComment(@Param() ids, @User() user: ReqUserDto): Promise<any> {
    await this.cmtService.deleteCommment(user, +ids.boardId, +ids.commentId);

    return { message: 'success' };
  }
}
