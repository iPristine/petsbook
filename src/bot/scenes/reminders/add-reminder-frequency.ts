import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { ReminderButtons } from './reminder.buttons';
import { BotContext } from 'src/bot/interfaces/context.interface';
import { Markup } from 'telegraf';
import { ReminderFrequency } from '@prisma/client';


const frequencies = [
  ReminderFrequency.ONCE,
  ReminderFrequency.WEEKLY,
  ReminderFrequency.MONTHLY,
  ReminderFrequency.QUARTERLY,
  ReminderFrequency.YEARLY,
];
@Scene(BotScenes.ADD_REMINDER_FREQUENCY)
export class AddReminderFrequency {
  @SceneEnter()
  async enterAddReminderFrequency(@Ctx() ctx: BotContext) {
    await ctx.reply(
      'Выберите периодичность напоминания:',
      this.frequency(),
    );
  }

  @Action(frequencies)
  async onFrequency(@Ctx() ctx: BotContext) {
    const frequency = ctx.callbackQuery['data'] as ReminderFrequency;
    ctx.session.data.reminderFrequency = frequency;
    await ctx.scene.enter(BotScenes.ADD_REMINDER_NOTIFY);
  }

  frequency() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('📅 Разовое', ReminderFrequency.ONCE)],
      [Markup.button.callback('🔄 Раз в неделю', ReminderFrequency.WEEKLY)],
      [Markup.button.callback('🔄 Раз в месяц', ReminderFrequency.MONTHLY)],
      [Markup.button.callback('🔄 Раз в 3 месяца', ReminderFrequency.QUARTERLY)],
      [Markup.button.callback('🔄 Раз в год', ReminderFrequency.YEARLY)],
    ]);
  }
}
