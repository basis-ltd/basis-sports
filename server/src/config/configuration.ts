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

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  database: {
    url: process.env.DATABASE_URL ?? '',
    synchronize:
      process.env.NODE_ENV === 'development' &&
      process.env.TYPEORM_SYNCHRONIZE !== 'false',
    logging: process.env.TYPEORM_LOGGING === 'true',
  },
});