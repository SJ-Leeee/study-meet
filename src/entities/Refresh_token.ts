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

@Entity({ schema: 'study_meet', name: 'refreshTokens' })
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

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user' })
  user: UserEntity;
}
