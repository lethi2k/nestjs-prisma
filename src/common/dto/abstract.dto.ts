import { AbstractEntity } from '../abstract.entity';
import { LanguageCode as PrismaLanguageCode } from '@prisma/client'
import { LanguageCode as AppLanguageCode } from '@src/constants';
import { ContextProvider } from '@src/providers';

export class AbstractDto {
  id!: string;
  translations?: AbstractTranslationDto[];

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity.id;
    }

    const languageCode = ContextProvider.getLanguage();

    if (languageCode && entity.translations) {
      // Convert application language code to Prisma language code if necessary
      const convertedLanguageCode = this.convertToPrismaLanguageCode(languageCode);

      const translationEntity = entity.translations.find(
        (translation) => translation.languageCode === convertedLanguageCode,
      );

      if (translationEntity) {
        const fields: Record<string, any> = {};

        for (const key of Object.keys(translationEntity)) {
          const metadata = Reflect.getMetadata(
            'DYNAMIC_TRANSLATION_DECORATOR_KEY',
            this,
            key,
          );

          if (metadata) {
            fields[key] = (translationEntity as any)[key];
          }
        }

        Object.assign(this, fields);
      }
    } else {
      // this.translations = entity.translations?.map(
      //   (trans) => new AbstractTranslationDto(trans),
      // );
    }
  }

  private convertToPrismaLanguageCode(code: AppLanguageCode): PrismaLanguageCode {
    // Implement the conversion logic if needed
    switch (code) {
      case AppLanguageCode.en_US:
        return PrismaLanguageCode.EN;
      // Add other conversions as needed
      default:
        throw new Error('Unknown language code');
    }
  }
}

export class AbstractTranslationDto extends AbstractDto {
  constructor(entity: AbstractEntity) {
    super(entity, { excludeFields: true });
  }
}
