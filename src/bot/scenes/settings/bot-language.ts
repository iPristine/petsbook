import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { I18nTranslateService } from '../../../i18n/i18n.service';

const LANG_TYPES = ['ru', 'en'];
import { BotScenes } from '../types';
import { BotContext } from '../../interfaces/context.interface';
import { UserService } from 'src/user/user.service';
import { Markup } from 'telegraf';
import { LanguageOption } from 'src/common/types';
import { BaseScene } from 'src/bot/interfaces/base.scene';

const i18nBase = 'main.Settings.';

@Scene(BotScenes.LANGUAGE)
export class BotLanguage extends BaseScene {
  constructor(
    private i18n: I18nTranslateService,
    private userService: UserService  
  ) {
    super();
  }


  @SceneEnter()
  async enterLanguage(@Ctx() ctx: BotContext) {
    const message = await this.i18n.t({key: i18nBase+'ChooseLang', ctx});
    const buttons = await this.languageButtons(ctx);

    const updated = await this.updateBotMessage(ctx, message, buttons);

    if (!updated) {
      const sentMessage = await ctx.reply(message, buttons);
      await this.saveBotMessage(ctx, sentMessage);
    }
  }

  @Action([...LANG_TYPES])
  async getLanguage(@Ctx() ctx: BotContext) {
    await ctx.deleteMessage();
    ctx.session.data.language = ctx.callbackQuery['data'];
    const language = ctx.session.data.language;
    await ctx.reply(await this.i18n.t({key: i18nBase+'ChoosedLang', ctx, options: {args: {language}}}));
    await this.userService.updateLanguage(ctx.from.id, language);

    await this.navigate(ctx, BotScenes.SETTINGS);
  }

  async languageButtons(@Ctx() ctx: BotContext) {

    return Markup.inlineKeyboard([
      Markup.button.callback(await this.i18n.t({key: i18nBase+LanguageOption.RU, ctx}), LanguageOption.RU),
      Markup.button.callback(await this.i18n.t({key: i18nBase+LanguageOption.EN, ctx}), LanguageOption.EN),
    ], {
      columns: 1,
    });
  }
}
