import { ObjectId } from 'mongodb';

/**
 * Interface representing a folder in the document service
 */
export interface Folder {
  _id?: ObjectId;
  name: string;
  parentId?: string | null; // null for root folders
  path: string; // Full path from root, e.g., "/Marketing/Campaigns"
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isShared: boolean;
  sharedWith?: Array<{
    userId: string;
    permission: 'read' | 'write' | 'admin';
  }>;
  metadata?: {
    description?: string;
    color?: string;
    icon?: string;
    tags?: string[];
  };
}

/**
 * Interface representing a folder with its document and subfolder counts
 */
export interface FolderWithCounts extends Folder {
  documentCount: number;
  subfolderCount: number;
}

/**
 * Interface for creating a new folder
 */
export interface CreateFolderDto {
  name: string;
  parentId?: string | null;
  metadata?: {
    description?: string;
    color?: string;
    icon?: string;
    tags?: string[];
  };
}

/**
 * Interface for updating a folder
 */
export interface UpdateFolderDto {
  name?: string;
  parentId?: string | null;
  isShared?: boolean;
  sharedWith?: Array<{
    userId: string;
    permission: 'read' | 'write' | 'admin';
  }>;
  metadata?: {
    description?: string;
    color?: string;
    icon?: string;
    tags?: string[];
  };
}

/**
 * Interface for folder sharing
 */
export interface ShareFolderDto {
  userIds: string[];
  permission: 'read' | 'write' | 'admin';
}

/**
 * Generate a path for a folder based on its parent path and name
 * @param parentPath The path of the parent folder
 * @param folderName The name of the folder
 * @returns The full path of the folder
 */
export function generateFolderPath(parentPath: string | null, folderName: string): string {
  if (!parentPath || parentPath === '/') {
    return `/${folderName}`;
  }
  return `${parentPath}/${folderName}`;
}

/**
 * Validate a folder name
 * @param name The folder name to validate
 * @returns True if the name is valid, false otherwise
 */
export function isValidFolderName(name: string): boolean {
  // Folder name should not contain invalid characters for paths
  const invalidChars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|'];
  return (
    name.length > 0 &&
    name.length <= 255 &&
    !invalidChars.some(char => name.includes(char))
  );
}
