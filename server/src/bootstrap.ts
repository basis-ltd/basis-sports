import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuditContextInterceptor } from './common/interceptors/audit-context.interceptor';

export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: configService.get<string>('corsOrigin'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new AuditContextInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('basis-sports API')
    .setDescription('Football analytics platform API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
}