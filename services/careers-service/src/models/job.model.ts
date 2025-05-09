/**
 * Job model interfaces for the careers service
 */

export interface JobListing {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string; // Full-time, Part-time, Contract, etc.
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  featured: boolean;
  published: boolean;
  applicationLink?: string;
  applicationEmail?: string;
  postedDate: string;
  closingDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: string; // URL to resume file
  coverLetter?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  referral?: string;
  status: 'new' | 'reviewing' | 'interview' | 'offer' | 'rejected' | 'hired';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description?: string;
  jobCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  country?: string;
  remote: boolean;
  jobCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  jobs: Omit<JobListing, 'responsibilities' | 'requirements' | 'benefits'>[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateJobDto {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  featured?: boolean;
  published?: boolean;
  applicationLink?: string;
  applicationEmail?: string;
  closingDate?: string;
}

export interface UpdateJobDto {
  title?: string;
  department?: string;
  location?: string;
  type?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  featured?: boolean;
  published?: boolean;
  applicationLink?: string;
  applicationEmail?: string;
  closingDate?: string;
}

export interface CreateApplicationDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  referral?: string;
}

export interface UpdateApplicationDto {
  status?: 'new' | 'reviewing' | 'interview' | 'offer' | 'rejected' | 'hired';
  notes?: string;
}
