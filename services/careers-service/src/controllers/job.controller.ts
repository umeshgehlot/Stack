import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ObjectId } from 'mongodb';
import slugify from 'slugify';
import { 
  JobListing, 
  JobApplication, 
  CreateJobDto, 
  UpdateJobDto, 
  CreateApplicationDto, 
  UpdateApplicationDto 
} from '../models/job.model';

export class JobController {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * Get all job listings with filtering and pagination
   */
  async getJobs(request: FastifyRequest<{
    Querystring: {
      department?: string;
      location?: string;
      type?: string;
      featured?: boolean;
      published?: boolean;
      search?: string;
      limit?: number;
      page?: number;
    }
  }>, reply: FastifyReply) {
    try {
      const { 
        department, 
        location, 
        type, 
        featured, 
        published = true, 
        search,
        limit = 10, 
        page = 1 
      } = request.query;
      
      const skip = (page - 1) * limit;
      
      // Build query
      const query: any = {};
      
      if (department) query.department = department;
      if (location) query.location = location;
      if (type) query.type = type;
      if (featured !== undefined) query.featured = featured;
      if (published !== undefined) query.published = published;
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Get total count
      const total = await this.fastify.db.collection('jobs').countDocuments(query);
      
      // Get jobs
      const jobs = await this.fastify.db.collection('jobs')
        .find(query)
        .project({
          responsibilities: 0,
          requirements: 0,
          benefits: 0
        })
        .sort({ featured: -1, postedDate: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      // Calculate total pages
      const totalPages = Math.ceil(total / limit);
      
      return reply.code(200).send({
        jobs,
        total,
        page,
        limit,
        totalPages
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve job listings' });
    }
  }

  /**
   * Get featured job listings
   */
  async getFeaturedJobs(request: FastifyRequest, reply: FastifyReply) {
    try {
      const jobs = await this.fastify.db.collection('jobs')
        .find({ featured: true, published: true })
        .project({
          responsibilities: 0,
          requirements: 0,
          benefits: 0
        })
        .sort({ postedDate: -1 })
        .limit(6)
        .toArray();
      
      return reply.code(200).send(jobs);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve featured job listings' });
    }
  }

  /**
   * Get job listing by slug
   */
  async getJobBySlug(request: FastifyRequest<{
    Params: { slug: string }
  }>, reply: FastifyReply) {
    try {
      const { slug } = request.params;
      
      const job = await this.fastify.db.collection('jobs').findOne({ slug });
      
      if (!job) {
        return reply.code(404).send({ error: 'Job listing not found' });
      }
      
      return reply.code(200).send(job);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve job listing' });
    }
  }

  /**
   * Create a new job listing
   */
  async createJob(request: FastifyRequest<{
    Body: CreateJobDto;
  }>, reply: FastifyReply) {
    try {
      const { 
        title, 
        department, 
        location, 
        type, 
        description, 
        responsibilities, 
        requirements, 
        benefits,
        salary,
        featured = false,
        published = true,
        applicationLink,
        applicationEmail,
        closingDate
      } = request.body;
      
      // Generate slug
      let slug = slugify(title, { lower: true, strict: true });
      
      // Check if slug already exists
      const existingJob = await this.fastify.db.collection('jobs').findOne({ slug });
      
      if (existingJob) {
        // Append random string to slug to make it unique
        slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
      }
      
      const now = new Date().toISOString();
      
      const job: JobListing = {
        id: new ObjectId().toString(),
        title,
        slug,
        department,
        location,
        type,
        description,
        responsibilities,
        requirements,
        benefits,
        salary,
        featured,
        published,
        applicationLink,
        applicationEmail,
        postedDate: now,
        closingDate,
        createdAt: now,
        updatedAt: now
      };
      
      await this.fastify.db.collection('jobs').insertOne(job);
      
      // Publish event for job creation
      await this.fastify.redis.publish('job:created', JSON.stringify(job));
      
      return reply.code(201).send(job);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to create job listing' });
    }
  }

  /**
   * Update a job listing
   */
  async updateJob(request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateJobDto;
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const updateData = request.body;
      
      // Check if job exists
      const job = await this.fastify.db.collection('jobs').findOne({ id });
      
      if (!job) {
        return reply.code(404).send({ error: 'Job listing not found' });
      }
      
      // If title is updated, update slug as well
      if (updateData.title) {
        let newSlug = slugify(updateData.title, { lower: true, strict: true });
        
        // Check if new slug already exists and is not the current job
        const existingJob = await this.fastify.db.collection('jobs').findOne({ 
          slug: newSlug, 
          id: { $ne: id } 
        });
        
        if (existingJob) {
          // Append random string to slug to make it unique
          newSlug = `${newSlug}-${Math.random().toString(36).substring(2, 8)}`;
        }
        
        updateData.slug = newSlug;
      }
      
      // Update job
      const now = new Date().toISOString();
      
      const result = await this.fastify.db.collection('jobs').findOneAndUpdate(
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
        return reply.code(404).send({ error: 'Job listing not found' });
      }
      
      // Publish event for job update
      await this.fastify.redis.publish('job:updated', JSON.stringify(result));
      
      return reply.code(200).send(result);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to update job listing' });
    }
  }

  /**
   * Delete a job listing
   */
  async deleteJob(request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      // Check if job exists
      const job = await this.fastify.db.collection('jobs').findOne({ id });
      
      if (!job) {
        return reply.code(404).send({ error: 'Job listing not found' });
      }
      
      // Delete job
      await this.fastify.db.collection('jobs').deleteOne({ id });
      
      // Publish event for job deletion
      await this.fastify.redis.publish('job:deleted', JSON.stringify({ id }));
      
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete job listing' });
    }
  }

  /**
   * Submit a job application
   */
  async submitApplication(request: FastifyRequest<{
    Params: { jobId: string };
    Body: CreateApplicationDto;
  }>, reply: FastifyReply) {
    try {
      const { jobId } = request.params;
      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        resume, 
        coverLetter,
        linkedIn,
        github,
        portfolio,
        referral
      } = request.body;
      
      // Check if job exists
      const job = await this.fastify.db.collection('jobs').findOne({ id: jobId });
      
      if (!job) {
        return reply.code(404).send({ error: 'Job listing not found' });
      }
      
      // Check if application already exists
      const existingApplication = await this.fastify.db.collection('applications').findOne({
        jobId,
        email
      });
      
      if (existingApplication) {
        return reply.code(409).send({ 
          error: 'You have already applied for this position' 
        });
      }
      
      const now = new Date().toISOString();
      
      const application: JobApplication = {
        id: new ObjectId().toString(),
        jobId,
        firstName,
        lastName,
        email,
        phone,
        resume,
        coverLetter,
        linkedIn,
        github,
        portfolio,
        referral,
        status: 'new',
        createdAt: now,
        updatedAt: now
      };
      
      await this.fastify.db.collection('applications').insertOne(application);
      
      // Publish event for application submission
      await this.fastify.redis.publish('application:submitted', JSON.stringify({
        id: application.id,
        jobId,
        jobTitle: job.title,
        applicantName: `${firstName} ${lastName}`,
        applicantEmail: email
      }));
      
      return reply.code(201).send({
        id: application.id,
        jobId,
        jobTitle: job.title,
        status: 'new',
        message: 'Your application has been submitted successfully'
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to submit application' });
    }
  }

  /**
   * Get all applications for a job
   */
  async getApplications(request: FastifyRequest<{
    Params: { jobId: string };
    Querystring: {
      status?: 'new' | 'reviewing' | 'interview' | 'offer' | 'rejected' | 'hired';
      limit?: number;
      page?: number;
    }
  }>, reply: FastifyReply) {
    try {
      const { jobId } = request.params;
      const { status, limit = 10, page = 1 } = request.query;
      
      const skip = (page - 1) * limit;
      
      // Build query
      const query: any = { jobId };
      
      if (status) query.status = status;
      
      // Get total count
      const total = await this.fastify.db.collection('applications').countDocuments(query);
      
      // Get applications
      const applications = await this.fastify.db.collection('applications')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      // Calculate total pages
      const totalPages = Math.ceil(total / limit);
      
      return reply.code(200).send({
        applications,
        total,
        page,
        limit,
        totalPages
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve applications' });
    }
  }

  /**
   * Update application status
   */
  async updateApplication(request: FastifyRequest<{
    Params: { jobId: string; applicationId: string };
    Body: UpdateApplicationDto;
  }>, reply: FastifyReply) {
    try {
      const { jobId, applicationId } = request.params;
      const { status, notes } = request.body;
      
      // Check if application exists
      const application = await this.fastify.db.collection('applications').findOne({
        id: applicationId,
        jobId
      });
      
      if (!application) {
        return reply.code(404).send({ error: 'Application not found' });
      }
      
      // Update application
      const now = new Date().toISOString();
      
      const result = await this.fastify.db.collection('applications').findOneAndUpdate(
        { id: applicationId, jobId },
        { 
          $set: {
            status: status || application.status,
            notes: notes || application.notes,
            updatedAt: now
          } 
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return reply.code(404).send({ error: 'Application not found' });
      }
      
      // Publish event for application update
      await this.fastify.redis.publish('application:updated', JSON.stringify({
        id: applicationId,
        jobId,
        status: result.status
      }));
      
      return reply.code(200).send(result);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to update application' });
    }
  }

  /**
   * Get departments with job counts
   */
  async getDepartments(request: FastifyRequest, reply: FastifyReply) {
    try {
      const departments = await this.fastify.db.collection('jobs').aggregate([
        { $match: { published: true } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', count: 1 } },
        { $sort: { name: 1 } }
      ]).toArray();
      
      return reply.code(200).send(departments);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve departments' });
    }
  }

  /**
   * Get locations with job counts
   */
  async getLocations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const locations = await this.fastify.db.collection('jobs').aggregate([
        { $match: { published: true } },
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', count: 1 } },
        { $sort: { name: 1 } }
      ]).toArray();
      
      return reply.code(200).send(locations);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve locations' });
    }
  }
}
