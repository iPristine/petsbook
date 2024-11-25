import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { ReminderButtons } from './reminder.buttons';
import { BotContext } from 'src/bot/interfaces/context.interface';
import { BaseScene } from 'src/bot/interfaces/base.scene';


@Scene(BotScenes.REMINDER_DETAILS)
export class ReminderDetails extends BaseScene {
  constructor(private remindersService: RemindersService) {
    super();
  }

  @SceneEnter()
  async enterReminderDetails(@Ctx() ctx: BotContext) {
    const reminderId = ctx.session.data.currentReminderId;
    const reminder = await this.remindersService.getReminderById(+reminderId);

    if (!reminder) {
      await ctx.reply('Ошибка: Напоминание не найдено');
      await ctx['scene'].enter(BotScenes.REMINDERS_LIST);
      return;
    }

    const frequencyText = {
      once: 'Разовое',
      weekly: 'Раз в неделю',
      monthly: 'Раз в месяц',
      quarterly: 'Раз в 3 месяца',
      yearly: 'Раз в год',
    }[reminder.frequency];

    const notifyText = {
      0: 'В тот же день',
      1: 'За день до',
      7: 'За неделю до',
    }[reminder.notifyDays];

    const petsInfo =
      reminder.pets.length > 0
        ? `🐾 Питомцы: ${reminder.pets.map((p) => p.pet.name).join(', ')}`
        : '🌐 Общее напоминание';

    const message = [
      `📝 ${reminder.title}`,
      '',
      `📅 Дата: ${reminder.date.toLocaleDateString()}`,
      `🔄 Периодичность: ${frequencyText}`,
      `🔔 Уведомление: ${notifyText}`,
      petsInfo,
    ].join('\n');

    await ctx.reply(message, ReminderButtons.reminderDetails());
  }

  @Action('edit_reminder')
  async editReminder(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(BotScenes.EDIT_REMINDER);
  }

  @Action('delete_reminder')
  async deleteReminder(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(BotScenes.DELETE_REMINDER_CONFIRM);
  }

  @Action('back_to_list')
  async backToList(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(BotScenes.REMINDERS_LIST);
  }
}
