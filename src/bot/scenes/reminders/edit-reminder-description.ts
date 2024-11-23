import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { BotContext } from 'src/bot/interfaces/context.interface';
@Scene(BotScenes.EDIT_REMINDER_DESCRIPTION)
export class EditReminderDescription {
  constructor(private remindersService: RemindersService) {}

  @SceneEnter()
  async enterEditDescription(@Ctx() ctx: BotContext) {
    await ctx.reply('Введите новое описание напоминания:');
  }

  @On('text')
  async onDescription(@Ctx() ctx: BotContext) {
    const description = ctx.message['text'];
    const reminderId = ctx.session.data.currentReminderId;

    if (description.length < 2 || description.length > 100) {
      await ctx.reply('Описание должно быть от 2 до 100 символов');
      return;
    }

    try {
      await this.remindersService.updateReminder(reminderId, {
        title: description,
      });
      await ctx.reply('✅ Описание успешно обновлено');
    } catch (error) {
      await ctx.reply('❌ Произошла ошибка при обновлении описания');
    }

    await ctx.scene.enter(BotScenes.REMINDER_DETAILS);
  }
}
