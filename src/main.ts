import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-execption.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { logger } from './logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
