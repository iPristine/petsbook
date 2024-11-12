import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { I18nTranslateService } from '../../../i18n/i18n.service';

@Scene(BotScenes.ADD_PET_AGE)
export class AddPetAge {
  constructor(private i18n: I18nTranslateService) {}

  @SceneEnter()
  async enterAddPetAge(@Ctx() ctx: Context) {
    await ctx.reply('Введите возраст питомца (в годах):');
  }

  @On('text')
  async onPetAge(@Ctx() ctx: Context) {
    const age = parseInt(ctx.message['text']);

    if (isNaN(age) || age < 0 || age > 30) {
      await ctx.reply(
        'Пожалуйста, введите корректный возраст (от 0 до 30 лет)',
      );
      return;
    }

    ctx['session']['petAge'] = age;
    await ctx['scene'].enter(BotScenes.ADD_PET_CONFIRM);
  }
}
