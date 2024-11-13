import { Action, Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { I18nTranslateService } from '../../../i18n/i18n.service';
import { PetsService } from '../../../pets/pets.service';
import { PetButtons } from './pet.buttons';

@Scene(BotScenes.PET_EDIT)
export class PetEdit {
  constructor(
    private i18n: I18nTranslateService,
    private petsService: PetsService,
  ) {}

  @SceneEnter()
  async enterPetEdit(@Ctx() ctx: Context) {
    const petId = ctx['session']['currentPetId'];
    const pet = await this.petsService.getPetById(petId);

    if (!pet) {
      await ctx.reply('Ошибка: Питомец не найден');
      await ctx['scene'].enter(BotScenes.MY_PETS);
      return;
    }

    const message = [
      '✏️ Что вы хотите изменить?',
      '',
      `Текущие данные:`,
      `🐾 Имя: ${pet.name}`,
      `🎂 Возраст: ${pet.age || 'Не указан'}`,
    ].join('\n');

    await ctx.reply(message, PetButtons.petEdit());
  }

  @Action('edit_name')
  async editName(@Ctx() ctx: Context) {
    ctx['session']['editField'] = 'name';
    await ctx.reply('Введите новое имя питомца:');
  }

  @Action('edit_age')
  async editAge(@Ctx() ctx: Context) {
    ctx['session']['editField'] = 'age';
    await ctx.reply('Введите новый возраст питомца:');
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const field = ctx['session']['editField'];
    const petId = ctx['session']['currentPetId'];
    const text = ctx.message['text'];

    if (!field || !petId) {
      await ctx['scene'].enter(BotScenes.PET_DETAILS);
      return;
    }

    try {
      if (field === 'name') {
        if (text.length < 2 || text.length > 20) {
          await ctx.reply('Имя питомца должно быть от 2 до 20 символов');
          return;
        }
        await this.petsService.updatePet(petId, { name: text });
        await ctx.reply('✅ Имя успешно изменено');
      } else if (field === 'age') {
        const age = parseInt(text);
        if (isNaN(age) || age < 0 || age > 30) {
          await ctx.reply(
            'Пожалуйста, введите корректный возраст (от 0 до 30 лет)',
          );
          return;
        }
        await this.petsService.updatePet(petId, { age });
        await ctx.reply('✅ Возраст успешно изменен');
      }
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при обновлении данных');
    }

    await ctx['scene'].enter(BotScenes.PET_DETAILS);
  }

  @Action('back')
  async back(@Ctx() ctx: Context) {
    await ctx['scene'].enter(BotScenes.PET_DETAILS);
  }
}
