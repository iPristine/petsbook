import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotButtons } from '../bot.buttons';
import { I18nTranslateService } from '../../i18n/i18n.service';
import { BotScenes } from './types';

@Scene(BotScenes.MAIN_MENU)
export class MainMenu {
  constructor(private i18n: I18nTranslateService) {
    this.i18n = i18n;
  }

  @SceneEnter()
  async enterMainMenu(@Ctx() ctx: Context) {
    await ctx.reply('Main menu:', BotButtons.mainMenu());
  }

  @Action('my-profile')
  async getMyProfile(@Ctx() ctx: Context) {
    ctx['session']['language'] = ctx.callbackQuery['data'];

    await ctx['scene'].leave();
    await ctx['scene'].enter(BotScenes.MY_PROFILE);
  }

  @Action('my-pets')
  async getMyPets(@Ctx() ctx: Context) {
    ctx['session']['language'] = ctx.callbackQuery['data'];

    await ctx['scene'].leave();
    await ctx['scene'].enter(BotScenes.MY_PETS);
  }

  @Action('remainders')
  async getRemainders(@Ctx() ctx: Context) {
    ctx['session']['language'] = ctx.callbackQuery['data'];

    await ctx['scene'].leave();
    await ctx['scene'].enter(BotScenes.REMINDERS_LIST);
  }

  @Action('settings')
  async getSettings(@Ctx() ctx: Context) {
    ctx['session']['language'] = ctx.callbackQuery['data'];

    await ctx['scene'].leave();
    await ctx['scene'].enter(BotScenes.SETTINGS);
  }
}
