import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { TaskController } from '../controllers/task.controller';

// Define request/response schemas for validation
const taskCreateSchema = Type.Object({
  title: Type.String(),
  description: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
  priority: Type.Optional(Type.Enum({ low: 'low', medium: 'medium', high: 'high', urgent: 'urgent' })),
  dueDate: Type.Optional(Type.String({ format: 'date-time' })),
  assigneeId: Type.Optional(Type.String()),
  boardId: Type.String(),
  columnId: Type.String(),
  position: Type.Optional(Type.Number()),
  labels: Type.Optional(Type.Array(Type.String()))
});

const taskUpdateSchema = Type.Object({
  title: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
  priority: Type.Optional(Type.Enum({ low: 'low', medium: 'medium', high: 'high', urgent: 'urgent' })),
  dueDate: Type.Optional(Type.String({ format: 'date-time' })),
  assigneeId: Type.Optional(Type.String()),
  boardId: Type.Optional(Type.String()),
  columnId: Type.Optional(Type.String()),
  position: Type.Optional(Type.Number()),
  labels: Type.Optional(Type.Array(Type.String()))
});

const commentCreateSchema = Type.Object({
  text: Type.String(),
  mentions: Type.Optional(Type.Array(Type.String())),
  attachments: Type.Optional(Type.Array(Type.Object({
    name: Type.String(),
    url: Type.String(),
    type: Type.String(),
    size: Type.Number()
  })))
});

const commentUpdateSchema = Type.Object({
  text: Type.String(),
  mentions: Type.Optional(Type.Array(Type.String()))
});

const taskParamsSchema = Type.Object({
  id: Type.String()
});

const commentParamsSchema = Type.Object({
  id: Type.String(),
  commentId: Type.String()
});

const taskQuerySchema = Type.Object({
  boardId: Type.Optional(Type.String()),
  columnId: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
  priority: Type.Optional(Type.Enum({ low: 'low', medium: 'medium', high: 'high', urgent: 'urgent' })),
  assigneeId: Type.Optional(Type.String()),
  creatorId: Type.Optional(Type.String()),
  dueDate: Type.Optional(Type.String()),
  search: Type.Optional(Type.String()),
  labels: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Number()),
  page: Type.Optional(Type.Number())
});

// Task response schema
const taskResponseSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  status: Type.String(),
  priority: Type.String(),
  dueDate: Type.Optional(Type.String({ format: 'date-time' })),
  assigneeId: Type.Optional(Type.String()),
  assigneeName: Type.Optional(Type.String()),
  assigneeAvatar: Type.Optional(Type.String()),
  creatorId: Type.String(),
  creatorName: Type.String(),
  creatorAvatar: Type.Optional(Type.String()),
  boardId: Type.String(),
  columnId: Type.String(),
  position: Type.Number(),
  labels: Type.Array(Type.String()),
  attachments: Type.Array(Type.Object({
    id: Type.String(),
    name: Type.String(),
    url: Type.String(),
    type: Type.String(),
    size: Type.Number(),
    createdAt: Type.String({ format: 'date-time' }),
    createdBy: Type.String()
  })),
  checklists: Type.Array(Type.Object({
    id: Type.String(),
    title: Type.String(),
    items: Type.Array(Type.Object({
      id: Type.String(),
      text: Type.String(),
      completed: Type.Boolean(),
      assigneeId: Type.Optional(Type.String()),
      dueDate: Type.Optional(Type.String({ format: 'date-time' })),
      createdAt: Type.String({ format: 'date-time' }),
      updatedAt: Type.String({ format: 'date-time' })
    })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' })
  })),
  comments: Type.Array(Type.Object({
    id: Type.String(),
    text: Type.String(),
    authorId: Type.String(),
    authorName: Type.String(),
    authorAvatar: Type.Optional(Type.String()),
    mentions: Type.Array(Type.String()),
    attachments: Type.Array(Type.Object({
      id: Type.String(),
      name: Type.String(),
      url: Type.String(),
      type: Type.String(),
      size: Type.Number(),
      createdAt: Type.String({ format: 'date-time' }),
      createdBy: Type.String()
    })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' })
  })),
  customFields: Type.Array(Type.Object({
    id: Type.String(),
    name: Type.String(),
    type: Type.String(),
    value: Type.Any()
  })),
  watchers: Type.Array(Type.String()),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

const tasksResponseSchema = Type.Object({
  tasks: Type.Array(taskResponseSchema),
  total: Type.Number(),
  page: Type.Number(),
  limit: Type.Number(),
  totalPages: Type.Number()
});

// Comment response schema
const commentResponseSchema = Type.Object({
  id: Type.String(),
  text: Type.String(),
  authorId: Type.String(),
  authorName: Type.String(),
  authorAvatar: Type.Optional(Type.String()),
  mentions: Type.Array(Type.String()),
  attachments: Type.Array(Type.Object({
    id: Type.String(),
    name: Type.String(),
    url: Type.String(),
    type: Type.String(),
    size: Type.Number(),
    createdAt: Type.String({ format: 'date-time' }),
    createdBy: Type.String()
  })),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

// Define route handler
export default async function taskRoutes(fastify: FastifyInstance) {
  const taskController = new TaskController(fastify);

  // Get all tasks with filtering and pagination
  fastify.get('/', {
    onRequest: [fastify.authenticate],
    schema: {
      querystring: taskQuerySchema,
      response: {
        200: tasksResponseSchema
      }
    }
  }, (request, reply) => taskController.getTasks(request, reply));

  // Get task by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: taskParamsSchema,
      response: {
        200: taskResponseSchema
      }
    }
  }, (request, reply) => taskController.getTaskById(request, reply));

  // Create a new task
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: taskCreateSchema,
      response: {
        201: taskResponseSchema
      }
    }
  }, (request, reply) => taskController.createTask(request, reply));

  // Update a task
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: taskParamsSchema,
      body: taskUpdateSchema,
      response: {
        200: taskResponseSchema
      }
    }
  }, (request, reply) => taskController.updateTask(request, reply));

  // Delete a task
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: taskParamsSchema
    }
  }, (request, reply) => taskController.deleteTask(request, reply));

  // Add a comment to a task
  fastify.post('/:id/comments', {
    onRequest: [fastify.authenticate],
    schema: {
      params: taskParamsSchema,
      body: commentCreateSchema,
      response: {
        201: commentResponseSchema
      }
    }
  }, (request, reply) => taskController.addComment(request, reply));

  // Update a comment
  fastify.put('/:id/comments/:commentId', {
    onRequest: [fastify.authenticate],
    schema: {
      params: commentParamsSchema,
      body: commentUpdateSchema,
      response: {
        200: commentResponseSchema
      }
    }
  }, (request, reply) => taskController.updateComment(request, reply));

  // Delete a comment
  fastify.delete('/:id/comments/:commentId', {
    onRequest: [fastify.authenticate],
    schema: {
      params: commentParamsSchema
    }
  }, (request, reply) => taskController.deleteComment(request, reply));
}
