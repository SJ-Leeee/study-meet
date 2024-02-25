import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './Users';

@Entity()
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'refreshTokenId' })
  refreshTokenId: number;

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

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens)
  @JoinColumn({ name: 'user' })
  user: UserEntity;
}
