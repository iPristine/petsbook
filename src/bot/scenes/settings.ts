import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { I18nTranslateService } from '../../i18n/i18n.service';
import { BotScenes } from './types';
import { BotButtons } from '../bot.buttons';
import { BotContext } from '../interfaces/context.interface';

@Scene(BotScenes.SETTINGS)
export class Settings {
  constructor(private i18n: I18nTranslateService) {
    this.i18n = i18n;
  }

  @SceneEnter()
  async enterSettings(@Ctx() ctx: BotContext) {
    await ctx.reply('Settings:', BotButtons.settings());
  }

  @Action('language')
  async getLanguage(@Ctx() ctx: BotContext) {
    await ctx.scene.enter(BotScenes.LANGUAGE);
  }

  @Action('back')
  async getMainMenu(@Ctx() ctx: BotContext) {

    await ctx.scene.enter(BotScenes.MAIN_MENU);
  }
}
