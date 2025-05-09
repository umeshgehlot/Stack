import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { PostController } from '../controllers/post.controller';

// Define request/response schemas for validation
const postCreateSchema = Type.Object({
  title: Type.String(),
  excerpt: Type.String(),
  content: Type.String(),
  image: Type.String(),
  readTime: Type.String(),
  category: Type.String(),
  tags: Type.Array(Type.String()),
  featured: Type.Optional(Type.Boolean()),
  published: Type.Optional(Type.Boolean())
});

const postUpdateSchema = Type.Object({
  title: Type.Optional(Type.String()),
  excerpt: Type.Optional(Type.String()),
  content: Type.Optional(Type.String()),
  image: Type.Optional(Type.String()),
  readTime: Type.Optional(Type.String()),
  category: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String())),
  featured: Type.Optional(Type.Boolean()),
  published: Type.Optional(Type.Boolean())
});

const commentCreateSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  content: Type.String(),
  title: Type.Optional(Type.String())
});

const commentUpdateSchema = Type.Object({
  approved: Type.Boolean()
});

const postParamsSchema = Type.Object({
  id: Type.String()
});

const slugParamsSchema = Type.Object({
  slug: Type.String()
});

const commentParamsSchema = Type.Object({
  id: Type.String(),
  commentId: Type.String()
});

const postQuerySchema = Type.Object({
  category: Type.Optional(Type.String()),
  tag: Type.Optional(Type.String()),
  featured: Type.Optional(Type.Boolean()),
  published: Type.Optional(Type.Boolean()),
  authorId: Type.Optional(Type.String()),
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Number()),
  page: Type.Optional(Type.Number())
});

// Define route handler
export default async function postRoutes(fastify: FastifyInstance) {
  const postController = new PostController(fastify);

  // Get all posts with filtering and pagination
  fastify.get('/', {
    schema: {
      querystring: postQuerySchema,
      response: {
        200: Type.Object({
          posts: Type.Array(Type.Object({
            id: Type.String(),
            title: Type.String(),
            slug: Type.String(),
            excerpt: Type.String(),
            image: Type.String(),
            author: Type.Object({
              id: Type.String(),
              name: Type.String(),
              avatar: Type.String(),
              title: Type.String()
            }),
            date: Type.String({ format: 'date-time' }),
            readTime: Type.String(),
            category: Type.String(),
            tags: Type.Array(Type.String()),
            featured: Type.Boolean(),
            published: Type.Boolean(),
            views: Type.Number(),
            createdAt: Type.String({ format: 'date-time' }),
            updatedAt: Type.String({ format: 'date-time' })
          })),
          total: Type.Number(),
          page: Type.Number(),
          limit: Type.Number(),
          totalPages: Type.Number()
        })
      }
    }
  }, (request, reply) => postController.getPosts(request, reply));

  // Get featured posts
  fastify.get('/featured', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          title: Type.String(),
          slug: Type.String(),
          excerpt: Type.String(),
          image: Type.String(),
          author: Type.Object({
            id: Type.String(),
            name: Type.String(),
            avatar: Type.String(),
            title: Type.String()
          }),
          date: Type.String({ format: 'date-time' }),
          readTime: Type.String(),
          category: Type.String(),
          tags: Type.Array(Type.String()),
          featured: Type.Boolean(),
          published: Type.Boolean(),
          views: Type.Number(),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        }))
      }
    }
  }, (request, reply) => postController.getFeaturedPosts(request, reply));

  // Get post by slug
  fastify.get('/:slug', {
    schema: {
      params: slugParamsSchema,
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          slug: Type.String(),
          excerpt: Type.String(),
          content: Type.String(),
          image: Type.String(),
          author: Type.Object({
            id: Type.String(),
            name: Type.String(),
            avatar: Type.String(),
            title: Type.String()
          }),
          date: Type.String({ format: 'date-time' }),
          readTime: Type.String(),
          category: Type.String(),
          tags: Type.Array(Type.String()),
          featured: Type.Boolean(),
          published: Type.Boolean(),
          views: Type.Number(),
          comments: Type.Array(Type.Object({
            id: Type.String(),
            name: Type.String(),
            email: Type.String(),
            content: Type.String(),
            title: Type.Optional(Type.String()),
            approved: Type.Boolean(),
            createdAt: Type.String({ format: 'date-time' }),
            updatedAt: Type.String({ format: 'date-time' })
          })),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        })
      }
    }
  }, (request, reply) => postController.getPostBySlug(request, reply));

  // Create a new post
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: postCreateSchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          title: Type.String(),
          slug: Type.String(),
          excerpt: Type.String(),
          content: Type.String(),
          image: Type.String(),
          author: Type.Object({
            id: Type.String(),
            name: Type.String(),
            avatar: Type.String(),
            title: Type.String()
          }),
          date: Type.String({ format: 'date-time' }),
          readTime: Type.String(),
          category: Type.String(),
          tags: Type.Array(Type.String()),
          featured: Type.Boolean(),
          published: Type.Boolean(),
          views: Type.Number(),
          comments: Type.Array(Type.Object({
            id: Type.String(),
            name: Type.String(),
            email: Type.String(),
            content: Type.String(),
            title: Type.Optional(Type.String()),
            approved: Type.Boolean(),
            createdAt: Type.String({ format: 'date-time' }),
            updatedAt: Type.String({ format: 'date-time' })
          })),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        })
      }
    }
  }, (request, reply) => postController.createPost(request, reply));

  // Update a post
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: postParamsSchema,
      body: postUpdateSchema,
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          slug: Type.String(),
          excerpt: Type.String(),
          content: Type.String(),
          image: Type.String(),
          author: Type.Object({
            id: Type.String(),
            name: Type.String(),
            avatar: Type.String(),
            title: Type.String()
          }),
          date: Type.String({ format: 'date-time' }),
          readTime: Type.String(),
          category: Type.String(),
          tags: Type.Array(Type.String()),
          featured: Type.Boolean(),
          published: Type.Boolean(),
          views: Type.Number(),
          comments: Type.Array(Type.Object({
            id: Type.String(),
            name: Type.String(),
            email: Type.String(),
            content: Type.String(),
            title: Type.Optional(Type.String()),
            approved: Type.Boolean(),
            createdAt: Type.String({ format: 'date-time' }),
            updatedAt: Type.String({ format: 'date-time' })
          })),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        })
      }
    }
  }, (request, reply) => postController.updatePost(request, reply));

  // Delete a post
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: postParamsSchema
    }
  }, (request, reply) => postController.deletePost(request, reply));

  // Add a comment to a post
  fastify.post('/:slug/comments', {
    schema: {
      params: slugParamsSchema,
      body: commentCreateSchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          postId: Type.String(),
          name: Type.String(),
          email: Type.String(),
          content: Type.String(),
          title: Type.Optional(Type.String()),
          approved: Type.Boolean(),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        })
      }
    }
  }, (request, reply) => postController.addComment(request, reply));

  // Update a comment (approve/reject)
  fastify.put('/:id/comments/:commentId', {
    onRequest: [fastify.authenticate],
    schema: {
      params: commentParamsSchema,
      body: commentUpdateSchema,
      response: {
        200: Type.Object({
          id: Type.String(),
          postId: Type.String(),
          name: Type.String(),
          email: Type.String(),
          content: Type.String(),
          title: Type.Optional(Type.String()),
          approved: Type.Boolean(),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        })
      }
    }
  }, (request, reply) => postController.updateComment(request, reply));

  // Delete a comment
  fastify.delete('/:id/comments/:commentId', {
    onRequest: [fastify.authenticate],
    schema: {
      params: commentParamsSchema
    }
  }, (request, reply) => postController.deleteComment(request, reply));

  // Get related posts
  fastify.get('/:slug/related', {
    schema: {
      params: slugParamsSchema,
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          title: Type.String(),
          slug: Type.String(),
          excerpt: Type.String(),
          image: Type.String(),
          author: Type.Object({
            id: Type.String(),
            name: Type.String(),
            avatar: Type.String(),
            title: Type.String()
          }),
          date: Type.String({ format: 'date-time' }),
          readTime: Type.String(),
          category: Type.String(),
          tags: Type.Array(Type.String()),
          featured: Type.Boolean(),
          published: Type.Boolean(),
          views: Type.Number(),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        }))
      }
    }
  }, (request, reply) => postController.getRelatedPosts(request, reply));

  // Get categories with post counts
  fastify.get('/categories', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          name: Type.String(),
          count: Type.Number()
        }))
      }
    }
  }, (request, reply) => postController.getCategories(request, reply));

  // Get tags with post counts
  fastify.get('/tags', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          name: Type.String(),
          count: Type.Number()
        }))
      }
    }
  }, (request, reply) => postController.getTags(request, reply));
}
