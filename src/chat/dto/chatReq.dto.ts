import { IsString, Length } from 'class-validator';

export class ChatReqDto {
  @IsString()
  @Length(2)
  message: string;
}
