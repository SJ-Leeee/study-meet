import { DataSource } from 'typeorm';
import { Board_image } from './src/entities/Board_image';
import { Boards } from './src/entities/Boards';
import { Chats } from './src/entities/Chats';
import { Comments } from './src/entities/Comments';
import { Friends } from './src/entities/Friends';
import { Reports } from './src/entities/Reports';
import { Scrabs } from './src/entities/Scrabs';
import { Tutor_certification_image } from './src/entities/Tutor_certification_image';
import { Tutor_info } from './src/entities/Tutor_info';
import { Users } from './src/entities/Users';

require('dotenv').config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    Users,
    Boards,
    Board_image,
    Tutor_info,
    Tutor_certification_image,
    Comments,
    Chats,
    Friends,
    Reports,
    Scrabs,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  charset: 'utf8mb4_general_ci',
  synchronize: true,
  logging: true,
});

export default dataSource;
// typeorm-extension 전용 파일
