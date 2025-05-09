import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { 
  Board, 
  CreateBoardDto, 
  UpdateBoardDto,
  Column,
  CreateColumnDto,
  UpdateColumnDto,
  Label,
  CreateLabelDto,
  UpdateLabelDto,
  BoardMember
} from '../models/task.model';

export class BoardController {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * Get all boards with filtering and pagination
   */
  async getBoards(request: FastifyRequest<{
    Querystring: {
      teamId?: string;
      ownerId?: string;
      visibility?: 'private' | 'team' | 'public';
      search?: string;
      limit?: number;
      page?: number;
    }
  }>, reply: FastifyReply) {
    try {
      const { 
        teamId, 
        ownerId, 
        visibility, 
        search,
        limit = 20, 
        page = 1 
      } = request.query;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      const skip = (page - 1) * limit;
      
      // Build query
      const query: any = {
        $or: [
          { ownerId: user.id },
          { 'members.userId': user.id },
          { visibility: 'public' }
        ]
      };
      
      if (teamId) query.teamId = teamId;
      if (ownerId) query.ownerId = ownerId;
      if (visibility) query.visibility = visibility;
      
      if (search) {
        query.$and = [
          {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } }
            ]
          }
        ];
      }
      
      // Get total count
      const total = await this.fastify.db.collection('boards').countDocuments(query);
      
      // Get boards
      const boards = await this.fastify.db.collection('boards')
        .find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      // Calculate total pages
      const totalPages = Math.ceil(total / limit);
      
      return reply.code(200).send({
        boards,
        total,
        page,
        limit,
        totalPages
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve boards' });
    }
  }

  /**
   * Get a board by ID
   */
  async getBoardById(request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      const board = await this.fastify.db.collection('boards').findOne({
        id,
        $or: [
          { ownerId: user.id },
          { 'members.userId': user.id },
          { visibility: 'public' }
        ]
      });
      
      if (!board) {
        return reply.code(404).send({ error: 'Board not found or you do not have access' });
      }
      
      return reply.code(200).send(board);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve board' });
    }
  }

  /**
   * Create a new board
   */
  async createBoard(request: FastifyRequest<{
    Body: CreateBoardDto;
  }>, reply: FastifyReply) {
    try {
      const { 
        name, 
        description, 
        teamId, 
        visibility = 'private',
        background,
        columns = []
      } = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // If teamId is provided, check if team exists and user is a member
      if (teamId) {
        const team = await this.fastify.db.collection('teams').findOne({ 
          id: teamId,
          $or: [
            { ownerId: user.id },
            { 'members.userId': user.id }
          ]
        });
        
        if (!team) {
          return reply.code(404).send({ error: 'Team not found or you are not a member' });
        }
      }
      
      const now = new Date().toISOString();
      
      // Default columns if none provided
      const boardColumns: Column[] = columns.length > 0 
        ? columns.map((column, index) => ({
            id: uuidv4(),
            name: column.name,
            position: column.position || index,
            taskLimit: column.taskLimit,
            taskCount: 0,
            color: column.color,
            createdAt: now,
            updatedAt: now
          }))
        : [
            {
              id: uuidv4(),
              name: 'To Do',
              position: 0,
              taskCount: 0,
              createdAt: now,
              updatedAt: now
            },
            {
              id: uuidv4(),
              name: 'In Progress',
              position: 1,
              taskCount: 0,
              createdAt: now,
              updatedAt: now
            },
            {
              id: uuidv4(),
              name: 'Done',
              position: 2,
              taskCount: 0,
              createdAt: now,
              updatedAt: now
            }
          ];
      
      const board: Board = {
        id: uuidv4(),
        name,
        description,
        ownerId: user.id,
        ownerName: user.name,
        teamId,
        teamName: teamId ? (await this.fastify.db.collection('teams').findOne({ id: teamId }))?.name : undefined,
        visibility,
        background,
        columns: boardColumns,
        labels: [
          {
            id: uuidv4(),
            name: 'Bug',
            color: '#FF5630',
            createdAt: now,
            updatedAt: now
          },
          {
            id: uuidv4(),
            name: 'Feature',
            color: '#36B37E',
            createdAt: now,
            updatedAt: now
          },
          {
            id: uuidv4(),
            name: 'Documentation',
            color: '#00B8D9',
            createdAt: now,
            updatedAt: now
          },
          {
            id: uuidv4(),
            name: 'High Priority',
            color: '#FF8B00',
            createdAt: now,
            updatedAt: now
          }
        ],
        customFields: [],
        members: [
          {
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            role: 'owner',
            joinedAt: now
          }
        ],
        createdAt: now,
        updatedAt: now
      };
      
      await this.fastify.db.collection('boards').insertOne(board);
      
      // Publish event for board creation
      await this.fastify.redis.publish('board:created', JSON.stringify({
        boardId: board.id,
        creatorId: user.id
      }));
      
      return reply.code(201).send(board);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to create board' });
    }
  }

  /**
   * Update a board
   */
  async updateBoard(request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateBoardDto;
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const updateData = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if board exists and user has permission
      const board = await this.fastify.db.collection('boards').findOne({
        id,
        $or: [
          { ownerId: user.id },
          { 'members.userId': user.id, 'members.role': { $in: ['admin', 'owner'] } }
        ]
      });
      
      if (!board) {
        return reply.code(404).send({ error: 'Board not found or you do not have permission' });
      }
      
      // If teamId is updated, check if team exists and user is a member
      if (updateData.teamId && updateData.teamId !== board.teamId) {
        const team = await this.fastify.db.collection('teams').findOne({ 
          id: updateData.teamId,
          $or: [
            { ownerId: user.id },
            { 'members.userId': user.id }
          ]
        });
        
        if (!team) {
          return reply.code(404).send({ error: 'Team not found or you are not a member' });
        }
        
        updateData.teamName = team.name;
      }
      
      // Update board
      const now = new Date().toISOString();
      
      const result = await this.fastify.db.collection('boards').findOneAndUpdate(
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
        return reply.code(404).send({ error: 'Board not found' });
      }
      
      // Publish event for board update
      await this.fastify.redis.publish('board:updated', JSON.stringify({
        boardId: id,
        updaterId: user.id
      }));
      
      return reply.code(200).send(result);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to update board' });
    }
  }

  /**
   * Delete a board
   */
  async deleteBoard(request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if board exists and user is the owner
      const board = await this.fastify.db.collection('boards').findOne({
        id,
        ownerId: user.id
      });
      
      if (!board) {
        return reply.code(404).send({ error: 'Board not found or you are not the owner' });
      }
      
      // Delete board
      await this.fastify.db.collection('boards').deleteOne({ id });
      
      // Delete all tasks associated with the board
      await this.fastify.db.collection('tasks').deleteMany({ boardId: id });
      
      // Publish event for board deletion
      await this.fastify.redis.publish('board:deleted', JSON.stringify({
        boardId: id,
        deleterId: user.id
      }));
      
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete board' });
    }
  }

  /**
   * Add a column to a board
   */
  async addColumn(request: FastifyRequest<{
    Params: { id: string };
    Body: CreateColumnDto;
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { name, position, taskLimit, color } = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if board exists and user has permission
      const board = await this.fastify.db.collection('boards').findOne({
        id,
        $or: [
          { ownerId: user.id },
          { 'members.userId': user.id, 'members.role': { $in: ['admin', 'owner'] } }
        ]
      });
      
      if (!board) {
        return reply.code(404).send({ error: 'Board not found or you do not have permission' });
      }
      
      const now = new Date().toISOString();
      
      const column: Column = {
        id: uuidv4(),
        name,
        position,
        taskLimit,
        taskCount: 0,
        color,
        createdAt: now,
        updatedAt: now
      };
      
      // Add column to board
      await this.fastify.db.collection('boards').updateOne(
        { id },
        { 
          $push: { columns: column },
          $set: { updatedAt: now }
        }
      );
      
      // Publish event for column creation
      await this.fastify.redis.publish('column:created', JSON.stringify({
        boardId: id,
        columnId: column.id,
        creatorId: user.id
      }));
      
      return reply.code(201).send(column);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to add column' });
    }
  }

  /**
   * Update a column
   */
  async updateColumn(request: FastifyRequest<{
    Params: { id: string; columnId: string };
    Body: UpdateColumnDto;
  }>, reply: FastifyReply) {
    try {
      const { id, columnId } = request.params;
      const updateData = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if board exists and user has permission
      const board = await this.fastify.db.collection('boards').findOne({
        id,
        $or: [
          { ownerId: user.id },
          { 'members.userId': user.id, 'members.role': { $in: ['admin', 'owner'] } }
        ]
      });
      
      if (!board) {
        return reply.code(404).send({ error: 'Board not found or you do not have permission' });
      }
      
      // Check if column exists
      const column = board.columns.find((col: Column) => col.id === columnId);
      
      if (!column) {
        return reply.code(404).send({ error: 'Column not found' });
      }
      
      const now = new Date().toISOString();
      
      // Update column
      const updateFields: any = {};
      
      if (updateData.name !== undefined) updateFields['columns.$.name'] = updateData.name;
      if (updateData.position !== undefined) updateFields['columns.$.position'] = updateData.position;
      if (updateData.taskLimit !== undefined) updateFields['columns.$.taskLimit'] = updateData.taskLimit;
      if (updateData.color !== undefined) updateFields['columns.$.color'] = updateData.color;
      updateFields['columns.$.updatedAt'] = now;
      updateFields['updatedAt'] = now;
      
      await this.fastify.db.collection('boards').updateOne(
        { id, 'columns.id': columnId },
        { $set: updateFields }
      );
      
      // Get updated board
      const updatedBoard = await this.fastify.db.collection('boards').findOne({ id });
      const updatedColumn = updatedBoard.columns.find((col: Column) => col.id === columnId);
      
      // Publish event for column update
      await this.fastify.redis.publish('column:updated', JSON.stringify({
        boardId: id,
        columnId,
        updaterId: user.id
      }));
      
      return reply.code(200).send(updatedColumn);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to update column' });
    }
  }

  /**
   * Delete a column
   */
  async deleteColumn(request: FastifyRequest<{
    Params: { id: string; columnId: string }
  }>, reply: FastifyReply) {
    try {
      const { id, columnId } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if board exists and user has permission
      const board = await this.fastify.db.collection('boards').findOne({
        id,
        $or: [
          { ownerId: user.id },
          { 'members.userId': user.id, 'members.role': { $in: ['admin', 'owner'] } }
        ]
      });
      
      if (!board) {
        return reply.code(404).send({ error: 'Board not found or you do not have permission' });
      }
      
      // Check if column exists
      const column = board.columns.find((col: Column) => col.id === columnId);
      
      if (!column) {
        return reply.code(404).send({ error: 'Column not found' });
      }
      
      // Check if column has tasks
      const tasksCount = await this.fastify.db.collection('tasks').countDocuments({ boardId: id, columnId });
      
      if (tasksCount > 0) {
        return reply.code(400).send({ error: 'Cannot delete column with tasks. Move or delete tasks first.' });
      }
      
      const now = new Date().toISOString();
      
      // Delete column
      await this.fastify.db.collection('boards').updateOne(
        { id },
        { 
          $pull: { columns: { id: columnId } },
          $set: { updatedAt: now }
        }
      );
      
      // Publish event for column deletion
      await this.fastify.redis.publish('column:deleted', JSON.stringify({
        boardId: id,
        columnId,
        deleterId: user.id
      }));
      
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete column' });
    }
  }

  /**
   * Add a label to a board
   */
  async addLabel(request: FastifyRequest<{
    Params: { id: string };
    Body: CreateLabelDto;
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { name, color } = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if board exists and user has permission
      const board = await this.fastify.db.collection('boards').findOne({
        id,
        $or: [
          { ownerId: user.id },
          { 'members.userId': user.id, 'members.role': { $in: ['admin', 'owner'] } }
        ]
      });
      
      if (!board) {
        return reply.code(404).send({ error: 'Board not found or you do not have permission' });
      }
      
      const now = new Date().toISOString();
      
      const label: Label = {
        id: uuidv4(),
        name,
        color,
        createdAt: now,
        updatedAt: now
      };
      
      // Add label to board
      await this.fastify.db.collection('boards').updateOne(
        { id },
        { 
          $push: { labels: label },
          $set: { updatedAt: now }
        }
      );
      
      return reply.code(201).send(label);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to add label' });
    }
  }

  /**
   * Add a member to a board
   */
  async addMember(request: FastifyRequest<{
    Params: { id: string };
    Body: { userId: string; role: 'admin' | 'member' | 'viewer' };
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { userId, role } = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if board exists and user has permission
      const board = await this.fastify.db.collection('boards').findOne({
        id,
        $or: [
          { ownerId: user.id },
          { 'members.userId': user.id, 'members.role': 'admin' }
        ]
      });
      
      if (!board) {
        return reply.code(404).send({ error: 'Board not found or you do not have permission' });
      }
      
      // Check if user exists
      const memberUser = await this.fastify.db.collection('users').findOne({ id: userId });
      
      if (!memberUser) {
        return reply.code(404).send({ error: 'User not found' });
      }
      
      // Check if user is already a member
      const existingMember = board.members.find((m: BoardMember) => m.userId === userId);
      
      if (existingMember) {
        return reply.code(409).send({ error: 'User is already a member of this board' });
      }
      
      const now = new Date().toISOString();
      
      const member: BoardMember = {
        userId,
        userName: memberUser.name,
        userAvatar: memberUser.avatar,
        role,
        joinedAt: now
      };
      
      // Add member to board
      await this.fastify.db.collection('boards').updateOne(
        { id },
        { 
          $push: { members: member },
          $set: { updatedAt: now }
        }
      );
      
      // Publish event for member addition
      await this.fastify.redis.publish('board:member:added', JSON.stringify({
        boardId: id,
        memberId: userId,
        adderId: user.id
      }));
      
      return reply.code(201).send(member);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to add member' });
    }
  }
}
