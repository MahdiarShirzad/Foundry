import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-from-email', minLength: 10 })
  @IsString()
  @MinLength(10)
  token: string;

  @ApiProperty({
    example: 'NewPassword123',
    minLength: 10,
    maxLength: 128,
    pattern: '^(?=.*[A-Za-z])(?=.*\\d).+$',
    description: 'Password must contain at least one letter and one digit',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must contain at least one letter and one digit',
  })
  password: string;
}
