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
import { AccessToken } from './entities/Access_token';
import { RefreshToken } from './entities/Refresh_token';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
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
        AccessToken,
        RefreshToken,
      ],
      synchronize: true,
      keepConnectionAlive: true,
      logging: true,
      charset: 'utf8mb4',
      // 이모티콘 쓰기 위해
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
