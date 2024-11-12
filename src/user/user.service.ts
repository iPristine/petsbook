import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(telegramId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        telegramId: telegramId.toString(),
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async createOrUpdate(userData: {
    telegramId: number;
    firstName: string;
    lastName?: string;
    username?: string;
    lang?: string;
  }): Promise<User> {
    const { telegramId, firstName, lastName, username, lang } = userData;

    return this.prisma.user.upsert({
      where: {
        telegramId: telegramId.toString(),
      },
      update: {
        firstName,
        lastName: lastName || null,
        username: username || null,
        lang,
      },
      create: {
        telegramId: telegramId.toString(),
        firstName,
        lastName: lastName || null,
        username: username || null,
        lang,
      },
    });
  }

  async updateLanguage(telegramId: number, lang: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        telegramId: telegramId.toString(),
      },
      data: {
        lang,
      },
    });
  }
}
