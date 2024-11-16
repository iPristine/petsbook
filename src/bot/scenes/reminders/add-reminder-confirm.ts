import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { UserService } from '../../../user/user.service';
import { PetsService } from '../../../pets/pets.service';
import { ReminderButtons } from './reminder.buttons';

@Scene(BotScenes.ADD_REMINDER_CONFIRM)
export class AddReminderConfirm {
  constructor(
    private remindersService: RemindersService,
    private userService: UserService,
    private petsService: PetsService,
  ) {}

  @SceneEnter()
  async enterAddReminderConfirm(@Ctx() ctx: Context) {
    const {
      reminderDescription,
      reminderDate,
      reminderFrequency,
      reminderNotifyDays,
      reminderPets,
    } = ctx['session'];

    let petsInfo = 'Общее напоминание';
    if (reminderPets?.length > 0) {
      const pets = await Promise.all(
        reminderPets.map((id) => this.petsService.getPetById(id)),
      );
      petsInfo = `Питомцы: ${pets.map((p) => p.name).join(', ')}`;
    }

    const frequencyText = {
      once: 'Разовое',
      weekly: 'Раз в неделю',
      monthly: 'Раз в месяц',
      quarterly: 'Раз в 3 месяца',
      yearly: 'Раз в год',
    }[reminderFrequency];

    const notifyText = {
      0: 'В тот же день',
      1: 'За день до',
      7: 'За неделю до',
    }[reminderNotifyDays];

    const message = [
      '📝 Проверьте данные напоминания:',
      '',
      `📌 Описание: ${reminderDescription}`,
      `📅 Дата: ${reminderDate.toLocaleDateString()}`,
      `🔄 Периодичность: ${frequencyText}`,
      `🔔 Уведомление: ${notifyText}`,
      `🐾 ${petsInfo}`,
    ].join('\n');

    await ctx.reply(message, ReminderButtons.confirmReminder());
  }

  @Action(['confirm_reminder', 'cancel_reminder'])
  async onConfirm(@Ctx() ctx: Context) {
    const action = ctx.callbackQuery['data'];

    if (action === 'cancel_reminder') {
      await ctx.reply('❌ Создание напоминания отменено');
      await ctx['scene'].enter(BotScenes.REMINDERS_LIST);
      return;
    }

    const {
      reminderDescription,
      reminderDate,
      reminderFrequency,
      reminderNotifyDays,
      reminderPets,
    } = ctx['session'];

    const user = await this.userService.findOne(ctx.from.id);

    try {
      await this.remindersService.createReminder(user.id, {
        chatId: ctx.from.id.toString(),
        title: reminderDescription,
        date: reminderDate,
        frequency: reminderFrequency,
        notifyDays: reminderNotifyDays,
        petIds: reminderPets || [],
      });

      await ctx.reply('✅ Напоминание успешно создано!');
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при создании напоминания');
    }

    await ctx['scene'].enter(BotScenes.REMINDERS_LIST);
  }
}
