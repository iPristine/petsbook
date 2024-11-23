import { ReminderFrequency } from '@prisma/client';
import { Context, Scenes } from 'telegraf';

interface SessionData {
  lastBotMessages?: number[];
  reminderDescription?: string;
  reminderDate?: Date;
  reminderFrequency?: ReminderFrequency;
  reminderNotifyDays?: number;
  reminderPets?: string[];
  currentReminderId?: string;
  language?: string;
  data?: Record<string, any>;
}

interface BotSession extends Scenes.SceneSession {
  __scenes: any;
  data: SessionData;
}

export interface BotContext extends Context {
  session: BotSession;
  scene: Scenes.SceneContextScene<BotContext>;
}
