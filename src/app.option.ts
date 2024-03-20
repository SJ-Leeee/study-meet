import { HttpStatus, NestApplicationOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { BusinessException } from './exception/businessException';
import { DocumentBuilder } from '@nestjs/swagger';

export class AppOptions {
  private readonly doc: DocumentBuilder = new DocumentBuilder();

  public initializeSwaggerDoc() {
    return this.doc
      .setTitle('Study-meet API') // 문서 제목
      .setDescription('study meet API개발 문서') // 문서 설명
      .setVersion('1.0') // 문서 버전
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          name: 'JWT',
          in: 'header',
        },
        'access-token',
      )
      .addCookieAuth('refreshToken')
      .setContact('seungjun', '', 'cjstkrak@gmail.com')
      .build();
  }

  public getNestOptions(): NestApplicationOptions {
    const configService = new ConfigService();
    const env = configService.get<string>('ENV');
    const serviceName = configService.get<string>('SERVICE_NAME');
    const colorize = env !== 'prod';

    return {
      abortOnError: true,
      logger: WinstonModule.createLogger({
        transports: [
          new winston.transports.Console({
            level: env === 'prod' ? 'info' : 'silly',
            format:
              env === 'local'
                ? winston.format.combine(
                    winston.format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike(serviceName, {
                      colors: colorize,
                      prettyPrint: true,
                    }),
                  )
                : null,
          }),
        ],
      }),
    };
  }
}

export function ValidationPipeOption(errors) {
  const errMsg = Object.values(errors[0].constraints).join(', ');
  throw new BusinessException('pipe', errMsg, errMsg, HttpStatus.BAD_REQUEST);
}
