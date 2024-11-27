import { Ctx, Scene, SceneEnter, On, Action } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { BotContext } from '@bot/interfaces/context.interface';
import { Markup } from 'telegraf';
import { UserService } from 'src/user/user.service';
import { BaseScene } from '@bot/interfaces/base.scene';
import { OctokitService } from 'nestjs-octokit';

@Scene(BotScenes.SEND_FEEDBACK)
export class SendFeedback extends BaseScene {
  constructor(
    private userService: UserService,
    private octokitService: OctokitService,
  ) {
    super();
  }

  @SceneEnter()
  async enterFeedback(@Ctx() ctx: BotContext) {
    await ctx.reply(
      'Пожалуйста, опишите ваш отзыв или проблему:',
      Markup.inlineKeyboard([[Markup.button.callback('❌ Отмена', 'cancel')]]),
    );
  }

  @On('text')
  async onFeedback(@Ctx() ctx: BotContext) {
    const feedback = ctx.message['text'];
    const user = await this.userService.findOne(ctx.from.id);

    try {
      const title = `Feedback from @${user.username || 'anonymous'}`;
      const body = [
        `**От пользователя:**`,
        `- Telegram ID: ${user.telegramId}`,
        `- Имя: ${user.firstName} ${user.lastName || ''}`,
        `- Username: @${user.username || 'отсутствует'}`,
        '',
        '**Сообщение:**',
        feedback,
      ].join('\n');

      await this.octokitService.rest.issues.create({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        title,
        body,
        labels: ['feedback'],
      });

      await ctx.reply(
        '✅ Спасибо за ваш отзыв! Мы обязательно рассмотрим его.',
      );
      this.navigate(ctx, BotScenes.MAIN_MENU);
    } catch (error) {
      console.log(error);
      await ctx.reply(
        '❌ Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте позже.',
      );
    }

    this.navigate(ctx, BotScenes.MAIN_MENU);
  }

  @Action('cancel')
  async cancel(@Ctx() ctx: BotContext) {
    await ctx.reply('Отправка отзыва отменена');
    this.navigate(ctx, BotScenes.MAIN_MENU);
  }
}
