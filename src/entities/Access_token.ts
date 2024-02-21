import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './Users';

@Entity()
export class AccessTokenEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'accessTokenId' })
  accessTokenId: number;

  @Column('varchar')
  jti: string;

  @Column('text')
  token: string;

  @Column()
  available: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.accessTokens)
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;
}
