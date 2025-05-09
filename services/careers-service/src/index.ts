import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyMongodb from '@fastify/mongodb';
import fastifyRedis from '@fastify/redis';
import fastifySwagger from '@fastify/swagger';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '../.env') });

// Import routes
import jobRoutes from './routes/jobs';

// Import error handler middleware
import { errorHandler } from './middleware/error.middleware';

// Create Fastify instance
const server: FastifyInstance = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register plugins
server.register(fastifyCors, {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
});

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecretkey',
});

// Register Swagger documentation
server.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Careers Service API',
      description: 'API documentation for the Careers Service',
      version: '1.0.0',
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
});

// Expose Swagger documentation UI
server.register(require('@fastify/swagger-ui'), {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// Register MongoDB
server.register(fastifyMongodb, {
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/careers',
  forceClose: true,
});

// Register Redis
server.register(fastifyRedis, {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  password: process.env.REDIS_PASSWORD,
});

// Add authentication decorator
server.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// Register error handler
server.setErrorHandler(errorHandler);

// Register routes
server.register(jobRoutes, { prefix: '/api/jobs' });

// Health check route
server.get('/health', async () => {
  return { status: 'ok', service: 'careers-service' };
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3004;
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    console.log(`Careers service is running on ${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
const signals = ['SIGINT', 'SIGTERM'] as const;
signals.forEach((signal) => {
  process.on(signal, async () => {
    server.log.info(`Received ${signal}, closing server...`);
    
    try {
      await server.close();
      server.log.info('Server closed successfully');
      process.exit(0);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  });
});

start();
