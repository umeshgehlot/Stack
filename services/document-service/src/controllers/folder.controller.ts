import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ObjectId } from 'mongodb';
import { 
  Folder, 
  FolderWithCounts, 
  CreateFolderDto, 
  UpdateFolderDto, 
  ShareFolderDto,
  generateFolderPath,
  isValidFolderName
} from '../models/folder.model';

/**
 * Controller for folder operations
 */
export class FolderController {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * Create a new folder
   */
  async createFolder(
    request: FastifyRequest<{ Body: CreateFolderDto }>,
    reply: FastifyReply
  ) {
    const { id: userId, email } = request.user as { id: string; email: string };
    const { name, parentId = null, metadata } = request.body;

    try {
      // Validate folder name
      if (!isValidFolderName(name)) {
        return reply.code(400).send({ 
          error: 'Invalid folder name. Folder names cannot contain /, \\, :, *, ?, ", <, >, |' 
        });
      }

      // Check if parent folder exists (if specified)
      let parentPath = '/';
      if (parentId) {
        const parentFolder = await this.fastify.db.collection('folders').findOne({
          _id: new ObjectId(parentId),
          $or: [
            { createdBy: userId },
            { 'sharedWith.userId': userId }
          ]
        });

        if (!parentFolder) {
          return reply.code(404).send({ error: 'Parent folder not found' });
        }

        parentPath = parentFolder.path;

        // Check if user has write permission on parent folder
        if (parentFolder.createdBy !== userId) {
          const userPermission = parentFolder.sharedWith.find(
            (share: any) => share.userId === userId
          )?.permission;

          if (!userPermission || userPermission === 'read') {
            return reply.code(403).send({ error: 'You do not have permission to create folders here' });
          }
        }
      }

      // Check if folder with same name already exists in the same parent
      const existingFolder = await this.fastify.db.collection('folders').findOne({
        name,
        parentId: parentId || null,
        $or: [
          { createdBy: userId },
          { 'sharedWith.userId': userId }
        ]
      });

      if (existingFolder) {
        return reply.code(409).send({ error: 'A folder with this name already exists in this location' });
      }

      // Generate folder path
      const path = generateFolderPath(parentPath, name);

      // Create the folder
      const now = new Date();
      const folder: Folder = {
        name,
        parentId: parentId || null,
        path,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
        isShared: false,
        metadata
      };

      const result = await this.fastify.db.collection('folders').insertOne(folder);
      
      // Publish folder creation event
      await this.fastify.redis.publish('folder:events', JSON.stringify({
        type: 'folder:created',
        folderId: result.insertedId.toString(),
        userId,
        timestamp: now.toISOString(),
      }));

      // Return the created folder with counts
      const createdFolder = await this.fastify.db.collection('folders').findOne({
        _id: result.insertedId
      });

      const folderWithCounts: FolderWithCounts = {
        ...createdFolder,
        id: createdFolder._id.toString(),
        documentCount: 0,
        subfolderCount: 0
      };

      return reply.code(201).send(folderWithCounts);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Get all folders for the current user
   */
  async getFolders(
    request: FastifyRequest<{ Querystring: { parentId?: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { parentId } = request.query;

    try {
      // Find folders that the user created or has access to
      const query: any = {
        $or: [
          { createdBy: userId },
          { 'sharedWith.userId': userId }
        ]
      };

      // Filter by parent folder if specified
      if (parentId !== undefined) {
        query.parentId = parentId || null; // null for root folders
      }

      const folders = await this.fastify.db.collection('folders')
        .find(query)
        .sort({ name: 1 })
        .toArray();

      // Get document and subfolder counts for each folder
      const foldersWithCounts: FolderWithCounts[] = await Promise.all(
        folders.map(async (folder) => {
          const documentCount = await this.fastify.db.collection('documents').countDocuments({
            folderId: folder._id.toString()
          });

          const subfolderCount = await this.fastify.db.collection('folders').countDocuments({
            parentId: folder._id.toString()
          });

          return {
            ...folder,
            id: folder._id.toString(),
            documentCount,
            subfolderCount
          };
        })
      );

      return reply.code(200).send(foldersWithCounts);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Get a folder by ID
   */
  async getFolderById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;

    try {
      // Find the folder
      const folder = await this.fastify.db.collection('folders').findOne({
        _id: new ObjectId(id),
        $or: [
          { createdBy: userId },
          { 'sharedWith.userId': userId }
        ]
      });

      if (!folder) {
        return reply.code(404).send({ error: 'Folder not found' });
      }

      // Get document and subfolder counts
      const documentCount = await this.fastify.db.collection('documents').countDocuments({
        folderId: folder._id.toString()
      });

      const subfolderCount = await this.fastify.db.collection('folders').countDocuments({
        parentId: folder._id.toString()
      });

      const folderWithCounts: FolderWithCounts = {
        ...folder,
        id: folder._id.toString(),
        documentCount,
        subfolderCount
      };

      return reply.code(200).send(folderWithCounts);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Update a folder
   */
  async updateFolder(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateFolderDto }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    const updateData = request.body;

    try {
      // Find the folder
      const folder = await this.fastify.db.collection('folders').findOne({
        _id: new ObjectId(id)
      });

      if (!folder) {
        return reply.code(404).send({ error: 'Folder not found' });
      }

      // Check permissions
      if (folder.createdBy !== userId) {
        const userPermission = folder.sharedWith?.find(
          (share: any) => share.userId === userId
        )?.permission;

        if (!userPermission || userPermission !== 'admin') {
          return reply.code(403).send({ error: 'You do not have permission to update this folder' });
        }
      }

      // Validate folder name if provided
      if (updateData.name && !isValidFolderName(updateData.name)) {
        return reply.code(400).send({ 
          error: 'Invalid folder name. Folder names cannot contain /, \\, :, *, ?, ", <, >, |' 
        });
      }

      // Check if folder with same name already exists in the same parent
      if (updateData.name) {
        const existingFolder = await this.fastify.db.collection('folders').findOne({
          _id: { $ne: new ObjectId(id) },
          name: updateData.name,
          parentId: folder.parentId,
          $or: [
            { createdBy: userId },
            { 'sharedWith.userId': userId }
          ]
        });

        if (existingFolder) {
          return reply.code(409).send({ error: 'A folder with this name already exists in this location' });
        }
      }

      // Update folder path if name is changing
      let path = folder.path;
      if (updateData.name) {
        const pathParts = folder.path.split('/');
        pathParts[pathParts.length - 1] = updateData.name;
        path = pathParts.join('/');
      }

      // Prepare update data
      const update: any = {
        ...updateData,
        path,
        updatedAt: new Date()
      };

      // Update the folder
      await this.fastify.db.collection('folders').updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );

      // Publish folder update event
      await this.fastify.redis.publish('folder:events', JSON.stringify({
        type: 'folder:updated',
        folderId: id,
        userId,
        timestamp: new Date().toISOString(),
      }));

      // Get the updated folder
      const updatedFolder = await this.fastify.db.collection('folders').findOne({
        _id: new ObjectId(id)
      });

      // Get document and subfolder counts
      const documentCount = await this.fastify.db.collection('documents').countDocuments({
        folderId: id
      });

      const subfolderCount = await this.fastify.db.collection('folders').countDocuments({
        parentId: id
      });

      const folderWithCounts: FolderWithCounts = {
        ...updatedFolder,
        id: updatedFolder._id.toString(),
        documentCount,
        subfolderCount
      };

      return reply.code(200).send(folderWithCounts);
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Delete a folder
   */
  async deleteFolder(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;

    try {
      // Find the folder
      const folder = await this.fastify.db.collection('folders').findOne({
        _id: new ObjectId(id)
      });

      if (!folder) {
        return reply.code(404).send({ error: 'Folder not found' });
      }

      // Check permissions
      if (folder.createdBy !== userId) {
        const userPermission = folder.sharedWith?.find(
          (share: any) => share.userId === userId
        )?.permission;

        if (!userPermission || userPermission !== 'admin') {
          return reply.code(403).send({ error: 'You do not have permission to delete this folder' });
        }
      }

      // Check if folder has subfolders
      const subfolderCount = await this.fastify.db.collection('folders').countDocuments({
        parentId: id
      });

      if (subfolderCount > 0) {
        return reply.code(409).send({ error: 'Cannot delete folder with subfolders' });
      }

      // Check if folder has documents
      const documentCount = await this.fastify.db.collection('documents').countDocuments({
        folderId: id
      });

      if (documentCount > 0) {
        return reply.code(409).send({ error: 'Cannot delete folder with documents' });
      }

      // Delete the folder
      await this.fastify.db.collection('folders').deleteOne({
        _id: new ObjectId(id)
      });

      // Publish folder deletion event
      await this.fastify.redis.publish('folder:events', JSON.stringify({
        type: 'folder:deleted',
        folderId: id,
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
   * Share a folder with other users
   */
  async shareFolder(
    request: FastifyRequest<{ Params: { id: string }; Body: ShareFolderDto }>,
    reply: FastifyReply
  ) {
    const { id: userId } = request.user as { id: string };
    const { id } = request.params;
    const { userIds, permission } = request.body;

    try {
      // Find the folder
      const folder = await this.fastify.db.collection('folders').findOne({
        _id: new ObjectId(id)
      });

      if (!folder) {
        return reply.code(404).send({ error: 'Folder not found' });
      }

      // Check permissions
      if (folder.createdBy !== userId) {
        const userPermission = folder.sharedWith?.find(
          (share: any) => share.userId === userId
        )?.permission;

        if (!userPermission || userPermission !== 'admin') {
          return reply.code(403).send({ error: 'You do not have permission to share this folder' });
        }
      }

      // Prepare the shared users array
      const sharedWith = folder.sharedWith || [];
      
      // Update or add users
      for (const shareUserId of userIds) {
        const existingShareIndex = sharedWith.findIndex(
          (share: any) => share.userId === shareUserId
        );

        if (existingShareIndex >= 0) {
          sharedWith[existingShareIndex].permission = permission;
        } else {
          sharedWith.push({
            userId: shareUserId,
            permission
          });
        }
      }

      // Update the folder
      await this.fastify.db.collection('folders').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            sharedWith,
            isShared: true,
            updatedAt: new Date()
          } 
        }
      );

      // Publish folder sharing event
      await this.fastify.redis.publish('folder:events', JSON.stringify({
        type: 'folder:shared',
        folderId: id,
        userId,
        sharedWith: userIds,
        permission,
        timestamp: new Date().toISOString(),
      }));

      // Get the updated folder
      const updatedFolder = await this.fastify.db.collection('folders').findOne({
        _id: new ObjectId(id)
      });

      return reply.code(200).send({
        ...updatedFolder,
        id: updatedFolder._id.toString()
      });
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  /**
   * Remove sharing for a user from a folder
   */
  async removeSharing(
    request: FastifyRequest<{ Params: { id: string, userId: string } }>,
    reply: FastifyReply
  ) {
    const { id: currentUserId } = request.user as { id: string };
    const { id, userId: targetUserId } = request.params;

    try {
      // Find the folder
      const folder = await this.fastify.db.collection('folders').findOne({
        _id: new ObjectId(id)
      });

      if (!folder) {
        return reply.code(404).send({ error: 'Folder not found' });
      }

      // Check permissions
      if (folder.createdBy !== currentUserId) {
        const userPermission = folder.sharedWith?.find(
          (share: any) => share.userId === currentUserId
        )?.permission;

        if (!userPermission || userPermission !== 'admin') {
          return reply.code(403).send({ error: 'You do not have permission to modify sharing for this folder' });
        }
      }

      // Remove the user from sharedWith
      const sharedWith = (folder.sharedWith || []).filter(
        (share: any) => share.userId !== targetUserId
      );

      // Update isShared flag if no more shares
      const isShared = sharedWith.length > 0;

      // Update the folder
      await this.fastify.db.collection('folders').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            sharedWith,
            isShared,
            updatedAt: new Date()
          } 
        }
      );

      // Publish folder unsharing event
      await this.fastify.redis.publish('folder:events', JSON.stringify({
        type: 'folder:unshared',
        folderId: id,
        userId: currentUserId,
        targetUserId,
        timestamp: new Date().toISOString(),
      }));

      return reply.code(204).send();
    } catch (err) {
      this.fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }
}
