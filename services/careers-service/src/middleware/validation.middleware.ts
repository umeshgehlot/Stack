import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Middleware to validate job title
 */
export const validateJobTitle = async (
  request: FastifyRequest<{ Body: { title: string } }>,
  reply: FastifyReply
) => {
  const { title } = request.body;
  
  if (!title || title.trim().length === 0) {
    return reply.code(400).send({ error: 'Job title is required' });
  }
  
  if (title.length > 255) {
    return reply.code(400).send({ error: 'Job title cannot exceed 255 characters' });
  }
};

/**
 * Middleware to validate job description
 */
export const validateJobDescription = async (
  request: FastifyRequest<{ Body: { description: string } }>,
  reply: FastifyReply
) => {
  const { description } = request.body;
  
  if (!description || description.trim().length === 0) {
    return reply.code(400).send({ error: 'Job description is required' });
  }
  
  if (description.length > 10000) {
    return reply.code(400).send({ error: 'Job description cannot exceed 10,000 characters' });
  }
};

/**
 * Middleware to validate department
 */
export const validateDepartment = async (
  request: FastifyRequest<{ Body: { department: string } }>,
  reply: FastifyReply
) => {
  const { department } = request.body;
  
  if (!department || department.trim().length === 0) {
    return reply.code(400).send({ error: 'Department is required' });
  }
  
  // Valid departments
  const validDepartments = [
    'engineering', 
    'product', 
    'design', 
    'marketing', 
    'sales', 
    'customer-success',
    'operations',
    'finance',
    'hr',
    'legal'
  ];
  
  if (!validDepartments.includes(department)) {
    return reply.code(400).send({ 
      error: 'Invalid department',
      validDepartments
    });
  }
};

/**
 * Middleware to validate location
 */
export const validateLocation = async (
  request: FastifyRequest<{ Body: { location: string } }>,
  reply: FastifyReply
) => {
  const { location } = request.body;
  
  if (!location || location.trim().length === 0) {
    return reply.code(400).send({ error: 'Location is required' });
  }
  
  // Valid locations
  const validLocations = [
    'san-francisco', 
    'new-york', 
    'london', 
    'remote',
    'berlin',
    'tokyo',
    'sydney',
    'toronto',
    'singapore'
  ];
  
  if (!validLocations.includes(location)) {
    return reply.code(400).send({ 
      error: 'Invalid location',
      validLocations
    });
  }
};

/**
 * Middleware to validate job type
 */
export const validateJobType = async (
  request: FastifyRequest<{ Body: { type: string } }>,
  reply: FastifyReply
) => {
  const { type } = request.body;
  
  if (!type || type.trim().length === 0) {
    return reply.code(400).send({ error: 'Job type is required' });
  }
  
  // Valid job types
  const validTypes = [
    'Full-time', 
    'Part-time', 
    'Contract', 
    'Internship',
    'Temporary'
  ];
  
  if (!validTypes.includes(type)) {
    return reply.code(400).send({ 
      error: 'Invalid job type',
      validTypes
    });
  }
};

/**
 * Middleware to validate applicant name
 */
export const validateApplicantName = async (
  request: FastifyRequest<{ Body: { firstName: string; lastName: string } }>,
  reply: FastifyReply
) => {
  const { firstName, lastName } = request.body;
  
  if (!firstName || firstName.trim().length === 0) {
    return reply.code(400).send({ error: 'First name is required' });
  }
  
  if (firstName.length > 100) {
    return reply.code(400).send({ error: 'First name cannot exceed 100 characters' });
  }
  
  if (!lastName || lastName.trim().length === 0) {
    return reply.code(400).send({ error: 'Last name is required' });
  }
  
  if (lastName.length > 100) {
    return reply.code(400).send({ error: 'Last name cannot exceed 100 characters' });
  }
};

/**
 * Middleware to validate applicant email
 */
export const validateApplicantEmail = async (
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) => {
  const { email } = request.body;
  
  if (!email || email.trim().length === 0) {
    return reply.code(400).send({ error: 'Email is required' });
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return reply.code(400).send({ error: 'Invalid email format' });
  }
};

/**
 * Middleware to validate applicant phone
 */
export const validateApplicantPhone = async (
  request: FastifyRequest<{ Body: { phone: string } }>,
  reply: FastifyReply
) => {
  const { phone } = request.body;
  
  if (!phone || phone.trim().length === 0) {
    return reply.code(400).send({ error: 'Phone number is required' });
  }
  
  // Simple phone validation (allow numbers, spaces, dashes, parentheses, and plus sign)
  const phoneRegex = /^[0-9\s\-\(\)\+]+$/;
  if (!phoneRegex.test(phone)) {
    return reply.code(400).send({ error: 'Invalid phone format' });
  }
};

/**
 * Middleware to validate resume URL
 */
export const validateResumeUrl = async (
  request: FastifyRequest<{ Body: { resume: string } }>,
  reply: FastifyReply
) => {
  const { resume } = request.body;
  
  if (!resume || resume.trim().length === 0) {
    return reply.code(400).send({ error: 'Resume URL is required' });
  }
  
  // Simple URL validation
  try {
    new URL(resume);
  } catch (err) {
    return reply.code(400).send({ error: 'Invalid resume URL' });
  }
};

/**
 * Middleware to validate ObjectId format
 */
export const validateObjectId = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return reply.code(400).send({ error: 'Invalid ID format' });
  }
};
