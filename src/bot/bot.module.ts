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
import { RemindersList } from './scenes/reminders/reminders-list';
import { RemindersService } from 'src/reminders/reminders.service';
import { AddReminderPets } from './scenes/reminders/add-reminder-pets';
import { AddReminderDescription } from './scenes/reminders/add-reminder-description';
import { AddReminderDate } from './scenes/reminders/add-reminder-date';
import { AddReminderFrequency } from './scenes/reminders/add-reminder-frequency';
import { AddReminderNotify } from './scenes/reminders/add-reminder-notify';
import { AddReminderConfirm } from './scenes/reminders/add-reminder-confirm';
import { ReminderDetails } from './scenes/reminders/reminder-details';
import { EditReminder } from './scenes/reminders/edit-reminder';
import { EditReminderDescription } from './scenes/reminders/edit-reminder-description';
import { EditReminderDate } from './scenes/reminders/edit-reminder-date';
import { EditReminderFrequency } from './scenes/reminders/edit-reminder-frequency';
import { EditReminderNotify } from './scenes/reminders/edit-reminder-notify';
import { DeleteReminderConfirm } from './scenes/reminders/delete-reminder-confirm';

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
    RemindersService,

    AddPetName,
    AddPetType,
    AddPetGender,
    AddPetConfirm,
    AddPetAge,
    PetDetails,
    PetEdit,
    PetDelete,
    DeletePetConfirm,

    RemindersList,
    AddReminderPets,
    AddReminderDescription,
    AddReminderDate,
    AddReminderFrequency,
    AddReminderNotify,
    AddReminderConfirm,
    ReminderDetails,
    EditReminder,
    EditReminderDescription,
    EditReminderDate,
    EditReminderFrequency,
    EditReminderNotify,
    DeleteReminderConfirm,
  ],
})
export class BotModule {}
