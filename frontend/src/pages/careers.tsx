import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, 
  Box, Image, Tabs, Divider, List, ThemeIcon, Accordion
} from '@mantine/core';
import { 
  IconBriefcase, IconMapPin, IconClock, IconFilter, IconChevronRight,
  IconCircleCheck, IconUsers, IconRocket, IconHeart, IconBuildingSkyscraper
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';

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

// Values
const values = [
  {
    icon: <IconUsers size={30} />,
    title: 'Collaboration',
    description: 'We believe in the power of teamwork and open communication. We work together across teams and time zones to solve complex problems.'
  },
  {
    icon: <IconRocket size={30} />,
    title: 'Innovation',
    description: "We're not afraid to challenge the status quo and think outside the box. We encourage creative solutions and continuous improvement."
  },
  {
    icon: <IconHeart size={30} />,
    title: 'Customer Focus',
    description: "Our customers are at the heart of everything we do. We're committed to understanding their needs and exceeding their expectations."
  },
  {
    icon: <IconCircleCheck size={30} />,
    title: 'Quality',
    description: 'We take pride in our work and strive for excellence in everything we do. We set high standards and hold ourselves accountable.'
  }
];

// Benefits
const benefits = [
  {
    title: 'Competitive Compensation',
    description: 'We offer competitive salaries, equity, and performance bonuses to recognize your contributions.'
  },
  {
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision insurance for you and your dependents, plus a wellness stipend.'
  },
  {
    title: 'Flexible Work',
    description: "Work from home, one of our offices, or a mix of both. We trust you to work where you're most productive."
  },
  {
    title: 'Learning & Development',
    description: 'Annual learning stipend, conference budget, and regular workshops to help you grow professionally.'
  },
  {
    title: 'Generous Time Off',
    description: 'Unlimited PTO, paid holidays, and parental leave to ensure you can recharge and spend time with loved ones.'
  },
  {
    title: 'Team Building',
    description: 'Regular team events, offsites, and virtual activities to foster connections and have fun together.'
  }
];

export default function Careers() {
  const [activeDepartment, setActiveDepartment] = useState('all');
  const [activeLocation, setActiveLocation] = useState('all');
  
  // Filter jobs based on active filters
  const filteredJobs = jobs.filter(job => 
    (activeDepartment === 'all' || job.department === activeDepartment) &&
    (activeLocation === 'all' || job.location === activeLocation)
  );

  return (
    <div>
      <Head>
        <title>Careers | Stack</title>
        <meta name="description" content="Join our team at Stack and help build the future of collaboration. Explore open positions and learn about our culture." />
      </Head>

      <Navbar />
      
      {/* Careers Header */}
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
          <Box sx={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <Badge 
              size="xl" 
              radius="xl" 
              color="pink" 
              variant="filled" 
              mb={20}
              sx={{
                padding: '10px 20px',
                textTransform: 'uppercase',
                fontWeight: 700
              }}
            >
              Careers
            </Badge>
            
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              Join our team
            </Title>
            
            <Text size="xl" mb={40} sx={{ lineHeight: 1.6 }}>
              Help us build the future of collaboration and make work more productive and enjoyable for teams around the world.
            </Text>
            
            <Button 
              component="a"
              href="#open-positions"
              size="lg"
              radius="xl"
              sx={{ 
                background: 'white',
                color: '#4158D0',
                padding: '0 35px',
                height: 54,
                fontWeight: 600,
                '&:hover': {
                  background: 'white',
                  transform: 'translateY(-5px)'
                }
              }}
            >
              View Open Positions
            </Button>
          </Box>
        </Container>
      </Box>

      {/* About Us */}
      <Container size="lg" py={80}>
        <SimpleGrid cols={2} spacing={50} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          <Box>
            <Title order={2} mb={20}>About Stack</Title>
            <Text mb={30} sx={{ lineHeight: 1.8 }}>
              Stack is a real-time collaboration platform that helps teams work together more efficiently, no matter where they are. Our mission is to make work more productive and enjoyable by providing tools that foster seamless collaboration.
            </Text>
            <Text mb={30} sx={{ lineHeight: 1.8 }}>
              Founded in 2020, we've grown to serve thousands of teams around the world, from small startups to large enterprises. Our diverse team is distributed across North America, Europe, and Asia, bringing together a wealth of experiences and perspectives.
            </Text>
            <Text sx={{ lineHeight: 1.8 }}>
              We're backed by leading investors who share our vision for the future of work, and we're just getting started. Join us on our journey to transform how teams collaborate and get work done.
            </Text>
          </Box>
          
          <Box>
            <Image 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" 
              alt="Stack team" 
              radius="md"
              sx={{ 
                width: '100%',
                height: 350,
                objectFit: 'cover'
              }}
            />
          </Box>
        </SimpleGrid>
      </Container>
      
      {/* Our Values */}
      <Box py={80} sx={{ background: '#f8f9fa' }}>
        <Container size="lg">
          <Title order={2} align="center" mb={50}>Our Values</Title>
          
          <SimpleGrid 
            cols={4} 
            spacing={30}
            breakpoints={[
              { maxWidth: 992, cols: 2 },
              { maxWidth: 576, cols: 1 }
            ]}
          >
            {values.map((value, index) => (
              <Card 
                key={index} 
                withBorder 
                radius="md" 
                p="xl"
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.1) 0%, rgba(200, 80, 192, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4158D0',
                    marginBottom: 20
                  }}
                >
                  {value.icon}
                </Box>
                
                <Title order={3} mb={15}>{value.title}</Title>
                <Text color="dimmed">{value.description}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Benefits */}
      <Container size="lg" py={80}>
        <SimpleGrid cols={2} spacing={50} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          <Box>
            <Image 
              src="https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" 
              alt="Stack office" 
              radius="md"
              sx={{ 
                width: '100%',
                height: 400,
                objectFit: 'cover'
              }}
            />
          </Box>
          
          <Box>
            <Title order={2} mb={30}>Benefits & Perks</Title>
            
            <Accordion 
              variant="separated"
              radius="md"
              styles={{
                item: {
                  marginBottom: 10,
                  border: '1px solid #eee',
                  '&[data-active]': {
                    backgroundColor: 'rgba(65, 88, 208, 0.05)'
                  }
                },
                control: {
                  padding: '15px 20px',
                  '&:hover': {
                    backgroundColor: 'rgba(65, 88, 208, 0.03)'
                  }
                },
                label: {
                  fontWeight: 600
                },
                content: {
                  padding: '0 20px 15px'
                }
              }}
            >
              {benefits.map((benefit, index) => (
                <Accordion.Item key={index} value={`benefit-${index}`}>
                  <Accordion.Control>{benefit.title}</Accordion.Control>
                  <Accordion.Panel>
                    <Text>{benefit.description}</Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Box>
        </SimpleGrid>
      </Container>
      
      {/* Open Positions */}
      <Box py={80} sx={{ background: '#f8f9fa' }} id="open-positions">
        <Container size="lg">
          <Title order={2} align="center" mb={50}>Open Positions</Title>
          
          <Group position="apart" mb={30}>
            <Tabs
              value={activeDepartment}
              onTabChange={(value) => value !== null && setActiveDepartment(value.toString())}
              variant="pills"
              radius="xl"
              sx={{
                '.mantine-Tabs-tabsList': {
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                },
                '.mantine-Tabs-tab': {
                  fontWeight: 600,
                  padding: '8px 16px',
                  whiteSpace: 'nowrap',
                  '&[data-active]': {
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    color: 'white'
                  }
                }
              }}
            >
              <Tabs.List>
                {categories.map(category => (
                  <Tabs.Tab 
                    key={category.value} 
                    value={category.value}
                  >
                    {category.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
            
            <Tabs
              value={activeLocation}
              onTabChange={(value) => value !== null && setActiveLocation(value.toString())}
              variant="pills"
              radius="xl"
              sx={{
                '.mantine-Tabs-tabsList': {
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                },
                '.mantine-Tabs-tab': {
                  fontWeight: 600,
                  padding: '8px 16px',
                  whiteSpace: 'nowrap',
                  '&[data-active]': {
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    color: 'white'
                  }
                }
              }}
            >
              <Tabs.List>
                {locations.map(location => (
                  <Tabs.Tab 
                    key={location.value} 
                    value={location.value}
                  >
                    {location.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </Group>
          
          {filteredJobs.length > 0 ? (
            <SimpleGrid 
              cols={2} 
              spacing={30}
              breakpoints={[{ maxWidth: 768, cols: 1 }]}
            >
              {filteredJobs.map(job => (
                <Card 
                  key={job.id} 
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
                  <Title order={3} mb={10}>{job.title}</Title>
                  
                  <Group mb={20}>
                    <Badge 
                      leftSection={<IconBriefcase size={14} />}
                      color="blue"
                    >
                      {categories.find(cat => cat.value === job.department)?.label}
                    </Badge>
                    <Badge 
                      leftSection={<IconMapPin size={14} />}
                      color="violet"
                    >
                      {locations.find(loc => loc.value === job.location)?.label}
                    </Badge>
                    <Badge 
                      leftSection={<IconClock size={14} />}
                      color="green"
                    >
                      {job.type}
                    </Badge>
                  </Group>
                  
                  <Text color="dimmed" mb={20}>{job.description}</Text>
                  
                  <Button 
                    variant="light" 
                    color="blue" 
                    fullWidth
                    rightIcon={<IconChevronRight size={16} />}
                    component={Link}
                    href={`/careers/${job.id}`}
                  >
                    View Details
                  </Button>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Box py={50} sx={{ textAlign: 'center' }}>
              <Title order={3} color="dimmed" mb={20}>No positions found</Title>
              <Text size="lg" color="dimmed" mb={30}>
                We don't have any open positions matching your filters at the moment.
              </Text>
              <Button 
                variant="outline" 
                color="blue" 
                onClick={() => {
                  setActiveDepartment('all');
                  setActiveLocation('all');
                }}
              >
                Reset Filters
              </Button>
            </Box>
          )}
        </Container>
      </Box>
      
      {/* Not seeing a fit? */}
      <Container size="lg" py={80}>
        <Card 
          withBorder 
          radius="lg" 
          p={40}
          sx={{
            background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.05) 0%, rgba(200, 80, 192, 0.05) 100%)',
            textAlign: 'center'
          }}
        >
          <Title order={2} mb={15}>Don't see a role that fits?</Title>
          <Text size="lg" color="dimmed" mb={30} sx={{ maxWidth: 600, margin: '0 auto' }}>
            We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
          </Text>
          
          <Button 
            component={Link}
            href="/contact"
            size="lg"
            radius="xl"
            sx={{ 
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              padding: '0 35px',
              height: 54
            }}
          >
            Get in Touch
          </Button>
        </Card>
      </Container>

      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
    </div>
  );
}
