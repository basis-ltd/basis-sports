import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration, { validateAppConfig } from './configuration';
import { getEnvFilePath } from './env-path';

function mergeEnvConfigIntoProcess(envConfig: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(envConfig)) {
    if (typeof value === 'string' && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [getEnvFilePath(), '.env'],
      validate: (envConfig: Record<string, unknown>) => {
        mergeEnvConfigIntoProcess(envConfig);
        return validateAppConfig(configuration());
      },
    }),
  ],
})
export class AppConfigModule {}