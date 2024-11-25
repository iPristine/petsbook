import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Context, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { RemindersService } from '../reminders/reminders.service';
import { Pet, Reminder, ReminderFrequency, User } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private remindersService: RemindersService,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkReminders() {
    await this.checkPreNotifications();

    const now = new Date();
    const nextDay = new Date(now.getTime() + 60000*60*24);


    const reminders = await this.remindersService.findRemindersInTimeRange(
      new Date(0),
      nextDay,
    );

    for (const reminder of reminders) {
      await this.sendNotification(reminder);
      if (reminder.frequency === ReminderFrequency.ONCE) {
        await this.remindersService.deleteReminder(reminder.id);
      } else {
        const nextDate = this.calculateNextDate(
          reminder.date,
          reminder.frequency,
        );
        await this.remindersService.updateReminder(reminder.id, {
          date: nextDate,
        });
      }
    }
  }

  private async sendNotification(
    reminder: Reminder & { user: User; pets: { pet: Pet }[] },
  ) {
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

  private calculateNextDate(currentDate: Date, frequency: string): Date {
    const nextDate = new Date(currentDate);
    switch (frequency) {
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
    return nextDate;
  }

  private async checkPreNotifications() {
    const now = new Date();
    const oneDayAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneWeekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const reminders = await this.remindersService.findPreNotifications(
      now,
      oneDayAhead,
      oneWeekAhead,
    );

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
