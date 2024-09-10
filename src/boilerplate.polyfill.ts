import 'source-map-support/register';


import type { AbstractDto, AbstractTranslationDto } from './common/dto/abstract.dto';
import { PageMetaDto } from './common/dto/page-meta.dto';
import { PageDto } from './common/dto/page.dto';
import type { LanguageCode } from './constants/language-code';

declare global {
  export type Uuid = string & { _uuidBrand: undefined };
  export type Todo = any & { _todoBrand: undefined };

  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: unknown): Dto[];

    getByLanguage(
      this: AbstractTranslationDto[],
      languageCode: LanguageCode,
    ): string;

    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      // FIXME make option type visible from entity
      options?: unknown,
    ): PageDto<Dto>;
  }
}

Array.prototype.getByLanguage = function (languageCode: LanguageCode): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return this.find((translation) => languageCode === translation.languageCode)!
    .text;
};

Array.prototype.toPageDto = function (
  pageMetaDto: PageMetaDto,
  options?: unknown,
) {
  return new PageDto(this.toDtos(options), pageMetaDto);
};

