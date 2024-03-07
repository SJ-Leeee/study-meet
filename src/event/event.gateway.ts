import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { cli } from 'winston/lib/winston/config';

@WebSocketGateway(8080, { namespace: 'chat', cors: '*' })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly logger: Logger) {}
  @SubscribeMessage('hihi')
  handleMessage(@MessageBody() data: any): string {
    console.log(data);
    return 'Hello worl22d!';
  }
  afterInit(server: any) {
    this.logger.log('init');
  }
  handleConnection(client: any, ...args: any[]) {
    console.log(`클라접속`);
  }
  handleDisconnect(client: any) {}
}
