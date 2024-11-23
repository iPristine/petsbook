import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { ReminderButtons } from './reminder.buttons';
import { BotContext } from 'src/bot/interfaces/context.interface';
import { ReminderFrequency } from '@prisma/client';
import { Markup } from 'telegraf';

const frequencies = [
  ReminderFrequency.ONCE,
  ReminderFrequency.WEEKLY,
  ReminderFrequency.MONTHLY,
  ReminderFrequency.QUARTERLY,
  ReminderFrequency.YEARLY,
];

@Scene(BotScenes.EDIT_REMINDER_FREQUENCY)
export class EditReminderFrequency {
  constructor(private remindersService: RemindersService) {}

  @SceneEnter()
  async enterEditFrequency(@Ctx() ctx: BotContext) {
    await ctx.reply(
      'Выберите новую периодичность напоминания:',
      this.frequency(),
    );
  }

  @Action(frequencies)
  async onFrequency(@Ctx() ctx: BotContext) {
    const frequency = ctx.callbackQuery['data'] as ReminderFrequency;
    const reminderId = ctx.session.data.currentReminderId;

    try {
      await this.remindersService.updateReminder(reminderId, { frequency });
      await ctx.reply('✅ Периодичность успешно обновлена');
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при обновлении периодичности');
    }

    await ctx.scene.enter(BotScenes.REMINDER_DETAILS);
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
