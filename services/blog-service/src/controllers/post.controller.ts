import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ObjectId } from 'mongodb';
import slugify from 'slugify';
import { 
  BlogPost, 
  Comment,
  CreatePostDto, 
  UpdatePostDto, 
  CreateCommentDto,
  UpdateCommentDto,
  PostQueryParams,
  PostsResponse,
  generateSlug
} from '../models/post.model';

/**
 * Controller for blog post operations
 */
export class PostController {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * Get all blog posts with pagination and filtering
   */
  async getPosts(
    request: FastifyRequest<{ Querystring: PostQueryParams }>,
    reply: FastifyReply
  ): Promise<PostsResponse> {
    const { 
      category, 
      tag, 
      featured, 
      published = true, 
      authorId,
      search,
      limit = 10,
      page = 1
    } = request.query;

    try {
      // Build query
      const query: any = {};
      
      // Only show published posts by default (unless explicitly requested)
      if (published !== undefined) {
        query.published = published;
      }
      
      if (category) {
        query.category = category;
      }
      
      if (tag) {
        query.tags = tag;
      }
      
      if (featured !== undefined) {
        query.featured = featured;
      }
      
      if (authorId) {
        query['author.id'] = authorId;
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get total count
      const total = await this.fastify.db.collection('posts').countDocuments(query);
      
      // Get posts
      const posts = await this.fastify.db.collection('posts')
        .find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      // Calculate total pages
      const totalPages = Math.ceil(total / limit);
      
      // Format response
      const formattedPosts = posts.map(post => ({
        ...post,
        id: post._id.toString(),
        date: post.date.toISOString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }));
      
      return {
        posts: formattedPosts,
        total,
        page,
        limit,
        totalPages
      };
    } catch (err) {
      this.fastify.log.error(err);
      reply.code(500).send({ error: 'Internal Server Error' });
      return {} as PostsResponse; // This will never be reached due to the reply above
    }
  }

  /**
   * Get featured blog posts
   */
  async getFeaturedPosts(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const featuredPosts = await this.fastify.db.collection('posts')
        .find({ featured: true, published: true })
        .sort({ date: -1 })
        .limit(6)
        .toArray();
      
      // Format response
      const formattedPosts = featuredPosts.map(post => ({
        ...post,
        id: post._id.toString(),
        date: post.date.toISOString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }));
      
      return reply.code(200).send(formattedPosts);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Get a blog post by slug
   */
  async getPostBySlug(
    request: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply
  ) {
    const { slug } = request.params;

    try {
      // Find the post
      const post = await this.fastify.db.collection('posts').findOne({ slug });
      
      if (!post) {
        return reply.code(404).send({ error: 'Post not found' });
      }
      
      // Increment view count
      await this.fastify.db.collection('posts').updateOne(
        { _id: post._id },
        { $inc: { views: 1 } }
      );
      
      // Format response
      const formattedPost = {
        ...post,
        id: post._id.toString(),
        date: post.date.toISOString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        comments: post.comments.map((comment: any) => ({
          ...comment,
          id: comment._id.toString(),
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString()
        }))
      };
      
      return reply.code(200).send(formattedPost);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Create a new blog post
   */
  async createPost(
    request: FastifyRequest<{ Body: CreatePostDto }>,
    reply: FastifyReply
  ) {
    const { id: userId, email, name = email.split('@')[0] } = request.user as { id: string; email: string; name?: string };
    const { 
      title, 
      excerpt, 
      content, 
      image, 
      readTime, 
      category, 
      tags, 
      featured = false, 
      published = false 
    } = request.body;

    try {
      // Generate slug
      const slug = slugify(title, { lower: true, strict: true });
      
      // Check if post with same slug already exists
      const existingPost = await this.fastify.db.collection('posts').findOne({ slug });
      
      if (existingPost) {
        return reply.code(409).send({ error: 'A post with this title already exists' });
      }
      
      // Create the post
      const now = new Date();
      const post: BlogPost = {
        title,
        slug,
        excerpt,
        content,
        image,
        author: {
          id: userId,
          name,
          avatar: '', // This would be fetched from user service in a real implementation
          title: '' // This would be fetched from user service in a real implementation
        },
        date: now,
        readTime,
        category,
        tags,
        featured,
        published,
        views: 0,
        comments: [],
        createdAt: now,
        updatedAt: now
      };
      
      const result = await this.fastify.db.collection('posts').insertOne(post);
      
      // Publish post creation event
      await this.fastify.redis.publish('blog:events', JSON.stringify({
        type: 'post:created',
        postId: result.insertedId.toString(),
        userId,
        timestamp: now.toISOString(),
      }));
      
      // Return the created post
      const createdPost = await this.fastify.db.collection('posts').findOne({
        _id: result.insertedId
      });
      
      return reply.code(201).send({
        ...createdPost,
        id: createdPost?._id.toString(),
        date: createdPost?.date.toISOString(),
        createdAt: createdPost?.createdAt.toISOString(),
        updatedAt: createdPost?.updatedAt.toISOString()
      });
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Update a blog post
   */
  async updatePost(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdatePostDto }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    const updateData = request.body;

    try {
      // Find the post
      const post = await this.fastify.db.collection('posts').findOne({
        _id: new ObjectId(id)
      });
      
      if (!post) {
        return reply.code(404).send({ error: 'Post not found' });
      }
      
      // Check permissions
      if (post.author.id !== userId) {
        return reply.code(403).send({ error: 'You do not have permission to update this post' });
      }
      
      // Update slug if title is changing
      let slug = post.slug;
      if (updateData.title) {
        slug = slugify(updateData.title, { lower: true, strict: true });
        
        // Check if another post with the new slug already exists
        const existingPost = await this.fastify.db.collection('posts').findOne({
          _id: { $ne: new ObjectId(id) },
          slug
        });
        
        if (existingPost) {
          return reply.code(409).send({ error: 'A post with this title already exists' });
        }
      }
      
      // Prepare update data
      const update: any = {
        ...updateData,
        slug,
        updatedAt: new Date()
      };
      
      // Update the post
      await this.fastify.db.collection('posts').updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );
      
      // Publish post update event
      await this.fastify.redis.publish('blog:events', JSON.stringify({
        type: 'post:updated',
        postId: id,
        userId,
        timestamp: new Date().toISOString(),
      }));
      
      // Get the updated post
      const updatedPost = await this.fastify.db.collection('posts').findOne({
        _id: new ObjectId(id)
      });
      
      return reply.code(200).send({
        ...updatedPost,
        id: updatedPost?._id.toString(),
        date: updatedPost?.date.toISOString(),
        createdAt: updatedPost?.createdAt.toISOString(),
        updatedAt: updatedPost?.updatedAt.toISOString()
      });
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Delete a blog post
   */
  async deletePost(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;

    try {
      // Find the post
      const post = await this.fastify.db.collection('posts').findOne({
        _id: new ObjectId(id)
      });
      
      if (!post) {
        return reply.code(404).send({ error: 'Post not found' });
      }
      
      // Check permissions
      if (post.author.id !== userId) {
        return reply.code(403).send({ error: 'You do not have permission to delete this post' });
      }
      
      // Delete the post
      await this.fastify.db.collection('posts').deleteOne({
        _id: new ObjectId(id)
      });
      
      // Publish post deletion event
      await this.fastify.redis.publish('blog:events', JSON.stringify({
        type: 'post:deleted',
        postId: id,
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
   * Add a comment to a blog post
   */
  async addComment(
    request: FastifyRequest<{ Params: { slug: string }; Body: CreateCommentDto }>,
    reply: FastifyReply
  ) {
    const { slug } = request.params;
    const { name, email, content, title } = request.body;

    try {
      // Find the post
      const post = await this.fastify.db.collection('posts').findOne({ slug });
      
      if (!post) {
        return reply.code(404).send({ error: 'Post not found' });
      }
      
      // Create the comment
      const now = new Date();
      const comment: Comment = {
        _id: new ObjectId(),
        postId: post._id.toString(),
        name,
        email,
        content,
        title,
        approved: false, // Require approval by default
        createdAt: now,
        updatedAt: now
      };
      
      // Add the comment to the post
      await this.fastify.db.collection('posts').updateOne(
        { _id: post._id },
        { $push: { comments: comment } }
      );
      
      // Publish comment creation event
      await this.fastify.redis.publish('blog:events', JSON.stringify({
        type: 'comment:created',
        postId: post._id.toString(),
        commentId: comment._id?.toString(),
        timestamp: now.toISOString(),
      }));
      
      return reply.code(201).send({
        ...comment,
        id: comment._id?.toString(),
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString()
      });
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Approve or reject a comment
   */
  async updateComment(
    request: FastifyRequest<{ 
      Params: { id: string; commentId: string }; 
      Body: UpdateCommentDto 
    }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id, commentId } = request.params;
    const { approved } = request.body;

    try {
      // Find the post
      const post = await this.fastify.db.collection('posts').findOne({
        _id: new ObjectId(id)
      });
      
      if (!post) {
        return reply.code(404).send({ error: 'Post not found' });
      }
      
      // Check permissions
      if (post.author.id !== userId) {
        return reply.code(403).send({ error: 'You do not have permission to moderate comments on this post' });
      }
      
      // Find the comment
      const commentIndex = post.comments.findIndex(
        (comment: any) => comment._id.toString() === commentId
      );
      
      if (commentIndex === -1) {
        return reply.code(404).send({ error: 'Comment not found' });
      }
      
      // Update the comment
      const now = new Date();
      post.comments[commentIndex].approved = approved;
      post.comments[commentIndex].updatedAt = now;
      
      // Save the updated post
      await this.fastify.db.collection('posts').updateOne(
        { _id: post._id },
        { $set: { comments: post.comments } }
      );
      
      // Publish comment update event
      await this.fastify.redis.publish('blog:events', JSON.stringify({
        type: 'comment:updated',
        postId: id,
        commentId,
        approved,
        userId,
        timestamp: now.toISOString(),
      }));
      
      return reply.code(200).send({
        ...post.comments[commentIndex],
        id: post.comments[commentIndex]._id.toString(),
        createdAt: post.comments[commentIndex].createdAt.toISOString(),
        updatedAt: post.comments[commentIndex].updatedAt.toISOString()
      });
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(
    request: FastifyRequest<{ Params: { id: string; commentId: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id, commentId } = request.params;

    try {
      // Find the post
      const post = await this.fastify.db.collection('posts').findOne({
        _id: new ObjectId(id)
      });
      
      if (!post) {
        return reply.code(404).send({ error: 'Post not found' });
      }
      
      // Check permissions
      if (post.author.id !== userId) {
        return reply.code(403).send({ error: 'You do not have permission to delete comments on this post' });
      }
      
      // Remove the comment
      const updatedComments = post.comments.filter(
        (comment: any) => comment._id.toString() !== commentId
      );
      
      if (updatedComments.length === post.comments.length) {
        return reply.code(404).send({ error: 'Comment not found' });
      }
      
      // Save the updated post
      await this.fastify.db.collection('posts').updateOne(
        { _id: post._id },
        { $set: { comments: updatedComments } }
      );
      
      // Publish comment deletion event
      await this.fastify.redis.publish('blog:events', JSON.stringify({
        type: 'comment:deleted',
        postId: id,
        commentId,
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
   * Get related posts
   */
  async getRelatedPosts(
    request: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply
  ) {
    const { slug } = request.params;

    try {
      // Find the post
      const post = await this.fastify.db.collection('posts').findOne({ slug });
      
      if (!post) {
        return reply.code(404).send({ error: 'Post not found' });
      }
      
      // Find related posts based on category and tags
      const relatedPosts = await this.fastify.db.collection('posts')
        .find({
          _id: { $ne: post._id },
          published: true,
          $or: [
            { category: post.category },
            { tags: { $in: post.tags } }
          ]
        })
        .sort({ date: -1 })
        .limit(4)
        .toArray();
      
      // Format response
      const formattedPosts = relatedPosts.map(relatedPost => ({
        ...relatedPost,
        id: relatedPost._id.toString(),
        date: relatedPost.date.toISOString(),
        createdAt: relatedPost.createdAt.toISOString(),
        updatedAt: relatedPost.updatedAt.toISOString()
      }));
      
      return reply.code(200).send(formattedPosts);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Get categories with post counts
   */
  async getCategories(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const categories = await this.fastify.db.collection('posts').aggregate([
        { $match: { published: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();
      
      return reply.code(200).send(categories.map(category => ({
        name: category._id,
        count: category.count
      })));
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Get tags with post counts
   */
  async getTags(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const tags = await this.fastify.db.collection('posts').aggregate([
        { $match: { published: true } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();
      
      return reply.code(200).send(tags.map(tag => ({
        name: tag._id,
        count: tag.count
      })));
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }
}
