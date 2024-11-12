import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { I18nTranslateService } from '../../../i18n/i18n.service';

@Scene(BotScenes.ADD_PET_NAME)
export class AddPetName {
  constructor(private i18n: I18nTranslateService) {}

  @SceneEnter()
  async enterAddPetName(@Ctx() ctx: Context) {
    await ctx.reply('Введите имя питомца:');
  }

  @On('text')
  async onPetName(@Ctx() ctx: Context) {
    const petName = ctx.message['text'];

    if (petName.length < 2 || petName.length > 20) {
      await ctx.reply('Имя питомца должно быть от 2 до 20 символов');
      return;
    }

    ctx['session']['petName'] = petName;
    await ctx['scene'].enter(BotScenes.ADD_PET_GENDER);
  }
}
