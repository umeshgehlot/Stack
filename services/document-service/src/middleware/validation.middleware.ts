import { FastifyRequest, FastifyReply } from 'fastify';
import { isValidFolderName } from '../models/folder.model';

/**
 * Middleware to validate folder names
 */
export const validateFolderName = async (
  request: FastifyRequest<{ Body: { name: string } }>,
  reply: FastifyReply
) => {
  const { name } = request.body;
  
  if (!isValidFolderName(name)) {
    return reply.code(400).send({ 
      error: 'Invalid folder name. Folder names cannot contain /, \\, :, *, ?, ", <, >, |' 
    });
  }
};

/**
 * Middleware to validate document title
 */
export const validateDocumentTitle = async (
  request: FastifyRequest<{ Body: { title: string } }>,
  reply: FastifyReply
) => {
  const { title } = request.body;
  
  if (!title || title.trim().length === 0) {
    return reply.code(400).send({ error: 'Document title is required' });
  }
  
  if (title.length > 255) {
    return reply.code(400).send({ error: 'Document title cannot exceed 255 characters' });
  }
  
  // Check for invalid characters
  const invalidChars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|'];
  if (invalidChars.some(char => title.includes(char))) {
    return reply.code(400).send({ 
      error: 'Invalid document title. Document titles cannot contain /, \\, :, *, ?, ", <, >, |' 
    });
  }
};

/**
 * Middleware to validate sharing permissions
 */
export const validateSharingPermission = async (
  request: FastifyRequest<{ Body: { permission: string } }>,
  reply: FastifyReply
) => {
  const { permission } = request.body;
  
  if (!permission) {
    return reply.code(400).send({ error: 'Permission is required' });
  }
  
  const validPermissions = ['read', 'write', 'admin'];
  if (!validPermissions.includes(permission)) {
    return reply.code(400).send({ 
      error: 'Invalid permission. Permission must be one of: read, write, admin' 
    });
  }
};

/**
 * Middleware to validate document content size
 */
export const validateDocumentSize = async (
  request: FastifyRequest<{ Body: { content: string } }>,
  reply: FastifyReply
) => {
  const { content } = request.body;
  
  if (content && Buffer.from(content).length > 10 * 1024 * 1024) { // 10MB limit
    return reply.code(413).send({ error: 'Document content exceeds the maximum size of 10MB' });
  }
};

/**
 * Middleware to validate ObjectId format
 */
export const validateObjectId = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return reply.code(400).send({ error: 'Invalid ID format' });
  }
};
