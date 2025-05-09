import Fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyMongodb from '@fastify/mongodb';
import fastifyRedis from '@fastify/redis';
import fastifyWebsocket from '@fastify/websocket';
import { errorHandler } from './middleware/error.middleware';
import meetingRoutes from './routes/meetings';
import recordingRoutes from './routes/recordings';
import websocketRoutes from './routes/websocket';

// Load environment variables
const {
  MONGODB_URI = 'mongodb://localhost:27017/stack',
  REDIS_URI = 'redis://localhost:6379',
  JWT_SECRET = 'your-secret-key',
  PORT = 3003,
  HOST = '0.0.0.0',
  NODE_ENV = 'development'
} = process.env;

// Create Fastify instance
export const createApp = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: {
      level: NODE_ENV === 'production' ? 'info' : 'debug',
      transport: NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname'
            }
          }
        : undefined
    }
  });

  // Register plugins
  await fastify.register(fastifyCors, {
    origin: true,
    credentials: true
  });

  await fastify.register(fastifyJwt, {
    secret: JWT_SECRET
  });

  await fastify.register(fastifyMongodb, {
    url: MONGODB_URI,
    forceClose: true
  });

  await fastify.register(fastifyRedis, {
    url: REDIS_URI
  });

  await fastify.register(fastifyWebsocket, {
    options: { maxPayload: 1048576 } // 1MB
  });

  // Add authentication decorator
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or missing token' });
    }
  });

  // Register HTTP API routes
  fastify.register(meetingRoutes, { prefix: '/api/meetings' });
  fastify.register(recordingRoutes, { prefix: '/api/meetings' });
  
  // Register WebSocket routes
  fastify.register(websocketRoutes, { prefix: '/ws' });

  // Register error handler
  fastify.setErrorHandler(errorHandler);

  // Health check route
  fastify.get('/health', async () => {
    return { status: 'ok', service: 'meeting-service' };
  });

  // Not found handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ error: 'Not Found', message: `Route ${request.method}:${request.url} not found` });
  });

  return fastify;
};

// Start the server if this file is run directly
if (require.main === module) {
  const start = async () => {
    try {
      const fastify = await createApp();
      await fastify.listen({ port: Number(PORT), host: HOST });
      console.log(`Server is running on ${HOST}:${PORT}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };

  start();
}
