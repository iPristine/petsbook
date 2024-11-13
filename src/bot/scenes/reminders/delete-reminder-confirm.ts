import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { ReminderButtons } from './reminder.buttons';

@Scene(BotScenes.DELETE_REMINDER_CONFIRM)
export class DeleteReminderConfirm {
  constructor(private remindersService: RemindersService) {}

  @SceneEnter()
  async enterDeleteConfirm(@Ctx() ctx: Context) {
    const reminderId = ctx['session']['currentReminderId'];
    const reminder = await this.remindersService.getReminderById(reminderId);

    if (!reminder) {
      await ctx.reply('Ошибка: Напоминание не найдено');
      await ctx['scene'].enter(BotScenes.REMINDERS_LIST);
      return;
    }

    const message = [
      '⚠️ Вы действительно хотите удалить напоминание?',
      '',
      `📝 ${reminder.title}`,
      `📅 ${reminder.date.toLocaleDateString()}`,
    ].join('\n');

    await ctx.reply(
      message,
      Markup.inlineKeyboard([
        [Markup.button.callback('✅ Да, удалить', 'confirm_delete')],
        [Markup.button.callback('❌ Отмена', 'cancel_delete')],
      ]),
    );
  }

  @Action(['confirm_delete', 'cancel_delete'])
  async onDeleteConfirm(@Ctx() ctx: Context) {
    const action = ctx.callbackQuery['data'];
    const reminderId = ctx['session']['currentReminderId'];

    if (action === 'cancel_delete') {
      await ctx.reply('❌ Удаление отменено');
      await ctx['scene'].enter(BotScenes.REMINDER_DETAILS);
      return;
    }

    try {
      await this.remindersService.deleteReminder(reminderId);
      await ctx.reply('✅ Напоминание успешно удалено');
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при удалении напоминания');
    }

    await ctx['scene'].enter(BotScenes.REMINDERS_LIST);
  }
} 