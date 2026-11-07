import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123',
    minLength: 10,
    maxLength: 30,
    pattern: '^(?=.*[A-Za-z])(?=.*\\d).+$',
    description: 'Password must contain at least one letter and one digit',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(30)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must contain at least one letter and one digit',
  })
  password: string;
}
