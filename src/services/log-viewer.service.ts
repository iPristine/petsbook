import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LogViewerService {
  constructor(private prisma: PrismaService) {}

  async getUserLogs(telegramId: string, limit = 5) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      select: { id: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const logs = await this.prisma.userLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        action: true,
        details: true,
        error: true,
        createdAt: true,
      },
    });

    return logs;
  }

  async getLastErrors(telegramId: string, limit = 5) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      select: { id: true },
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    return this.prisma.userLog.findMany({
      where: {
        userId: user.id,
        error: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
