/**
 * Task model interfaces for the task service
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  boardId: string;
  columnId: string;
  position: number;
  labels: string[];
  attachments: Attachment[];
  checklists: Checklist[];
  comments: Comment[];
  customFields: CustomField[];
  watchers: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'archived' | string;

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  createdBy: string;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  mentions: string[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox';
  value: any;
  options?: { id: string; label: string; color?: string }[];
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  ownerName: string;
  teamId?: string;
  teamName?: string;
  visibility: 'private' | 'team' | 'public';
  background?: {
    type: 'color' | 'image';
    value: string;
  };
  columns: Column[];
  labels: Label[];
  customFields: CustomFieldDefinition[];
  members: BoardMember[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  name: string;
  position: number;
  taskLimit?: number;
  taskCount: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox';
  required: boolean;
  options?: { id: string; label: string; color?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardMember {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  ownerName: string;
  visibility: 'private' | 'team' | 'public';
  members: WorkspaceMember[];
  boards: WorkspaceBoard[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface WorkspaceBoard {
  id: string;
  name: string;
  description?: string;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating and updating tasks
export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  boardId: string;
  columnId: string;
  position?: number;
  labels?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  boardId?: string;
  columnId?: string;
  position?: number;
  labels?: string[];
}

export interface CreateBoardDto {
  name: string;
  description?: string;
  teamId?: string;
  visibility?: 'private' | 'team' | 'public';
  background?: {
    type: 'color' | 'image';
    value: string;
  };
  columns?: {
    name: string;
    position: number;
    taskLimit?: number;
    color?: string;
  }[];
}

export interface UpdateBoardDto {
  name?: string;
  description?: string;
  teamId?: string;
  visibility?: 'private' | 'team' | 'public';
  background?: {
    type: 'color' | 'image';
    value: string;
  };
}

export interface CreateColumnDto {
  name: string;
  position: number;
  taskLimit?: number;
  color?: string;
}

export interface UpdateColumnDto {
  name?: string;
  position?: number;
  taskLimit?: number;
  color?: string;
}

export interface CreateLabelDto {
  name: string;
  color: string;
}

export interface UpdateLabelDto {
  name?: string;
  color?: string;
}

export interface CreateCommentDto {
  text: string;
  mentions?: string[];
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface UpdateCommentDto {
  text: string;
  mentions?: string[];
}

export interface CreateChecklistDto {
  title: string;
  items?: {
    text: string;
    completed?: boolean;
    assigneeId?: string;
    dueDate?: string;
  }[];
}

export interface UpdateChecklistDto {
  title?: string;
}

export interface CreateChecklistItemDto {
  text: string;
  completed?: boolean;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateChecklistItemDto {
  text?: string;
  completed?: boolean;
  assigneeId?: string;
  dueDate?: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BoardsResponse {
  boards: Board[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
