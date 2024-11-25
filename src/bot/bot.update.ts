import { Update, Start, Ctx, Command, InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { LoggerService } from '../services/logger.service';
import { LogViewerService } from '../services/log-viewer.service';
import { I18nTranslateService } from 'src/i18n/i18n.service';
import { BotButtons } from './bot.buttons';
import { BotScenes } from './scenes/types';
import { UserService } from 'src/user/user.service';
import { I18nService } from 'nestjs-i18n';
import { BotContext } from './interfaces/context.interface';

@Update()
export class BotUpdate {
  constructor(
    private logger: LoggerService,
    private logViewer: LogViewerService,
    private i18n: I18nTranslateService,
    private i18nService: I18nService,
    private userService: UserService,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}


  @Start()
  async startCommand(@Ctx() ctx: BotContext) {
    const { id, first_name, last_name, username, language_code } = ctx.from;
    try {
      const user = await this.userService.createOrUpdate({
        telegramId: id,
        firstName: first_name,
        lastName: last_name,
        username: username,
        lang: language_code,
      });

      ctx.session.data = {
        language: user.lang,
        lastBotMessages: [],
      };

      const welcomeMessage = await this.i18nService.t('main.WelcomeHTML', {
        lang: user.lang,
        args: {
          first_name: user.firstName,
          last_name: user.lastName || '',
        },
      });

      await ctx.replyWithHTML(welcomeMessage);

      await ctx.scene.enter(BotScenes.MAIN_MENU);

      await this.logger.logUserAction({
        telegramId: id.toString(),
        action: 'START_COMMAND',
        details: `User registered/updated: ${first_name} (${username || 'no username'})`,
      });

    } catch (error) {
      await this.logger.logUserAction({
        telegramId: id.toString(),
        action: 'START_COMMAND',
        error: error.message,
      });

    
      return 'ERRORS.REGISTRATION';
    }
  }

  @Command('lang')
  async getBotLanguage(@Ctx() ctx: BotContext) {
    await ctx.deleteMessage();
    await ctx.scene.enter(BotScenes.LANGUAGE);
    await ctx.reply(
      await this.i18n.t({key: 'main.CHOOSE_LANG', ctx}),

    );

    await ctx.reply(
      await this.i18n.t({key: 'main.CHOOSE_LANG', ctx}),
      BotButtons.chooseLanguage(),
    );
  }

  @Command('main')
  async getMainMenu(@Ctx() ctx: BotContext) {
    await ctx.deleteMessage();
    await ctx.scene.enter(BotScenes.MAIN_MENU);
  }

  @Command('my-profile')
  async getMyProfile(@Ctx() ctx: BotContext) {
    await ctx.deleteMessage();
    await ctx.scene.enter(BotScenes.MAIN_MENU);
  }

  @Command('logs')
  async viewLogs(@Ctx() ctx: BotContext) {
    try {
      const logs = await this.logViewer.getUserLogs(ctx.from.id.toString());

      if (!logs.length) {
        return 'История действий пуста';
      }

      const formattedLogs = logs
        .map((log) => {
          const date = new Date(log.createdAt).toLocaleString('ru');
          return `📝 ${date}\n🔹 Действие: ${log.action}\n${log.details ? `📄 Детали: ${log.details}\n` : ''}${log.error ? `❌ Ошибка: ${log.error}\n` : ''}`;
        })
        .join('\n');

      return `📋 Последние действия:\n\n${formattedLogs}`;
    } catch (error) {
      return 'Не удалось получить историю действий';
    }
  }

  @Command('errors')
  async viewErrors(@Ctx() ctx: BotContext) {
    try {
      const errors = await this.logViewer.getLastErrors(ctx.from.id.toString());

      if (!errors.length) {
        return 'Ошибок не найдено';
      }

      const formattedErrors = errors
        .map((log) => {
          const date = new Date(log.createdAt).toLocaleString('ru');
          return `❌ ${date}\n🔹 Действие: ${log.action}\n💬 Ошибка: ${log.error}`;
        })
        .join('\n\n');

      return `🚫 Последние ошибки:\n\n${formattedErrors}`;
    } catch (error) {
      return 'Не удалось получить список ошибок';
    }
  }

  @Command('notify')
  async sendNotification(@Ctx() ctx: BotContext) {
    try {
      const user = await this.userService.findOne(ctx.from.id);

      const message = [
        '🔔 Тестовое уведомление',
        `👤 Отправлено пользователю: ${user.firstName}`,
        '📝 Это проверка системы уведомлений',
        '⏰ Время отправки: ' + new Date().toLocaleString('ru'),
      ].join('\n');

      await this.bot.telegram.sendMessage(user.telegramId, message);

      await this.logger.logUserAction({
        telegramId: user.telegramId,
        action: 'TEST_NOTIFICATION',
        details: 'Test notification sent successfully',
      });

      return '✅ Тестовое уведомление отправлено';
    } catch (error) {
      await this.logger.logUserAction({
        telegramId: ctx.from.id.toString(),
        action: 'TEST_NOTIFICATION',
        error: error.message,
      });

      return '❌ Ошибка при отправке тестового уведомления';
    }
  }
}
