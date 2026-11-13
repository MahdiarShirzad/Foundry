import { IsString } from 'class-validator';

export class CreateIdeaNoteDto {
  @IsString()
  author: string;

  @IsString()
  initials: string;

  @IsString()
  body: string;
}
