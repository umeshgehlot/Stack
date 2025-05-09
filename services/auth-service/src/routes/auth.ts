import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Type } from '@sinclair/typebox';
import bcrypt from 'bcrypt';

// Define request/response schemas for validation
const registerSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
});

const loginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

const userResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
});

const authResponseSchema = Type.Object({
  user: userResponseSchema,
  token: Type.String(),
});

// Define route handler
export default async function authRoutes(fastify: FastifyInstance) {
  // Register a new user
  fastify.post('/register', {
    schema: {
      body: registerSchema,
      response: {
        201: authResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ Body: typeof registerSchema.static }>, reply: FastifyReply) => {
    const { name, email, password } = request.body;
    
    try {
      // Check if user already exists
      const existingUser = await fastify.db.collection('users').findOne({ email });
      
      if (existingUser) {
        return reply.code(409).send({ error: 'User with this email already exists' });
      }
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create user
      const now = new Date();
      const result = await fastify.db.collection('users').insertOne({
        name,
        email,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      });
      
      const userId = result.insertedId.toString();
      
      // Generate JWT token
      const token = fastify.jwt.sign({
        id: userId,
        email,
        name,
      });
      
      return reply.code(201).send({
        user: {
          id: userId,
          name,
          email,
          createdAt: now.toISOString(),
        },
        token,
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Login user
  fastify.post('/login', {
    schema: {
      body: loginSchema,
      response: {
        200: authResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ Body: typeof loginSchema.static }>, reply: FastifyReply) => {
    const { email, password } = request.body;
    
    try {
      // Find user
      const user = await fastify.db.collection('users').findOne({ email });
      
      if (!user) {
        return reply.code(401).send({ error: 'Invalid email or password' });
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return reply.code(401).send({ error: 'Invalid email or password' });
      }
      
      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      });
      
      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        },
        token,
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Verify token and get current user
  fastify.get('/me', {
    onRequest: [fastify.authenticate],
    schema: {
      response: {
        200: userResponseSchema,
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.user as { id: string };
    
    try {
      const user = await fastify.db.collection('users').findOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Logout (client-side only, just for API completeness)
  fastify.post('/logout', {}, async (request, reply) => {
    return { success: true, message: 'Logged out successfully' };
  });
}