import { Logger, Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';

@Module({
  providers: [EventGateway, Logger],
})
export class EventModule {}
