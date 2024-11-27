import { Injectable } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { Post, PostReaction, ReactionType, User } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { I18nService } from 'nestjs-i18n';
import { getIconFromReactionType } from '../common/utils/get-icon-from-reaction-type';
@Injectable()
export class BotService {
  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private logger: LoggerService,
    private i18nService: I18nService,
  ) {}

  async sendMessage(telegramId: string, message: string, extra?: any) {
    try {
      return await this.bot.telegram.sendMessage(telegramId, message, extra);
    } catch (error) {
      await this.logger.logUserAction({
        telegramId,
        action: 'SEND_MESSAGE',
        error: error.message,
      });
      throw error;
    }
  }

  async sendMessageToAdmin(message: string, extra?: any) {
    const adminTelegramId = process.env.ADMIN_TELEGRAM_ID;
    const adminMessage = `ADMIN MESSAGE:\n'${message}'`;

    return await this.sendMessage(adminTelegramId, adminMessage, extra);
  }

  async sendPost(user: User, post: Post) {
    if (
      process.env.SEND_ONLY_TO_ADMIN &&
      user.telegramId !== process.env.ADMIN_TELEGRAM_ID
    ) {
      return;
    }

    const buttons = Object.values(ReactionType).map((type) =>
      Markup.button.callback(
        `${getIconFromReactionType(type)}`,
        `react_${post.id}_${type}`,
      ),
    );

    const mainMenuButtonTitle = await this.i18nService.t(
      'main.MainMenuButton',
      {
        lang: user.lang,
      },
    );

    buttons.push(Markup.button.callback(mainMenuButtonTitle, `main_menu`));

    const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

    try {
      await this.sendMessage(
        user.telegramId,
        post[`content${user.lang === 'ru' ? 'Ru' : 'En'}`] ||
          post.contentDefault,
        keyboard,
      );

      await this.logger.logUserAction({
        telegramId: user.telegramId,
        action: 'SEND_POST',
        details: `Post ID: ${post.id}`,
      });
    } catch (error) {
      await this.logger.logUserAction({
        telegramId: user.telegramId,
        action: 'SEND_POST',
        error: error.message,
      });
    }
  }

  async updatePostReactions(
    chatId: string,
    messageId: number,
    postId: string,
    reactions: PostReaction[],
  ) {
    const reactionCounts = this.countReactions(reactions);

    const buttons = Object.values(ReactionType).map((type) =>
      Markup.button.callback(
        `${type} ${reactionCounts[type] || 0}`,
        `react_${postId}_${type}`,
      ),
    );

    const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

    try {
      await this.bot.telegram.editMessageReplyMarkup(
        chatId,
        messageId,
        undefined,
        keyboard.reply_markup,
      );
    } catch (error) {
      await this.logger.logUserAction({
        telegramId: chatId,
        action: 'UPDATE_POST_REACTIONS',
        error: error.message,
      });
    }
  }

  private countReactions(reactions: PostReaction[]) {
    return reactions.reduce(
      (acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      },
      {} as Record<ReactionType, number>,
    );
  }
}
