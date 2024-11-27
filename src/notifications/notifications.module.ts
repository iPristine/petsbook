import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RemindersService } from '../reminders/reminders.service';
import { PostsService } from '../posts/posts.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import { BotService } from '../bot/bot.service';
import { LoggerModule } from '../logger/logger.module';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [
    LoggerModule,
    BotModule
  ],
  providers: [
    NotificationsService,
    RemindersService,
    PostsService,
    UserService,
    PrismaService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {} 