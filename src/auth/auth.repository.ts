import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { SignupUserDto } from './dto/signupUser.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { email } });
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
}
