import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/entities/Refresh_token';
import { UserEntity } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly accessTokenRepo: Repository<RefreshTokenEntity>,
  ) {}

  async saveRefreshToken(
    user: UserEntity,
    token: string,
    jti: string,
    expiresAt: Date,
  ) {
    const refreshToken = new RefreshTokenEntity();
    refreshToken.user_id = user;
    refreshToken.token = token;
    refreshToken.jti = jti;
    refreshToken.expiresAt = expiresAt;

    this.accessTokenRepo.save(refreshToken);
  }
}
