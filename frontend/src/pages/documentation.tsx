import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, 
  Tabs, Accordion, Box, List, ThemeIcon, Divider, Anchor, Code
} from '@mantine/core';
import { 
  IconBook, IconFileText, IconVideo, IconUsers, IconChecklist, 
  IconRocket, IconArrowRight, IconSearch, IconBrandGithub,
  IconCode, IconDeviceDesktop, IconLock, IconBolt, IconBrandSlack,
  IconChevronRight, IconCircleCheck, IconExternalLink
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';

// Documentation categories and topics
type DocItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  slug: string;
};

type DocData = {
  gettingStarted: DocItem[];
  features: DocItem[];
  integrations: DocItem[];
  security: DocItem[];
  [key: string]: DocItem[];
};

const documentationData: DocData = {
  gettingStarted: [
    {
      title: 'Quick Start Guide',
      description: 'Learn how to set up your Stack account and create your first workspace.',
      icon: <IconRocket size={20} />,
      slug: 'quick-start'
    },
    {
      title: 'System Requirements',
      description: 'Check the minimum system requirements for running Stack efficiently.',
      icon: <IconDeviceDesktop size={20} />,
      slug: 'system-requirements'
    },
    {
      title: 'Installation Guide',
      description: 'Step-by-step instructions for installing Stack on different platforms.',
      icon: <IconBolt size={20} />,
      slug: 'installation'
    }
  ],
  features: [
    {
      title: 'Real-time Documents',
      description: 'Learn how to collaborate on documents in real-time with your team.',
      icon: <IconFileText size={20} />,
      slug: 'real-time-documents'
    },
    {
      title: 'Video Meetings',
      description: 'Discover how to schedule, join, and manage video meetings.',
      icon: <IconVideo size={20} />,
      slug: 'video-meetings'
    },
    {
      title: 'Team Chat',
      description: 'Learn how to use channels, threads, and direct messages effectively.',
      icon: <IconUsers size={20} />,
      slug: 'team-chat'
    },
    {
      title: 'Task Management',
      description: 'Discover how to create, assign, and track tasks across your team.',
      icon: <IconChecklist size={20} />,
      slug: 'task-management'
    }
  ],
  integrations: [
    {
      title: 'GitHub Integration',
      description: 'Connect Stack with GitHub to streamline your development workflow.',
      icon: <IconBrandGithub size={20} />,
      slug: 'github-integration'
    },
    {
      title: 'Slack Integration',
      description: 'Connect Stack with Slack to keep all your communications in sync.',
      icon: <IconBrandSlack size={20} />,
      slug: 'slack-integration'
    },
    {
      title: 'API Documentation',
      description: 'Learn how to use Stack\'s API to build custom integrations.',
      icon: <IconCode size={20} />,
      slug: 'api-documentation'
    }
  ],
  security: [
    {
      title: 'Security Overview',
      description: 'Learn about Stack\'s security features and best practices.',
      icon: <IconLock size={20} />,
      slug: 'security-overview'
    },
    {
      title: 'Authentication',
      description: 'Understand different authentication methods and how to set them up.',
      icon: <IconLock size={20} />,
      slug: 'authentication'
    },
    {
      title: 'Data Privacy',
      description: 'Learn how Stack protects your data and ensures privacy compliance.',
      icon: <IconLock size={20} />,
      slug: 'data-privacy'
    }
  ]
};

// Sample content for the Quick Start Guide
const quickStartContent = {
  title: 'Quick Start Guide',
  sections: [
    {
      title: 'Creating your account',
      content: 'To get started with Stack, you need to create an account. Visit the Sign Up page and enter your email address, password, and other required information. Once you submit the form, you\'ll receive a verification email. Click the link in the email to verify your account.',
      steps: [
        'Navigate to the Stack sign-up page',
        'Enter your email address and create a password',
        'Fill in your name and organization details',
        'Click "Create Account"',
        'Check your email for a verification link',
        'Click the verification link to activate your account'
      ]
    },
    {
      title: 'Setting up your workspace',
      content: 'After verifying your account, you\'ll be prompted to create your first workspace. A workspace is where all your team\'s documents, chats, and tasks live. Give your workspace a name that reflects your team or project.',
      steps: [
        'Click "Create New Workspace" on the dashboard',
        'Enter a name for your workspace',
        'Choose a URL for your workspace (e.g., yourcompany.stackapp.com)',
        'Select your team size and primary use case',
        'Click "Create Workspace"'
      ]
    },
    {
      title: 'Inviting team members',
      content: 'Once your workspace is set up, you can invite team members to join. You can invite them via email or by sharing a special invitation link.',
      steps: [
        'Go to "Settings" > "Team Members"',
        'Click "Invite Members"',
        'Enter email addresses of team members you want to invite',
        'Assign appropriate roles (Admin, Member, Guest)',
        'Click "Send Invitations"'
      ]
    },
    {
      title: 'Creating your first document',
      content: 'Now that your workspace is set up and your team members are invited, you can create your first document. Stack documents support rich text formatting, images, tables, and more.',
      steps: [
        'Navigate to the "Documents" section',
        'Click "New Document"',
        'Give your document a title',
        'Start editing your document using the rich text editor',
        'Use the sharing options to collaborate with your team'
      ]
    }
  ]
};

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('gettingStarted');
  const [activeDoc, setActiveDoc] = useState('quick-start');
  const [searchQuery, setSearchQuery] = useState('');

  // Function to render documentation content based on active doc
  const renderDocContent = () => {
    if (activeDoc === 'quick-start') {
      return (
        <Box>
          <Title order={1} mb={30}>{quickStartContent.title}</Title>
          
          {quickStartContent.sections.map((section, index) => (
            <Box key={index} mb={40}>
              <Title order={2} mb={15}>{section.title}</Title>
              <Text mb={20}>{section.content}</Text>
              
              <Title order={3} size="h4" mb={15}>Steps:</Title>
              <List 
                spacing="sm"
                mb={30}
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <IconCircleCheck size={16} />
                  </ThemeIcon>
                }
              >
                {section.steps.map((step, stepIndex) => (
                  <List.Item key={stepIndex}>{step}</List.Item>
                ))}
              </List>
              
              {index < quickStartContent.sections.length - 1 && <Divider my={30} />}
            </Box>
          ))}
          
          <Box mt={50}>
            <Title order={3} mb={20}>Next Steps</Title>
            <SimpleGrid cols={2} spacing={20} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
              <Card p="lg" radius="md" withBorder>
                <Group position="apart" mb={15}>
                  <IconFileText size={24} color="#4158D0" />
                  <Badge color="blue">Feature</Badge>
                </Group>
                <Text weight={600} size="lg" mb={10}>Explore Real-time Documents</Text>
                <Text size="sm" color="dimmed" mb={15}>
                  Learn how to use Stack's powerful real-time document collaboration features.
                </Text>
                <Button 
                  variant="light" 
                  color="blue" 
                  fullWidth 
                  rightIcon={<IconArrowRight size={16} />}
                  onClick={() => {
                    setActiveTab('features');
                    setActiveDoc('real-time-documents');
                  }}
                >
                  Read Documentation
                </Button>
              </Card>
              
              <Card p="lg" radius="md" withBorder>
                <Group position="apart" mb={15}>
                  <IconUsers size={24} color="#4158D0" />
                  <Badge color="blue">Feature</Badge>
                </Group>
                <Text weight={600} size="lg" mb={10}>Set Up Team Chat</Text>
                <Text size="sm" color="dimmed" mb={15}>
                  Discover how to organize your team communications with channels and threads.
                </Text>
                <Button 
                  variant="light" 
                  color="blue" 
                  fullWidth 
                  rightIcon={<IconArrowRight size={16} />}
                  onClick={() => {
                    setActiveTab('features');
                    setActiveDoc('team-chat');
                  }}
                >
                  Read Documentation
                </Button>
              </Card>
            </SimpleGrid>
          </Box>
        </Box>
      );
    }
    
    // For other docs, show a placeholder message
    return (
      <Box py={50} sx={{ textAlign: 'center' }}>
        <IconBook size={64} color="#4158D0" style={{ opacity: 0.5, marginBottom: 20 }} />
        <Title order={2} mb={15}>Documentation Coming Soon</Title>
        <Text size="lg" color="dimmed" mb={30} sx={{ maxWidth: 600, margin: '0 auto' }}>
          We're currently working on this documentation section. 
          Please check back soon or contact our support team for assistance.
        </Text>
        <Button 
          component={Link}
          href="/contact"
          variant="outline"
          color="blue"
          leftIcon={<IconExternalLink size={16} />}
        >
          Contact Support
        </Button>
      </Box>
    );
  };

  // Filter documentation based on search query
  const filterDocumentation = (items: DocItem[]) => {
    if (!searchQuery) return items;
    
    return items.filter((item: DocItem) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div>
      <Head>
        <title>Documentation | Stack</title>
        <meta name="description" content="Comprehensive documentation for Stack - the all-in-one collaboration platform." />
      </Head>

      <Navbar />
      
      {/* Documentation Header */}
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
              Documentation
            </Badge>
            
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              Learn how to use Stack
            </Title>
            
            <Text size="xl" mb={40} sx={{ lineHeight: 1.6 }}>
              Comprehensive guides, tutorials, and API references to help you get the most out of Stack.
            </Text>
            
            {/* Search Bar */}
            <Box 
              sx={{ 
                position: 'relative',
                maxWidth: 600,
                margin: '0 auto'
              }}
            >
              <Box 
                component="input"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: '100%',
                  height: 56,
                  padding: '0 20px 0 50px',
                  borderRadius: 30,
                  border: 'none',
                  fontSize: 16,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                  }
                }}
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: '50%',
                  left: 20,
                  transform: 'translateY(-50%)',
                  color: '#4158D0'
                }}
              >
                <IconSearch size={20} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Documentation Content */}
      <Container size="lg" py={60}>
        <SimpleGrid cols={3} spacing={30} breakpoints={[
          { maxWidth: 992, cols: 1 }
        ]}>
          {/* Sidebar Navigation */}
          <Box>
            <Card withBorder radius="md" p={0}>
              <Tabs
                value={activeTab}
                onTabChange={(value) => value !== null && setActiveTab(value.toString())}
                orientation="vertical"
                variant="pills"
                styles={{
                  tab: {
                    padding: '15px 20px',
                    fontWeight: 600,
                    '&[data-active]': {
                      background: 'rgba(65, 88, 208, 0.1)',
                      color: '#4158D0'
                    }
                  }
                }}
              >
                <Tabs.List>
                  <Tabs.Tab value="gettingStarted" icon={<IconRocket size={16} />}>
                    Getting Started
                  </Tabs.Tab>
                  <Tabs.Tab value="features" icon={<IconBolt size={16} />}>
                    Features
                  </Tabs.Tab>
                  <Tabs.Tab value="integrations" icon={<IconCode size={16} />}>
                    Integrations
                  </Tabs.Tab>
                  <Tabs.Tab value="security" icon={<IconLock size={16} />}>
                    Security
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
              
              <Divider />
              
              <Box p="md">
                <Title order={4} mb={15}>
                  {activeTab === 'gettingStarted' && 'Getting Started'}
                  {activeTab === 'features' && 'Features'}
                  {activeTab === 'integrations' && 'Integrations'}
                  {activeTab === 'security' && 'Security'}
                </Title>
                
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {filterDocumentation(documentationData[activeTab]).map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        padding: '12px 15px',
                        borderRadius: 8,
                        marginBottom: 8,
                        cursor: 'pointer',
                        background: activeDoc === item.slug ? 'rgba(65, 88, 208, 0.1)' : 'transparent',
                        '&:hover': {
                          background: 'rgba(65, 88, 208, 0.05)'
                        }
                      }}
                      onClick={() => setActiveDoc(item.slug)}
                    >
                      <Group position="apart">
                        <Group spacing={10}>
                          <Box sx={{ color: '#4158D0' }}>{item.icon}</Box>
                          <Text weight={activeDoc === item.slug ? 700 : 500}>{item.title}</Text>
                        </Group>
                        <IconChevronRight size={16} color="#4158D0" style={{ opacity: activeDoc === item.slug ? 1 : 0.5 }} />
                      </Group>
                      
                      {activeDoc === item.slug && (
                        <Text size="sm" color="dimmed" mt={5}>
                          {item.description}
                        </Text>
                      )}
                    </Box>
                  ))}
                  
                  {filterDocumentation(documentationData[activeTab]).length === 0 && (
                    <Box py={30} sx={{ textAlign: 'center' }}>
                      <Text color="dimmed">No results found for "{searchQuery}"</Text>
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
            
            <Card withBorder radius="md" p="lg" mt={20}>
              <Title order={4} mb={15}>Need Help?</Title>
              <Text size="sm" color="dimmed" mb={20}>
                Can't find what you're looking for? Our support team is here to help.
              </Text>
              <Button 
                component={Link}
                href="/contact"
                variant="light"
                color="blue"
                fullWidth
                leftIcon={<IconExternalLink size={16} />}
              >
                Contact Support
              </Button>
            </Card>
          </Box>
          
          {/* Main Content */}
          <Box sx={{ gridColumn: '2 / span 2' }}>
            <Card withBorder radius="md" p="xl">
              {renderDocContent()}
            </Card>
            
            {/* Related Documentation */}
            <Box mt={40}>
              <Title order={3} mb={20}>Related Documentation</Title>
              <SimpleGrid cols={3} spacing={20} breakpoints={[
                { maxWidth: 768, cols: 2 },
                { maxWidth: 576, cols: 1 }
              ]}>
                {documentationData[activeTab]
                  .filter(item => item.slug !== activeDoc)
                  .slice(0, 3)
                  .map((item, index) => (
                    <Card 
                      key={index} 
                      withBorder 
                      radius="md" 
                      p="md"
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                      onClick={() => setActiveDoc(item.slug)}
                    >
                      <Box sx={{ color: '#4158D0', marginBottom: 10 }}>{item.icon}</Box>
                      <Text weight={600} mb={8}>{item.title}</Text>
                      <Text size="sm" color="dimmed">{item.description}</Text>
                    </Card>
                  ))}
              </SimpleGrid>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>

      {/* FAQ Section */}
      <Box py={80} sx={{ background: '#f8f9fa' }}>
        <Container size="lg">
          <Box sx={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }} mb={50}>
            <Title order={2} mb={15}>Frequently Asked Questions</Title>
            <Text size="lg" color="dimmed">
              Find answers to common questions about Stack and its features.
            </Text>
          </Box>
          
          <Accordion 
            radius="md"
            sx={{ maxWidth: 800, margin: '0 auto' }}
          >
            <Accordion.Item value="compare">
              <Accordion.Control>
                <Text weight={600}>How does Stack compare to other collaboration tools?</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  Stack offers a more integrated approach compared to other tools. While most platforms focus on either document collaboration, chat, or task management, Stack brings all these features together in one seamless interface. This eliminates the need to switch between multiple tools and ensures that all your team's work is centralized.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="teams">
              <Accordion.Control>
                <Text weight={600}>Is Stack suitable for small teams?</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  Absolutely! Stack is designed to scale with your team. Our platform is perfect for small teams that need a simple, all-in-one solution for collaboration. We offer flexible pricing plans that make Stack accessible for teams of all sizes, including a free tier for very small teams.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="trial">
              <Accordion.Control>
                <Text weight={600}>Can I try Stack before purchasing?</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial. This gives you ample time to explore Stack and see how it can benefit your team. After the trial period, you can choose the plan that best suits your needs.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="data">
              <Accordion.Control>
                <Text weight={600}>How secure is my data with Stack?</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  Security is our top priority. Stack uses industry-standard encryption for all data, both in transit and at rest. We implement strict access controls, regular security audits, and compliance with major security standards. Your data belongs to you, and we provide tools for data export and backup.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="support">
              <Accordion.Control>
                <Text weight={600}>What kind of support does Stack offer?</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>
                  We offer multiple levels of support depending on your plan. All users have access to our comprehensive documentation, community forums, and email support. Business and Enterprise plans include priority support with faster response times, dedicated account managers, and training sessions.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box py={80}>
        <Container size="md">
          <Card 
            withBorder 
            radius="lg" 
            p={40}
            sx={{
              background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.05) 0%, rgba(200, 80, 192, 0.05) 100%)',
              textAlign: 'center'
            }}
          >
            <Title order={2} mb={15}>Ready to get started with Stack?</Title>
            <Text size="lg" color="dimmed" mb={30} sx={{ maxWidth: 600, margin: '0 auto' }}>
              Join thousands of teams already using Stack to collaborate more efficiently and get more done.
            </Text>
            
            <Group position="center" spacing="md">
              <Button 
                component={Link}
                href="/signup"
                size="lg"
                radius="xl"
                color="blue"
                sx={{ 
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                  padding: '0 35px',
                  height: 54
                }}
              >
                Sign Up Free
              </Button>
              
              <Button 
                component={Link}
                href="/contact"
                size="lg"
                radius="xl"
                variant="outline"
                color="blue"
                sx={{ 
                  padding: '0 35px',
                  height: 54
                }}
              >
                Contact Sales
              </Button>
            </Group>
          </Card>
        </Container>
      </Box>

      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
    </div>
  );
}
