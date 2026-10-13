import { Injectable, NotFoundException } from '@nestjs/common';
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
  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}
