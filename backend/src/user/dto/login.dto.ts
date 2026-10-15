import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'prashant@gmail.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'Password for the user account',
    example: 'password123',
    minLength: 6,
    maxLength: 30,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  password: string;
}
