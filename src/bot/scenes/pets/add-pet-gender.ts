import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotScenes } from '../types';
import { I18nTranslateService } from '../../../i18n/i18n.service';
import { PetButtons } from './pet.buttons';

@Scene(BotScenes.ADD_PET_GENDER)
export class AddPetGender {
  constructor(private i18n: I18nTranslateService) {}

  @SceneEnter()
  async enterAddPetGender(@Ctx() ctx: Context) {
    await ctx.reply('Выберите пол питомца:', PetButtons.petGender());
  }

  @Action(['male', 'female'])
  async onPetGender(@Ctx() ctx: Context) {
    ctx['session']['petGender'] = ctx.callbackQuery['data'];
    await ctx['scene'].enter(BotScenes.ADD_PET_TYPE);
  }
}
