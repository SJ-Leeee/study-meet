import { DataSource } from 'typeorm';
import { Board_imageEntity } from './src/entities/Board_image';
import { BoardEntity } from './src/entities/Boards';
import { ChatEntity } from './src/entities/Chats';
import { CommentEntity } from './src/entities/Comments';
import { FriendEntity } from './src/entities/Friends';
import { ReportEntity } from './src/entities/Reports';
import { ScrabEntity } from './src/entities/Scrabs';
import { Tutor_certification_imageEntity } from './src/entities/Tutor_certification_image';
import { Tutor_infoEntity } from './src/entities/Tutor_info';
import { UserEntity } from './src/entities/Users';

require('dotenv').config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    UserEntity,
    BoardEntity,
    Board_imageEntity,
    Tutor_infoEntity,
    Tutor_certification_imageEntity,
    CommentEntity,
    ChatEntity,
    FriendEntity,
    ReportEntity,
    ScrabEntity,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  charset: 'utf8mb4_general_ci',
  synchronize: true,
  logging: true,
});

export default dataSource;
// typeorm-extension 전용 파일
