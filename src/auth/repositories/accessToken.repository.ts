import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenEntity } from 'src/entities/Access_token';
import { UserEntity } from 'src/entities/Users';
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
    accessToken.user_id = user;
    accessToken.token = token;
    accessToken.jti = jti;
    accessToken.expiresAt = expiresAt;

    return this.accessTokenRepo.save(accessToken);
  }

  async getAccessWithJti(jti: string): Promise<AccessTokenEntity> {
    return await this.accessTokenRepo.findOne({ where: { jti } });
  }
}
