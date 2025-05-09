import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '../.env') });

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

// Import plugins
import dbConnector from './plugins/db-connector';

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
  sign: {
    expiresIn: '1d',
  },
});

server.register(fastifySwagger, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Authentication Service API',
      description: 'API documentation for the Authentication Service',
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
  exposeRoute: true,
});

// Register database connector
server.register(dbConnector);

// Register routes
server.register(authRoutes, { prefix: '/api/auth' });
server.register(userRoutes, { prefix: '/api/users' });

// Health check route
server.get('/health', async () => {
  return { status: 'ok', service: 'auth-service' };
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    console.log(`Auth service is running on ${host}:${port}`);
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
    await server.close();
    process.exit(0);
  });
});

// Start the server if this file is run directly
if (require.main === module) {
  start();
}

export default server;