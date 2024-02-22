import { NestApplicationOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winston from 'winston';

export function getNestOptions(): NestApplicationOptions {
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
