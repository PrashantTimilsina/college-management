import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { AuthGuard } from '../auth/guard/auth.guard.js';
import { CurrentUser } from '../auth/decorator/current-user.decorator.js';
import type { JwtAuth } from '../auth/dto/jwt-auth.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: JwtAuth) {
    const userId = user.userId;
    return this.userService.getMe(userId);
  }
}
