import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../../entities/Refresh_token';
import { UserEntity } from '../../entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshRepo: Repository<RefreshTokenEntity>,
  ) {}

  async saveRefreshToken(
    user: UserEntity,
    token: string,
    jti: string,
    expiresAt: Date,
  ) {
    const refreshToken = new RefreshTokenEntity();
    refreshToken.user = user;
    refreshToken.token = token;
    refreshToken.jti = jti;
    refreshToken.expiresAt = expiresAt;

    return this.refreshRepo.save(refreshToken);
  }

  async getRefreshWithJti(jti: string): Promise<RefreshTokenEntity> {
    return await this.refreshRepo
      .createQueryBuilder('refresh')
      .select(['refresh.available', 'user.userId'])
      .leftJoin('refresh.user', 'user')
      .where('refresh.jti = :jti', { jti })
      .getOne();
  }

  async blacklist(jti: string): Promise<void> {
    await this.refreshRepo
      .createQueryBuilder()
      .update(RefreshTokenEntity)
      .set({ available: false })
      .where('jti = :jti', { jti })
      .execute();
  }
}
