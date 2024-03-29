import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { AccessTokenRepository } from 'src/auth/repositories/accessToken.repository';
import { RefreshTokenRepository } from 'src/auth/repositories/refreshToken.repository';
import { UserEntity } from 'src/entities/Users';
import { AccessTokenEntity } from 'src/entities/Access_token';
import { RefreshTokenEntity } from 'src/entities/Refresh_token';
import { BusinessException } from 'src/exception/businessException';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
  }),
  save: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: MockRepository<UserRepository>;
  let accessTokenRepo: MockRepository<AccessTokenRepository>;
  let refreshTokenRepo: MockRepository<RefreshTokenRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepository,
        AccessTokenRepository,
        RefreshTokenRepository,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(AccessTokenEntity),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(RefreshTokenEntity),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<MockRepository<UserRepository>>(
      getRepositoryToken(UserEntity),
    );
  });
  const mockUser = {
    email: 'aaaa@test.com',
    name: 'test',
    password: 'test',
    age: 30,
  };
  describe('회원가입', () => {
    it('정상적인 회원가입', async () => {
      jest
        .spyOn(userRepo.createQueryBuilder(), 'getOne')
        .mockResolvedValue(null);

      jest.spyOn(userRepo, 'save').mockResolvedValue(null);
      const result = await service.signupUser(
        JSON.parse(JSON.stringify(mockUser)),
      );
      expect(userRepo.createQueryBuilder().getOne).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(result.name).toEqual('test');
    });

    it('같은 Email이 존재 할 경우', () => {
      jest.spyOn(userRepo.createQueryBuilder(), 'getOne').mockResolvedValue(1);
      expect(service.signupUser(mockUser)).rejects.toThrow(BusinessException);
    });
  });
});
