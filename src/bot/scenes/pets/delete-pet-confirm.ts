import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { I18nTranslateService } from '../../../i18n/i18n.service';
import { PetsService } from '../../../pets/pets.service';
import { UserService } from '../../../user/user.service';
import { BotButtons } from '../../bot.buttons';

@Scene(BotScenes.DELETE_PET_CONFIRM)
export class DeletePetConfirm {
  constructor(
    private i18n: I18nTranslateService,
    private petsService: PetsService,
    private userService: UserService,
  ) {}

  @SceneEnter()
  async enterDeletePetConfirm(@Ctx() ctx: Context) {
    const petId = ctx['session']['currentPetId'];
    const pet = await this.petsService.getPetById(petId);

    if (!pet) {
      await ctx.reply('Ошибка: Питомец не найден');
      await ctx['scene'].enter(BotScenes.MY_PETS);
      return;
    }

    const message = [
      '⚠️ Вы действительно хотите удалить питомца?',
      '',
      `🐾 Имя: ${pet.name}`,
      `🐶 Тип: ${pet.type === 'dog' ? 'Собака' : 'Кошка'}`,
    ];

    await ctx.reply(message.join('\n'), BotButtons.petDeleteConfirm());
  }

  @Action(['confirm_delete', 'cancel_delete'])
  async onDeleteConfirm(@Ctx() ctx: Context) {
    const action = ctx.callbackQuery['data'];

    if (action === 'cancel_delete') {
      await ctx.reply('❌ Удаление отменено');
      await ctx['scene'].enter(BotScenes.PET_DETAILS);
      return;
    }

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
}
