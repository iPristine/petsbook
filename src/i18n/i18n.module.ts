import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { I18nTranslateService } from './i18n.service';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'ru',
      loaderOptions: {
        path: path.join(__dirname, '/'),
        watch: true,
        extension: '.json',
      },
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
        AcceptLanguageResolver,
      ],
      // To update generated types you need to remove ./generated folder
      typesOutputPath: 'src/i18n/generated/i18n.generated.ts',
    }),
  ],
  providers: [I18nTranslateService],
  exports: [I18nTranslateService],
})
export class I18nTranslateModule {}
