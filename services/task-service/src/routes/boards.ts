import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { BoardController } from '../controllers/board.controller';

// Define request/response schemas for validation
const boardCreateSchema = Type.Object({
  name: Type.String(),
  description: Type.Optional(Type.String()),
  teamId: Type.Optional(Type.String()),
  visibility: Type.Optional(Type.Enum({ private: 'private', team: 'team', public: 'public' })),
  background: Type.Optional(Type.Object({
    type: Type.Enum({ color: 'color', image: 'image' }),
    value: Type.String()
  })),
  columns: Type.Optional(Type.Array(Type.Object({
    name: Type.String(),
    position: Type.Number(),
    taskLimit: Type.Optional(Type.Number()),
    color: Type.Optional(Type.String())
  })))
});

const boardUpdateSchema = Type.Object({
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  teamId: Type.Optional(Type.String()),
  visibility: Type.Optional(Type.Enum({ private: 'private', team: 'team', public: 'public' })),
  background: Type.Optional(Type.Object({
    type: Type.Enum({ color: 'color', image: 'image' }),
    value: Type.String()
  }))
});

const columnCreateSchema = Type.Object({
  name: Type.String(),
  position: Type.Number(),
  taskLimit: Type.Optional(Type.Number()),
  color: Type.Optional(Type.String())
});

const columnUpdateSchema = Type.Object({
  name: Type.Optional(Type.String()),
  position: Type.Optional(Type.Number()),
  taskLimit: Type.Optional(Type.Number()),
  color: Type.Optional(Type.String())
});

const labelCreateSchema = Type.Object({
  name: Type.String(),
  color: Type.String()
});

const memberAddSchema = Type.Object({
  userId: Type.String(),
  role: Type.Enum({ admin: 'admin', member: 'member', viewer: 'viewer' })
});

const boardParamsSchema = Type.Object({
  id: Type.String()
});

const columnParamsSchema = Type.Object({
  id: Type.String(),
  columnId: Type.String()
});

const boardQuerySchema = Type.Object({
  teamId: Type.Optional(Type.String()),
  ownerId: Type.Optional(Type.String()),
  visibility: Type.Optional(Type.Enum({ private: 'private', team: 'team', public: 'public' })),
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Number()),
  page: Type.Optional(Type.Number())
});

// Board response schemas
const columnSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  position: Type.Number(),
  taskLimit: Type.Optional(Type.Number()),
  taskCount: Type.Number(),
  color: Type.Optional(Type.String()),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

const labelSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  color: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

const customFieldSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  type: Type.String(),
  required: Type.Boolean(),
  options: Type.Optional(Type.Array(Type.Object({
    id: Type.String(),
    label: Type.String(),
    color: Type.Optional(Type.String())
  }))),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

const boardMemberSchema = Type.Object({
  userId: Type.String(),
  userName: Type.String(),
  userAvatar: Type.Optional(Type.String()),
  role: Type.String(),
  joinedAt: Type.String({ format: 'date-time' })
});

const boardResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  ownerId: Type.String(),
  ownerName: Type.String(),
  teamId: Type.Optional(Type.String()),
  teamName: Type.Optional(Type.String()),
  visibility: Type.String(),
  background: Type.Optional(Type.Object({
    type: Type.String(),
    value: Type.String()
  })),
  columns: Type.Array(columnSchema),
  labels: Type.Array(labelSchema),
  customFields: Type.Array(customFieldSchema),
  members: Type.Array(boardMemberSchema),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

const boardsResponseSchema = Type.Object({
  boards: Type.Array(boardResponseSchema),
  total: Type.Number(),
  page: Type.Number(),
  limit: Type.Number(),
  totalPages: Type.Number()
});

// Define route handler
export default async function boardRoutes(fastify: FastifyInstance) {
  const boardController = new BoardController(fastify);

  // Get all boards with filtering and pagination
  fastify.get('/', {
    onRequest: [fastify.authenticate],
    schema: {
      querystring: boardQuerySchema,
      response: {
        200: boardsResponseSchema
      }
    }
  }, (request, reply) => boardController.getBoards(request, reply));

  // Get board by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: boardParamsSchema,
      response: {
        200: boardResponseSchema
      }
    }
  }, (request, reply) => boardController.getBoardById(request, reply));

  // Create a new board
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: boardCreateSchema,
      response: {
        201: boardResponseSchema
      }
    }
  }, (request, reply) => boardController.createBoard(request, reply));

  // Update a board
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: boardParamsSchema,
      body: boardUpdateSchema,
      response: {
        200: boardResponseSchema
      }
    }
  }, (request, reply) => boardController.updateBoard(request, reply));

  // Delete a board
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: boardParamsSchema
    }
  }, (request, reply) => boardController.deleteBoard(request, reply));

  // Add a column to a board
  fastify.post('/:id/columns', {
    onRequest: [fastify.authenticate],
    schema: {
      params: boardParamsSchema,
      body: columnCreateSchema,
      response: {
        201: columnSchema
      }
    }
  }, (request, reply) => boardController.addColumn(request, reply));

  // Update a column
  fastify.put('/:id/columns/:columnId', {
    onRequest: [fastify.authenticate],
    schema: {
      params: columnParamsSchema,
      body: columnUpdateSchema,
      response: {
        200: columnSchema
      }
    }
  }, (request, reply) => boardController.updateColumn(request, reply));

  // Delete a column
  fastify.delete('/:id/columns/:columnId', {
    onRequest: [fastify.authenticate],
    schema: {
      params: columnParamsSchema
    }
  }, (request, reply) => boardController.deleteColumn(request, reply));

  // Add a label to a board
  fastify.post('/:id/labels', {
    onRequest: [fastify.authenticate],
    schema: {
      params: boardParamsSchema,
      body: labelCreateSchema,
      response: {
        201: labelSchema
      }
    }
  }, (request, reply) => boardController.addLabel(request, reply));

  // Add a member to a board
  fastify.post('/:id/members', {
    onRequest: [fastify.authenticate],
    schema: {
      params: boardParamsSchema,
      body: memberAddSchema,
      response: {
        201: boardMemberSchema
      }
    }
  }, (request, reply) => boardController.addMember(request, reply));
}
