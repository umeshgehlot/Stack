import { FastifyRequest } from 'fastify';
import { IncomingMessage } from 'http';
import { Socket as NetSocket } from 'net';
import { WebSocket as WS } from 'ws';

declare module 'ws' {
  interface WebSocket extends WS {
    send(data: any, options?: { binary?: boolean; compress?: boolean; fin?: boolean }, callback?: (err?: Error) => void): void;
    close(code?: number, reason?: string): void;
  }
}

declare module '@fastify/websocket' {
  interface SocketStream {
    socket: WebSocket;
    connection: IncomingMessage;
  }

  interface WebsocketRouteOptions {
    websocket: boolean;
    onRequest?: ((request: FastifyRequest, reply: any) => Promise<void>)[];
  }
}
