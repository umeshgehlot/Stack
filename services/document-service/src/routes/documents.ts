import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Type } from '@sinclair/typebox';

// Define request/response schemas for validation
const documentCreateSchema = Type.Object({
  title: Type.String(),
  content: Type.Optional(Type.String()),
});

const documentUpdateSchema = Type.Object({
  title: Type.Optional(Type.String()),
  content: Type.Optional(Type.String()),
});

const documentParamsSchema = Type.Object({
  id: Type.String(),
});

const documentResponseSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  content: Type.Optional(Type.String()),
  createdBy: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  collaborators: Type.Array(Type.Object({
    id: Type.String(),
    name: Type.String(),
    email: Type.String(),
  })),
});

// Define route handler
export default async function documentRoutes(fastify: FastifyInstance) {
  // Create a new document
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: documentCreateSchema,
      response: {
        201: documentResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ Body: typeof documentCreateSchema.static }>, reply: FastifyReply) => {
    const { id: userId, email } = request.user as { id: string, email: string };
    const { title, content = '' } = request.body;
    
    try {
      // Get user details from auth service (in a real app)
      // For demo, we'll use the email as the name
      const userName = email.split('@')[0];
      
      // Create document
      const now = new Date();
      const result = await fastify.db.collection('documents').insertOne({
        title,
        content,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
        collaborators: [{ id: userId, name: userName, email }],
        version: 1,
      });
      
      // Publish document creation event
      await fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:created',
        documentId: result.insertedId.toString(),
        userId,
        timestamp: now.toISOString(),
      }));
      
      const document = await fastify.db.collection('documents').findOne(
        { _id: result.insertedId }
      );
      
      return reply.code(201).send({
        id: document._id.toString(),
        title: document.title,
        content: document.content,
        createdBy: document.createdBy,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
        collaborators: document.collaborators,
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Get all documents for current user
  fastify.get('/', {
    onRequest: [fastify.authenticate],
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          title: Type.String(),
          createdBy: Type.String(),
          updatedAt: Type.String({ format: 'date-time' }),
          collaborators: Type.Array(Type.Object({
            id: Type.String(),
            name: Type.String(),
            email: Type.String(),
          })),
        })),
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    
    try {
      const documents = await fastify.db.collection('documents')
        .find({ 'collaborators.id': userId })
        .sort({ updatedAt: -1 })
        .project({ content: 0 }) // Exclude content for performance
        .toArray();
      
      return documents.map(doc => ({
        id: doc._id.toString(),
        title: doc.title,
        createdBy: doc.createdBy,
        updatedAt: doc.updatedAt.toISOString(),
        collaborators: doc.collaborators,
      }));
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Get document by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: documentParamsSchema,
      response: {
        200: documentResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ Params: typeof documentParamsSchema.static }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    
    try {
      const document = await fastify.db.collection('documents').findOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      if (!document) {
        return reply.code(404).send({ error: 'Document not found' });
      }
      
      // Check if user has access to this document
      const hasAccess = document.collaborators.some((collab: any) => collab.id === userId);
      if (!hasAccess) {
        return reply.code(403).send({ error: 'Access denied' });
      }
      
      // Track document view for analytics
      await fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:viewed',
        documentId: id,
        userId,
        timestamp: new Date().toISOString(),
      }));
      
      return {
        id: document._id.toString(),
        title: document.title,
        content: document.content,
        createdBy: document.createdBy,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
        collaborators: document.collaborators,
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Update document by ID
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: documentParamsSchema,
      body: documentUpdateSchema,
      response: {
        200: documentResponseSchema,
      },
    },
  }, async (request: FastifyRequest<{ 
    Params: typeof documentParamsSchema.static,
    Body: typeof documentUpdateSchema.static 
  }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    const updates = request.body;
    
    try {
      const document = await fastify.db.collection('documents').findOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      if (!document) {
        return reply.code(404).send({ error: 'Document not found' });
      }
      
      // Check if user has access to this document
      const hasAccess = document.collaborators.some((collab: any) => collab.id === userId);
      if (!hasAccess) {
        return reply.code(403).send({ error: 'Access denied' });
      }
      
      // Update document
      const updateData: any = {
        ...updates,
        updatedAt: new Date(),
        version: document.version + 1,
      };
      
      const result = await fastify.db.collection('documents').findOneAndUpdate(
        { _id: new fastify.mongo.ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      // Publish document update event
      await fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:updated',
        documentId: id,
        userId,
        timestamp: new Date().toISOString(),
        changes: updates,
      }));
      
      const updatedDoc = result.value;
      
      return {
        id: updatedDoc._id.toString(),
        title: updatedDoc.title,
        content: updatedDoc.content,
        createdBy: updatedDoc.createdBy,
        createdAt: updatedDoc.createdAt.toISOString(),
        updatedAt: updatedDoc.updatedAt.toISOString(),
        collaborators: updatedDoc.collaborators,
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Delete document by ID
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: documentParamsSchema,
    },
  }, async (request: FastifyRequest<{ Params: typeof documentParamsSchema.static }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    
    try {
      const document = await fastify.db.collection('documents').findOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      if (!document) {
        return reply.code(404).send({ error: 'Document not found' });
      }
      
      // Check if user is the creator of the document
      if (document.createdBy !== userId) {
        return reply.code(403).send({ error: 'Only the document creator can delete it' });
      }
      
      await fastify.db.collection('documents').deleteOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      // Publish document deletion event
      await fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:deleted',
        documentId: id,
        userId,
        timestamp: new Date().toISOString(),
      }));
      
      return reply.code(204).send();
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  // Add collaborator to document
  fastify.post('/:id/collaborators', {
    onRequest: [fastify.authenticate],
    schema: {
      params: documentParamsSchema,
      body: Type.Object({
        email: Type.String({ format: 'email' }),
      }),
    },
  }, async (request: FastifyRequest<{ 
    Params: typeof documentParamsSchema.static,
    Body: { email: string } 
  }>, reply: FastifyReply) => {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    const { email } = request.body;
    
    try {
      const document = await fastify.db.collection('documents').findOne({
        _id: new fastify.mongo.ObjectId(id),
      });
      
      if (!document) {
        return reply.code(404).send({ error: 'Document not found' });
      }
      
      // Check if user has access to this document
      const hasAccess = document.collaborators.some((collab: any) => collab.id === userId);
      if (!hasAccess) {
        return reply.code(403).send({ error: 'Access denied' });
      }
      
      // In a real app, we would look up the user by email in the auth service
      // For demo purposes, we'll create a mock user
      const collaboratorName = email.split('@')[0];
      const collaboratorId = `user-${Date.now()}`;
      
      // Check if user is already a collaborator
      const isAlreadyCollaborator = document.collaborators.some(
        (collab: any) => collab.email === email
      );
      
      if (isAlreadyCollaborator) {
        return reply.code(400).send({ error: 'User is already a collaborator' });
      }
      
      // Add collaborator
      await fastify.db.collection('documents').updateOne(
        { _id: new fastify.mongo.ObjectId(id) },
        { 
          $push: { 
            collaborators: { 
              id: collaboratorId, 
              name: collaboratorName, 
              email 
            } 
          },
          $set: { updatedAt: new Date() }
        }
      );
      
      // Publish collaborator added event
      await fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:collaborator:added',
        documentId: id,
        userId,
        collaboratorId,
        collaboratorEmail: email,
        timestamp: new Date().toISOString(),
      }));
      
      return reply.code(200).send({ success: true });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}