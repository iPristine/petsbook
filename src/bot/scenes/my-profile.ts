import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { BotButtons } from '../bot.buttons';
import { I18nTranslateService } from '../../i18n/i18n.service';
import { BotScenes } from './types';
import { UserService } from 'src/user/user.service';
import { BaseScene, BotContext } from '@bot/interfaces';

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

      this.updateBotMessage(ctx, message, BotButtons.myProfile());
    } catch (error) {
      await ctx.reply('Произошла ошибка при получении данных пользователя');
    }
  }

  @Action('back')
  async getMainMenu(@Ctx() ctx: BotContext) {
    this.navigate(ctx, BotScenes.MAIN_MENU);
  }
}
