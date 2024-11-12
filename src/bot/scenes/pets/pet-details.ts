import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { I18nTranslateService } from '../../../i18n/i18n.service';
import { PetsService } from '../../../pets/pets.service';
import { UserService } from '../../../user/user.service';
import { BotButtons } from '../../bot.buttons';

@Scene(BotScenes.PET_DETAILS)
export class PetDetails {
  constructor(
    private i18n: I18nTranslateService,
    private petsService: PetsService,
    private userService: UserService,
  ) {}

  @SceneEnter()
  async enterPetDetails(@Ctx() ctx: Context) {
    const petId = ctx['session']['currentPetId'];
    if (!petId) {
      await ctx.reply('Ошибка: Питомец не найден');
      await ctx['scene'].enter(BotScenes.MY_PETS);
      return;
    }

    const pet = await this.petsService.getPetById(petId);
    if (!pet) {
      await ctx.reply('Ошибка: Питомец не найден');
      await ctx['scene'].enter(BotScenes.MY_PETS);
      return;
    }

    const message = [
      `🐾 Имя: ${pet.name}`,
      `🐶 Тип: ${pet.type === 'dog' ? 'Собака' : 'Кошка'}`,
      `🎂 Возраст: ${pet.age || 'Не указан'}`,
      `♂️♀️ Пол: ${pet.gender === 'male' ? 'Мальчик' : 'Девочка'}`,
      `📅 Добавлен: ${pet.createdAt.toLocaleDateString()}`,
    ].join('\n');

    await ctx.reply(message, BotButtons.petDetails());
  }

  @Action('edit_pet')
  async editPet(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx['scene'].enter(BotScenes.PET_EDIT);
  }

  @Action('delete_pet')
  async deletePet(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx['scene'].enter(BotScenes.DELETE_PET_CONFIRM);
  }

  @Action('back')
  async backToMyPets(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx['scene'].enter(BotScenes.MY_PETS);
  }
} 