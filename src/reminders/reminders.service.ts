import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}

  async createReminder(
    userId: string,
    data: {
      title: string;
      description?: string;
      date: Date;
      frequency?: string;
      notifyDays?: number;
      petIds: string[];
    },
  ) {
    return this.prisma.reminder.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        frequency: data.frequency,
        notifyDays: data.notifyDays,
        userId: userId,
        pets: {
          create: data.petIds.map((petId) => ({
            pet: { connect: { id: petId } },
          })),
        },
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

  async getRemindersByUserId(userId: string) {
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
  ) {
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

  async getReminderById(id: number) {
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
}
