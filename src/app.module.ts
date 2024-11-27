import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { I18nTranslateModule } from './i18n/i18n.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RemindersService } from './reminders/reminders.service';
import { PostsModule } from './posts/posts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UserModule } from './user/user.module';
import { LoggerModule } from './logger/logger.module';
import { OctokitModule } from 'nestjs-octokit';
@Module({
  imports: [
    ConfigModule.forRoot(),
    I18nTranslateModule,
    BotModule,
    ScheduleModule.forRoot(),
    OctokitModule.forRoot({
      isGlobal: true,
      octokitOptions: {
        auth: process.env.GITHUB_TOKEN,
      },
    }),
    PostsModule,
    NotificationsModule,
    UserModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, RemindersService],
})
export class AppModule {}
