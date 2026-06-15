export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  rbacEnforce: boolean;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  resend: {
    apiKey: string;
    fromEmail: string;
  };
  appUrl: string;
  passwordResetExpiresMinutes: number;
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
    rbacEnforce: process.env.RBAC_ENFORCE === 'true',
    jwt: {
      secret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
    },
    resend: {
      apiKey: process.env.RESEND_API_KEY ?? '',
      fromEmail:
        process.env.RESEND_FROM_EMAIL ??
        'Basis Sports <onboarding@resend.dev>',
    },
    appUrl: process.env.APP_URL ?? 'http://localhost:5173',
    passwordResetExpiresMinutes: parseInt(
      process.env.PASSWORD_RESET_EXPIRES_MINUTES ?? '60',
      10,
    ),
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

  if (config.nodeEnv === 'production' && config.jwt.secret === 'dev-jwt-secret-change-in-production') {
    throw new Error('JWT_SECRET must be set in production.');
  }

  return config;
}