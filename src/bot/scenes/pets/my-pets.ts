import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { I18nTranslateService } from '../../../i18n/i18n.service';
import { BotScenes } from '../types';
import { PetsService } from 'src/pets/pets.service';
import { UserService } from 'src/user/user.service';
import { BaseScene, BotContext } from '@bot/interfaces';

@Scene(BotScenes.MY_PETS)
export class MyPets extends BaseScene {
  constructor(
    private i18n: I18nTranslateService,
    private petsService: PetsService,
    private userService: UserService,
  ) {
    super();
  }

  @SceneEnter()
  async enterMyPets(@Ctx() ctx: BotContext) {
    const telegramId = ctx.from.id;
    const user = await this.userService.findOne(telegramId);
    const pets = await this.petsService.findPetsByUserId(user.id);
    if (pets.length === 0) {
      const buttons = [];

      buttons.push([Markup.button.callback('➕ Добавить питомца', 'add_pet')]);
      buttons.push([Markup.button.callback('◀️ Назад', 'back')]);
      await ctx.reply(
        'У вас пока нет питомцев.',
        Markup.inlineKeyboard(buttons),
      );
    } else {
      const buttons = pets.map((pet) => [
        Markup.button.callback(
          `🐾 ${pet.name} (${pet.age || 'возраст не указан'})`,
          `pet_details_${pet.id}`,
        ),
      ]);
      buttons.push([Markup.button.callback('➕ Добавить питомца', 'add_pet')]);
      buttons.push([Markup.button.callback('◀️ Назад', 'back')]);


      this.updateBotMessage(ctx, 'Ваши питомцы:', Markup.inlineKeyboard(buttons));
    }
  }

  @Action(/^pet_details_/)
  async showPetDetails(@Ctx() ctx: BotContext) {
    const petId = ctx.callbackQuery['data'].split('_')[2];
    ctx.session['currentPetId'] = petId;
    this.navigate(ctx, BotScenes.PET_DETAILS);
  }

  @Action('add_pet')
  async addPet(@Ctx() ctx: BotContext) {
    await ctx.answerCbQuery();
    this.navigate(ctx, BotScenes.ADD_PET_NAME);
  }

  @Action('back')
  async getMainMenu(@Ctx() ctx: BotContext) {
    this.navigate(ctx, BotScenes.MAIN_MENU);
  }
}
