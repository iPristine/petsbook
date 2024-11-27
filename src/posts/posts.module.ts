import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [PostsService, PrismaService],
  exports: [PostsService],
})
export class PostsModule {} 