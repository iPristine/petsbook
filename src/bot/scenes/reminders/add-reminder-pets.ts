import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { PetsService } from '../../../pets/pets.service';
import { UserService } from '../../../user/user.service';
import { ReminderButtons } from './reminder.buttons';

@Scene(BotScenes.ADD_REMINDER_PETS)
export class AddReminderPets {
  constructor(
    private petsService: PetsService,
    private userService: UserService,
  ) {}

  @SceneEnter()
  async enterAddReminderPets(@Ctx() ctx: Context) {
    const user = await this.userService.findOne(ctx.from.id);
    const pets = await this.petsService.findPetsByUserId(user.id);

    await ctx.reply(
      'Выберите питомца для напоминания:',
      ReminderButtons.selectPets(pets),
    );
  }

  @Action('no_pets')
  async noPets(@Ctx() ctx: Context) {
    ctx['session']['reminderPets'] = [];
    await ctx['scene'].enter(BotScenes.ADD_REMINDER_DESCRIPTION);
  }

  @Action(/^select_pet_/)
  async selectPet(@Ctx() ctx: Context) {
    const petId = ctx.callbackQuery['data'].split('_')[2];
    ctx['session']['reminderPets'] = [petId];
    await ctx['scene'].enter(BotScenes.ADD_REMINDER_DESCRIPTION);
  }
}
