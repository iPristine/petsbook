import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { BotScenes } from '../types';
import { PetsService } from '../../../pets/pets.service';
import { UserService } from '../../../user/user.service';
import { BotContext } from 'src/bot/interfaces/context.interface';
import { Markup } from 'telegraf';
import { Pet } from '@prisma/client';
import { BotButtons } from 'src/bot/bot.buttons';

@Scene(BotScenes.ADD_REMINDER_PETS)
export class AddReminderPets {
  constructor(
    private petsService: PetsService,
    private userService: UserService,
  ) {}

  @SceneEnter()
  async enterAddReminderPets(@Ctx() ctx: BotContext) {
    const user = await this.userService.findOne(ctx.from.id);
    const pets = await this.petsService.findPetsByUserId(user.id);

    await ctx.reply(
      'Для кого напоминание:',
      this.buttons(pets),
    );
  }

  @Action('no_pets')
  async noPets(@Ctx() ctx: BotContext) {
    ctx.session.data.reminderPets = [];
    await ctx.scene.enter(BotScenes.ADD_REMINDER_DESCRIPTION);
  }

  @Action(/^select_pet_/)
  async selectPet(@Ctx() ctx: BotContext) {
    const petId: string = ctx.callbackQuery['data'].replace('select_pet_', '');
    ctx.session.data.reminderPets = [petId];
    await ctx.scene.enter(BotScenes.ADD_REMINDER_DESCRIPTION);
  }

  @Action('back')
  async back(@Ctx() ctx: BotContext) {
    await ctx.scene.leave();
    await ctx.scene.enter(BotScenes.REMINDERS_LIST);
  }

  buttons(pets: Pet[]) {
    const buttons = [
      [Markup.button.callback('🌐 Общее напоминание', 'no_pets')],
      ...pets.map((pet) => [
        Markup.button.callback(`🐾 ${pet.name}`, `select_pet_${pet.id}`),
      ]),
    ];

    buttons.push([BotButtons.backButton()]);

    return Markup.inlineKeyboard(buttons);
  }
}
