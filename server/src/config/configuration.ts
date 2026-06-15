export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  database: {
    url: string;
    synchronize: boolean;
    logging: boolean;
  };
}

export default (): AppConfig => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const isProduction = nodeEnv === 'production';

  return {
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv,
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    database: {
      url: process.env.DATABASE_URL ?? '',
      synchronize:
        !isProduction &&
        nodeEnv === 'development' &&
        process.env.TYPEORM_SYNCHRONIZE !== 'false',
      logging: process.env.TYPEORM_LOGGING === 'true',
    },
  };
};

export function validateAppConfig(config: AppConfig): AppConfig {
  if (!config.database.url) {
    throw new Error(
      'DATABASE_URL environment variable is required. Copy server/.env.example to server/.env and configure it.',
    );
  }

  return config;
}