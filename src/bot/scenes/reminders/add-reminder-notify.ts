import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { BotContext } from 'src/bot/interfaces/context.interface';
import { Markup } from 'telegraf';
import { BaseScene } from '@bot/interfaces/base.scene';

@Scene(BotScenes.ADD_REMINDER_NOTIFY)
export class AddReminderNotify extends BaseScene {
  @SceneEnter()
  async enterAddReminderNotify(@Ctx() ctx: BotContext) {
    await ctx.reply(
      'За сколько дней напомнить?',
      this.notifyBefore(),
    );
  }

  @Action(/^notify_/)
  async onNotify(@Ctx() ctx: BotContext) {
    const days = parseInt(ctx.callbackQuery['data'].replace('notify_', ''));
    ctx.session.data.reminderNotifyDays = days;
    await ctx.scene.enter(BotScenes.ADD_REMINDER_CONFIRM);
  }


  notifyBefore() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('🔔 В тот же день', 'notify_0')],
      [Markup.button.callback('🔔 За день до', 'notify_1')],
      [Markup.button.callback('🔔 За неделю до', 'notify_7')],
    ]);
  }
}
