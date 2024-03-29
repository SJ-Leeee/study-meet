import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;
}
