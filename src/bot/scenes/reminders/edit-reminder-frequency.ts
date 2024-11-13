import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { ReminderButtons } from './reminder.buttons';

@Scene(BotScenes.EDIT_REMINDER_FREQUENCY)
export class EditReminderFrequency {
  constructor(private remindersService: RemindersService) {}

  @SceneEnter()
  async enterEditFrequency(@Ctx() ctx: Context) {
    await ctx.reply(
      'Выберите новую периодичность напоминания:',
      ReminderButtons.frequency(),
    );
  }

  @Action(/^freq_/)
  async onFrequency(@Ctx() ctx: Context) {
    const frequency = ctx.callbackQuery['data'].replace('freq_', '');
    const reminderId = ctx['session']['currentReminderId'];

    try {
      await this.remindersService.updateReminder(reminderId, { frequency });
      await ctx.reply('✅ Периодичность успешно обновлена');
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при обновлении периодичности');
    }

    await ctx['scene'].enter(BotScenes.REMINDER_DETAILS);
  }
} 