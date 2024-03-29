import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenEntity } from '../../entities/Access_token';
import { UserEntity } from '../../entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class AccessTokenRepository {
  constructor(
    @InjectRepository(AccessTokenEntity)
    private readonly accessTokenRepo: Repository<AccessTokenEntity>,
  ) {}

  async saveAccessToken(
    user: UserEntity,
    token: string,
    jti: string,
    expiresAt: Date,
  ) {
    const accessToken = new AccessTokenEntity();
    accessToken.user = user;
    accessToken.token = token;
    accessToken.jti = jti;
    accessToken.expiresAt = expiresAt;

    return this.accessTokenRepo.save(accessToken);
  }

  async getAccessWithJti(jti: string): Promise<AccessTokenEntity> {
    return await this.accessTokenRepo
      .createQueryBuilder('accessToken')
      .select(['accessToken.available', 'user.userId', 'user.userRole']) // accessToken만 선택
      .leftJoin('accessToken.user', 'user')
      .where('accessToken.jti = :jti', { jti })
      .getOne();
  }

  async blacklist(jti: string): Promise<void> {
    await this.accessTokenRepo
      .createQueryBuilder()
      .update(AccessTokenEntity)
      .set({ available: false })
      .where('jti = :jti', { jti })
      .execute();
  }
}
