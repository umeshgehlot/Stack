import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { FolderController } from '../controllers/folder.controller';

// Define request/response schemas for validation
const folderCreateSchema = Type.Object({
  name: Type.String(),
  parentId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  metadata: Type.Optional(Type.Object({
    description: Type.Optional(Type.String()),
    color: Type.Optional(Type.String()),
    icon: Type.Optional(Type.String()),
    tags: Type.Optional(Type.Array(Type.String()))
  }))
});

const folderUpdateSchema = Type.Object({
  name: Type.Optional(Type.String()),
  parentId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  isShared: Type.Optional(Type.Boolean()),
  sharedWith: Type.Optional(Type.Array(Type.Object({
    userId: Type.String(),
    permission: Type.Enum({ read: 'read', write: 'write', admin: 'admin' })
  }))),
  metadata: Type.Optional(Type.Object({
    description: Type.Optional(Type.String()),
    color: Type.Optional(Type.String()),
    icon: Type.Optional(Type.String()),
    tags: Type.Optional(Type.Array(Type.String()))
  }))
});

const folderParamsSchema = Type.Object({
  id: Type.String()
});

const folderShareSchema = Type.Object({
  userIds: Type.Array(Type.String()),
  permission: Type.Enum({ read: 'read', write: 'write', admin: 'admin' })
});

const folderResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  parentId: Type.Union([Type.String(), Type.Null()]),
  path: Type.String(),
  createdBy: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  isShared: Type.Boolean(),
  sharedWith: Type.Optional(Type.Array(Type.Object({
    userId: Type.String(),
    permission: Type.Enum({ read: 'read', write: 'write', admin: 'admin' })
  }))),
  metadata: Type.Optional(Type.Object({
    description: Type.Optional(Type.String()),
    color: Type.Optional(Type.String()),
    icon: Type.Optional(Type.String()),
    tags: Type.Optional(Type.Array(Type.String()))
  })),
  documentCount: Type.Number(),
  subfolderCount: Type.Number()
});

const folderQuerySchema = Type.Object({
  parentId: Type.Optional(Type.Union([Type.String(), Type.Null()]))
});

const removeShareParamsSchema = Type.Object({
  id: Type.String(),
  userId: Type.String()
});

// Define route handler
export default async function folderRoutes(fastify: FastifyInstance) {
  const folderController = new FolderController(fastify);

  // Create a new folder
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: folderCreateSchema,
      response: {
        201: folderResponseSchema
      }
    }
  }, (request, reply) => folderController.createFolder(request, reply));

  // Get all folders for current user
  fastify.get('/', {
    onRequest: [fastify.authenticate],
    schema: {
      querystring: folderQuerySchema,
      response: {
        200: Type.Array(folderResponseSchema)
      }
    }
  }, (request, reply) => folderController.getFolders(request, reply));

  // Get a folder by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: folderParamsSchema,
      response: {
        200: folderResponseSchema
      }
    }
  }, (request, reply) => folderController.getFolderById(request, reply));

  // Update a folder
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: folderParamsSchema,
      body: folderUpdateSchema,
      response: {
        200: folderResponseSchema
      }
    }
  }, (request, reply) => folderController.updateFolder(request, reply));

  // Delete a folder
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: folderParamsSchema
    }
  }, (request, reply) => folderController.deleteFolder(request, reply));

  // Share a folder with other users
  fastify.post('/:id/share', {
    onRequest: [fastify.authenticate],
    schema: {
      params: folderParamsSchema,
      body: folderShareSchema,
      response: {
        200: folderResponseSchema
      }
    }
  }, (request, reply) => folderController.shareFolder(request, reply));

  // Remove sharing for a user from a folder
  fastify.delete('/:id/share/:userId', {
    onRequest: [fastify.authenticate],
    schema: {
      params: removeShareParamsSchema
    }
  }, (request, reply) => folderController.removeSharing(request, reply));
}
