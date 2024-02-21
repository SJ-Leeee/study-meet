import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignupUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;
}
