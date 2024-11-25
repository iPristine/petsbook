import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { ReminderButtons } from './reminder.buttons';
import { BotContext } from 'src/bot/interfaces/context.interface';
import { BaseScene } from '@bot/interfaces/base.scene';
@Scene(BotScenes.EDIT_REMINDER)
export class EditReminder extends BaseScene {
  @SceneEnter()
  async enterEditReminder(@Ctx() ctx: BotContext) {
    await ctx.reply('✏️ Что хотите изменить?', ReminderButtons.editReminder());
  }

  @Action('edit_description')
  async editDescription(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(BotScenes.EDIT_REMINDER_DESCRIPTION);
  }

  @Action('edit_date')
  async editDate(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(BotScenes.EDIT_REMINDER_DATE);
  }

  @Action('edit_frequency')
  async editFrequency(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(BotScenes.EDIT_REMINDER_FREQUENCY);
  }

  @Action('edit_notify')
  async editNotify(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(BotScenes.EDIT_REMINDER_NOTIFY);
  }

  @Action('back_to_details')
  async backToDetails(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    await ctx.scene.enter(BotScenes.REMINDER_DETAILS);
  }
}
