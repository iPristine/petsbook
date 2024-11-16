import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Pet, Reminder, User } from '@prisma/client';

interface CreateReminderDto {
  userId: string; // Обязательное поле
  chatId: string;
  title: string;
  description?: string;
  date: Date;
  frequency: 'once' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  notifyDays: 0 | 1 | 7;
  petIds?: string[]; // Опциональное поле
}

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}

  async createReminder(
    userId: string,
    data: Omit<CreateReminderDto, 'userId'>,
  ): Promise<Reminder> {
    return this.prisma.reminder.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        frequency: data.frequency,
        notifyDays: data.notifyDays,
        userId: userId,
        pets: data.petIds?.length
          ? {
              create: data.petIds.map((petId) => ({
                pet: { connect: { id: petId } },
              })),
            }
          : undefined,
      },
      include: {
        pets: {
          include: {
            pet: true,
          },
        },
      },
    });
  }

  async getRemindersByUserId(userId: string): Promise<Reminder[]> {
    return this.prisma.reminder.findMany({
      where: { userId },
      include: {
        pets: {
          include: {
            pet: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async updateReminder(
    reminderId: string,
    data: {
      title?: string;
      description?: string;
      date?: Date;
      frequency?: string;
      notifyDays?: number;
      petIds?: string[];
    },
  ): Promise<Reminder> {
    if (data.petIds) {
      await this.prisma.petReminder.deleteMany({
        where: { reminderId },
      });
    }

    return this.prisma.reminder.update({
      where: { id: reminderId },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        frequency: data.frequency,
        notifyDays: data.notifyDays,
        pets: data.petIds
          ? {
              create: data.petIds.map((petId) => ({
                pet: { connect: { id: petId } },
              })),
            }
          : undefined,
      },
      include: {
        pets: {
          include: {
            pet: true,
          },
        },
      },
    });
  }

  async deleteReminder(reminderId: string) {
    await this.prisma.petReminder.deleteMany({
      where: { reminderId },
    });

    return this.prisma.reminder.delete({
      where: { id: reminderId },
    });
  }

  async getReminderById(
    id: number,
  ): Promise<(Reminder & { pets: { pet: Pet }[] }) | null> {
    return this.prisma.reminder.findUnique({
      where: { id: id.toString() },
      include: {
        pets: {
          include: {
            pet: true,
          },
        },
      },
    });
  }

  async findRemindersInTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<(Reminder & { user: User; pets: { pet: Pet }[] })[]> {
    return this.prisma.reminder.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
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
  }

  async findPreNotifications(
    now: Date,
    oneDayAhead: Date,
    oneWeekAhead: Date,
  ): Promise<(Reminder & { user: User; pets: { pet: Pet }[] })[]> {
    return this.prisma.reminder.findMany({
      where: {
        OR: [
          {
            notifyDays: 1,
            date: {
              gte: oneDayAhead,
              lte: new Date(oneDayAhead.getTime() + 60000),
            },
          },
          {
            notifyDays: 7,
            date: {
              gte: oneWeekAhead,
              lte: new Date(oneWeekAhead.getTime() + 60000),
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
  }
}
