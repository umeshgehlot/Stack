import { ObjectId } from 'mongodb';

/**
 * Interface representing a document in the document service
 */
export interface Document {
  _id?: ObjectId;
  title: string;
  content: string;
  folderId?: string | null; // null for documents in root
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt?: Date;
  size: number; // Size in bytes
  fileType: string; // MIME type or extension
  version: number;
  isShared: boolean;
  collaborators: Array<{
    id: string;
    name: string;
    email: string;
    permission?: 'read' | 'write' | 'admin';
  }>;
  metadata?: {
    description?: string;
    tags?: string[];
    starred?: boolean;
    color?: string;
    thumbnail?: string;
  };
}

/**
 * Interface for creating a new document
 */
export interface CreateDocumentDto {
  title: string;
  content?: string;
  folderId?: string | null;
  fileType: string;
  metadata?: {
    description?: string;
    tags?: string[];
    color?: string;
  };
}

/**
 * Interface for updating a document
 */
export interface UpdateDocumentDto {
  title?: string;
  content?: string;
  folderId?: string | null;
  metadata?: {
    description?: string;
    tags?: string[];
    starred?: boolean;
    color?: string;
  };
}

/**
 * Interface for document sharing
 */
export interface ShareDocumentDto {
  userIds: string[];
  permission: 'read' | 'write' | 'admin';
}

/**
 * Calculate the size of a document in bytes
 * @param content The document content
 * @returns The size in bytes
 */
export function calculateDocumentSize(content: string = ''): number {
  // In a real implementation, this would be more sophisticated
  // and would account for binary data, metadata, etc.
  return Buffer.from(content).length;
}

/**
 * Get file type from filename or MIME type
 * @param filename The filename or MIME type
 * @returns The file type (extension)
 */
export function getFileType(filename: string): string {
  if (filename.includes('/')) {
    // This is a MIME type
    const parts = filename.split('/');
    return parts[parts.length - 1];
  }
  
  // Extract extension from filename
  const parts = filename.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1].toLowerCase();
  }
  
  return 'unknown';
}
