import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { LoginDto } from '../user/dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    return this.authService.createUser(name, email, password);
  }
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }
  @Post('refresh')
  refreshAccessToken(@Body() refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    return this.authService.refreshAccessToken(refreshToken);
  }
}
