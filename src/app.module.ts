import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/Users';
import { Boards } from './entities/Boards';
import { Tutor_info } from './entities/Tutor_info';
import { Tutor_certification_image } from './entities/Tutor_certification_image';
import { Comments } from './entities/Comments';
import { Chats } from './entities/Chats';
import { Friends } from './entities/Friends';
import { Reports } from './entities/Reports';
import { Scrabs } from './entities/Scrabs';
import { Board_image } from './entities/Board_image';

@Module({
  imports: [
    UserModule,
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
        Users,
        Boards,
        Tutor_info,
        Tutor_certification_image,
        Comments,
        Chats,
        Friends,
        Reports,
        Scrabs,
        Board_image,
      ],
      synchronize: true,
      keepConnectionAlive: true,
      logging: true,
      charset: 'utf8mb4',
      // 이모티콘 쓰기 위해
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
