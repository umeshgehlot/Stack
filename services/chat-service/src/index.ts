import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifyMongodb from '@fastify/mongodb';
import fastifyRedis from '@fastify/redis';
import fastifySocketIO from 'fastify-socket.io';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '../.env') });

// Import routes
import chatRoutes from './routes/chats';
import messageRoutes from './routes/messages';

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

server.register(fastifySwagger, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Chat Service API',
      description: 'API documentation for the Chat Service',
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

// Register MongoDB
server.register(fastifyMongodb, {
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/chat',
  forceClose: true,
});

// Register Redis
server.register(fastifyRedis, {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  password: process.env.REDIS_PASSWORD,
});

// Register Socket.IO
server.register(fastifySocketIO, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Add authentication decorator
server.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// Register routes
server.register(chatRoutes, { prefix: '/api/chats' });
server.register(messageRoutes, { prefix: '/api/messages' });

// Health check route
server.get('/health', async () => {
  return { status: 'ok', service: 'chat-service' };
});

// Setup Socket.IO handlers
server.ready().then(() => {
  const io: Server = server.io;
  
  // Middleware for authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      // Verify JWT token
      const decoded = server.jwt.verify(token);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    const { id, email } = socket.data.user;
    console.log(`User connected: ${id} (${email})`);
    
    // Join user to their personal room for direct messages
    socket.join(`user:${id}`);
    
    // Handle joining chat rooms
    socket.on('join:chat', async (chatId) => {
      try {
        // Check if user has access to this chat
        const chat = await server.mongo.db.collection('chats').findOne({
          _id: new server.mongo.ObjectId(chatId),
          'participants.id': id,
        });
        
        if (chat) {
          socket.join(`chat:${chatId}`);
          console.log(`User ${id} joined chat ${chatId}`);
          
          // Notify other participants
          socket.to(`chat:${chatId}`).emit('user:joined', {
            userId: id,
            chatId,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error(`Error joining chat ${chatId}:`, err);
      }
    });
    
    // Handle leaving chat rooms
    socket.on('leave:chat', (chatId) => {
      socket.leave(`chat:${chatId}`);
      console.log(`User ${id} left chat ${chatId}`);
      
      // Notify other participants
      socket.to(`chat:${chatId}`).emit('user:left', {
        userId: id,
        chatId,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Handle new messages
    socket.on('message:new', async (data) => {
      try {
        const { chatId, content, attachments } = data;
        
        // Check if user has access to this chat
        const chat = await server.mongo.db.collection('chats').findOne({
          _id: new server.mongo.ObjectId(chatId),
          'participants.id': id,
        });
        
        if (!chat) {
          socket.emit('error', { message: 'Access denied to this chat' });
          return;
        }
        
        // Create message in database
        const now = new Date();
        const message = {
          chatId,
          senderId: id,
          content,
          attachments: attachments || [],
          createdAt: now,
          readBy: [{ id, readAt: now }],
        };
        
        const result = await server.mongo.db.collection('messages').insertOne(message);
        const messageId = result.insertedId.toString();
        
        // Broadcast message to all participants in the chat
        io.to(`chat:${chatId}`).emit('message:received', {
          id: messageId,
          ...message,
          createdAt: now.toISOString(),
          readBy: message.readBy.map(r => ({ ...r, readAt: r.readAt.toISOString() })),
        });
        
        // Update chat's lastMessage
        await server.mongo.db.collection('chats').updateOne(
          { _id: new server.mongo.ObjectId(chatId) },
          { 
            $set: { 
              lastMessage: {
                id: messageId,
                content,
                senderId: id,
                createdAt: now,
              },
              updatedAt: now,
            } 
          }
        );
      } catch (err) {
        console.error('Error handling new message:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Handle typing indicators
    socket.on('typing:start', (chatId) => {
      socket.to(`chat:${chatId}`).emit('user:typing', {
        userId: id,
        chatId,
        timestamp: new Date().toISOString(),
      });
    });
    
    socket.on('typing:stop', (chatId) => {
      socket.to(`chat:${chatId}`).emit('user:stopped-typing', {
        userId: id,
        chatId,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Handle message read receipts
    socket.on('message:read', async (data) => {
      try {
        const { messageId, chatId } = data;
        const now = new Date();
        
        // Update message readBy array
        await server.mongo.db.collection('messages').updateOne(
          { 
            _id: new server.mongo.ObjectId(messageId),
            'readBy.id': { $ne: id } // Only add if not already read
          },
          { 
            $push: { 
              readBy: { id, readAt: now } 
            } 
          }
        );
        
        // Notify other participants
        socket.to(`chat:${chatId}`).emit('message:read-receipt', {
          messageId,
          userId: id,
          chatId,
          readAt: now.toISOString(),
        });
      } catch (err) {
        console.error('Error handling read receipt:', err);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${id}`);
    });
  });
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3003;
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    console.log(`Chat service is running on ${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();