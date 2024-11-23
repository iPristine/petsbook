import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { BotButtons } from '../bot.buttons';
import { I18nTranslateService } from '../../i18n/i18n.service';

const LANG_TYPES = ['ru', 'en'];
import { BotScenes } from './types';
import { BotContext } from '../interfaces/context.interface';
import { UserService } from 'src/user/user.service';
import { Markup } from 'telegraf';
import { LanguageOption } from 'src/common/types';

const i18nBase = 'main.Settings.';

@Scene(BotScenes.LANGUAGE)
export class BotLanguage {
  constructor(
    private i18n: I18nTranslateService,
    private userService: UserService  
  ) {
    this.i18n = i18n;
  }


  @SceneEnter()
  async enterLanguage(@Ctx() ctx: BotContext) {
    await ctx.reply(await this.i18n.t({key: 'main.CHOOSE_LANG', ctx}),await this.languageButtons(ctx));
  }

  @Action([...LANG_TYPES])
  async getLanguage(@Ctx() ctx: BotContext) {
    await ctx.deleteMessage();
    ctx.session.data.language = ctx.callbackQuery['data'];
    const language = ctx.session.data.language;
    await ctx.reply(await this.i18n.t({key: 'main.CHOOSE_LANG', ctx}));
    await this.userService.updateLanguage(ctx.from.id, language);
    await ctx.scene.leave();
    await ctx.scene.enter(BotScenes.MAIN_MENU);
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
