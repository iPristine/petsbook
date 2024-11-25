import {  Ctx, SceneLeave } from 'nestjs-telegraf';

import { BotContext } from '../interfaces/context.interface';
import { BotScenes } from '../scenes/types';


export class BaseScene {

  constructor() {}


  @SceneLeave()
  async sceneLeave(@Ctx() ctx: BotContext) {
    if (ctx.session.data.lastBotMessages?.length) {
      const lastMessageId = ctx.session.data.lastBotMessages[ctx.session.data.lastBotMessages.length - 1];

      await Promise.all(
        ctx.session.data.lastBotMessages
          .slice(0, -1)
          .map(messageId => ctx.deleteMessage(messageId).catch(() => {}))
      );

      ctx.session.data.lastBotMessages = [lastMessageId];
    }
  }

  protected async saveBotMessage(ctx: BotContext, message: any) {
    if (!ctx.session.data.lastBotMessages) {
      ctx.session.data.lastBotMessages = [];
    }
    ctx.session.data.lastBotMessages.push(message.message_id);
  }

  protected async updateBotMessage(ctx: BotContext, text: string, keyboard?: any) {
    if (ctx.session.data.lastBotMessages?.length) {
      const lastMessageId = ctx.session.data.lastBotMessages[ctx.session.data.lastBotMessages.length - 1];
      try {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          lastMessageId,
          null,
          text,
          {
            parse_mode: 'HTML',
            ...keyboard
          }
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    return false;
  }

  protected async navigate(ctx: BotContext, scene: BotScenes) {
    await ctx.scene.leave();
    await ctx.scene.enter(scene);
  }
}
