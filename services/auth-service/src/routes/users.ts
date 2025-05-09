import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Type } from '@sinclair/typebox';
import bcrypt from 'bcrypt';

// Define request/response schemas for validation
const userParamsSchema = Type.Object({
  id: Type.String(),
});

const userUpdateSchema = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: 'email' })),
  password: Type.Optional(Type.String({ minLength: 8 })),
});

const userResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

// Define route handler
export default async function userRoutes(fastify: FastifyInstance) {
  // Get user by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: userParamsSchema,
      response: {
        200: userResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ Params: typeof userParamsSchema.static }>, reply: FastifyReply) => {
    const { id: requesterId } = request.user as { id: string };
    const { id } = request.params;
    
    try {
      // Only allow users to access their own profile or admins to access any profile
      if (requesterId !== id) {
        // Check if requester is admin (in a real app)
        const requester = await fastify.db.collection('users').findOne({
          _id: new fastify.mongo.ObjectId(requesterId),
        });
        
        if (!requester || !requester.isAdmin) {
          return reply.code(403).send({ error: 'Access denied' });
        }
      }
      
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
        updatedAt: user.updatedAt.toISOString(),
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Update user
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: userParamsSchema,
      body: userUpdateSchema,
      response: {
        200: userResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ 
    Params: typeof userParamsSchema.static,
    Body: typeof userUpdateSchema.static 
  }>, reply: FastifyReply) => {
    const { id: requesterId } = request.user as { id: string };
    const { id } = request.params;
    const updates = request.body;
    
    try {
      // Only allow users to update their own profile
      if (requesterId !== id) {
        return reply.code(403).send({ error: 'Access denied' });
      }
      
      const user = await fastify.db.collection('users').findOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      
      // Prepare update data
      const updateData: any = {
        updatedAt: new Date(),
      };
      
      if (updates.name) {
        updateData.name = updates.name;
      }
      
      if (updates.email) {
        // Check if email is already taken
        const existingUser = await fastify.db.collection('users').findOne({
          email: updates.email,
          _id: { $ne: new fastify.mongo.ObjectId(id) },
        });
        
        if (existingUser) {
          return reply.code(409).send({ error: 'Email is already taken' });
        }
        
        updateData.email = updates.email;
      }
      
      if (updates.password) {
        // Hash new password
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(updates.password, saltRounds);
      }
      
      // Update user
      const result = await fastify.db.collection('users').findOneAndUpdate(
        { _id: new fastify.mongo.ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      const updatedUser = result.value;
      
      return {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Delete user
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: userParamsSchema,
    },
  }, async (request: FastifyRequest<{ Params: typeof userParamsSchema.static }>, reply: FastifyReply) => {
    const { id: requesterId } = request.user as { id: string };
    const { id } = request.params;
    
    try {
      // Only allow users to delete their own account or admins to delete any account
      if (requesterId !== id) {
        // Check if requester is admin
        const requester = await fastify.db.collection('users').findOne({
          _id: new fastify.mongo.ObjectId(requesterId),
        });
        
        if (!requester || !requester.isAdmin) {
          return reply.code(403).send({ error: 'Access denied' });
        }
      }
      
      const result = await fastify.db.collection('users').deleteOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      if (result.deletedCount === 0) {
        return reply.code(404).send({ error: 'User not found' });
      }
      
      return reply.code(204).send();
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}