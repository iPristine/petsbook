import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { PrismaService } from '../prisma.service';
import { LogViewerService } from './log-viewer.service';

@Module({
  providers: [
    LoggerService,
    PrismaService,
    LogViewerService
  ],
  exports: [LoggerService, LogViewerService],
})
export class LoggerModule {} 