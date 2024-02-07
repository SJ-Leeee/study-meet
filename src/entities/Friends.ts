import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'study-meet', name: 'friends' })
export class Friends {
  @PrimaryGeneratedColumn({ type: 'int', name: 'friendId' })
  friendId: number;

  // ManyToOne 유저아이디 두개~~
}
