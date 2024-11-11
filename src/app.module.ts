import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { I18nTranslateModule } from './i18n/i18n.module';

@Module({
  imports: [ConfigModule.forRoot(), BotModule, I18nTranslateModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
