import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'study-meet', name: 'chats' })
export class Chats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatId' })
  chatId: number;

  @Column('text', { name: 'chatDetail' })
  chatDetail: string;

  // ManyToOne  유저아이디 두개~~
}
