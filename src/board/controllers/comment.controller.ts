import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('board/:boardId/comment')
export class CommentController {
  constructor() {}

  @Post()
  async postComment() {}

  @Get()
  async getComment() {}

  @Put()
  async editComment() {}

  @Delete()
  async deleteComment() {}
}
