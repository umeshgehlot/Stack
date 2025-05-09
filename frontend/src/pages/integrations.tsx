import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, 
  Tabs, Box, Image, Grid, ThemeIcon, Divider, Input
} from '@mantine/core';
import { 
  IconBrandGithub, IconBrandSlack, IconBrandGoogle, IconBrandZoom,
  IconBrandDrops, IconBrandWindows, IconBrandTrello, IconBrandAsana,
  IconSearch, IconArrowRight, IconPlus, IconCheck, IconBrandFigma
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';

// Integration categories
const categories = [
  { value: 'all', label: 'All Integrations' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'communication', label: 'Communication' },
  { value: 'storage', label: 'Storage & Files' },
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' }
];

// Integrations data
const integrations = [
  {
    id: 1,
    name: 'GitHub',
    description: 'Connect your GitHub repositories to track issues, pull requests, and code changes directly in Stack.',
    icon: <IconBrandGithub size={30} />,
    category: 'development',
    popular: true,
    image: '/images/integrations/github.png'
  },
  {
    id: 2,
    name: 'Slack',
    description: 'Sync conversations between Slack and Stack to keep all your team communications in one place.',
    icon: <IconBrandSlack size={30} />,
    category: 'communication',
    popular: true,
    image: '/images/integrations/slack.png'
  },
  {
    id: 3,
    name: 'Google Workspace',
    description: 'Integrate with Google Docs, Sheets, Calendar, and Drive for seamless collaboration.',
    icon: <IconBrandGoogle size={30} />,
    category: 'productivity',
    popular: true,
    image: '/images/integrations/google.png'
  },
  {
    id: 4,
    name: 'Zoom',
    description: 'Schedule and join Zoom meetings directly from Stack and automatically save recordings.',
    icon: <IconBrandZoom size={30} />,
    category: 'communication',
    popular: true,
    image: '/images/integrations/github.png'
  },
  {
    id: 5,
    name: 'Dropbox',
    description: 'Access and share your Dropbox files within Stack to keep everything organized.',
    icon: <IconBrandDrops size={30} />,
    category: 'storage',
    popular: false,
    image: '/images/integrations/slack.png'
  },
  {
    id: 6,
    name: 'Microsoft 365',
    description: 'Connect with Microsoft Word, Excel, Outlook, and OneDrive for a complete productivity suite.',
    icon: <IconBrandWindows size={30} />,
    category: 'productivity',
    popular: true,
    image: '/images/integrations/google.png'
  },
  {
    id: 7,
    name: 'Trello',
    description: 'Sync your Trello boards with Stack to manage tasks and projects in one place.',
    icon: <IconBrandTrello size={30} />,
    category: 'productivity',
    popular: false,
    image: '/images/integrations/github.png'
  },
  {
    id: 8,
    name: 'Asana',
    description: 'Integrate Asana tasks and projects with Stack for comprehensive project management.',
    icon: <IconBrandAsana size={30} />,
    category: 'productivity',
    popular: false,
    image: '/images/integrations/slack.png'
  },
  {
    id: 9,
    name: 'Figma',
    description: 'Access your Figma designs directly in Stack and collaborate with your team.',
    icon: <IconBrandFigma size={30} />,
    category: 'design',
    popular: true,
    image: '/images/integrations/google.png'
  }
];

export default function Integrations() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter integrations based on active category and search query
  const filteredIntegrations = integrations.filter(integration => 
    (activeCategory === 'all' || integration.category === activeCategory) &&
    (integration.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     integration.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get popular integrations
  const popularIntegrations = integrations.filter(integration => integration.popular);

  return (
    <div>
      <Head>
        <title>Integrations | Stack</title>
        <meta name="description" content="Explore Stack's integrations with your favorite tools and services to enhance your workflow." />
      </Head>

      <Navbar />
      
      {/* Integrations Header */}
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
              Integrations
            </Badge>
            
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              Connect your favorite tools
            </Title>
            
            <Text size="xl" mb={40} sx={{ lineHeight: 1.6 }}>
              Stack integrates with the tools you already use to create a seamless workflow.
            </Text>
            
            {/* Search Bar */}
            <Box 
              sx={{ 
                position: 'relative',
                maxWidth: 600,
                margin: '0 auto'
              }}
            >
              <Input
                icon={<IconSearch size={20} />}
                placeholder="Search integrations..."
                size="lg"
                radius="xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                sx={{
                  input: {
                    height: 56,
                    fontSize: 16,
                    '&::placeholder': {
                      color: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Popular Integrations */}
      <Container size="lg" mt={-60} mb={80}>
        <Card withBorder radius="lg" p="xl">
          <Title order={3} mb={30}>Popular Integrations</Title>
          
          <SimpleGrid 
            cols={4} 
            spacing={30}
            breakpoints={[
              { maxWidth: 992, cols: 3 },
              { maxWidth: 768, cols: 2 },
              { maxWidth: 576, cols: 1 }
            ]}
          >
            {popularIntegrations.slice(0, 4).map(integration => (
              <Card 
                key={integration.id} 
                withBorder 
                radius="md" 
                p="lg"
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
                    background: 'rgba(65, 88, 208, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4158D0',
                    marginBottom: 15
                  }}
                >
                  {integration.icon}
                </Box>
                
                <Title order={4} mb={10}>{integration.name}</Title>
                <Text size="sm" color="dimmed" mb={20} sx={{ flex: 1 }}>
                  {integration.description.length > 100 
                    ? `${integration.description.substring(0, 100)}...` 
                    : integration.description
                  }
                </Text>
                
                <Button 
                  variant="light" 
                  color="blue" 
                  radius="md"
                  rightIcon={<IconPlus size={16} />}
                  fullWidth
                >
                  Add Integration
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </Card>
      </Container>

      {/* All Integrations */}
      <Container size="lg" mb={80}>
        <Tabs
          value={activeCategory}
          onTabChange={(value) => value !== null && setActiveCategory(value.toString())}
          variant="pills"
          radius="xl"
          sx={{
            '.mantine-Tabs-tabsList': {
              borderBottom: '1px solid #eee',
              paddingBottom: 15,
              marginBottom: 30,
              overflowX: 'auto',
              flexWrap: 'nowrap',
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
        
        {filteredIntegrations.length > 0 ? (
          <SimpleGrid 
            cols={3} 
            spacing={30}
            breakpoints={[
              { maxWidth: 992, cols: 2 },
              { maxWidth: 576, cols: 1 }
            ]}
          >
            {filteredIntegrations.map(integration => (
              <Card 
                key={integration.id} 
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
                <Group mb={20}>
                  <Box 
                    sx={{ 
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'rgba(65, 88, 208, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4158D0'
                    }}
                  >
                    {integration.icon}
                  </Box>
                  
                  <Box>
                    <Title order={4}>{integration.name}</Title>
                    <Badge color="blue" size="sm">
                      {categories.find(cat => cat.value === integration.category)?.label}
                    </Badge>
                  </Box>
                </Group>
                
                <Text color="dimmed" mb={20} sx={{ minHeight: 80 }}>
                  {integration.description}
                </Text>
                
                <Group position="apart" mt="auto">
                  <Button 
                    variant="subtle" 
                    color="blue" 
                    rightIcon={<IconArrowRight size={16} />}
                    sx={{ fontWeight: 600 }}
                  >
                    Learn More
                  </Button>
                  
                  <Button 
                    variant="light" 
                    color="blue" 
                    radius="md"
                    rightIcon={<IconPlus size={16} />}
                  >
                    Add
                  </Button>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Box py={50} sx={{ textAlign: 'center' }}>
            <Title order={3} color="dimmed" mb={20}>No integrations found</Title>
            <Text size="lg" color="dimmed" mb={30}>
              We couldn't find any integrations matching your search criteria.
            </Text>
            <Button 
              variant="outline" 
              color="blue" 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Reset Filters
            </Button>
          </Box>
        )}
      </Container>
      
      {/* Build Your Own Integration */}
      <Box py={80} sx={{ background: '#f8f9fa' }}>
        <Container size="md">
          <Card 
            withBorder 
            radius="lg" 
            p={0}
            sx={{ overflow: 'hidden' }}
          >
            <Grid gutter={0}>
              <Grid.Col md={6}>
                <Box p={40}>
                  <Title order={2} mb={15}>Build your own integration</Title>
                  <Text color="dimmed" mb={30} sx={{ lineHeight: 1.6 }}>
                    Don't see the integration you need? Build your own using our powerful API and developer tools.
                  </Text>
                  
                  <Box mb={30}>
                    <Group mb={15}>
                      <ThemeIcon 
                        radius="xl" 
                        size={30} 
                        color="blue"
                        variant="light"
                      >
                        <IconCheck size={16} />
                      </ThemeIcon>
                      <Text>Comprehensive API documentation</Text>
                    </Group>
                    <Group mb={15}>
                      <ThemeIcon 
                        radius="xl" 
                        size={30} 
                        color="blue"
                        variant="light"
                      >
                        <IconCheck size={16} />
                      </ThemeIcon>
                      <Text>Developer support and resources</Text>
                    </Group>
                    <Group>
                      <ThemeIcon 
                        radius="xl" 
                        size={30} 
                        color="blue"
                        variant="light"
                      >
                        <IconCheck size={16} />
                      </ThemeIcon>
                      <Text>Publish to our integration marketplace</Text>
                    </Group>
                  </Box>
                  
                  <Group>
                    <Button 
                      component={Link}
                      href="/api-docs"
                      size="md"
                      radius="xl"
                      sx={{ 
                        background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                        padding: '0 30px',
                        height: 48
                      }}
                    >
                      View API Docs
                    </Button>
                    
                    <Button 
                      component={Link}
                      href="/contact"
                      size="md"
                      radius="xl"
                      variant="outline"
                      color="blue"
                      sx={{ 
                        padding: '0 30px',
                        height: 48
                      }}
                    >
                      Contact Us
                    </Button>
                  </Group>
                </Box>
              </Grid.Col>
              
              <Grid.Col md={6}>
                <Box 
                  sx={{ 
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    height: '100%',
                    padding: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    textAlign: 'center',
                    '@media (max-width: 768px)': {
                      padding: '40px 20px'
                    }
                  }}
                >
                  <IconBrandGithub size={60} style={{ marginBottom: 20 }} />
                  <Title order={3} mb={15}>Join our Developer Community</Title>
                  <Text mb={30} sx={{ lineHeight: 1.6 }}>
                    Connect with other developers building on Stack, share your integrations, and get help from our team.
                  </Text>
                  <Button 
                    component="a"
                    href="https://github.com/stackapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="md"
                    radius="xl"
                    variant="white"
                    leftIcon={<IconBrandGithub size={20} />}
                    sx={{ 
                      color: '#4158D0',
                      padding: '0 30px',
                      height: 48
                    }}
                  >
                    GitHub Repository
                  </Button>
                </Box>
              </Grid.Col>
            </Grid>
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
