import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { ReminderButtons } from './reminder.buttons';

@Scene(BotScenes.ADD_REMINDER_NOTIFY)
export class AddReminderNotify {
  @SceneEnter()
  async enterAddReminderNotify(@Ctx() ctx: Context) {
    await ctx.reply(
      'За сколько дней напомнить?',
      ReminderButtons.notifyBefore(),
    );
  }

  @Action(/^notify_/)
  async onNotify(@Ctx() ctx: Context) {
    const days = parseInt(ctx.callbackQuery['data'].replace('notify_', ''));
    ctx['session']['reminderNotifyDays'] = days;
    await ctx['scene'].enter(BotScenes.ADD_REMINDER_CONFIRM);
  }
}
