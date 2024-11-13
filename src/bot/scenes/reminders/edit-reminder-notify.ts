import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { ReminderButtons } from './reminder.buttons';

@Scene(BotScenes.EDIT_REMINDER_NOTIFY)
export class EditReminderNotify {
  constructor(private remindersService: RemindersService) {}

  @SceneEnter()
  async enterEditNotify(@Ctx() ctx: Context) {
    await ctx.reply(
      'Выберите за сколько дней напоминать:',
      ReminderButtons.notifyBefore(),
    );
  }

  @Action(/^notify_/)
  async onNotify(@Ctx() ctx: Context) {
    const days = parseInt(ctx.callbackQuery['data'].replace('notify_', ''));
    const reminderId = ctx['session']['currentReminderId'];

    try {
      await this.remindersService.updateReminder(reminderId, {
        notifyDays: days,
      });
      await ctx.reply('✅ Время уведомления успешно обновлено');
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при обновлении времени уведомления');
    }

    await ctx['scene'].enter(BotScenes.REMINDER_DETAILS);
  }
}
