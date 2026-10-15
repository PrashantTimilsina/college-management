import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { LoginDto } from '../user/dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User registered successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiConflictResponse({
    description: 'User with the given email already exists',
  })
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    return this.authService.createUser(name, email, password);
  }
  @ApiOperation({ summary: 'Login a user' })
  @ApiCreatedResponse({ description: 'User logged in successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiConflictResponse({
    description:
      'User with the given email does not exist or password is incorrect',
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiConflictResponse({
    description: 'Invalid refresh token',
  })
  @Post('refresh')
  refreshAccessToken(@Body() refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    return this.authService.refreshAccessToken(refreshToken);
  }
}
