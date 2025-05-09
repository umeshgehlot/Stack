import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ObjectId } from 'mongodb';
import { 
  Document, 
  CreateDocumentDto, 
  UpdateDocumentDto, 
  ShareDocumentDto,
  calculateDocumentSize,
  getFileType
} from '../models/document.model';

/**
 * Controller for document operations
 */
export class DocumentController {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * Create a new document
   */
  async createDocument(
    request: FastifyRequest<{ Body: CreateDocumentDto }>,
    reply: FastifyReply
  ) {
    const { id: userId, email, name = email.split('@')[0] } = request.user as { id: string; email: string; name?: string };
    const { title, content = '', folderId = null, fileType, metadata } = request.body;

    try {
      // Check if folder exists (if specified)
      if (folderId) {
        const folder = await this.fastify.db.collection('folders').findOne({
          _id: new ObjectId(folderId),
          $or: [
            { createdBy: userId },
            { 'sharedWith.userId': userId }
          ]
        });

        if (!folder) {
          return reply.code(404).send({ error: 'Folder not found' });
        }

        // Check if user has write permission on folder
        if (folder.createdBy !== userId) {
          const userPermission = folder.sharedWith.find(
            (share: any) => share.userId === userId
          )?.permission;

          if (!userPermission || userPermission === 'read') {
            return reply.code(403).send({ error: 'You do not have permission to create documents in this folder' });
          }
        }
      }

      // Check if document with same name already exists in the same folder
      const existingDocument = await this.fastify.db.collection('documents').findOne({
        title,
        folderId: folderId || null,
        $or: [
          { createdBy: userId },
          { 'collaborators.id': userId }
        ]
      });

      if (existingDocument) {
        return reply.code(409).send({ error: 'A document with this name already exists in this location' });
      }

      // Calculate document size
      const size = calculateDocumentSize(content);

      // Create the document
      const now = new Date();
      const document: Document = {
        title,
        content,
        folderId: folderId || null,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
        lastAccessedAt: now,
        size,
        fileType: fileType || 'text/plain',
        version: 1,
        isShared: false,
        collaborators: [{
          id: userId,
          name,
          email,
          permission: 'admin'
        }],
        metadata
      };

      const result = await this.fastify.db.collection('documents').insertOne(document);
      
      // Publish document creation event
      await this.fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:created',
        documentId: result.insertedId.toString(),
        userId,
        folderId,
        timestamp: now.toISOString(),
      }));

      // Return the created document
      const createdDocument = await this.fastify.db.collection('documents').findOne({
        _id: result.insertedId
      });

      return reply.code(201).send({
        ...createdDocument,
        id: createdDocument._id.toString()
      });
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Get all documents for the current user
   */
  async getDocuments(
    request: FastifyRequest<{ Querystring: { folderId?: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { folderId } = request.query;

    try {
      // Find documents that the user created or has access to
      const query: any = {
        $or: [
          { createdBy: userId },
          { 'collaborators.id': userId }
        ]
      };

      // Filter by folder if specified
      if (folderId !== undefined) {
        query.folderId = folderId || null; // null for documents in root
      }

      const documents = await this.fastify.db.collection('documents')
        .find(query)
        .sort({ updatedAt: -1 })
        .toArray();

      // Map documents to response format
      const formattedDocuments = documents.map(doc => ({
        ...doc,
        id: doc._id.toString(),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
        lastAccessedAt: doc.lastAccessedAt ? doc.lastAccessedAt.toISOString() : null
      }));

      return reply.code(200).send(formattedDocuments);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Get a document by ID
   */
  async getDocumentById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;

    try {
      // Find the document
      const document = await this.fastify.db.collection('documents').findOne({
        _id: new ObjectId(id),
        $or: [
          { createdBy: userId },
          { 'collaborators.id': userId }
        ]
      });

      if (!document) {
        return reply.code(404).send({ error: 'Document not found' });
      }

      // Update last accessed timestamp
      await this.fastify.db.collection('documents').updateOne(
        { _id: new ObjectId(id) },
        { $set: { lastAccessedAt: new Date() } }
      );

      // Format document for response
      const formattedDocument = {
        ...document,
        id: document._id.toString(),
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
        lastAccessedAt: document.lastAccessedAt ? document.lastAccessedAt.toISOString() : null
      };

      return reply.code(200).send(formattedDocument);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Update a document
   */
  async updateDocument(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateDocumentDto }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    const updateData = request.body;

    try {
      // Find the document
      const document = await this.fastify.db.collection('documents').findOne({
        _id: new ObjectId(id)
      });

      if (!document) {
        return reply.code(404).send({ error: 'Document not found' });
      }

      // Check permissions
      const userCollaborator = document.collaborators.find(
        (collab: any) => collab.id === userId
      );

      if (!userCollaborator) {
        return reply.code(403).send({ error: 'You do not have permission to access this document' });
      }

      if (document.createdBy !== userId && (!userCollaborator.permission || userCollaborator.permission === 'read')) {
        return reply.code(403).send({ error: 'You do not have permission to update this document' });
      }

      // Check if document with same name already exists in the same folder
      if (updateData.title && updateData.title !== document.title) {
        const existingDocument = await this.fastify.db.collection('documents').findOne({
          _id: { $ne: new ObjectId(id) },
          title: updateData.title,
          folderId: updateData.folderId || document.folderId,
          $or: [
            { createdBy: userId },
            { 'collaborators.id': userId }
          ]
        });

        if (existingDocument) {
          return reply.code(409).send({ error: 'A document with this name already exists in this location' });
        }
      }

      // Calculate new size if content is updated
      let size = document.size;
      if (updateData.content !== undefined) {
        size = calculateDocumentSize(updateData.content);
      }

      // Prepare update data
      const update: any = {
        ...updateData,
        size,
        updatedAt: new Date(),
        version: document.version + 1
      };

      // Update the document
      await this.fastify.db.collection('documents').updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );

      // Publish document update event
      await this.fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:updated',
        documentId: id,
        userId,
        timestamp: new Date().toISOString(),
      }));

      // Get the updated document
      const updatedDocument = await this.fastify.db.collection('documents').findOne({
        _id: new ObjectId(id)
      });

      // Format document for response
      const formattedDocument = {
        ...updatedDocument,
        id: updatedDocument._id.toString(),
        createdAt: updatedDocument.createdAt.toISOString(),
        updatedAt: updatedDocument.updatedAt.toISOString(),
        lastAccessedAt: updatedDocument.lastAccessedAt ? updatedDocument.lastAccessedAt.toISOString() : null
      };

      return reply.code(200).send(formattedDocument);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;

    try {
      // Find the document
      const document = await this.fastify.db.collection('documents').findOne({
        _id: new ObjectId(id)
      });

      if (!document) {
        return reply.code(404).send({ error: 'Document not found' });
      }

      // Check permissions
      const userCollaborator = document.collaborators.find(
        (collab: any) => collab.id === userId
      );

      if (!userCollaborator) {
        return reply.code(403).send({ error: 'You do not have permission to access this document' });
      }

      if (document.createdBy !== userId && (!userCollaborator.permission || userCollaborator.permission !== 'admin')) {
        return reply.code(403).send({ error: 'You do not have permission to delete this document' });
      }

      // Delete the document
      await this.fastify.db.collection('documents').deleteOne({
        _id: new ObjectId(id)
      });

      // Publish document deletion event
      await this.fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:deleted',
        documentId: id,
        userId,
        timestamp: new Date().toISOString(),
      }));

      return reply.code(204).send();
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Share a document with other users
   */
  async shareDocument(
    request: FastifyRequest<{ Params: { id: string }; Body: ShareDocumentDto }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    const { userIds, permission } = request.body;

    try {
      // Find the document
      const document = await this.fastify.db.collection('documents').findOne({
        _id: new ObjectId(id)
      });

      if (!document) {
        return reply.code(404).send({ error: 'Document not found' });
      }

      // Check permissions
      const userCollaborator = document.collaborators.find(
        (collab: any) => collab.id === userId
      );

      if (!userCollaborator) {
        return reply.code(403).send({ error: 'You do not have permission to access this document' });
      }

      if (document.createdBy !== userId && (!userCollaborator.permission || userCollaborator.permission !== 'admin')) {
        return reply.code(403).send({ error: 'You do not have permission to share this document' });
      }

      // Get user details from user service (in a real app)
      // For demo, we'll use basic info
      const collaborators = [...document.collaborators];
      
      // Update or add users
      for (const shareUserId of userIds) {
        // Skip if trying to share with self
        if (shareUserId === userId) continue;

        const existingCollabIndex = collaborators.findIndex(
          (collab: any) => collab.id === shareUserId
        );

        if (existingCollabIndex >= 0) {
          collaborators[existingCollabIndex].permission = permission;
        } else {
          // In a real app, we would fetch user details from user service
          // For demo, we'll use placeholder data
          collaborators.push({
            id: shareUserId,
            name: `User ${shareUserId.substring(0, 5)}`,
            email: `user-${shareUserId.substring(0, 5)}@example.com`,
            permission
          });
        }
      }

      // Update the document
      await this.fastify.db.collection('documents').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            collaborators,
            isShared: true,
            updatedAt: new Date()
          } 
        }
      );

      // Publish document sharing event
      await this.fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:shared',
        documentId: id,
        userId,
        sharedWith: userIds,
        permission,
        timestamp: new Date().toISOString(),
      }));

      // Get the updated document
      const updatedDocument = await this.fastify.db.collection('documents').findOne({
        _id: new ObjectId(id)
      });

      // Format document for response
      const formattedDocument = {
        ...updatedDocument,
        id: updatedDocument._id.toString(),
        createdAt: updatedDocument.createdAt.toISOString(),
        updatedAt: updatedDocument.updatedAt.toISOString(),
        lastAccessedAt: updatedDocument.lastAccessedAt ? updatedDocument.lastAccessedAt.toISOString() : null
      };

      return reply.code(200).send(formattedDocument);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Remove sharing for a user from a document
   */
  async removeSharing(
    request: FastifyRequest<{ Params: { id: string, userId: string } }>,
    reply: FastifyReply
  ) {
    const { id: currentUserId } = request.user as { id: string };
    const { id, userId: targetUserId } = request.params;

    try {
      // Find the document
      const document = await this.fastify.db.collection('documents').findOne({
        _id: new ObjectId(id)
      });

      if (!document) {
        return reply.code(404).send({ error: 'Document not found' });
      }

      // Check permissions
      const userCollaborator = document.collaborators.find(
        (collab: any) => collab.id === currentUserId
      );

      if (!userCollaborator) {
        return reply.code(403).send({ error: 'You do not have permission to access this document' });
      }

      if (document.createdBy !== currentUserId && (!userCollaborator.permission || userCollaborator.permission !== 'admin')) {
        return reply.code(403).send({ error: 'You do not have permission to modify sharing for this document' });
      }

      // Cannot remove the document owner
      if (targetUserId === document.createdBy) {
        return reply.code(400).send({ error: 'Cannot remove the document owner' });
      }

      // Remove the user from collaborators
      const collaborators = document.collaborators.filter(
        (collab: any) => collab.id !== targetUserId
      );

      // Update isShared flag if no more collaborators (besides owner)
      const isShared = collaborators.length > 1;

      // Update the document
      await this.fastify.db.collection('documents').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            collaborators,
            isShared,
            updatedAt: new Date()
          } 
        }
      );

      // Publish document unsharing event
      await this.fastify.redis.publish('document:events', JSON.stringify({
        type: 'document:unshared',
        documentId: id,
        userId: currentUserId,
        targetUserId,
        timestamp: new Date().toISOString(),
      }));

      return reply.code(204).send();
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Search documents
   */
  async searchDocuments(
    request: FastifyRequest<{ Querystring: { query: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { query } = request.query;

    try {
      if (!query || query.trim().length < 2) {
        return reply.code(400).send({ error: 'Search query must be at least 2 characters' });
      }

      // Create text index if it doesn't exist
      try {
        await this.fastify.db.collection('documents').createIndex({
          title: 'text',
          content: 'text',
          'metadata.tags': 'text',
          'metadata.description': 'text'
        });
      } catch (err) {
        // Index might already exist, continue
      }

      // Search documents that the user has access to
      const documents = await this.fastify.db.collection('documents')
        .find({
          $text: { $search: query },
          $or: [
            { createdBy: userId },
            { 'collaborators.id': userId }
          ]
        })
        .project({
          score: { $meta: 'textScore' },
          content: { $substr: ['$content', 0, 200] } // Only return a preview of content
        })
        .sort({ score: { $meta: 'textScore' } })
        .limit(20)
        .toArray();

      // Format documents for response
      const formattedDocuments = documents.map(doc => ({
        ...doc,
        id: doc._id.toString(),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
        lastAccessedAt: doc.lastAccessedAt ? doc.lastAccessedAt.toISOString() : null,
        contentPreview: doc.content, // This is already limited to 200 chars
        content: undefined // Remove full content from response
      }));

      return reply.code(200).send(formattedDocuments);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Get recent documents
   */
  async getRecentDocuments(
    request: FastifyRequest<{ Querystring: { limit?: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const limit = parseInt(request.query.limit || '5', 10);

    try {
      // Find recent documents that the user accessed
      const documents = await this.fastify.db.collection('documents')
        .find({
          $or: [
            { createdBy: userId },
            { 'collaborators.id': userId }
          ]
        })
        .sort({ lastAccessedAt: -1 })
        .limit(limit)
        .toArray();

      // Format documents for response
      const formattedDocuments = documents.map(doc => ({
        ...doc,
        id: doc._id.toString(),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
        lastAccessedAt: doc.lastAccessedAt ? doc.lastAccessedAt.toISOString() : null
      }));

      return reply.code(200).send(formattedDocuments);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Star/unstar a document
   */
  async toggleStar(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;

    try {
      // Find the document
      const document = await this.fastify.db.collection('documents').findOne({
        _id: new ObjectId(id),
        $or: [
          { createdBy: userId },
          { 'collaborators.id': userId }
        ]
      });

      if (!document) {
        return reply.code(404).send({ error: 'Document not found' });
      }

      // Toggle starred status
      const metadata = document.metadata || {};
      metadata.starred = !metadata.starred;

      // Update the document
      await this.fastify.db.collection('documents').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            metadata,
            updatedAt: new Date()
          } 
        }
      );

      // Get the updated document
      const updatedDocument = await this.fastify.db.collection('documents').findOne({
        _id: new ObjectId(id)
      });

      // Format document for response
      const formattedDocument = {
        ...updatedDocument,
        id: updatedDocument._id.toString(),
        createdAt: updatedDocument.createdAt.toISOString(),
        updatedAt: updatedDocument.updatedAt.toISOString(),
        lastAccessedAt: updatedDocument.lastAccessedAt ? updatedDocument.lastAccessedAt.toISOString() : null
      };

      return reply.code(200).send(formattedDocument);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }
}
