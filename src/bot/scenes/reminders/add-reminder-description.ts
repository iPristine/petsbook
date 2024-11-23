import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { BotContext } from 'src/bot/interfaces/context.interface';

@Scene(BotScenes.ADD_REMINDER_DESCRIPTION)
export class AddReminderDescription {
  @SceneEnter()
  async enterAddReminderDescription(@Ctx() ctx: BotContext) {
    await ctx.reply('Введите описание напоминания:');
  }

  @On('text')
  async onDescription(@Ctx() ctx: BotContext) {
    const description = ctx.message['text'];

    if (description.length < 2 || description.length > 100) {
      await ctx.reply('Описание должно быть от 2 до 100 символов');
      return;
    }

    ctx.session.data.reminderDescription = description;
    await ctx.scene.enter(BotScenes.ADD_REMINDER_DATE);
  }
}
