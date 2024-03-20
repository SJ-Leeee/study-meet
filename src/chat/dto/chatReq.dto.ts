import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChatReqDto {
  @ApiProperty()
  @IsString()
  @Length(2)
  message: string;
}
