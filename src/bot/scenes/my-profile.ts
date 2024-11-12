import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotButtons } from '../bot.buttons';
import { I18nTranslateService } from '../../i18n/i18n.service';
import { BotScenes } from './types';
import { UserService } from 'src/user/user.service';

@Scene(BotScenes.MY_PROFILE)
export class MyProfile {
  constructor(
    private i18n: I18nTranslateService,
    private userService: UserService,
  ) {}

  @SceneEnter()
  async enterMyProfile(@Ctx() ctx: Context) {
    try {
      const user = await this.userService.findOne(ctx.from.id);
      const message = [
        `👤 Имя: ${user.firstName}`,
        user.lastName ? `Фамилия: ${user.lastName}` : null,
        user.username ? `Username: @${user.username}` : null,
        `🌐 Язык: ${user.lang || 'не установлен'}`,
        `📅 Дата регистрации: ${user.createdAt.toLocaleDateString()}`,
      ]
        .filter(Boolean)
        .join('\n');
      await ctx.reply(message, BotButtons.myProfile());
    } catch (error) {
      await ctx.reply('Произошла ошибка при получении данных пользователя');
    }
  }

  @Action('back')
  async getMainMenu(@Ctx() ctx: Context) {
    ctx['session']['language'] = ctx.callbackQuery['data'];

    await ctx['scene'].enter(BotScenes.MAIN_MENU);
  }
}
