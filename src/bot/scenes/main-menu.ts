import { Action, Ctx, Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { BotButtons } from '../bot.buttons';
import { I18nTranslateService } from '../../i18n/i18n.service';
import { BotScenes } from './types';
import { I18nService } from 'nestjs-i18n';
import { BotContext, BotContext as Context } from '../interfaces/context.interface';

const i18nBase = 'main.MainMenu.'

@Scene(BotScenes.MAIN_MENU)
export class MainMenu {

  constructor(
    private i18n: I18nTranslateService,
  ) {
  }

  @SceneEnter()
  async enterMainMenu(@Ctx() ctx: BotContext) {

    const message = await this.i18n.t({key: i18nBase+'Title', ctx});

    await ctx.reply(message, await this.mainMenuButtons(ctx));
  }


  @Action('my-profile')
  async getMyProfile(@Ctx() ctx: Context) {

    await ctx.scene.leave();
    await ctx.scene.enter(BotScenes.MY_PROFILE);
  }

  @Action('my-pets')
  async getMyPets(@Ctx() ctx: Context) {

    await ctx.scene.leave();
    await ctx.scene.enter(BotScenes.MY_PETS);
  }

  @Action('remainders')
  async getRemainders(@Ctx() ctx: Context) {

    await ctx.scene.leave();
    await ctx.scene.enter(BotScenes.REMINDERS_LIST);
  }

  @Action('settings')
  async getSettings(@Ctx() ctx: BotContext) {

    await ctx.scene.leave();
    await ctx.scene.enter(BotScenes.SETTINGS);
  }



  async mainMenuButtons(@Ctx() ctx: BotContext) {

    return Markup.inlineKeyboard([
      Markup.button.callback(await this.i18n.t({key: i18nBase+'MyProfile', ctx}), 'my-profile'),
      Markup.button.callback(await this.i18n.t({key: i18nBase+'MyPets', ctx}), 'my-pets'),
      Markup.button.callback(await this.i18n.t({key: i18nBase+'Remainders', ctx}), 'remainders'),
      Markup.button.callback(await this.i18n.t({key: i18nBase+'Settings', ctx}), 'settings'),
    ], {
      columns: 1,
    });
  }

  @SceneLeave()
  async leaveMainMenu(@Ctx() ctx: BotContext) {
    if (ctx.session.data.lastBotMessages?.length) {
      await Promise.all(
        ctx.session.data.lastBotMessages.map(messageId =>
          ctx.deleteMessage(messageId).catch(() => {})
        )
      );
      ctx.session.data.lastBotMessages = [];
    }
  }
}
