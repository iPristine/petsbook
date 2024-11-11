import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import * as LocalSession from 'telegraf-session-local';
import { PrismaService } from '../prisma.service';
import { LoggerService } from '../services/logger.service';
import { LogViewerService } from '../services/log-viewer.service';

import { TelegrafModule } from 'nestjs-telegraf';
import { I18nTranslateModule } from 'src/i18n/i18n.module';
import { I18nTranslateService } from 'src/i18n/i18n.service';
import { BotLanguage } from './scenes/bot-language';

const sessions = new LocalSession({ database: 'session.json' });


@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process.env.TELEGRAM_BOT_TOKEN,
        middlewares: [sessions.middleware()],
      }),
    }),
    I18nTranslateModule,
  ],
  providers: [
    BotUpdate,
    PrismaService,
    LoggerService,
    LogViewerService,
    I18nTranslateService,
    BotLanguage,
  ],
})
export class BotModule {}
