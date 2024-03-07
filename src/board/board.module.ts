import { Module } from '@nestjs/common';
import { BoardController } from './controllers/board.controller';
import { BoardService } from './services/board.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from 'src/entities/Boards';
import { Board_imageEntity } from 'src/entities/Board_image';
import { CommentEntity } from 'src/entities/Comments';
import { UploadModule } from 'src/upload/upload.module';
import { BoardRepository } from './repositories/board.repository';
import { BoardImageRepository } from './repositories/boardImage.repository';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { CommentRepository } from './repositories/comment.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([BoardEntity, Board_imageEntity, CommentEntity]),
    UploadModule,
  ],
  controllers: [BoardController, CommentController],
  providers: [
    BoardService,
    BoardRepository,
    BoardImageRepository,
    CommentService,
    CommentRepository,
  ],
})
export class BoardModule {}
