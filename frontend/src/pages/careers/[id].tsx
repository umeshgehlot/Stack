import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, 
  Box, List, ThemeIcon, Divider
} from '@mantine/core';
import { 
  IconBriefcase, IconMapPin, IconClock, IconArrowLeft,
  IconCheck, IconSend
} from '@tabler/icons-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CookieConsent from '../../components/CookieConsent';
import FloatingChatButton from '../../components/FloatingChatButton';
import BackToTopButton from '../../components/BackToTopButton';

// Job categories
const categories = [
  { value: 'all', label: 'All Departments' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'customer-success', label: 'Customer Success' }
];

// Job locations
const locations = [
  { value: 'all', label: 'All Locations' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'new-york', label: 'New York' },
  { value: 'london', label: 'London' },
  { value: 'remote', label: 'Remote' }
];

// Job listings
const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    department: 'engineering',
    location: 'san-francisco',
    type: 'Full-time',
    description: 'We\'re looking for a Senior Frontend Engineer to help build and improve our web application. You\'ll work closely with designers and backend engineers to create a seamless user experience.',
    responsibilities: [
      'Develop new user-facing features using React and TypeScript',
      'Build reusable components and libraries for future use',
      'Optimize applications for maximum speed and scalability',
      'Collaborate with cross-functional teams to define, design, and ship new features'
    ],
    requirements: [
      '5+ years of experience in frontend development',
      'Strong proficiency in JavaScript, TypeScript, and React',
      'Experience with responsive design and CSS frameworks',
      'Familiarity with RESTful APIs and GraphQL'
    ]
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'product',
    location: 'new-york',
    type: 'Full-time',
    description: 'We\'re seeking a Product Manager to help define and execute our product strategy. You\'ll work with engineering, design, and marketing teams to deliver features that delight our customers.',
    responsibilities: [
      'Define product requirements and create detailed specifications',
      'Work with engineering and design teams to deliver high-quality features',
      'Analyze user feedback and usage metrics to inform product decisions',
      'Prioritize features and create roadmaps for product development'
    ],
    requirements: [
      '3+ years of experience in product management',
      'Strong analytical and problem-solving skills',
      'Excellent communication and presentation abilities',
      'Experience with agile development methodologies'
    ]
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    department: 'design',
    location: 'london',
    type: 'Full-time',
    description: 'We\'re looking for a talented UX/UI Designer to create beautiful, intuitive interfaces for our web and mobile applications. You\'ll work closely with product managers and engineers to deliver a seamless user experience.',
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity mockups',
      'Conduct user research and usability testing',
      'Develop and maintain design systems and style guides',
      'Collaborate with engineers to implement designs accurately'
    ],
    requirements: [
      '3+ years of experience in UX/UI design',
      'Proficiency in design tools such as Figma or Sketch',
      'Strong portfolio demonstrating your design process',
      'Experience with responsive design and accessibility'
    ]
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    department: 'engineering',
    location: 'remote',
    type: 'Full-time',
    description: 'We\'re seeking a DevOps Engineer to help build and maintain our infrastructure. You\'ll work with the engineering team to ensure our systems are reliable, scalable, and secure.',
    responsibilities: [
      'Design, implement, and maintain CI/CD pipelines',
      'Manage cloud infrastructure using AWS or GCP',
      'Monitor system performance and troubleshoot issues',
      'Implement security best practices and ensure compliance'
    ],
    requirements: [
      '3+ years of experience in DevOps or SRE roles',
      'Strong knowledge of Linux/Unix systems',
      'Experience with containerization (Docker, Kubernetes)',
      'Familiarity with infrastructure as code (Terraform, CloudFormation)'
    ]
  },
  {
    id: 5,
    title: 'Content Marketing Manager',
    department: 'marketing',
    location: 'san-francisco',
    type: 'Full-time',
    description: 'We\'re looking for a Content Marketing Manager to create compelling content that drives engagement and conversions. You\'ll work with the marketing team to develop and execute our content strategy.',
    responsibilities: [
      'Create and manage a content calendar for blog posts, case studies, and whitepapers',
      'Write and edit high-quality content for various channels',
      'Collaborate with design and product teams to create effective marketing materials',
      'Analyze content performance and optimize for better results'
    ],
    requirements: [
      '3+ years of experience in content marketing',
      'Excellent writing and editing skills',
      'Knowledge of SEO best practices',
      'Experience with content management systems'
    ]
  },
  {
    id: 6,
    title: 'Customer Success Manager',
    department: 'customer-success',
    location: 'new-york',
    type: 'Full-time',
    description: 'We\'re seeking a Customer Success Manager to ensure our customers get the most value from our platform. You\'ll work directly with customers to understand their needs and help them achieve their goals.',
    responsibilities: [
      'Onboard new customers and provide training on our platform',
      'Develop and maintain strong relationships with key accounts',
      'Identify upsell opportunities and work with sales team to execute',
      'Collect and share customer feedback with product and engineering teams'
    ],
    requirements: [
      '3+ years of experience in customer success or account management',
      'Strong communication and presentation skills',
      'Experience with CRM software (Salesforce, HubSpot)',
      'Ability to understand technical concepts and explain them clearly'
    ]
  },
  {
    id: 7,
    title: 'Sales Development Representative',
    department: 'sales',
    location: 'london',
    type: 'Full-time',
    description: 'We\'re looking for a Sales Development Representative to help grow our customer base. You\'ll work with the sales team to identify and qualify leads, setting the stage for successful sales conversations.',
    responsibilities: [
      'Prospect and qualify new sales opportunities',
      'Conduct outreach via email, phone, and social media',
      'Schedule meetings for Account Executives with qualified prospects',
      'Research accounts and identify key stakeholders'
    ],
    requirements: [
      '1+ years of experience in sales or business development',
      'Excellent communication and interpersonal skills',
      'Strong organizational and time management abilities',
      'Experience with CRM software (Salesforce, HubSpot)'
    ]
  },
  {
    id: 8,
    title: 'Backend Engineer',
    department: 'engineering',
    location: 'remote',
    type: 'Full-time',
    description: 'We\'re seeking a Backend Engineer to help build and scale our API and services. You\'ll work with the engineering team to design and implement robust, high-performance systems.',
    responsibilities: [
      'Design and implement scalable backend services',
      'Optimize database queries and improve performance',
      'Implement security best practices and ensure data protection',
      'Collaborate with frontend engineers to integrate APIs'
    ],
    requirements: [
      '3+ years of experience in backend development',
      'Strong proficiency in languages such as Python, Node.js, or Go',
      'Experience with databases (SQL and NoSQL)',
      'Knowledge of RESTful APIs and microservices architecture'
    ]
  }
];

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  // Find the job by ID
  const job = jobs.find(job => job.id === Number(id));
  
  // If job not found or ID is not yet available (during SSR)
  if (!job && id) {
    return (
      <div>
        <Head>
          <title>Job Not Found | Stack</title>
          <meta name="description" content="The job you're looking for could not be found." />
        </Head>

        <Navbar />
        
        <Container size="lg" py={100} sx={{ textAlign: 'center' }}>
          <Title order={1} mb={20}>Job Not Found</Title>
          <Text size="lg" mb={30}>The job position you're looking for could not be found.</Text>
          <Button 
            component={Link}
            href="/careers"
            leftIcon={<IconArrowLeft size={16} />}
            size="lg"
            radius="xl"
            sx={{ 
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              padding: '0 35px',
              height: 54
            }}
          >
            Back to Careers
          </Button>
        </Container>
        
        <Footer />
        <CookieConsent />
        <FloatingChatButton />
        <BackToTopButton />
      </div>
    );
  }
  
  // If ID is not yet available (during SSR)
  if (!id) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>{job?.title || 'Job Position'} | Stack</title>
        <meta name="description" content={job?.description || 'Join our team at Stack and help build the future of collaboration.'} />
      </Head>

      <Navbar />
      
      {/* Job Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
          color: 'white',
          padding: '120px 0 80px',
          marginTop: '-1px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container size="lg">
          <Button 
            component={Link}
            href="/careers"
            variant="white"
            leftIcon={<IconArrowLeft size={16} />}
            radius="xl"
            mb={30}
            sx={{ 
              color: '#4158D0',
              fontWeight: 600
            }}
          >
            Back to All Positions
          </Button>
          
          <Box sx={{ maxWidth: 800 }}>
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              {job?.title}
            </Title>
            
            <Group mb={20}>
              <Badge 
                leftSection={<IconBriefcase size={14} />}
                color="blue"
                size="lg"
              >
                {categories.find(cat => cat.value === job?.department)?.label}
              </Badge>
              <Badge 
                leftSection={<IconMapPin size={14} />}
                color="violet"
                size="lg"
              >
                {locations.find(loc => loc.value === job?.location)?.label}
              </Badge>
              <Badge 
                leftSection={<IconClock size={14} />}
                color="green"
                size="lg"
              >
                {job?.type}
              </Badge>
            </Group>
            
            <Text size="xl" sx={{ lineHeight: 1.6 }}>
              {job?.description}
            </Text>
          </Box>
        </Container>
      </Box>

      {/* Job Details */}
      <Container size="lg" py={80}>
        <SimpleGrid cols={2} spacing={50} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          <Box>
            <Title order={2} mb={30}>Responsibilities</Title>
            
            <List 
              spacing="md"
              icon={
                <ThemeIcon color="blue" size={24} radius="xl">
                  <IconCheck size={16} />
                </ThemeIcon>
              }
            >
              {job?.responsibilities.map((responsibility, index) => (
                <List.Item key={index}>
                  <Text size="lg">{responsibility}</Text>
                </List.Item>
              ))}
            </List>
          </Box>
          
          <Box>
            <Title order={2} mb={30}>Requirements</Title>
            
            <List 
              spacing="md"
              icon={
                <ThemeIcon color="blue" size={24} radius="xl">
                  <IconCheck size={16} />
                </ThemeIcon>
              }
            >
              {job?.requirements.map((requirement, index) => (
                <List.Item key={index}>
                  <Text size="lg">{requirement}</Text>
                </List.Item>
              ))}
            </List>
          </Box>
        </SimpleGrid>
        
        <Divider my={50} />
        
        {/* Apply Section */}
        <Box sx={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Title order={2} mb={15}>Ready to Apply?</Title>
          <Text size="lg" color="dimmed" mb={30}>
            We're excited to learn more about you and how you can contribute to our team.
          </Text>
          
          <Button 
            leftIcon={<IconSend size={20} />}
            size="xl"
            radius="xl"
            sx={{ 
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              padding: '0 40px',
              height: 60
            }}
          >
            Apply for this Position
          </Button>
          
          <Text size="sm" color="dimmed" mt={20}>
            By applying, you agree to our privacy policy and terms of service.
          </Text>
        </Box>
      </Container>
      
      {/* Similar Positions */}
      <Box py={80} sx={{ background: '#f8f9fa' }}>
        <Container size="lg">
          <Title order={2} align="center" mb={50}>Similar Positions</Title>
          
          <SimpleGrid 
            cols={3} 
            spacing={30}
            breakpoints={[
              { maxWidth: 992, cols: 2 },
              { maxWidth: 576, cols: 1 }
            ]}
          >
            {jobs
              .filter(j => j.id !== job?.id && j.department === job?.department)
              .slice(0, 3)
              .map(similarJob => (
                <Card 
                  key={similarJob.id} 
                  withBorder 
                  radius="md" 
                  p="lg"
                  sx={{ 
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Title order={3} mb={10}>{similarJob.title}</Title>
                  
                  <Group mb={20}>
                    <Badge 
                      leftSection={<IconMapPin size={14} />}
                      color="violet"
                    >
                      {locations.find(loc => loc.value === similarJob.location)?.label}
                    </Badge>
                    <Badge 
                      leftSection={<IconClock size={14} />}
                      color="green"
                    >
                      {similarJob.type}
                    </Badge>
                  </Group>
                  
                  <Text color="dimmed" mb={20} sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {similarJob.description}
                  </Text>
                  
                  <Button 
                    variant="light" 
                    color="blue" 
                    fullWidth
                    component={Link}
                    href={`/careers/${similarJob.id}`}
                  >
                    View Details
                  </Button>
                </Card>
              ))}
          </SimpleGrid>
          
          {jobs.filter(j => j.id !== job?.id && j.department === job?.department).length === 0 && (
            <Box sx={{ textAlign: 'center' }}>
              <Text size="lg" color="dimmed" mb={30}>
                There are no similar positions available at the moment.
              </Text>
              <Button 
                component={Link}
                href="/careers"
                variant="outline"
                color="blue"
                radius="xl"
              >
                View All Positions
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
    </div>
  );
}
