import { IsNotEmpty, IsString } from 'class-validator';

export class PostCommentDto {
  @IsNotEmpty()
  @IsString()
  comment: string;
}
