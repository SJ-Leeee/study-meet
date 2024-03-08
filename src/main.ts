import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ValidationPipeOption, getNestOptions } from './app.option';
import { BusinessExceptionFilter } from './exception/businessExceptionFilter';
import { join } from 'path';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(
    AppModule,
    getNestOptions(),
  );
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: ValidationPipeOption,
    }),
  );
  app.use(cookieParser());
  app.useGlobalFilters(new BusinessExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'static'));

  app.enableCors();

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  await app.listen(3000);
  console.log(`server on port: ${port}`);
}
bootstrap();
