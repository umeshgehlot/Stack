import { FastifyInstance } from 'fastify';
import { Collection, Db } from 'mongodb';
import { Redis } from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
    db: Db;
    mongo: {
      client: any;
      db: Db;
    };
    redis: Redis;
  }

  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      name?: string;
      [key: string]: any;
    };
  }
}
