import { Injectable } from '@nestjs/common';
import { isArray, isString, map } from 'lodash';
import type { TranslateOptions } from 'nestjs-i18n';
import { I18nService } from 'nestjs-i18n';

import { ContextProvider } from '@src/providers';
import { ITranslationDecoratorInterface } from '@src/interfaces';
import { STATIC_TRANSLATION_DECORATOR_KEY } from '@src/decorators';
import { AbstractTranslationDto } from '@src/common/dto/abstract.dto';

@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}

  async translate(key: string, options?: TranslateOptions): Promise<string> {
    return this.i18n.translate(key, {
      ...options,
      lang: ContextProvider.getLanguage(),
    });
  }

  async translateNecessaryKeys<T extends AbstractTranslationDto>(dto: T): Promise<T> {
    await Promise.all(
      map(dto, async (value, key) => {
        if (isString(value)) {
          const translateDec: ITranslationDecoratorInterface | undefined =
            Reflect.getMetadata(STATIC_TRANSLATION_DECORATOR_KEY, dto, key);

          if (translateDec) {
            return this.translate(
              `${translateDec.translationKey ?? key}.${value}`,
            );
          }

          return;
        }

        if (value instanceof AbstractTranslationDto) {
          return this.translateNecessaryKeys(value);
        }

        if (isArray(value)) {
          return Promise.all(
            map(value, (v) => {
              if (v instanceof AbstractTranslationDto) {
                return this.translateNecessaryKeys(v);
              }

              return null;
            }),
          );
        }
        return null;
      }),
    );

    return dto;
  }
}
