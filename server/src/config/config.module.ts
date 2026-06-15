import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration, { AppConfig, validateAppConfig } from './configuration';
import { getEnvFilePath } from './env-path';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [getEnvFilePath(), '.env'],
      validate: (config) => validateAppConfig(config as AppConfig),
    }),
  ],
})
export class AppConfigModule {}