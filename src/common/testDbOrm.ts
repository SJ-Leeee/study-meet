import { AccessTokenEntity } from 'src/entities/Access_token';
import { Board_imageEntity } from 'src/entities/Board_image';
import { BoardEntity } from 'src/entities/Boards';
import { ChatEntity } from 'src/entities/Chats';
import { CommentEntity } from 'src/entities/Comments';
import { FriendEntity } from 'src/entities/Friends';
import { RefreshTokenEntity } from 'src/entities/Refresh_token';
import { ReportEntity } from 'src/entities/Reports';
import { RoomEntity } from 'src/entities/Rooms';
import { ScrabEntity } from 'src/entities/Scrabs';
import { Tutor_certification_imageEntity } from 'src/entities/Tutor_certification_image';
import { Tutor_infoEntity } from 'src/entities/Tutor_info';
import { UserEntity } from 'src/entities/Users';
enum dbName {
  mysql = 'mysql',
  no = 'ex',
}

require('dotenv').config();
export const TestDbOrm = {
  type: dbName.mysql,
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.TEST_DATABASE,
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
};
