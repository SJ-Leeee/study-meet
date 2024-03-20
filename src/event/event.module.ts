import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
      }),
    }),
  ],
  providers: [EventGateway, Logger],
})
export class EventModule {}
