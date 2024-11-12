import { Update, Start, Ctx, Command, InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { PrismaService } from '../prisma.service';
import { LoggerService } from '../services/logger.service';
import { LogViewerService } from '../services/log-viewer.service';
import { I18nTranslateService } from 'src/i18n/i18n.service';
import { BotButtons } from './bot.buttons';
import { BotScenes } from './scenes/types';
import { UserService } from 'src/user/user.service';

@Update()
export class BotUpdate {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    private logViewer: LogViewerService,
    private i18n: I18nTranslateService,
    private userService: UserService,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    const { id, first_name, last_name, username, language_code } = ctx.from;

    try {
      const user = await this.userService.createOrUpdate({
        telegramId: id,
        firstName: first_name,
        lastName: last_name,
        username: username,
        lang: language_code,
      });

      await this.logger.logUserAction({
        telegramId: id.toString(),
        action: 'START_COMMAND',
        details: `User registered/updated: ${first_name} (${username || 'no username'})`,
      });
      await ctx.reply(await this.i18n.getWelcome(user));

      await ctx['scene'].enter(BotScenes.MAIN_MENU);
    } catch (error) {
      await this.logger.logUserAction({
        telegramId: id.toString(),
        action: 'START_COMMAND',
        error: error.message,
      });

      return 'ERRORS.REGISTRATION';
    }
  }

  @Command('commands')
  async getBotCommands(@Ctx() ctx: Context) {
    await ctx.replyWithHTML(
      await this.i18n.getChooseCommands(ctx['session']['language']),
      BotButtons.startupButtons(
        await this.i18n.startupButtons(ctx['session']['language']),
      ),
    );
  }

  @Command('lang')
  async getBotLanguage(@Ctx() ctx: Context) {
    await ctx.deleteMessage();
    await ctx['scene'].enter(BotScenes.LANGUAGE);
    await ctx.reply(
      await this.i18n.getChooseLanguage(ctx['session']['language']),
      BotButtons.chooseLanguage(),
    );
  }

  @Command('main')
  async getMainMenu(@Ctx() ctx: Context) {
    await ctx.deleteMessage();
    await ctx['scene'].enter(BotScenes.MAIN_MENU);
  }

  @Command('my-profile')
  async getMyProfile(@Ctx() ctx: Context) {
    await ctx.deleteMessage();
    await ctx['scene'].enter(BotScenes.MAIN_MENU);
  }

  @Command('logs')
  async viewLogs(@Ctx() ctx: Context) {
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
  async viewErrors(@Ctx() ctx: Context) {
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
}
