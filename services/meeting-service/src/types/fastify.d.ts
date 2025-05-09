import { FastifyInstance as OriginalFastifyInstance } from 'fastify';
import { Collection, Db } from 'mongodb';
import { Redis } from 'ioredis';
import { JwtPayload } from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyInstance extends OriginalFastifyInstance {
    db: Db;
    redis: Redis;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    jwt: {
      sign: (payload: object, options?: object) => string;
      verify: (token: string) => JwtPayload;
    };
  }

  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
      role?: string;
      [key: string]: any;
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
      role?: string;
      [key: string]: any;
    };
    user: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
      role?: string;
      [key: string]: any;
    };
  }
}
