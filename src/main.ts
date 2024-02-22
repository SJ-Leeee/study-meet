import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ValidationPipeOption, getNestOptions } from './app.option';
import { BusinessExceptionFilter } from './exception/businessExceptionFilter';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, getNestOptions());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: ValidationPipeOption,
    }),
  );
  app.use(cookieParser());
  app.useGlobalFilters(new BusinessExceptionFilter());
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  await app.listen(3000);
  console.log(`server on port: ${port}`);
}
bootstrap();
