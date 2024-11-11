import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LoggerService extends Logger {
  constructor(private prisma: PrismaService) {
    super();
  }

  async logUserAction(data: {
    telegramId: string;
    action: string;
    details?: string;
    error?: string;
  }) {
    const { telegramId, action, details, error } = data;

    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId },
        select: { id: true },
      });

      if (!user) {
        this.error(`User not found: ${telegramId}`);
        return;
      }

      this.log(`User ${telegramId} performed action: ${action}`);

      await this.prisma.userLog.create({
        data: {
          userId: user.id,
          action,
          details,
          error,
        },
      });

      if (error) {
        this.error(`Error for user ${telegramId}: ${error}`);
      }
    } catch (err) {
      this.error(`Logging error: ${err.message}`);
    }
  }
}
