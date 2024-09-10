import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ApiConfigService } from './services/api-config.service';
import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { TranslationService } from './services/translation.service';
import { ValidatorService } from './services/validator.service';

@Global()
@Module({
  providers: [
    ApiConfigService,
    ValidatorService,
    AwsS3Service,
    GeneratorService,
    TranslationService
  ],
  imports: [CqrsModule],
  exports: [
    ApiConfigService,
    ValidatorService,
    AwsS3Service, GeneratorService,
    TranslationService,
    CqrsModule
  ],
})
export class SharedModule { }
