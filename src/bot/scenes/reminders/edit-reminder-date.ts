import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { BotContext } from 'src/bot/interfaces/context.interface';
import { BaseScene } from '@bot/interfaces/base.scene';

@Scene(BotScenes.EDIT_REMINDER_DATE)
export class EditReminderDate extends BaseScene {
  constructor(private remindersService: RemindersService) {
    super();
  }

  @SceneEnter()
  async enterEditDate(@Ctx() ctx: BotContext) {
    await ctx.reply(
      'Введите новую дату напоминания в формате ДД.ММ.ГГГГ\nНапример: 25.12.2024',
    );
  }

  @On('text')
  async onDate(@Ctx() ctx: BotContext) {
    const dateText = ctx.message['text'];
    const [day, month, year] = dateText.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    const reminderId = ctx.session.data.currentReminderId;

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

    await ctx.scene.enter(BotScenes.REMINDER_DETAILS);
  }
}
