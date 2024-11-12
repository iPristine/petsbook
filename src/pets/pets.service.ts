import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Pet } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async findPetsByUserId(userId: string): Promise<Pet[]> {
    const petUsers = await this.prisma.petUser.findMany({
      where: { userId },
      include: { pet: true },
    });
    return petUsers.map((pu) => pu.pet);
  }

  async addPet(
    userId: string,
    petData: { name: string; type: string; gender: string; age?: number },
  ): Promise<Pet> {
    const pet = await this.prisma.pet.create({
      data: {
        name: petData.name,
        type: petData.type,
        age: petData.age,
        gender: petData.gender,
        owners: {
          create: { userId },
        },
      },
    });

    return pet;
  }

  async removePet(userId: string, petId: string): Promise<void> {
    await this.prisma.petUser.deleteMany({
      where: { userId, petId },
    });
    await this.prisma.pet.delete({
      where: { id: petId },
    });
  }

  async updatePet(
    petId: string,
    petData: { name?: string; age?: number },
  ): Promise<Pet> {
    return this.prisma.pet.update({
      where: { id: petId },
      data: petData,
    });
  }

  async getPetById(petId: string) {
    return this.prisma.pet.findUnique({
      where: { id: petId },
    });
  }
}
