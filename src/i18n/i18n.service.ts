import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from './generated/i18n.generated';
import { User } from '@prisma/client';
export type ButtonsLocalNames = string;

@Injectable()
export class I18nTranslateService {
  constructor(private readonly i18nService: I18nService<I18nTranslations>) {}

  async getWelcome({ lang, firstName, lastName }: User): Promise<string> {
    return await this.i18nService.t('main.WELCOME', {
      lang: lang,
      args: {
        first_name: firstName,
        last_name: lastName || '',
      },
    });
  }

  async getChooseCommands(lang: string): Promise<string> {
    return await this.i18nService.t('main.CHOOSE_OPT', { lang });
  }

  async startupButtons(lang: string): Promise<ButtonsLocalNames[]> {
    return [
      await this.i18nService.t('buttons.main_keyboard.BUDGET', {
        lang,
      }),
      await this.i18nService.t('buttons.main_keyboard.EXPENSES', {
        lang,
      }),
      await this.i18nService.t('buttons.main_keyboard.CURRENCIES_SUM', {
        lang,
      }),
    ];
  }

  async getChooseLanguage(lang: string): Promise<string> {
    return await this.i18nService.t('main.CHOOSE_LANG', { lang });
  }
}
