import { Injectable } from '@nestjs/common';
import { Pet } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  createPet(telegramId: string, name: string, age: number) {
    return this.prisma.pet.create({
      data: { telegramId, name, age },
    });
  }

  getPetsByUser(telegramId: string) {
    return this.pets.filter(pet => pet.telegramId === telegramId);
  }
} 