import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    return this.authService.createUser(name, email, password);
  }
}
