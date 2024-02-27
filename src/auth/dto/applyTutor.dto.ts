import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyTutorDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  selfIntroduce: string;
}
