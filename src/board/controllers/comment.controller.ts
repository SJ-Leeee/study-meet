import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('board/:boardId/comment')
export class CommentController {
  constructor(private readonly cmtService: CommentService) {}

  // 댓글작성
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '댓글 생성',
    description: 'jwt로 인증된 사용자가 댓글 작성',
  })
  @ApiParam({ name: 'boardId', description: '게시물 id로 검색', example: 5 })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: '댓글 생성',
  })
  @HttpCode(201)
  @Post()
  async postComment(
    @Param('boardId') boardId: string,
    @User() user: ReqUserDto,
    @Body() cmtDto: PostCommentDto,
  ): Promise<any> {
    await this.cmtService.postComment(user, +boardId, cmtDto);
    return { message: 'success' };
  }

  // 특정 게시물 댓글 조회 api
  @ApiOperation({
    summary: '댓글 전체 조회',
    description: '특정 게시물의 댓글을 전체 조회',
  })
  @ApiParam({ name: 'boardId', description: '게시물 id로 검색', example: 5 })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '댓글 조회',
  })
  @HttpCode(200)
  @Get()
  async getComments(@Param('boardId') boardId: string) {
    return await this.cmtService.getAllComments(+boardId);
  }

  // 특정 게시물의 특정 댓글 조회 api 쓸데가 없을 듯
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '댓글 전체 조회',
    description: '특정 게시물의 특정 댓글을 조회',
  })
  @ApiParam({ name: 'boardId', description: '게시물 id로 검색', example: 5 })
  @ApiParam({ name: 'commentId', description: '댓글 id로 검색', example: 5 })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '특정 댓글 조회',
  })
  @HttpCode(200)
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

  // 특정 댓글 삭제 api
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '댓글 삭제',
    description: 'jwt로 인증된 관리자나 작성자가 댓글 삭제',
  })
  @ApiParam({ name: 'boardId', description: '게시물 id로 검색', example: 5 })
  @ApiParam({ name: 'commentId', description: '댓글 id로 검색', example: 5 })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '특정 댓글 삭제',
  })
  @HttpCode(200)
  @Delete('/:commentId')
  async deleteComment(@Param() ids, @User() user: ReqUserDto): Promise<any> {
    await this.cmtService.deleteCommment(user, +ids.boardId, +ids.commentId);

    return { message: 'success' };
  }
}
