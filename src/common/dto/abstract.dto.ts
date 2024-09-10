import { LanguageCode } from "@src/constants";

export abstract class AbstractDto {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export abstract class AbstractTranslationDto extends AbstractDto {
  languageCode!: LanguageCode;
}