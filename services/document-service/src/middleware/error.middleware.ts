import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

// Extended error interface to handle MongoDB and validation errors
interface ExtendedError extends Omit<FastifyError, 'code'> {
  code?: string | number;
  validation?: any[];
}

/**
 * Global error handler middleware for the document service
 */
export const errorHandler = (
  error: ExtendedError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log the error
  request.log.error(error);

  // Handle MongoDB duplicate key error
  if (error.code === '11000' || error.code === 11000) {
    return reply.code(409).send({
      error: 'Duplicate resource',
      message: 'A resource with the same unique identifier already exists',
    });
  }

  // Handle validation errors
  if (error.validation) {
    return reply.code(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation,
    });
  }

  // Handle not found errors
  if (error.statusCode === 404) {
    return reply.code(404).send({
      error: 'Not Found',
      message: error.message || 'The requested resource was not found',
    });
  }

  // Handle unauthorized errors
  if (error.statusCode === 401) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: error.message || 'Authentication is required to access this resource',
    });
  }

  // Handle forbidden errors
  if (error.statusCode === 403) {
    return reply.code(403).send({
      error: 'Forbidden',
      message: error.message || 'You do not have permission to access this resource',
    });
  }

  // Handle payload too large errors
  if (error.statusCode === 413) {
    return reply.code(413).send({
      error: 'Payload Too Large',
      message: error.message || 'The request payload is too large',
    });
  }

  // Handle method not allowed errors
  if (error.statusCode === 405) {
    return reply.code(405).send({
      error: 'Method Not Allowed',
      message: error.message || 'The requested method is not allowed for this resource',
    });
  }

  // Handle bad request errors
  if (error.statusCode === 400) {
    return reply.code(400).send({
      error: 'Bad Request',
      message: error.message || 'The request is invalid or malformed',
    });
  }

  // Default to internal server error
  reply.code(500).send({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred while processing your request',
  });
};
