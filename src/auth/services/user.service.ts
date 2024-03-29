import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity, UserRole } from 'src/entities/Users';
import { BusinessException } from 'src/exception/businessException';
import { EditRoleDto } from '../dto/editRole.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  // 모든유저정보
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepo.getAllUsers();
  }

  // 유저정보를Id로
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

  // 유저역할변경
  async editUserRole(userId: number, role: EditRoleDto): Promise<void> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new BusinessException(
        'user',
        'user is not exist',
        'user is not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepo.updateUser(userId, role);
  }

  // 유저삭제
  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new BusinessException(
        'user',
        'user is not exist',
        'user is not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.userRepo.deleteUser(userId);
  }
}
