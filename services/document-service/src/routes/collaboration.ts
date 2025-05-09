import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Type } from '@sinclair/typebox';

// Define request/response schemas for validation
const documentParamsSchema = Type.Object({
  id: Type.String(),
});

const presenceUpdateSchema = Type.Object({
  status: Type.String(),
  cursor: Type.Optional(Type.Object({
    x: Type.Number(),
    y: Type.Number(),
  })),
  selection: Type.Optional(Type.Object({
    start: Type.Number(),
    end: Type.Number(),
  })),
});

const operationSchema = Type.Object({
  type: Type.String(),
  path: Type.Array(Type.Union([Type.String(), Type.Number()])),
  value: Type.Optional(Type.Any()),
});

// Define route handler
export default async function collaborationRoutes(fastify: FastifyInstance) {
  // Get active collaborators for a document
  fastify.get('/documents/:id/collaborators/active', {
    onRequest: [fastify.authenticate],
    schema: {
      params: documentParamsSchema,
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          name: Type.String(),
          email: Type.String(),
          status: Type.String(),
          lastActive: Type.String({ format: 'date-time' }),
          cursor: Type.Optional(Type.Object({
            x: Type.Number(),
            y: Type.Number(),
          })),
        })),
      },
    },
  }, async (request: FastifyRequest<{ Params: typeof documentParamsSchema.static }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id: documentId } = request.params;
    
    try {
      // Check if user has access to this document
      const document = await fastify.db.collection('documents').findOne({
        _id: new fastify.mongo.ObjectId(documentId),
        'collaborators.id': userId,
      });
      
      if (!document) {
        return reply.code(404).send({ error: 'Document not found or access denied' });
      }
      
      // Get active collaborators from Redis
      const activeCollaboratorsKey = `document:${documentId}:active_users`;
      const activeCollaborators = await fastify.redis.hgetall(activeCollaboratorsKey) || {};
      
      // Format the response
      const result = Object.entries(activeCollaborators).map(([id, data]) => {
        const userData = JSON.parse(data as string);
        return {
          id,
          name: userData.name,
          email: userData.email,
          status: userData.status,
          lastActive: userData.lastActive,
          cursor: userData.cursor,
        };
      });
      
      return result;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Update user presence in a document
  fastify.post('/documents/:id/presence', {
    onRequest: [fastify.authenticate],
    schema: {
      params: documentParamsSchema,
      body: presenceUpdateSchema,
    },
  }, async (request: FastifyRequest<{ 
    Params: typeof documentParamsSchema.static,
    Body: typeof presenceUpdateSchema.static 
  }>, reply: FastifyReply) => {
    const { id: userId, email, name } = request.user as { id: string, email: string, name: string };
    const { id: documentId } = request.params;
    const presenceData = request.body;
    
    try {
      // Check if user has access to this document
      const document = await fastify.db.collection('documents').findOne({
        _id: new fastify.mongo.ObjectId(documentId),
        'collaborators.id': userId,
      });
      
      if (!document) {
        return reply.code(404).send({ error: 'Document not found or access denied' });
      }
      
      // Update presence in Redis
      const activeCollaboratorsKey = `document:${documentId}:active_users`;
      const now = new Date().toISOString();
      
      // Get user info from document collaborators
      const collaborator = document.collaborators.find((c: any) => c.id === userId);
      const userName = collaborator?.name || name || email.split('@')[0];
      
      await fastify.redis.hset(activeCollaboratorsKey, userId, JSON.stringify({
        name: userName,
        email: collaborator?.email || email,
        status: presenceData.status,
        lastActive: now,
        cursor: presenceData.cursor,
        selection: presenceData.selection,
      }));
      
      // Set expiry for presence data (30 minutes)
      await fastify.redis.expire(activeCollaboratorsKey, 1800);
      
      // Publish presence update event
      await fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:presence:updated',
        documentId,
        userId,
        userName,
        presence: presenceData,
        timestamp: now,
      }));
      
      return { success: true };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Submit document operation (for collaborative editing)
  fastify.post('/documents/:id/operations', {
    onRequest: [fastify.authenticate],
    schema: {
      params: documentParamsSchema,
      body: Type.Array(operationSchema),
    },
  }, async (request: FastifyRequest<{ 
    Params: typeof documentParamsSchema.static,
    Body: typeof operationSchema.static[] 
  }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id: documentId } = request.params;
    const operations = request.body;
    
    try {
      // Check if user has access to this document
      const document = await fastify.db.collection('documents').findOne({
        _id: new fastify.mongo.ObjectId(documentId),
        'collaborators.id': userId,
      });
      
      if (!document) {
        return reply.code(404).send({ error: 'Document not found or access denied' });
      }
      
      // In a real implementation, we would apply the operations to the document
      // and handle conflict resolution. For this demo, we'll just publish the operations.
      
      // Publish operations event
      await fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:operations',
        documentId,
        userId,
        operations,
        timestamp: new Date().toISOString(),
      }));
      
      return { success: true };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Get document version history
  fastify.get('/documents/:id/history', {
    onRequest: [fastify.authenticate],
    schema: {
      params: documentParamsSchema,
    },
  }, async (request: FastifyRequest<{ Params: typeof documentParamsSchema.static }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id: documentId } = request.params;
    
    try {
      // Check if user has access to this document
      const document = await fastify.db.collection('documents').findOne({
        _id: new fastify.mongo.ObjectId(documentId),
        'collaborators.id': userId,
      });
      
      if (!document) {
        return reply.code(404).send({ error: 'Document not found or access denied' });
      }
      
      // Get document history from database
      const history = await fastify.db.collection('document_history')
        .find({ documentId: new fastify.mongo.ObjectId(documentId) })
        .sort({ timestamp: -1 })
        .limit(20)
        .toArray();
      
      return history.map((entry: any) => ({
        id: entry._id.toString(),
        userId: entry.userId,
        userName: entry.userName,
        operation: entry.operation,
        timestamp: entry.timestamp.toISOString(),
        version: entry.version,
      }));
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}