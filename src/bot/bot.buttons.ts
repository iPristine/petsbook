import { Markup } from 'telegraf';
import { ButtonsLocalNames, I18nTranslateService } from '../i18n/i18n.service';
import { LanguageOption } from 'src/common/types';

export class BotButtons {
  constructor(
    private i18n: I18nTranslateService,
  ) {}


  static chooseLanguage() {
    return Markup.inlineKeyboard([
      Markup.button.callback('RU', LanguageOption.RU),
      Markup.button.callback('EN', LanguageOption.EN),
    ]);
  }

  static mainMenu() {
    return Markup.inlineKeyboard([
      Markup.button.callback('My Profile', 'my-profile'),
      Markup.button.callback('My Pets', 'my-pets'),
      Markup.button.callback('Remainders', 'remainders'),
      Markup.button.callback('Settings', 'settings'),
    ], {
      columns: 1,
    });
  }

  static myProfile() {
    return Markup.inlineKeyboard([[Markup.button.callback('Back', 'back')]]);
  }

  static myPets() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('Add Pet', 'add_pet')],
      [Markup.button.callback('Back', 'back')],
    ]);
  }

  static remainders() {
    return Markup.inlineKeyboard([[Markup.button.callback('Back', 'back')]]);
  }

  static backButton() {
    return Markup.button.callback('◀️ Назад', 'back')
  }



}
