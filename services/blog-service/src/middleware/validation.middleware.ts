import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Middleware to validate blog post title
 */
export const validatePostTitle = async (
  request: FastifyRequest<{ Body: { title: string } }>,
  reply: FastifyReply
) => {
  const { title } = request.body;
  
  if (!title || title.trim().length === 0) {
    return reply.code(400).send({ error: 'Post title is required' });
  }
  
  if (title.length > 255) {
    return reply.code(400).send({ error: 'Post title cannot exceed 255 characters' });
  }
  
  // Check for invalid characters
  const invalidChars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|'];
  if (invalidChars.some(char => title.includes(char))) {
    return reply.code(400).send({ 
      error: 'Invalid post title. Post titles cannot contain /, \\, :, *, ?, ", <, >, |' 
    });
  }
};

/**
 * Middleware to validate blog post content
 */
export const validatePostContent = async (
  request: FastifyRequest<{ Body: { content: string } }>,
  reply: FastifyReply
) => {
  const { content } = request.body;
  
  if (!content || content.trim().length === 0) {
    return reply.code(400).send({ error: 'Post content is required' });
  }
  
  if (content.length > 100000) { // 100KB limit
    return reply.code(413).send({ error: 'Post content exceeds the maximum size of 100KB' });
  }
};

/**
 * Middleware to validate blog post excerpt
 */
export const validatePostExcerpt = async (
  request: FastifyRequest<{ Body: { excerpt: string } }>,
  reply: FastifyReply
) => {
  const { excerpt } = request.body;
  
  if (!excerpt || excerpt.trim().length === 0) {
    return reply.code(400).send({ error: 'Post excerpt is required' });
  }
  
  if (excerpt.length > 500) {
    return reply.code(400).send({ error: 'Post excerpt cannot exceed 500 characters' });
  }
};

/**
 * Middleware to validate comment content
 */
export const validateCommentContent = async (
  request: FastifyRequest<{ Body: { content: string } }>,
  reply: FastifyReply
) => {
  const { content } = request.body;
  
  if (!content || content.trim().length === 0) {
    return reply.code(400).send({ error: 'Comment content is required' });
  }
  
  if (content.length > 2000) {
    return reply.code(400).send({ error: 'Comment content cannot exceed 2000 characters' });
  }
};

/**
 * Middleware to validate commenter name
 */
export const validateCommenterName = async (
  request: FastifyRequest<{ Body: { name: string } }>,
  reply: FastifyReply
) => {
  const { name } = request.body;
  
  if (!name || name.trim().length === 0) {
    return reply.code(400).send({ error: 'Commenter name is required' });
  }
  
  if (name.length > 100) {
    return reply.code(400).send({ error: 'Commenter name cannot exceed 100 characters' });
  }
};

/**
 * Middleware to validate commenter email
 */
export const validateCommenterEmail = async (
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) => {
  const { email } = request.body;
  
  if (!email || email.trim().length === 0) {
    return reply.code(400).send({ error: 'Commenter email is required' });
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return reply.code(400).send({ error: 'Invalid email format' });
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
