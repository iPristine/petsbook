import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { Context, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkReminders() {
    await this.checkPreNotifications();

    const now = new Date();
    const reminders = await this.prisma.reminder.findMany({
      where: {
        OR: [
          {
            // Проверяем разовые напоминания
            frequency: 'once',
            date: {
              gte: now,
              lte: new Date(now.getTime() + 60000), // следующая минута
            },
          },
          {
            // Проверяем еженедельные напоминания
            frequency: 'weekly',
            date: {
              gte: now,
              lte: new Date(now.getTime() + 60000),
            },
          },
          {
            // Проверяем ежемесячные напоминания
            frequency: 'monthly',
            date: {
              gte: now,
              lte: new Date(now.getTime() + 60000),
            },
          },
          {
            // Проверяем ежеквартальные напоминания
            frequency: 'quarterly',
            date: {
              gte: now,
              lte: new Date(now.getTime() + 60000),
            },
          },
          {
            // Проверяем ежегодные напоминания
            frequency: 'yearly',
            date: {
              gte: now,
              lte: new Date(now.getTime() + 60000),
            },
          },
        ],
      },
      include: {
        user: true,
        pets: {
          include: {
            pet: true,
          },
        },
      },
    });

    for (const reminder of reminders) {
      await this.sendNotification(reminder);
      await this.updateReminderDate(reminder);
    }
  }

  private async sendNotification(reminder: any) {
    const petsInfo =
      reminder.pets.length > 0
        ? `🐾 Питомцы: ${reminder.pets.map((p) => p.pet.name).join(', ')}`
        : '🌐 Общее напоминание';

    const message = ['🔔 Напоминание:', `📝 ${reminder.title}`, petsInfo].join(
      '\n',
    );

    try {
      await this.bot.telegram.sendMessage(reminder.user.telegramId, message);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  private async updateReminderDate(reminder: any) {
    if (reminder.frequency === 'once') {
      // Для разовых напоминаний - удаляем после отправки
      await this.prisma.reminder.delete({
        where: { id: reminder.id },
      });
      return;
    }

    // Обновляем дату следующего напоминания
    const nextDate = new Date(reminder.date);
    switch (reminder.frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    await this.prisma.reminder.update({
      where: { id: reminder.id },
      data: { date: nextDate },
    });
  }

  private async checkPreNotifications() {
    const now = new Date();
    const reminders = await this.prisma.reminder.findMany({
      where: {
        OR: [
          {
            notifyDays: 1,
            date: {
              gte: new Date(now.getTime() + 24 * 60 * 60 * 1000 - 60000),
              lte: new Date(now.getTime() + 24 * 60 * 60 * 1000),
            },
          },
          {
            notifyDays: 7,
            date: {
              gte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 - 60000),
              lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
            },
          },
        ],
      },
      include: {
        user: true,
        pets: {
          include: {
            pet: true,
          },
        },
      },
    });

    for (const reminder of reminders) {
      const daysText = reminder.notifyDays === 1 ? 'завтра' : 'через неделю';
      const message = [
        '⏰ Предварительное напоминание:',
        `📝 ${reminder.title}`,
        `📅 Событие состоится ${daysText}`,
        reminder.pets.length > 0
          ? `🐾 Питомцы: ${reminder.pets.map((p) => p.pet.name).join(', ')}`
          : '🌐 Общее напоминание',
      ].join('\n');

      try {
        await this.bot.telegram.sendMessage(reminder.user.telegramId, message);
      } catch (error) {
        console.error('Error sending pre-notification:', error);
      }
    }
  }
}
