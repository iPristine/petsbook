import { Ctx, Scene, SceneEnter, On, Action } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { BotContext } from 'src/bot/interfaces/context.interface';
import { BotButtons } from 'src/bot/bot.buttons';
import { Markup } from 'telegraf';

@Scene(BotScenes.ADD_REMINDER_DESCRIPTION)
export class AddReminderDescription {
  @SceneEnter()
  async enterAddReminderDescription(@Ctx() ctx: BotContext) {
    await ctx.reply('Введите описание напоминания:', this.buttons());
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

  @Action('back')
  async back(@Ctx() ctx: BotContext) {
    await ctx.scene.leave();
    await ctx.scene.enter(BotScenes.ADD_REMINDER_PETS);
  }

  buttons() {
    const buttons = [];

    buttons.push([BotButtons.backButton()]);

    return Markup.inlineKeyboard(buttons);
  }
}
