import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { I18nTranslateService } from '../../../i18n/i18n.service';
import { PetsService } from '../../../pets/pets.service';
import { UserService } from '../../../user/user.service';
import { PetButtons } from './pet.buttons';

@Scene(BotScenes.PET_DELETE)
export class PetDelete {
  constructor(
    private i18n: I18nTranslateService,
    private petsService: PetsService,
    private userService: UserService,
  ) {}

  @SceneEnter()
  async enterPetDelete(@Ctx() ctx: Context) {
    const petId = ctx['session']['currentPetId'];
    const pet = await this.petsService.getPetById(petId);

    if (!pet) {
      await ctx.reply('Ошибка: Питомец не найден');
      await ctx['scene'].enter(BotScenes.MY_PETS);
      return;
    }

    const message = [
      '⚠️ Вы уверены, что хотите удалить питомца?',
      '',
      `🐾 ${pet.name}`,
      `${pet.type === 'dog' ? '🐕' : '🐱'} ${pet.type === 'dog' ? 'Собака' : 'Кошка'}`,
      `🎂 ${pet.age || 'Возраст не указан'}`,
    ].join('\n');

    await ctx.reply(message, PetButtons.petDelete());
  }

  @Action('confirm_delete')
  async confirmDelete(@Ctx() ctx: Context) {
    const petId = ctx['session']['currentPetId'];
    const user = await this.userService.findOne(ctx.from.id);

    try {
      await this.petsService.removePet(user.id, petId);
      await ctx.reply('✅ Питомец успешно удален');
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при удалении питомца');
    }

    await ctx['scene'].enter(BotScenes.MY_PETS);
  }

  @Action('cancel_delete')
  async cancelDelete(@Ctx() ctx: Context) {
    await ctx['scene'].enter(BotScenes.PET_DETAILS);
  }
}
