import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { ReminderButtons } from './reminder.buttons';
import { BotContext } from 'src/bot/interfaces/context.interface';
import { Markup } from 'telegraf';
import { BaseScene } from '@bot/interfaces/base.scene';
@Scene(BotScenes.EDIT_REMINDER_NOTIFY)
export class EditReminderNotify extends BaseScene {
  constructor(private remindersService: RemindersService) {
    super();
  }

  @SceneEnter()
  async enterEditNotify(@Ctx() ctx: BotContext) {
    await ctx.reply(
      'Выберите за сколько дней напоминать:',
      this.notifyBefore(),
    );
  }

  @Action(/^notify_/)
  async onNotify(@Ctx() ctx: BotContext) {
    const days = parseInt(ctx.callbackQuery['data'].replace('notify_', ''));
    const reminderId = ctx.session.data.currentReminderId;

    try {
      await this.remindersService.updateReminder(reminderId, {
        notifyDays: days,
      });
      await ctx.reply('✅ Время уведомления успешно обновлено');
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при обновлении времени уведомления');
    }

    await ctx.scene.enter(BotScenes.REMINDER_DETAILS);
  }


  notifyBefore() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('🔔 В тот же день', 'notify_0')],
      [Markup.button.callback('🔔 За день до', 'notify_1')],
      [Markup.button.callback('🔔 За неделю до', 'notify_7')],
    ]);
  }
}
