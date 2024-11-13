import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { BotScenes } from '../types';
import { RemindersService } from '../../../reminders/reminders.service';
import { UserService } from '../../../user/user.service';

@Scene(BotScenes.REMINDERS_LIST)
export class RemindersList {
  constructor(
    private remindersService: RemindersService,
    private userService: UserService,
  ) {}

  @SceneEnter()
  async enterRemindersList(@Ctx() ctx: Context) {
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

      await ctx.reply('Ваши напоминания:', Markup.inlineKeyboard(buttons));
    }
  }

  @Action(/^reminder_details_/)
  async showReminderDetails(@Ctx() ctx: Context) {
    const reminderId = ctx.callbackQuery['data'].split('_')[2];
    ctx['session']['currentReminderId'] = reminderId;
    await ctx['scene'].enter(BotScenes.REMINDER_DETAILS);
  }

  @Action('add_reminder')
  async addReminder(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx['scene'].enter(BotScenes.ADD_REMINDER_PETS);
  }

  @Action('back')
  async back(@Ctx() ctx: Context) {
    await ctx['scene'].enter(BotScenes.MAIN_MENU);
  }
}