import { ObjectId } from 'mongodb';

/**
 * Interface representing a blog post
 */
export interface BlogPost {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
  };
  date: Date;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  views: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface representing a blog post comment
 */
export interface Comment {
  _id?: ObjectId;
  postId: string;
  name: string;
  email: string;
  content: string;
  avatar?: string;
  title?: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for creating a new blog post
 */
export interface CreatePostDto {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  authorId: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
  published?: boolean;
}

/**
 * Interface for updating a blog post
 */
export interface UpdatePostDto {
  title?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
}

/**
 * Interface for creating a new comment
 */
export interface CreateCommentDto {
  name: string;
  email: string;
  content: string;
  title?: string;
}

/**
 * Interface for updating a comment
 */
export interface UpdateCommentDto {
  approved?: boolean;
}

/**
 * Interface for blog post query parameters
 */
export interface PostQueryParams {
  category?: string;
  tag?: string;
  featured?: boolean;
  published?: boolean;
  authorId?: string;
  search?: string;
  limit?: number;
  page?: number;
}

/**
 * Interface for blog post response with pagination
 */
export interface PostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Generate a slug from a title
 * @param title The post title
 * @returns A URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
