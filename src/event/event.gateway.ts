import { Logger, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/common/decorator/user.decorator';
import { ReqUserDto } from 'src/common/dto/reqUser.dto';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@WebSocketGateway(8080, { namespace: 'chat', cors: '*' })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}
  private logger: Logger = new Logger('EventsGateway');

  @WebSocketServer() server: Server;

  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage('hihi')
  handleMessage(@MessageBody() data: any, @User() user: ReqUserDto): string {
    console.log(user);
    console.log(data);
    return 'Hello worl22d!';
  }
  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id}`);
  }
}
