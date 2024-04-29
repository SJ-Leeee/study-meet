import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppOptions, ValidationPipeOption } from './app.option';
import { BusinessExceptionFilter } from './exception/businessExceptionFilter';
// import { join } from 'path';
import { SwaggerModule } from '@nestjs/swagger';
declare const module: any;

async function bootstrap() {
  // 옵션클래스
  const appOption = new AppOptions();
  const app = await NestFactory.create<NestApplication>(
    AppModule,
    appOption.getNestOptions(),
  );

  // swagger 등록
  const apiDocument = SwaggerModule.createDocument(
    app,
    appOption.initializeSwaggerDoc(),
  );
  SwaggerModule.setup('api/v1/docs', app, apiDocument);

  const port = 3000;
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: ValidationPipeOption,
    }),
  );
  app.use(cookieParser());
  app.useGlobalFilters(new BusinessExceptionFilter());
  // app.useStaticAssets(join(__dirname, '..', 'static'));

  app.enableCors();

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  await app.listen(port);
  console.log(`server on port: ${port}`);
}
bootstrap();
