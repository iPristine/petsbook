import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { UserService } from '../../../user/user.service';
import { BotContext } from 'src/bot/interfaces/context.interface';
import { BaseScene } from 'src/bot/interfaces/base.scene';

@Scene(BotScenes.REMINDERS_LIST)
export class RemindersList extends BaseScene {
  constructor(
    private remindersService: RemindersService,
    private userService: UserService,
  ) {
    super();
  }

  @SceneEnter()
  async enterRemindersList(@Ctx() ctx: BotContext) {
    const telegramId = ctx.from.id;
    const user = await this.userService.findOne(telegramId);
    const reminders = await this.remindersService.getRemindersByUserId(user.id);

    if (reminders.length === 0) {
      const buttons = [];
      buttons.push([
        Markup.button.callback('➕ Добавить напоминание', 'add_reminder'),
      ]);
      buttons.push([Markup.button.callback('◀️ Назад', 'back')]);

      await ctx.reply(
        'У вас пока нет напоминаний.',
        Markup.inlineKeyboard(buttons),
      );
    } else {
      const buttons = reminders.map((reminder) => [
        Markup.button.callback(
          `🔔 ${reminder.title} (${new Date(reminder.date).toLocaleDateString()})`,
          `reminder_details_${reminder.id}`,
        ),
      ]);

      buttons.push([
        Markup.button.callback('➕ Добавить напоминание', 'add_reminder'),
      ]);
      buttons.push([Markup.button.callback('◀️ Назад', 'back')]);

      this.updateBotMessage(ctx, 'Ваши напоминания:', Markup.inlineKeyboard(buttons));
    }
  }

  @Action(/^reminder_details_/)
  async showReminderDetails(@Ctx() ctx: BotContext) {
    const reminderId = ctx.callbackQuery['data'].split('_')[2];
    ctx.session.data.currentReminderId = reminderId;
    this.navigate(ctx, BotScenes.REMINDER_DETAILS);
  }

  @Action('add_reminder')
  async addReminder(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    this.navigate(ctx, BotScenes.ADD_REMINDER_PETS);
  }

  @Action('back')
  async back(@Ctx() ctx: BotContext) {
    this.navigate(ctx, BotScenes.MAIN_MENU);
  }
}
