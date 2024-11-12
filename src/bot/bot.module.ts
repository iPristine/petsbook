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
import { MainMenu } from './scenes/main-menu';
import { MyProfile } from './scenes/my-profile';
import { MyPets } from './scenes/pets/my-pets';
import { Settings } from './scenes/settings';
import { Remainers } from './scenes/remainers';
import { UserService } from 'src/user/user.service';
import { PetsService } from 'src/pets/pets.service';
import { AddPetName } from './scenes/pets/add-pet-name';
import { AddPetType } from './scenes/pets/add-pet-type';
import { AddPetGender } from './scenes/pets/add-pet-gender';
import { AddPetConfirm } from './scenes/pets/add-pet-confirm';
import { AddPetAge } from './scenes/pets/add-pet-age';
import { PetDetails } from './scenes/pets/pet-details';
import { PetEdit } from './scenes/pets/pet-edit';
import { PetDelete } from './scenes/pets/pet-delete';
import { DeletePetConfirm } from './scenes/pets/delete-pet-confirm';
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
    MainMenu,
    MyProfile,
    MyPets,
    Settings,
    Remainers,
    UserService,
    PetsService,
    AddPetName,
    AddPetType,
    AddPetGender,
    AddPetConfirm,
    AddPetAge,
    PetDetails,
    PetEdit,
    PetDelete,
    DeletePetConfirm,
  ],
})
export class BotModule {}
