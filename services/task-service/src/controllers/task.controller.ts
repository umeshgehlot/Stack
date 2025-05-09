import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { 
  Task, 
  CreateTaskDto, 
  UpdateTaskDto, 
  TaskStatus, 
  TaskPriority,
  Comment,
  CreateCommentDto,
  UpdateCommentDto,
  Checklist,
  CreateChecklistDto,
  UpdateChecklistDto,
  ChecklistItem,
  CreateChecklistItemDto,
  UpdateChecklistItemDto
} from '../models/task.model';

export class TaskController {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * Get all tasks with filtering and pagination
   */
  async getTasks(request: FastifyRequest<{
    Querystring: {
      boardId?: string;
      columnId?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      assigneeId?: string;
      creatorId?: string;
      dueDate?: string;
      search?: string;
      labels?: string;
      limit?: number;
      page?: number;
    }
  }>, reply: FastifyReply) {
    try {
      const { 
        boardId, 
        columnId, 
        status, 
        priority, 
        assigneeId, 
        creatorId, 
        dueDate,
        search,
        labels,
        limit = 20, 
        page = 1 
      } = request.query;
      
      const skip = (page - 1) * limit;
      
      // Build query
      const query: any = {};
      
      if (boardId) query.boardId = boardId;
      if (columnId) query.columnId = columnId;
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (assigneeId) query.assigneeId = assigneeId;
      if (creatorId) query.creatorId = creatorId;
      
      if (dueDate) {
        const today = new Date().toISOString().split('T')[0];
        
        if (dueDate === 'overdue') {
          query.dueDate = { $lt: today };
        } else if (dueDate === 'today') {
          query.dueDate = today;
        } else if (dueDate === 'upcoming') {
          query.dueDate = { $gt: today };
        } else if (dueDate === 'none') {
          query.dueDate = { $exists: false };
        }
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (labels) {
        const labelArray = labels.split(',');
        query.labels = { $in: labelArray };
      }
      
      // Get total count
      const total = await this.fastify.db.collection('tasks').countDocuments(query);
      
      // Get tasks
      const tasks = await this.fastify.db.collection('tasks')
        .find(query)
        .sort({ position: 1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      // Calculate total pages
      const totalPages = Math.ceil(total / limit);
      
      return reply.code(200).send({
        tasks,
        total,
        page,
        limit,
        totalPages
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve tasks' });
    }
  }

  /**
   * Get a task by ID
   */
  async getTaskById(request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      const task = await this.fastify.db.collection('tasks').findOne({ id });
      
      if (!task) {
        return reply.code(404).send({ error: 'Task not found' });
      }
      
      return reply.code(200).send(task);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve task' });
    }
  }

  /**
   * Create a new task
   */
  async createTask(request: FastifyRequest<{
    Body: CreateTaskDto;
  }>, reply: FastifyReply) {
    try {
      const { 
        title, 
        description, 
        status = 'todo', 
        priority = 'medium', 
        dueDate, 
        assigneeId,
        boardId,
        columnId,
        position,
        labels = []
      } = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if board exists
      const board = await this.fastify.db.collection('boards').findOne({ id: boardId });
      
      if (!board) {
        return reply.code(404).send({ error: 'Board not found' });
      }
      
      // Check if column exists
      const column = board.columns.find((col: any) => col.id === columnId);
      
      if (!column) {
        return reply.code(404).send({ error: 'Column not found' });
      }
      
      // Get assignee info if provided
      let assigneeName, assigneeAvatar;
      
      if (assigneeId) {
        const assignee = await this.fastify.db.collection('users').findOne({ id: assigneeId });
        
        if (assignee) {
          assigneeName = assignee.name;
          assigneeAvatar = assignee.avatar;
        }
      }
      
      // Calculate position if not provided
      let taskPosition = position;
      
      if (taskPosition === undefined) {
        const lastTask = await this.fastify.db.collection('tasks')
          .find({ boardId, columnId })
          .sort({ position: -1 })
          .limit(1)
          .toArray();
        
        taskPosition = lastTask.length > 0 ? lastTask[0].position + 1 : 0;
      }
      
      const now = new Date().toISOString();
      
      const task: Task = {
        id: uuidv4(),
        title,
        description,
        status,
        priority,
        dueDate,
        assigneeId,
        assigneeName,
        assigneeAvatar,
        creatorId: user.id,
        creatorName: user.name,
        creatorAvatar: user.avatar,
        boardId,
        columnId,
        position: taskPosition,
        labels,
        attachments: [],
        checklists: [],
        comments: [],
        customFields: [],
        watchers: [user.id],
        createdAt: now,
        updatedAt: now
      };
      
      await this.fastify.db.collection('tasks').insertOne(task);
      
      // Update column task count
      await this.fastify.db.collection('boards').updateOne(
        { id: boardId, 'columns.id': columnId },
        { $inc: { 'columns.$.taskCount': 1 } }
      );
      
      // Publish event for task creation
      await this.fastify.redis.publish('task:created', JSON.stringify({
        taskId: task.id,
        boardId,
        columnId,
        creatorId: user.id
      }));
      
      return reply.code(201).send(task);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to create task' });
    }
  }

  /**
   * Update a task
   */
  async updateTask(request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateTaskDto;
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const updateData = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if task exists
      const task = await this.fastify.db.collection('tasks').findOne({ id });
      
      if (!task) {
        return reply.code(404).send({ error: 'Task not found' });
      }
      
      // If moving to a different column
      if (updateData.columnId && updateData.columnId !== task.columnId) {
        // Check if board exists
        const board = await this.fastify.db.collection('boards').findOne({ id: task.boardId });
        
        if (!board) {
          return reply.code(404).send({ error: 'Board not found' });
        }
        
        // Check if column exists
        const column = board.columns.find((col: any) => col.id === updateData.columnId);
        
        if (!column) {
          return reply.code(404).send({ error: 'Column not found' });
        }
        
        // Update old column task count
        await this.fastify.db.collection('boards').updateOne(
          { id: task.boardId, 'columns.id': task.columnId },
          { $inc: { 'columns.$.taskCount': -1 } }
        );
        
        // Update new column task count
        await this.fastify.db.collection('boards').updateOne(
          { id: task.boardId, 'columns.id': updateData.columnId },
          { $inc: { 'columns.$.taskCount': 1 } }
        );
      }
      
      // If assignee is updated, get assignee info
      if (updateData.assigneeId && updateData.assigneeId !== task.assigneeId) {
        const assignee = await this.fastify.db.collection('users').findOne({ id: updateData.assigneeId });
        
        if (assignee) {
          updateData.assigneeName = assignee.name;
          updateData.assigneeAvatar = assignee.avatar;
        }
      }
      
      // Update task
      const now = new Date().toISOString();
      
      const result = await this.fastify.db.collection('tasks').findOneAndUpdate(
        { id },
        { 
          $set: {
            ...updateData,
            updatedAt: now
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return reply.code(404).send({ error: 'Task not found' });
      }
      
      // Publish event for task update
      await this.fastify.redis.publish('task:updated', JSON.stringify({
        taskId: id,
        boardId: result.boardId,
        columnId: result.columnId,
        updaterId: user.id
      }));
      
      return reply.code(200).send(result);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to update task' });
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if task exists
      const task = await this.fastify.db.collection('tasks').findOne({ id });
      
      if (!task) {
        return reply.code(404).send({ error: 'Task not found' });
      }
      
      // Delete task
      await this.fastify.db.collection('tasks').deleteOne({ id });
      
      // Update column task count
      await this.fastify.db.collection('boards').updateOne(
        { id: task.boardId, 'columns.id': task.columnId },
        { $inc: { 'columns.$.taskCount': -1 } }
      );
      
      // Publish event for task deletion
      await this.fastify.redis.publish('task:deleted', JSON.stringify({
        taskId: id,
        boardId: task.boardId,
        columnId: task.columnId,
        deleterId: user.id
      }));
      
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete task' });
    }
  }

  /**
   * Add a comment to a task
   */
  async addComment(request: FastifyRequest<{
    Params: { id: string };
    Body: CreateCommentDto;
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { text, mentions = [], attachments = [] } = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if task exists
      const task = await this.fastify.db.collection('tasks').findOne({ id });
      
      if (!task) {
        return reply.code(404).send({ error: 'Task not found' });
      }
      
      const now = new Date().toISOString();
      
      const comment: Comment = {
        id: uuidv4(),
        text,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        mentions,
        attachments: attachments.map(attachment => ({
          ...attachment,
          id: uuidv4(),
          createdAt: now,
          createdBy: user.id
        })),
        createdAt: now,
        updatedAt: now
      };
      
      // Add comment to task
      await this.fastify.db.collection('tasks').updateOne(
        { id },
        { 
          $push: { comments: comment },
          $set: { updatedAt: now }
        }
      );
      
      // If there are mentions, notify mentioned users
      if (mentions.length > 0) {
        // Publish event for mentions
        await this.fastify.redis.publish('task:mention', JSON.stringify({
          taskId: id,
          commentId: comment.id,
          mentionedUserIds: mentions,
          mentionerId: user.id
        }));
      }
      
      return reply.code(201).send(comment);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to add comment' });
    }
  }

  /**
   * Update a comment
   */
  async updateComment(request: FastifyRequest<{
    Params: { id: string; commentId: string };
    Body: UpdateCommentDto;
  }>, reply: FastifyReply) {
    try {
      const { id, commentId } = request.params;
      const { text, mentions = [] } = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if task exists
      const task = await this.fastify.db.collection('tasks').findOne({ id });
      
      if (!task) {
        return reply.code(404).send({ error: 'Task not found' });
      }
      
      // Check if comment exists and user is the author
      const comment = task.comments.find((c: Comment) => c.id === commentId);
      
      if (!comment) {
        return reply.code(404).send({ error: 'Comment not found' });
      }
      
      if (comment.authorId !== user.id) {
        return reply.code(403).send({ error: 'You can only update your own comments' });
      }
      
      const now = new Date().toISOString();
      
      // Update comment
      await this.fastify.db.collection('tasks').updateOne(
        { id, 'comments.id': commentId },
        { 
          $set: { 
            'comments.$.text': text,
            'comments.$.mentions': mentions,
            'comments.$.updatedAt': now,
            updatedAt: now
          }
        }
      );
      
      // Get updated task
      const updatedTask = await this.fastify.db.collection('tasks').findOne({ id });
      const updatedComment = updatedTask.comments.find((c: Comment) => c.id === commentId);
      
      return reply.code(200).send(updatedComment);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to update comment' });
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(request: FastifyRequest<{
    Params: { id: string; commentId: string }
  }>, reply: FastifyReply) {
    try {
      const { id, commentId } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if task exists
      const task = await this.fastify.db.collection('tasks').findOne({ id });
      
      if (!task) {
        return reply.code(404).send({ error: 'Task not found' });
      }
      
      // Check if comment exists and user is the author
      const comment = task.comments.find((c: Comment) => c.id === commentId);
      
      if (!comment) {
        return reply.code(404).send({ error: 'Comment not found' });
      }
      
      if (comment.authorId !== user.id) {
        return reply.code(403).send({ error: 'You can only delete your own comments' });
      }
      
      const now = new Date().toISOString();
      
      // Delete comment
      await this.fastify.db.collection('tasks').updateOne(
        { id },
        { 
          $pull: { comments: { id: commentId } },
          $set: { updatedAt: now }
        }
      );
      
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete comment' });
    }
  }
}
