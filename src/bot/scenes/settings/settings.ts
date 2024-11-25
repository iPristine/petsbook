import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { I18nTranslateService } from '../../../i18n/i18n.service';
import { BotScenes } from '../types';
import { BotButtons } from '../../bot.buttons';
import { BotContext } from '../../interfaces/context.interface';
import { BaseScene } from 'src/bot/interfaces/base.scene';
import { Markup } from 'telegraf';

const i18nBase = 'main.Settings.';

@Scene(BotScenes.SETTINGS)
export class Settings extends BaseScene {
  constructor(private i18n: I18nTranslateService) {
    super();
    this.i18n = i18n;
  }

  @SceneEnter()
  async enterSettings(@Ctx() ctx: BotContext) {
    const message = await this.i18n.t({key: i18nBase+'Title', ctx});
    const buttons = await this.settings(ctx);

    const updated = await this.updateBotMessage(ctx, message, buttons);


    if (!updated) {
      const sentMessage = await ctx.reply(message, buttons);
      await this.saveBotMessage(ctx, sentMessage);
    }
  }

  @Action('language')
  async getLanguage(@Ctx() ctx: BotContext) {
    await this.navigate(ctx, BotScenes.LANGUAGE);
  }

  @Action('back')
  async getMainMenu(@Ctx() ctx: BotContext) {
    await this.navigate(ctx, BotScenes.MAIN_MENU);
  }

  async settings(ctx: BotContext) {
    const buttons = [];
    const language = await this.i18n.t({key: i18nBase+'Language', ctx});
    buttons.push([Markup.button.callback(language, 'language')]);
    buttons.push([BotButtons.backButton()]);

    return Markup.inlineKeyboard(buttons);
  }
}
