import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Type } from '@sinclair/typebox';

// Define request/response schemas for validation
const chatCreateSchema = Type.Object({
  name: Type.Optional(Type.String()),
  type: Type.Enum({ type: Type.String() }, ['direct', 'group']),
  participants: Type.Array(Type.String()),
});

const chatUpdateSchema = Type.Object({
  name: Type.Optional(Type.String()),
  participants: Type.Optional(Type.Array(Type.String())),
});

const chatParamsSchema = Type.Object({
  id: Type.String(),
});

const participantSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  joinedAt: Type.String({ format: 'date-time' }),
});

const lastMessageSchema = Type.Object({
  id: Type.String(),
  content: Type.String(),
  senderId: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
});

const chatResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.Optional(Type.String()),
  type: Type.String(),
  participants: Type.Array(participantSchema),
  createdBy: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  lastMessage: Type.Optional(lastMessageSchema),
});

// Define route handler
export default async function chatRoutes(fastify: FastifyInstance) {
  // Create a new chat
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: chatCreateSchema,
      response: {
        201: chatResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ Body: typeof chatCreateSchema.static }>, reply: FastifyReply) => {
    const { id: userId, email, name } = request.user as { id: string, email: string, name: string };
    const { name: chatName, type, participants } = request.body;
    
    try {
      // For direct chats, ensure there are exactly 2 participants
      if (type === 'direct' && participants.length !== 1) {
        return reply.code(400).send({ error: 'Direct chats must have exactly one other participant' });
      }
      
      // For group chats, ensure there's a name
      if (type === 'group' && !chatName) {
        return reply.code(400).send({ error: 'Group chats must have a name' });
      }
      
      // Check if direct chat already exists between these users
      if (type === 'direct') {
        const existingChat = await fastify.db.collection('chats').findOne({
          type: 'direct',
          'participants.id': { $all: [userId, participants[0]] },
        });
        
        if (existingChat) {
          // Return existing chat
          return {
            id: existingChat._id.toString(),
            name: existingChat.name,
            type: existingChat.type,
            participants: existingChat.participants,
            createdBy: existingChat.createdBy,
            createdAt: existingChat.createdAt.toISOString(),
            updatedAt: existingChat.updatedAt.toISOString(),
            lastMessage: existingChat.lastMessage ? {
              id: existingChat.lastMessage.id,
              content: existingChat.lastMessage.content,
              senderId: existingChat.lastMessage.senderId,
              createdAt: existingChat.lastMessage.createdAt.toISOString(),
            } : undefined,
          };
        }
      }
      
      // Get participant details from auth service
      // In a real app, this would be a service-to-service call
      // For this demo, we'll use the participant IDs directly
      const participantDetails = await Promise.all(
        participants.map(async (participantId) => {
          try {
            // In a real app, fetch user details from auth service
            // For demo, we'll simulate a response
            const user = await fastify.db.collection('users').findOne({
              _id: new fastify.mongo.ObjectId(participantId),
            });
            
            return {
              id: participantId,
              name: user?.name || `User ${participantId}`,
              email: user?.email || `user${participantId}@example.com`,
              joinedAt: new Date(),
            };
          } catch (err) {
            fastify.log.error(`Error fetching user ${participantId}:`, err);
            return {
              id: participantId,
              name: `User ${participantId}`,
              email: `user${participantId}@example.com`,
              joinedAt: new Date(),
            };
          }
        })
      );
      
      // Add current user to participants
      const allParticipants = [
        {
          id: userId,
          name,
          email,
          joinedAt: new Date(),
        },
        ...participantDetails,
      ];
      
      // For direct chats, use participant names as chat name
      const finalChatName = type === 'direct'
        ? undefined // No name for direct chats
        : chatName;
      
      // Create chat
      const now = new Date();
      const result = await fastify.db.collection('chats').insertOne({
        name: finalChatName,
        type,
        participants: allParticipants,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
      });
      
      // Publish chat creation event
      await fastify.redis.publish('chat:events', JSON.stringify({
        type: 'chat:created',
        chatId: result.insertedId.toString(),
        userId,
        participants: allParticipants.map(p => p.id),
        timestamp: now.toISOString(),
      }));
      
      const chat = await fastify.db.collection('chats').findOne(
        { _id: result.insertedId }
      );
      
      return reply.code(201).send({
        id: chat._id.toString(),
        name: chat.name,
        type: chat.type,
        participants: chat.participants.map((p: any) => ({
          ...p,
          joinedAt: p.joinedAt.toISOString(),
        })),
        createdBy: chat.createdBy,
        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString(),
        lastMessage: undefined,
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Get all chats for current user
  fastify.get('/', {
    onRequest: [fastify.authenticate],
    schema: {
      response: {
        200: Type.Array(chatResponseSchema),
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    
    try {
      const chats = await fastify.db.collection('chats')
        .find({ 'participants.id': userId })
        .sort({ updatedAt: -1 })
        .toArray();
      
      return chats.map((chat: any) => ({
        id: chat._id.toString(),
        name: chat.name,
        type: chat.type,
        participants: chat.participants.map((p: any) => ({
          ...p,
          joinedAt: p.joinedAt.toISOString(),
        })),
        createdBy: chat.createdBy,
        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString(),
        lastMessage: chat.lastMessage ? {
          id: chat.lastMessage.id,
          content: chat.lastMessage.content,
          senderId: chat.lastMessage.senderId,
          createdAt: chat.lastMessage.createdAt.toISOString(),
        } : undefined,
      }));
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Get chat by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: chatParamsSchema,
      response: {
        200: chatResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ Params: typeof chatParamsSchema.static }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    
    try {
      const chat = await fastify.db.collection('chats').findOne({
        _id: new fastify.mongo.ObjectId(id),
        'participants.id': userId,
      });
      
      if (!chat) {
        return reply.code(404).send({ error: 'Chat not found' });
      }
      
      return {
        id: chat._id.toString(),
        name: chat.name,
        type: chat.type,
        participants: chat.participants.map((p: any) => ({
          ...p,
          joinedAt: p.joinedAt.toISOString(),
        })),
        createdBy: chat.createdBy,
        createdAt: chat.createdAt.toISOString(),
        updatedAt: chat.updatedAt.toISOString(),
        lastMessage: chat.lastMessage ? {
          id: chat.lastMessage.id,
          content: chat.lastMessage.content,
          senderId: chat.lastMessage.senderId,
          createdAt: chat.lastMessage.createdAt.toISOString(),
        } : undefined,
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Update chat
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: chatParamsSchema,
      body: chatUpdateSchema,
      response: {
        200: chatResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ 
    Params: typeof chatParamsSchema.static,
    Body: typeof chatUpdateSchema.static 
  }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    const updates = request.body;
    
    try {
      // Get chat and check permissions
      const chat = await fastify.db.collection('chats').findOne({
        _id: new fastify.mongo.ObjectId(id),
        'participants.id': userId,
      });
      
      if (!chat) {
        return reply.code(404).send({ error: 'Chat not found' });
      }
      
      // Only creator can update group chats
      if (chat.type === 'group' && chat.createdBy !== userId) {
        return reply.code(403).send({ error: 'Only the chat creator can update group chats' });
      }
      
      // Direct chats cannot be updated
      if (chat.type === 'direct' && updates.name) {
        return reply.code(400).send({ error: 'Cannot update name of direct chats' });
      }
      
      // Prepare update data
      const updateData: any = {
        updatedAt: new Date(),
      };
      
      if (updates.name) {
        updateData.name = updates.name;
      }
      
      if (updates.participants && chat.type === 'group') {
        // Get participant details
        const newParticipants = await Promise.all(
          updates.participants
            .filter(id => !chat.participants.some((p: any) => p.id === id))
            .map(async (participantId) => {
              try {
                // In a real app, fetch user details from auth service
                const user = await fastify.db.collection('users').findOne({
                  _id: new fastify.mongo.ObjectId(participantId),
                });
                
                return {
                  id: participantId,
                  name: user?.name || `User ${participantId}`,
                  email: user?.email || `user${participantId}@example.com`,
                  joinedAt: new Date(),
                };
              } catch (err) {
                return {
                  id: participantId,
                  name: `User ${participantId}`,
                  email: `user${participantId}@example.com`,
                  joinedAt: new Date(),
                };
              }
            })
        );
        
        // Combine existing and new participants
        updateData.participants = [
          ...chat.participants,
          ...newParticipants,
        ];
      }
      
      // Update chat
      const result = await fastify.db.collection('chats').findOneAndUpdate(
        { _id: new fastify.mongo.ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      const updatedChat = result.value;
      
      // Publish chat update event
      await fastify.redis.publish('chat:events', JSON.stringify({
        type: 'chat:updated',
        chatId: id,
        userId,
        updates: Object.keys(updateData).filter(key => key !== 'updatedAt'),
        timestamp: new Date().toISOString(),
      }));
      
      return {
        id: updatedChat._id.toString(),
        name: updatedChat.name,
        type: updatedChat.type,
        participants: updatedChat.participants.map((p: any) => ({
          ...p,
          joinedAt: p.joinedAt.toISOString(),
        })),
        createdBy: updatedChat.createdBy,
        createdAt: updatedChat.createdAt.toISOString(),
        updatedAt: updatedChat.updatedAt.toISOString(),
        lastMessage: updatedChat.lastMessage ? {
          id: updatedChat.lastMessage.id,
          content: updatedChat.lastMessage.content,
          senderId: updatedChat.lastMessage.senderId,
          createdAt: updatedChat.lastMessage.createdAt.toISOString(),
        } : undefined,
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Leave chat (or delete if creator)
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: chatParamsSchema,
    },
  }, async (request: FastifyRequest<{ Params: typeof chatParamsSchema.static }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    
    try {
      // Get chat and check permissions
      const chat = await fastify.db.collection('chats').findOne({
        _id: new fastify.mongo.ObjectId(id),
        'participants.id': userId,
      });
      
      if (!chat) {
        return reply.code(404).send({ error: 'Chat not found' });
      }
      
      // If direct chat or user is creator of group chat, delete the chat
      if (chat.type === 'direct' || chat.createdBy === userId) {
        await fastify.db.collection('chats').deleteOne({
          _id: new fastify.mongo.ObjectId(id),
        });
        
        // Delete all messages in this chat
        await fastify.db.collection('messages').deleteMany({
          chatId: id,
        });
        
        // Publish chat deletion event
        await fastify.redis.publish('chat:events', JSON.stringify({
          type: 'chat:deleted',
          chatId: id,
          userId,
          timestamp: new Date().toISOString(),
        }));
        
        return reply.code(204).send();
      }
      
      // Otherwise, remove user from participants
      await fastify.db.collection('chats').updateOne(
        { _id: new fastify.mongo.ObjectId(id) },
        { 
          $pull: { participants: { id: userId } },
          $set: { updatedAt: new Date() },
        }
      );
      
      // Publish participant left event
      await fastify.redis.publish('chat:events', JSON.stringify({
        type: 'chat:participant:left',
        chatId: id,
        userId,
        timestamp: new Date().toISOString(),
      }));
      
      return reply.code(204).send();
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}