import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { I18nTranslateService } from '../../../i18n/i18n.service';
import { PetsService } from '../../../pets/pets.service';
import { PetButtons } from './pet.buttons';
import { UserService } from 'src/user/user.service';

@Scene(BotScenes.ADD_PET_TYPE)
export class AddPetType {
  constructor(
    private i18n: I18nTranslateService,
    private petsService: PetsService,
    private userService: UserService,
  ) {}

  @SceneEnter()
  async enterAddPetType(@Ctx() ctx: Context) {
    const petGender = ctx['session']['petGender'];
    await ctx.reply('Выберите тип питомца:', PetButtons.petTypes(petGender));
  }

  @Action(['cat', 'dog'])
  async onPetType(@Ctx() ctx: Context) {
    ctx['session']['petType'] = ctx.callbackQuery['data'];
    await ctx['scene'].enter(BotScenes.ADD_PET_AGE);
  }
}
