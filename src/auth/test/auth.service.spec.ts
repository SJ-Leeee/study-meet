import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { AccessTokenRepository } from 'src/auth/repositories/accessToken.repository';
import { RefreshTokenRepository } from 'src/auth/repositories/refreshToken.repository';
import { UserEntity } from 'src/entities/Users';
import { AccessTokenEntity } from 'src/entities/Access_token';
import { RefreshTokenEntity } from 'src/entities/Refresh_token';
import { BusinessException } from 'src/exception/businessException';
import * as bcrypt from 'bcrypt';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
// 모든타입을 mocking 한 뒤 부분적으로 사용하기 위한 타입

const mockRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(), // 체이닝함수를 리턴할 때 this를 리턴하게 되는 함수이다
    getOne: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    save: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
  }),
  save: jest.fn(),
  sign: jest.fn(() => 'token'),
});

const mockConfigService = {
  get: jest.fn(),
};

// const mockTestRepo = {
//   findUserByEmail: jest.fn(),
// };

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
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
        { provide: JwtService, useValue: mockRepository() },
        { provide: ConfigService, useValue: mockConfigService },
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
    accessTokenRepo = module.get<MockRepository<AccessTokenRepository>>(
      getRepositoryToken(AccessTokenEntity),
    );

    refreshTokenRepo = module.get<MockRepository<RefreshTokenRepository>>(
      getRepositoryToken(RefreshTokenEntity),
    );

    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
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
      const goodUser = { ...mockUser };
      const result = await service.signupUser(goodUser);
      expect(userRepo.createQueryBuilder().getOne).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(result.name).toEqual('test');
    });

    it('같은 Email이 존재 할 경우', async () => {
      jest.spyOn(userRepo.createQueryBuilder(), 'getOne').mockResolvedValue(1);
      await expect(service.signupUser(mockUser)).rejects.toThrow(
        BusinessException,
      );
    });

    it('비밀번호가 없는 경우', async () => {
      const userWithoutPassword = { ...mockUser };
      delete userWithoutPassword.password; // 비밀번호 필드 삭제

      // 예외가 발생해야 함
      await expect(service.signupUser(userWithoutPassword)).rejects.toThrow(
        BusinessException,
      );
    });
  });

  describe('로그인', () => {
    it('비밀번호가 틀린 경우', async () => {
      jest
        .spyOn(userRepo.createQueryBuilder(), 'getOne')
        .mockResolvedValue(mockUser);

      const loginDto = { email: `aaaa@naver.com`, password: 'invalid' };
      const error = await service
        .loginServiceUser(loginDto)
        .catch((error) => error);

      expect(error).toBeDefined();
      expect(error.domain).toBe('auth');
    });

    it('로그인 후 토큰 정상 발급', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      mockConfigService.get.mockReturnValue('1h');
      jest
        .spyOn(userRepo.createQueryBuilder(), 'getOne')
        .mockResolvedValue({ userId: 1, password: hashedPassword });
      jest.spyOn(jwtService, 'sign');

      const result = await service.loginServiceUser({
        email: 'aaa',
        password: 'correctPassword',
      });
      expect(result).toEqual({ accessToken: 'token', refreshToken: 'token' });
    });
  });
});
