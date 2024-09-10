
import { Module } from '@nestjs/common';

import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    UserModule,
    HealthCheckerModule,
  ],
  providers: [],
})
export class AppModule {}
