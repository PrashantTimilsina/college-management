import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(name: string, email: string, password: string) {
    return await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }
}
