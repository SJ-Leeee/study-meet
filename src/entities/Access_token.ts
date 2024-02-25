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

@Entity({ schema: 'study_meet', name: 'accessTokens' })
export class AccessTokenEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'accessTokenId' })
  accessTokenId: number;

  @Column('varchar')
  jti: string;

  @Column('text')
  token: string;

  @Column({ default: true })
  available: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.accessTokens)
  @JoinColumn({ name: 'user' })
  user: UserEntity;
}
