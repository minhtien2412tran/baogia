import {
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ConversationIdDto, CallSignalDto, SendMessageDto } from './realtime.dto';
import { RealtimeService } from './realtime.service';

type SocketIdentity = { userId: number; role: string };

@WebSocketGateway({
  namespace: '/realtime',
  transports: ['websocket', 'polling'],
  pingInterval: 25_000,
  pingTimeout: 60_000,
  connectTimeout: 45_000,
  cors: {
    origin: (process.env.CORS_ORIGIN ??
      'http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000')
      .split(',')
      .map((value) => value.trim()),
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private readonly userSockets = new Map<number, Set<string>>();

  constructor(
    private readonly jwt: JwtService,
    private readonly realtime: RealtimeService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = this.getToken(client);
      if (!token) throw new Error('Authentication required');
      const payload = this.jwt.verify<{ sub?: number; role?: string }>(token, {
        secret: process.env.JWT_SECRET ?? 'dev-jetbay-secret-change-in-production',
      });
      const userId = Number(payload.sub);
      if (!Number.isInteger(userId) || userId <= 0) throw new Error('Invalid token');

      const identity = { userId, role: String(payload.role ?? 'USER') };
      client.data.identity = identity;
      const sockets = this.userSockets.get(userId) ?? new Set<string>();
      sockets.add(client.id);
      this.userSockets.set(userId, sockets);
      client.emit('realtime:connected', { userId, socketId: client.id });
    } catch {
      client.emit('realtime:error', { message: 'Authentication required' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const identity = client.data.identity as SocketIdentity | undefined;
    if (!identity) return;
    const sockets = this.userSockets.get(identity.userId);
    sockets?.delete(client.id);
    if (sockets?.size === 0) this.userSockets.delete(identity.userId);
  }

  @SubscribeMessage('conversation:join')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async join(
    @MessageBody() body: ConversationIdDto,
    @ConnectedSocket() client: Socket,
  ) {
    const identity = this.identity(client);
    if (this.realtime.isStaff(identity.role)) {
      await this.realtime.joinAsStaff(
        body.conversationId,
        identity.userId,
        identity.role,
      );
    } else {
      await this.realtime.getConversation(
        body.conversationId,
        identity.userId,
        identity.role,
      );
    }
    client.join(this.room(body.conversationId));
    return { ok: true, conversationId: body.conversationId };
  }

  @SubscribeMessage('conversation:leave')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  leave(
    @MessageBody() body: ConversationIdDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(this.room(body.conversationId));
    return { ok: true, conversationId: body.conversationId };
  }

  @SubscribeMessage('message:send')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async send(
    @MessageBody() body: ConversationIdDto & SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const identity = this.identity(client);
    const message = await this.realtime.sendMessage(
      body.conversationId,
      identity.userId,
      identity.role,
      body,
    );
    this.server.to(this.room(body.conversationId)).emit('message:new', message);
    return { ok: true, message };
  }

  @SubscribeMessage('message:read')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async read(
    @MessageBody() body: ConversationIdDto,
    @ConnectedSocket() client: Socket,
  ) {
    const identity = this.identity(client);
    await this.realtime.markRead(
      body.conversationId,
      identity.userId,
      identity.role,
    );
    this.server.to(this.room(body.conversationId)).emit('message:read', {
      conversationId: body.conversationId,
      userId: identity.userId,
    });
    return { ok: true };
  }

  @SubscribeMessage('call:signal')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async signal(
    @MessageBody() body: CallSignalDto,
    @ConnectedSocket() client: Socket,
  ) {
    const identity = this.identity(client);
    await this.realtime.canSignal(
      body.conversationId,
      identity.userId,
      identity.role,
      body,
    );
    this.emitToUser(body.toUserId, 'call:signal', {
      conversationId: body.conversationId,
      fromUserId: identity.userId,
      signal: body.signal,
    });
    return { ok: true };
  }

  @SubscribeMessage('call:end')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async endCall(
    @MessageBody() body: ConversationIdDto & { toUserId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const identity = this.identity(client);
    await this.realtime.canSignal(
      body.conversationId,
      identity.userId,
      identity.role,
      body,
    );
    this.emitToUser(body.toUserId, 'call:end', {
      conversationId: body.conversationId,
      fromUserId: identity.userId,
    });
    return { ok: true };
  }

  private identity(client: Socket): SocketIdentity {
    const identity = client.data.identity as SocketIdentity | undefined;
    if (!identity) throw new WsException('Authentication required');
    return identity;
  }

  private emitToUser(userId: number, event: string, payload: unknown) {
    for (const socketId of this.userSockets.get(userId) ?? []) {
      this.server.to(socketId).emit(event, payload);
    }
  }

  private room(publicId: string) {
    return `conversation:${publicId}`;
  }

  private getToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string') return authToken;
    const header = client.handshake.headers.authorization;
    if (header?.startsWith('Bearer ')) return header.slice(7);
    const queryToken = client.handshake.query.token;
    return typeof queryToken === 'string' ? queryToken : null;
  }
}
