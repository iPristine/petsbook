import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { I18nTranslateService } from '../../../i18n/i18n.service';
import { PetsService } from '../../../pets/pets.service';
import { UserService } from '../../../user/user.service';
import { PetButtons } from './pet.buttons';

@Scene(BotScenes.ADD_PET_CONFIRM)
export class AddPetConfirm {
  constructor(
    private i18n: I18nTranslateService,
    private petsService: PetsService,
    private userService: UserService,
  ) {}

  @SceneEnter()
  async enterAddPetConfirm(@Ctx() ctx: Context) {
    const { petName, petType, petAge, petGender } = ctx['session'];

    const message = [
      '📝 Проверьте данные питомца:',
      `Имя: ${petName}`,
      `Тип: ${petType === 'cat' ? '🐱 Кошка' : '🐕 Собака'}`,
      `Возраст: ${petAge} лет`,
      `Пол: ${petGender === 'male' ? '♂️ Мальчик' : '♀️ Девочка'}`,
    ].join('\n');

    await ctx.reply(message, PetButtons.petConfirm());
  }

  @Action(['confirm', 'cancel'])
  async onConfirm(@Ctx() ctx: Context) {
    const action = ctx.callbackQuery['data'];

    if (action === 'cancel') {
      await ctx.reply('Добавление питомца отменено');
      await ctx['scene'].enter(BotScenes.MY_PETS);
      return;
    }

    const { petName, petType, petAge, petGender } = ctx['session'];
    const user = await this.userService.findOne(ctx.from.id);

    try {
      await this.petsService.addPet(user.id, {
        name: petName,
        type: petType,
        age: petAge,
        gender: petGender,
      });

      await ctx.reply('✅ Питомец успешно добавлен!');
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при добавлении питомца');
    }

    await ctx['scene'].enter(BotScenes.MY_PETS);
  }
}
