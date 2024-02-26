import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from 'src/entities/Users';
import { BusinessException } from 'src/exception/businessException';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepo.getAllUsers();
  }

  async getUserById(userId: number): Promise<any> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new BusinessException(
        'user',
        'user is not exist',
        'user is not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const { password, createdAt, updatedAt, ...result } = user;
    return result;
  }
}
