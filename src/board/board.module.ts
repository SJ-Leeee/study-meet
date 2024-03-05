import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from 'src/entities/Boards';
import { Board_imageEntity } from 'src/entities/Board_image';
import { CommentEntity } from 'src/entities/Comments';
import { UploadModule } from 'src/upload/upload.module';
import { BoardRepository } from './repositories/board.repository';
import { BoardImageRepository } from './repositories/boardImage.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([BoardEntity, Board_imageEntity, CommentEntity]),
    UploadModule,
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, BoardImageRepository],
})
export class BoardModule {}
