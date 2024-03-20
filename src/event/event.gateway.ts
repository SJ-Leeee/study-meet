import { HttpStatus, Logger, UseGuards } from '@nestjs/common';
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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BusinessException } from 'src/exception/businessException';
import { UserService } from 'src/auth/services/user.service';

@WebSocketGateway(8080, { namespace: 'chat', cors: '*' })
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}
  private logger: Logger = new Logger('EventsGateway');
  @WebSocketServer() server: Server;

  connectedClients: {
    [socketId: string]: { userId: number; userName: string };
  } = {};
  @SubscribeMessage('message')
  handleMesssage(
    client: Socket,
    data: { message: string; room: number },
  ): void {
    const room = String(data.room);
    if (!client.rooms.has(room)) {
      return;
    }
    this.server.to(room).emit('message', {
      sender: this.connectedClients[client.id],
      message: data.message,
    });
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, room: number): void {
    // 이미 접속한 방인지 확인
    const roomToString = String(room);
    if (client.rooms.has(roomToString)) {
      return;
    }
    client.join(roomToString);
    this.server.to(roomToString).emit('userJoined', {
      uesrName: this.connectedClients[client.id].userName,
      room: roomToString,
    });
    this.logger.log(`JOIN to ${roomToString}`);
  }

  @SubscribeMessage('exit')
  handleExit(client: Socket, room: string): void {
    // 방에 접속되어 있지 않은 경우는 무시
    if (!client.rooms.has(room)) {
      return;
    }

    client.leave(room);

    this.server.to(room).emit('userLeft', {
      userName: this.connectedClients[client.id].userName,
      room,
    });
  }
  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    // 토큰으로 유저조회
    const sub = await this.validateJwt(client);
    const user = await this.userService.getUserById(sub);

    // 서버메모리에 유저정보를 저장
    this.connectedClients[client.id] = {
      userId: user.userId,
      userName: user.name,
    };

    // 소켓서버에 현재 유저들을 전송
    this.server.emit('getUserList', { userList: this.connectedClients });
    this.logger.log(`Client Connected : ${user.name}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      `Client Disconnected : ${this.connectedClients[client.id].userName}`,
    );

    // room에 전달
    client.rooms.forEach((room) => {
      this.server.to(room).emit('userLeft', {
        userName: this.connectedClients[client.id].userName,
        room,
      });
      client.leave(room);
    });
    // 해당 유저 삭제 후 유저정보 전송
    delete this.connectedClients[client.id];
    this.server.emit('getUserList', { userList: this.connectedClients });
  }

  private async validateJwt(socket: Socket) {
    try {
      const token = socket.handshake.query?.token as string;
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      return payload.sub;
    } catch (error) {
      throw new BusinessException('token', error, error, HttpStatus.FORBIDDEN);
    }
  }
}

// 소켓 테스팅해보기
// 레디스로 트래픽줄여보기

// 참고 handshake나 query로 입력받자 jwt
// import { io } from "socket.io-client";

// const socket = io(SERVER_DOMAIN, {
// 	auth: {
//     token: `Bearer ${BEARER_TOKEN}`,
//   },
// });
