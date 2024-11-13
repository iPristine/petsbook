import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';

@Scene(BotScenes.EDIT_REMINDER_DATE)
export class EditReminderDate {
  constructor(private remindersService: RemindersService) {}

  @SceneEnter()
  async enterEditDate(@Ctx() ctx: Context) {
    await ctx.reply(
      'Введите новую дату напоминания в формате ДД.ММ.ГГГГ\nНапример: 25.12.2024',
    );
  }

  @On('text')
  async onDate(@Ctx() ctx: Context) {
    const dateText = ctx.message['text'];
    const [day, month, year] = dateText.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    const reminderId = ctx['session']['currentReminderId'];

    if (
      isNaN(date.getTime()) ||
      date < new Date() ||
      year < 2024 ||
      year > 2030
    ) {
      await ctx.reply(
        'Пожалуйста, введите корректную дату в будущем (не позднее 2030 года)',
      );
      return;
    }

    try {
      await this.remindersService.updateReminder(reminderId, { date });
      await ctx.reply('✅ Дата успешно обновлена');
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при обновлении даты');
    }

    await ctx['scene'].enter(BotScenes.REMINDER_DETAILS);
  }
}
