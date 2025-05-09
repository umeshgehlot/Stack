import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Type } from '@sinclair/typebox';

// Define request/response schemas for validation
const messageCreateSchema = Type.Object({
  chatId: Type.String(),
  content: Type.String(),
  attachments: Type.Optional(Type.Array(Type.Object({
    type: Type.String(),
    url: Type.String(),
    name: Type.Optional(Type.String()),
    size: Type.Optional(Type.Number()),
  }))),
});

const messageParamsSchema = Type.Object({
  id: Type.String(),
});

const chatParamsSchema = Type.Object({
  chatId: Type.String(),
});

const messageQuerySchema = Type.Object({
  limit: Type.Optional(Type.Number({ default: 50 })),
  before: Type.Optional(Type.String()),
});

const readReceiptSchema = Type.Object({
  userId: Type.String(),
  readAt: Type.String({ format: 'date-time' }),
});

const messageResponseSchema = Type.Object({
  id: Type.String(),
  chatId: Type.String(),
  senderId: Type.String(),
  senderName: Type.Optional(Type.String()),
  content: Type.String(),
  attachments: Type.Array(Type.Object({
    type: Type.String(),
    url: Type.String(),
    name: Type.Optional(Type.String()),
    size: Type.Optional(Type.Number()),
  })),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
  readBy: Type.Array(readReceiptSchema),
});

// Define route handler
export default async function messageRoutes(fastify: FastifyInstance) {
  // Send a new message
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: messageCreateSchema,
      response: {
        201: messageResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ Body: typeof messageCreateSchema.static }>, reply: FastifyReply) => {
    const { id: userId, name } = request.user as { id: string, name: string };
    const { chatId, content, attachments = [] } = request.body;
    
    try {
      // Check if user has access to this chat
      const chat = await fastify.db.collection('chats').findOne({
        _id: new fastify.mongo.ObjectId(chatId),
        'participants.id': userId,
      });
      
      if (!chat) {
        return reply.code(404).send({ error: 'Chat not found or access denied' });
      }
      
      // Create message
      const now = new Date();
      const message = {
        chatId,
        senderId: userId,
        senderName: name,
        content,
        attachments,
        createdAt: now,
        readBy: [{ userId, readAt: now }],
      };
      
      const result = await fastify.db.collection('messages').insertOne(message);
      
      // Update chat's lastMessage
      await fastify.db.collection('chats').updateOne(
        { _id: new fastify.mongo.ObjectId(chatId) },
        { 
          $set: { 
            lastMessage: {
              id: result.insertedId.toString(),
              content,
              senderId: userId,
              createdAt: now,
            },
            updatedAt: now,
          } 
        }
      );
      
      // Publish message event via Redis
      await fastify.redis.publish('chat:events', JSON.stringify({
        type: 'message:created',
        messageId: result.insertedId.toString(),
        chatId,
        senderId: userId,
        content,
        timestamp: now.toISOString(),
      }));
      
      return reply.code(201).send({
        id: result.insertedId.toString(),
        chatId,
        senderId: userId,
        senderName: name,
        content,
        attachments,
        createdAt: now.toISOString(),
        readBy: [{ userId, readAt: now.toISOString() }],
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Get messages for a chat
  fastify.get('/chat/:chatId', {
    onRequest: [fastify.authenticate],
    schema: {
      params: chatParamsSchema,
      querystring: messageQuerySchema,
      response: {
        200: Type.Array(messageResponseSchema),
      },
    },
  }, async (request: FastifyRequest<{ 
    Params: typeof chatParamsSchema.static,
    Querystring: typeof messageQuerySchema.static 
  }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { chatId } = request.params;
    const { limit = 50, before } = request.query;
    
    try {
      // Check if user has access to this chat
      const chat = await fastify.db.collection('chats').findOne({
        _id: new fastify.mongo.ObjectId(chatId),
        'participants.id': userId,
      });
      
      if (!chat) {
        return reply.code(404).send({ error: 'Chat not found or access denied' });
      }
      
      // Build query
      const query: any = { chatId };
      
      if (before) {
        query._id = { $lt: new fastify.mongo.ObjectId(before) };
      }
      
      // Get messages
      const messages = await fastify.db.collection('messages')
        .find(query)
        .sort({ _id: -1 }) // Sort by newest first
        .limit(limit)
        .toArray();
      
      // Mark messages as read
      const now = new Date();
      const messageIds = messages.map((msg: any) => msg._id);
      
      if (messageIds.length > 0) {
        await fastify.db.collection('messages').updateMany(
          { 
            _id: { $in: messageIds },
            'readBy.userId': { $ne: userId } // Only update if not already read
          },
          { 
            $push: { 
              readBy: { userId, readAt: now } 
            } 
          }
        );
        
        // Publish read receipt event
        await fastify.redis.publish('chat:events', JSON.stringify({
          type: 'messages:read',
          chatId,
          userId,
          messageIds: messageIds.map((id: any) => id.toString()),
          timestamp: now.toISOString(),
        }));
      }
      
      // Format response
      return messages.map((msg: any) => ({
        id: msg._id.toString(),
        chatId: msg.chatId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        content: msg.content,
        attachments: msg.attachments || [],
        createdAt: msg.createdAt.toISOString(),
        updatedAt: msg.updatedAt ? msg.updatedAt.toISOString() : undefined,
        readBy: msg.readBy.map((r: any) => ({
          userId: r.userId,
          readAt: r.readAt.toISOString(),
        })),
      }));
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Get a specific message
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: messageParamsSchema,
      response: {
        200: messageResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ Params: typeof messageParamsSchema.static }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    
    try {
      const message = await fastify.db.collection('messages').findOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      if (!message) {
        return reply.code(404).send({ error: 'Message not found' });
      }
      
      // Check if user has access to the chat this message belongs to
      const chat = await fastify.db.collection('chats').findOne({
        _id: new fastify.mongo.ObjectId(message.chatId),
        'participants.id': userId,
      });
      
      if (!chat) {
        return reply.code(403).send({ error: 'Access denied' });
      }
      
      return {
        id: message._id.toString(),
        chatId: message.chatId,
        senderId: message.senderId,
        senderName: message.senderName,
        content: message.content,
        attachments: message.attachments || [],
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt ? message.updatedAt.toISOString() : undefined,
        readBy: message.readBy.map((r: any) => ({
          userId: r.userId,
          readAt: r.readAt.toISOString(),
        })),
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Update a message (only sender can update)
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: messageParamsSchema,
      body: Type.Object({
        content: Type.String(),
      }),
      response: {
        200: messageResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ 
    Params: typeof messageParamsSchema.static,
    Body: { content: string } 
  }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    const { content } = request.body;
    
    try {
      // Get message and check permissions
      const message = await fastify.db.collection('messages').findOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      if (!message) {
        return reply.code(404).send({ error: 'Message not found' });
      }
      
      // Only sender can update message
      if (message.senderId !== userId) {
        return reply.code(403).send({ error: 'Only the sender can update this message' });
      }
      
      // Check if message is too old to edit (e.g., 24 hours)
      const messageAge = Date.now() - message.createdAt.getTime();
      const maxEditAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (messageAge > maxEditAge) {
        return reply.code(400).send({ error: 'Message is too old to edit' });
      }
      
      // Update message
      const now = new Date();
      const result = await fastify.db.collection('messages').findOneAndUpdate(
        { _id: new fastify.mongo.ObjectId(id) },
        { 
          $set: { 
            content,
            updatedAt: now,
          } 
        },
        { returnDocument: 'after' }
      );
      
      const updatedMessage = result.value;
      
      // If this was the last message in the chat, update it there too
      const chat = await fastify.db.collection('chats').findOne({
        _id: new fastify.mongo.ObjectId(message.chatId),
        'lastMessage.id': id,
      });
      
      if (chat) {
        await fastify.db.collection('chats').updateOne(
          { _id: new fastify.mongo.ObjectId(message.chatId) },
          { 
            $set: { 
              'lastMessage.content': content,
              updatedAt: now,
            } 
          }
        );
      }
      
      // Publish message update event
      await fastify.redis.publish('chat:events', JSON.stringify({
        type: 'message:updated',
        messageId: id,
        chatId: message.chatId,
        senderId: userId,
        content,
        timestamp: now.toISOString(),
      }));
      
      return {
        id: updatedMessage._id.toString(),
        chatId: updatedMessage.chatId,
        senderId: updatedMessage.senderId,
        senderName: updatedMessage.senderName,
        content: updatedMessage.content,
        attachments: updatedMessage.attachments || [],
        createdAt: updatedMessage.createdAt.toISOString(),
        updatedAt: updatedMessage.updatedAt.toISOString(),
        readBy: updatedMessage.readBy.map((r: any) => ({
          userId: r.userId,
          readAt: r.readAt.toISOString(),
        })),
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Delete a message
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: messageParamsSchema,
    },
  }, async (request: FastifyRequest<{ Params: typeof messageParamsSchema.static }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    
    try {
      // Get message and check permissions
      const message = await fastify.db.collection('messages').findOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      if (!message) {
        return reply.code(404).send({ error: 'Message not found' });
      }
      
      // Check if user has access to the chat
      const chat = await fastify.db.collection('chats').findOne({
        _id: new fastify.mongo.ObjectId(message.chatId),
        'participants.id': userId,
      });
      
      if (!chat) {
        return reply.code(403).send({ error: 'Access denied' });
      }
      
      // Only sender or chat creator can delete messages
      if (message.senderId !== userId && chat.createdBy !== userId) {
        return reply.code(403).send({ error: 'Only the sender or chat creator can delete this message' });
      }
      
      // Delete message
      await fastify.db.collection('messages').deleteOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      // If this was the last message in the chat, update it
      if (chat.lastMessage && chat.lastMessage.id === id) {
        // Find the new last message
        const newLastMessage = await fastify.db.collection('messages')
          .find({ chatId: message.chatId })
          .sort({ createdAt: -1 })
          .limit(1)
          .toArray();
        
        if (newLastMessage.length > 0) {
          const lastMsg = newLastMessage[0];
          await fastify.db.collection('chats').updateOne(
            { _id: new fastify.mongo.ObjectId(message.chatId) },
            { 
              $set: { 
                lastMessage: {
                  id: lastMsg._id.toString(),
                  content: lastMsg.content,
                  senderId: lastMsg.senderId,
                  createdAt: lastMsg.createdAt,
                },
                updatedAt: new Date(),
              } 
            }
          );
        } else {
          // No messages left, remove lastMessage
          await fastify.db.collection('chats').updateOne(
            { _id: new fastify.mongo.ObjectId(message.chatId) },
            { 
              $unset: { lastMessage: "" },
              $set: { updatedAt: new Date() },
            }
          );
        }
      }
      
      // Publish message deletion event
      await fastify.redis.publish('chat:events', JSON.stringify({
        type: 'message:deleted',
        messageId: id,
        chatId: message.chatId,
        senderId: userId,
        timestamp: new Date().toISOString(),
      }));
      
      return reply.code(204).send();
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Mark messages as read
  fastify.post('/read', {
    onRequest: [fastify.authenticate],
    schema: {
      body: Type.Object({
        chatId: Type.String(),
        messageIds: Type.Array(Type.String()),
      }),
    },
  }, async (request: FastifyRequest<{ 
    Body: { chatId: string, messageIds: string[] } 
  }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { chatId, messageIds } = request.body;
    
    try {
      // Check if user has access to this chat
      const chat = await fastify.db.collection('chats').findOne({
        _id: new fastify.mongo.ObjectId(chatId),
        'participants.id': userId,
      });
      
      if (!chat) {
        return reply.code(404).send({ error: 'Chat not found or access denied' });
      }
      
      // Mark messages as read
      const now = new Date();
      
      await fastify.db.collection('messages').updateMany(
        { 
          chatId,
          _id: { $in: messageIds.map(id => new fastify.mongo.ObjectId(id)) },
          'readBy.userId': { $ne: userId } // Only update if not already read
        },
        { 
          $push: { 
            readBy: { userId, readAt: now } 
          } 
        }
      );
      
      // Publish read receipt event
      await fastify.redis.publish('chat:events', JSON.stringify({
        type: 'messages:read',
        chatId,
        userId,
        messageIds,
        timestamp: now.toISOString(),
      }));
      
      return { success: true };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}