import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { I18nTranslateService } from '../../i18n/i18n.service';
import { BotScenes } from './types';
import { BotButtons } from '../bot.buttons';

@Scene(BotScenes.SETTINGS)
export class Settings {
  constructor(private i18n: I18nTranslateService) {
    this.i18n = i18n;
  }

  @SceneEnter()
  async enterSettings(@Ctx() ctx: Context) {
    await ctx.reply('Settings:', BotButtons.settings());
  }

  @Action('back')
  async getMainMenu(@Ctx() ctx: Context) {
    ctx['session']['language'] = ctx.callbackQuery['data'];

    await ctx['scene'].enter(BotScenes.MAIN_MENU);
  }
}
