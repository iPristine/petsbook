import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';

@Scene(BotScenes.ADD_REMINDER_DATE)
export class AddReminderDate {
  @SceneEnter()
  async enterAddReminderDate(@Ctx() ctx: Context) {
    await ctx.reply(
      'Введите дату напоминания в формате ДД.ММ.ГГГГ\nНапример: 25.12.2024',
    );
  }

  @On('text')
  async onDate(@Ctx() ctx: Context) {
    const dateText = ctx.message['text'];
    const [day, month, year] = dateText.split('.').map(Number);
    const date = new Date(year, month - 1, day);

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

    ctx['session']['reminderDate'] = date;
    await ctx['scene'].enter(BotScenes.ADD_REMINDER_FREQUENCY);
  }
}
