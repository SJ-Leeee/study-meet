import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { SignupUserDto } from '../dto/signupUser.dto';
import { EditRoleDto } from '../dto/editRole.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    return await this.userRepo
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId })
      .getOne();
  }

  signupUser(dto: SignupUserDto, hashedPassword: string) {
    const user = new UserEntity();
    user.name = dto.name;
    user.email = dto.email;
    user.password = hashedPassword;
    user.age = dto.age;
    this.userRepo.save(user);
    const result = {
      id: user.userId,
      name: user.name,
      email: user.email,
    };
    return result;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepo
      .createQueryBuilder('user')
      .select(['user.userId', 'user.name', 'user.userRole'])
      .getMany();
  }

  async updateUser(userId: number, roleDto: EditRoleDto): Promise<any> {
    return await this.userRepo
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        userRole: roleDto.role,
      })
      .where('userId = :userId', { userId })
      .execute();
  }
}
