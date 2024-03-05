import { IsNotEmpty, IsString } from 'class-validator';

export class PostBoardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
