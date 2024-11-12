import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotButtons } from '../bot.buttons';
import { I18nTranslateService } from '../../i18n/i18n.service';
import { BotScenes } from './types';

@Scene(BotScenes.MY_PROFILE)
export class MyProfile {
  constructor(private i18n: I18nTranslateService) {
    this.i18n = i18n;
  }

  @SceneEnter()
  async enterMyProfile(@Ctx() ctx: Context) {
    await ctx.reply('My Profile:', BotButtons.myProfile());
  }

  @Action('back')
  async getMainMenu(@Ctx() ctx: Context) {
    ctx['session']['language'] = ctx.callbackQuery['data'];

    await ctx['scene'].enter(BotScenes.MAIN_MENU);
  }
}
