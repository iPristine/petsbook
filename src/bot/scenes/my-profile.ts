import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { I18nTranslateService } from '../../i18n/i18n.service';
import { BotScenes } from './types';
import { UserService } from 'src/user/user.service';
import { BaseScene, BotContext } from '@bot/interfaces';
import { Markup } from 'telegraf';

@Scene(BotScenes.MY_PROFILE)
export class MyProfile extends BaseScene {
  constructor(
    private i18n: I18nTranslateService,
    private userService: UserService,
  ) {
    super();
  }

  @SceneEnter()
  async enterMyProfile(@Ctx() ctx: BotContext) {
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

      this.updateBotMessage(ctx, message, this.myProfileButtons());
    } catch (error) {
      await ctx.reply('Произошла ошибка при получении данных пользователя');
    }
  }

  @Action('send-feedback')
  async sendFeedback(@Ctx() ctx: BotContext) {
    this.navigate(ctx, BotScenes.SEND_FEEDBACK);
  }

  @Action('back')
  async getMainMenu(@Ctx() ctx: BotContext) {
    this.navigate(ctx, BotScenes.MAIN_MENU);
  }

  myProfileButtons() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('Send Feedback', 'send-feedback')],
      [Markup.button.callback('Back', 'back')],
    ]);
  }
}
