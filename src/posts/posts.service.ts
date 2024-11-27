import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Post, PostReaction, ReactionType } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getNextUnsendPost(): Promise<Post | null> {
    return this.prisma.post.findFirst({
      where: {
        isSent: false,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async markPostAsSent(postId: string): Promise<Post> {
    return this.prisma.post.update({
      where: { id: postId },
      data: {
        isSent: true,
        sentAt: new Date(),
      },
    });
  }

  async createPost(content: string, imageUrl?: string): Promise<Post> {
    return this.prisma.post.create({
      data: {
        contentDefault: content,
        imageUrl,
        isSent: false,
      },
    });
  }

  async addReaction(postId: string, userId: string, type: ReactionType): Promise<PostReaction> {
    return this.prisma.postReaction.upsert({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
      update: {
        type,
      },
      create: {
        postId,
        userId,
        type,
      },
    });
  }

  async getPostWithReactions(postId: string) {
    return this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        reactions: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}