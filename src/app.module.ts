import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/Users';
import { BoardEntity } from './entities/Boards';
import { Tutor_infoEntity } from './entities/Tutor_info';
import { Tutor_certification_imageEntity } from './entities/Tutor_certification_image';
import { CommentEntity } from './entities/Comments';
import { ChatEntity } from './entities/Chats';
import { FriendEntity } from './entities/Friends';
import { ReportEntity } from './entities/Reports';
import { ScrabEntity } from './entities/Scrabs';
import { Board_imageEntity } from './entities/Board_image';
import { AuthModule } from './auth/auth.module';
import { AccessTokenEntity } from './entities/Access_token';
import { RefreshTokenEntity } from './entities/Refresh_token';
import { UploadModule } from './upload/upload.module';
import { BoardModule } from './board/board.module';
import { EventModule } from './event/event.module';
import { RoomEntity } from './entities/Rooms';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [
        UserEntity,
        BoardEntity,
        Tutor_infoEntity,
        Tutor_certification_imageEntity,
        CommentEntity,
        ChatEntity,
        FriendEntity,
        ReportEntity,
        ScrabEntity,
        Board_imageEntity,
        AccessTokenEntity,
        RefreshTokenEntity,
        RoomEntity,
      ],
      synchronize: false,
      keepConnectionAlive: true,
      logging: true,
      charset: 'utf8mb4',
      // 이모티콘 쓰기 위해
    }),
    AuthModule,
    UploadModule,
    BoardModule,
    EventModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
