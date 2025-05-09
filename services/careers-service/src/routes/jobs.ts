import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { JobController } from '../controllers/job.controller';

// Define request/response schemas for validation
const jobCreateSchema = Type.Object({
  title: Type.String(),
  department: Type.String(),
  location: Type.String(),
  type: Type.String(),
  description: Type.String(),
  responsibilities: Type.Array(Type.String()),
  requirements: Type.Array(Type.String()),
  benefits: Type.Array(Type.String()),
  salary: Type.Optional(Type.Object({
    min: Type.Number(),
    max: Type.Number(),
    currency: Type.String()
  })),
  featured: Type.Optional(Type.Boolean()),
  published: Type.Optional(Type.Boolean()),
  applicationLink: Type.Optional(Type.String()),
  applicationEmail: Type.Optional(Type.String()),
  closingDate: Type.Optional(Type.String())
});

const jobUpdateSchema = Type.Object({
  title: Type.Optional(Type.String()),
  department: Type.Optional(Type.String()),
  location: Type.Optional(Type.String()),
  type: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  responsibilities: Type.Optional(Type.Array(Type.String())),
  requirements: Type.Optional(Type.Array(Type.String())),
  benefits: Type.Optional(Type.Array(Type.String())),
  salary: Type.Optional(Type.Object({
    min: Type.Number(),
    max: Type.Number(),
    currency: Type.String()
  })),
  featured: Type.Optional(Type.Boolean()),
  published: Type.Optional(Type.Boolean()),
  applicationLink: Type.Optional(Type.String()),
  applicationEmail: Type.Optional(Type.String()),
  closingDate: Type.Optional(Type.String())
});

const applicationCreateSchema = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String({ format: 'email' }),
  phone: Type.String(),
  resume: Type.String(),
  coverLetter: Type.Optional(Type.String()),
  linkedIn: Type.Optional(Type.String()),
  github: Type.Optional(Type.String()),
  portfolio: Type.Optional(Type.String()),
  referral: Type.Optional(Type.String())
});

const applicationUpdateSchema = Type.Object({
  status: Type.Optional(Type.Enum({
    new: 'new',
    reviewing: 'reviewing',
    interview: 'interview',
    offer: 'offer',
    rejected: 'rejected',
    hired: 'hired'
  })),
  notes: Type.Optional(Type.String())
});

const jobParamsSchema = Type.Object({
  id: Type.String()
});

const slugParamsSchema = Type.Object({
  slug: Type.String()
});

const applicationParamsSchema = Type.Object({
  jobId: Type.String(),
  applicationId: Type.String()
});

const jobQuerySchema = Type.Object({
  department: Type.Optional(Type.String()),
  location: Type.Optional(Type.String()),
  type: Type.Optional(Type.String()),
  featured: Type.Optional(Type.Boolean()),
  published: Type.Optional(Type.Boolean()),
  search: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Number()),
  page: Type.Optional(Type.Number())
});

const applicationQuerySchema = Type.Object({
  status: Type.Optional(Type.Enum({
    new: 'new',
    reviewing: 'reviewing',
    interview: 'interview',
    offer: 'offer',
    rejected: 'rejected',
    hired: 'hired'
  })),
  limit: Type.Optional(Type.Number()),
  page: Type.Optional(Type.Number())
});

// Define route handler
export default async function jobRoutes(fastify: FastifyInstance) {
  const jobController = new JobController(fastify);

  // Get all jobs with filtering and pagination
  fastify.get('/', {
    schema: {
      querystring: jobQuerySchema,
      response: {
        200: Type.Object({
          jobs: Type.Array(Type.Object({
            id: Type.String(),
            title: Type.String(),
            slug: Type.String(),
            department: Type.String(),
            location: Type.String(),
            type: Type.String(),
            description: Type.String(),
            featured: Type.Boolean(),
            published: Type.Boolean(),
            postedDate: Type.String({ format: 'date-time' }),
            closingDate: Type.Optional(Type.String({ format: 'date-time' })),
            createdAt: Type.String({ format: 'date-time' }),
            updatedAt: Type.String({ format: 'date-time' })
          })),
          total: Type.Number(),
          page: Type.Number(),
          limit: Type.Number(),
          totalPages: Type.Number()
        })
      }
    }
  }, (request, reply) => jobController.getJobs(request, reply));

  // Get featured jobs
  fastify.get('/featured', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          title: Type.String(),
          slug: Type.String(),
          department: Type.String(),
          location: Type.String(),
          type: Type.String(),
          description: Type.String(),
          featured: Type.Boolean(),
          published: Type.Boolean(),
          postedDate: Type.String({ format: 'date-time' }),
          closingDate: Type.Optional(Type.String({ format: 'date-time' })),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        }))
      }
    }
  }, (request, reply) => jobController.getFeaturedJobs(request, reply));

  // Get job by slug
  fastify.get('/:slug', {
    schema: {
      params: slugParamsSchema,
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          slug: Type.String(),
          department: Type.String(),
          location: Type.String(),
          type: Type.String(),
          description: Type.String(),
          responsibilities: Type.Array(Type.String()),
          requirements: Type.Array(Type.String()),
          benefits: Type.Array(Type.String()),
          salary: Type.Optional(Type.Object({
            min: Type.Number(),
            max: Type.Number(),
            currency: Type.String()
          })),
          featured: Type.Boolean(),
          published: Type.Boolean(),
          applicationLink: Type.Optional(Type.String()),
          applicationEmail: Type.Optional(Type.String()),
          postedDate: Type.String({ format: 'date-time' }),
          closingDate: Type.Optional(Type.String({ format: 'date-time' })),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        })
      }
    }
  }, (request, reply) => jobController.getJobBySlug(request, reply));

  // Create a new job
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: jobCreateSchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          title: Type.String(),
          slug: Type.String(),
          department: Type.String(),
          location: Type.String(),
          type: Type.String(),
          description: Type.String(),
          responsibilities: Type.Array(Type.String()),
          requirements: Type.Array(Type.String()),
          benefits: Type.Array(Type.String()),
          salary: Type.Optional(Type.Object({
            min: Type.Number(),
            max: Type.Number(),
            currency: Type.String()
          })),
          featured: Type.Boolean(),
          published: Type.Boolean(),
          applicationLink: Type.Optional(Type.String()),
          applicationEmail: Type.Optional(Type.String()),
          postedDate: Type.String({ format: 'date-time' }),
          closingDate: Type.Optional(Type.String({ format: 'date-time' })),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        })
      }
    }
  }, (request, reply) => jobController.createJob(request, reply));

  // Update a job
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: jobParamsSchema,
      body: jobUpdateSchema,
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          slug: Type.String(),
          department: Type.String(),
          location: Type.String(),
          type: Type.String(),
          description: Type.String(),
          responsibilities: Type.Array(Type.String()),
          requirements: Type.Array(Type.String()),
          benefits: Type.Array(Type.String()),
          salary: Type.Optional(Type.Object({
            min: Type.Number(),
            max: Type.Number(),
            currency: Type.String()
          })),
          featured: Type.Boolean(),
          published: Type.Boolean(),
          applicationLink: Type.Optional(Type.String()),
          applicationEmail: Type.Optional(Type.String()),
          postedDate: Type.String({ format: 'date-time' }),
          closingDate: Type.Optional(Type.String({ format: 'date-time' })),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        })
      }
    }
  }, (request, reply) => jobController.updateJob(request, reply));

  // Delete a job
  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: jobParamsSchema
    }
  }, (request, reply) => jobController.deleteJob(request, reply));

  // Submit application for a job
  fastify.post('/:jobId/apply', {
    schema: {
      params: Type.Object({
        jobId: Type.String()
      }),
      body: applicationCreateSchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          jobId: Type.String(),
          jobTitle: Type.String(),
          status: Type.String(),
          message: Type.String()
        })
      }
    }
  }, (request, reply) => jobController.submitApplication(request, reply));

  // Get applications for a job
  fastify.get('/:jobId/applications', {
    onRequest: [fastify.authenticate],
    schema: {
      params: Type.Object({
        jobId: Type.String()
      }),
      querystring: applicationQuerySchema,
      response: {
        200: Type.Object({
          applications: Type.Array(Type.Object({
            id: Type.String(),
            jobId: Type.String(),
            firstName: Type.String(),
            lastName: Type.String(),
            email: Type.String(),
            phone: Type.String(),
            resume: Type.String(),
            coverLetter: Type.Optional(Type.String()),
            linkedIn: Type.Optional(Type.String()),
            github: Type.Optional(Type.String()),
            portfolio: Type.Optional(Type.String()),
            referral: Type.Optional(Type.String()),
            status: Type.String(),
            notes: Type.Optional(Type.String()),
            createdAt: Type.String({ format: 'date-time' }),
            updatedAt: Type.String({ format: 'date-time' })
          })),
          total: Type.Number(),
          page: Type.Number(),
          limit: Type.Number(),
          totalPages: Type.Number()
        })
      }
    }
  }, (request, reply) => jobController.getApplications(request, reply));

  // Update application status
  fastify.put('/:jobId/applications/:applicationId', {
    onRequest: [fastify.authenticate],
    schema: {
      params: applicationParamsSchema,
      body: applicationUpdateSchema,
      response: {
        200: Type.Object({
          id: Type.String(),
          jobId: Type.String(),
          firstName: Type.String(),
          lastName: Type.String(),
          email: Type.String(),
          phone: Type.String(),
          resume: Type.String(),
          coverLetter: Type.Optional(Type.String()),
          linkedIn: Type.Optional(Type.String()),
          github: Type.Optional(Type.String()),
          portfolio: Type.Optional(Type.String()),
          referral: Type.Optional(Type.String()),
          status: Type.String(),
          notes: Type.Optional(Type.String()),
          createdAt: Type.String({ format: 'date-time' }),
          updatedAt: Type.String({ format: 'date-time' })
        })
      }
    }
  }, (request, reply) => jobController.updateApplication(request, reply));

  // Get departments with job counts
  fastify.get('/departments', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          name: Type.String(),
          count: Type.Number()
        }))
      }
    }
  }, (request, reply) => jobController.getDepartments(request, reply));

  // Get locations with job counts
  fastify.get('/locations', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          name: Type.String(),
          count: Type.Number()
        }))
      }
    }
  }, (request, reply) => jobController.getLocations(request, reply));
}
