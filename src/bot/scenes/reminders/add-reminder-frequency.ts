import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { ReminderButtons } from './reminder.buttons';

@Scene(BotScenes.ADD_REMINDER_FREQUENCY)
export class AddReminderFrequency {
  @SceneEnter()
  async enterAddReminderFrequency(@Ctx() ctx: Context) {
    await ctx.reply(
      'Выберите периодичность напоминания:',
      ReminderButtons.frequency(),
    );
  }

  @Action(/^freq_/)
  async onFrequency(@Ctx() ctx: Context) {
    const frequency = ctx.callbackQuery['data'].replace('freq_', '');
    ctx['session']['reminderFrequency'] = frequency;
    await ctx['scene'].enter(BotScenes.ADD_REMINDER_NOTIFY);
  }
}
