import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async generateToken(userId: number, role: string) {
    const payload = { userId, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow<StringValue>(
          'JWT_REFRESH_EXPIRES_IN',
        ),
      }),
    ]);
    return { accessToken, refreshToken };
  }
  async createUser(name: string, email: string, password: string) {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser(name, email, hashedPassword);
    const { password: _, ...safeUser } = user;
    const tokens = await this.generateToken(user.id, user.role);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userService.saveHashedRefreshToken(user.id, hashedRefreshToken);
    return { user: safeUser, tokens };
  }
  async login(email: string, password: string) {
    const user = await this.userService.login(email, password);
    const { password: _, ...safeUser } = user;
    const tokens = await this.generateToken(user.id, user.role);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userService.saveHashedRefreshToken(user.id, hashedRefreshToken);
    return { user: safeUser, tokens };
  }
  async refreshAccessToken(refreshToken: string) {
    let payload: { userId: number; role: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.userService.findUserById(payload.userId);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const tokens = await this.generateToken(user.id, user.role);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    console.log(user.hashedRefreshToken === hashedRefreshToken);
    await this.userService.saveHashedRefreshToken(user.id, hashedRefreshToken);
    return tokens;
  }
}
