import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { ReminderButtons } from './reminder.buttons';

@Scene(BotScenes.EDIT_REMINDER)
export class EditReminder {
  @SceneEnter()
  async enterEditReminder(@Ctx() ctx: Context) {
    await ctx.reply('✏️ Что хотите изменить?', ReminderButtons.editReminder());
  }

  @Action('edit_description')
  async editDescription(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx['scene'].enter(BotScenes.EDIT_REMINDER_DESCRIPTION);
  }

  @Action('edit_date')
  async editDate(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx['scene'].enter(BotScenes.EDIT_REMINDER_DATE);
  }

  @Action('edit_frequency')
  async editFrequency(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx['scene'].enter(BotScenes.EDIT_REMINDER_FREQUENCY);
  }

  @Action('edit_notify')
  async editNotify(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx['scene'].enter(BotScenes.EDIT_REMINDER_NOTIFY);
  }

  @Action('back_to_details')
  async backToDetails(@Ctx() ctx: Context) {
    await ctx.answerCbQuery();
    await ctx['scene'].enter(BotScenes.REMINDER_DETAILS);
  }
}
