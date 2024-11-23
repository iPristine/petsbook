import { Injectable } from '@nestjs/common';
import { I18nService, TranslateOptions } from 'nestjs-i18n';
import { User } from '@prisma/client';
import { BotContext } from 'src/bot/interfaces/context.interface';
export type ButtonsLocalNames = string;


type TOptions = {
  key: string;
  options?: TranslateOptions;
  ctx?: BotContext;
}

@Injectable()
export class I18nTranslateService {
  constructor(private readonly i18nService: I18nService) {}

  async t({key, options, ctx}: TOptions): Promise<string> {
    return await this.i18nService.t(key, {lang: ctx?.session.data.language, ...options});
  }
}
