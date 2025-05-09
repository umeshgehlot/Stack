import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, 
  Tabs, Box, Image, Grid, ThemeIcon, Divider, List
} from '@mantine/core';
import { 
  IconVideo, IconFileText, IconUsers, IconDeviceDesktop, IconBrandYoutube,
  IconArrowRight, IconPlayerPlay, IconClock, IconChartBar, IconStarFilled
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';

// Tutorial categories
const categories = [
  { value: 'all', label: 'All Tutorials' },
  { value: 'getting-started', label: 'Getting Started' },
  { value: 'documents', label: 'Documents' },
  { value: 'meetings', label: 'Meetings' },
  { value: 'chat', label: 'Team Chat' },
  { value: 'tasks', label: 'Task Management' },
  { value: 'advanced', label: 'Advanced Features' }
];

// Tutorial data
const tutorials = [
  {
    id: 1,
    title: 'Getting Started with Stack',
    description: 'Learn the basics of Stack and how to set up your first workspace.',
    category: 'getting-started',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    duration: '10 min',
    level: 'Beginner',
    rating: 4.9,
    format: 'video',
    featured: true
  },
  {
    id: 2,
    title: 'Real-time Document Collaboration',
    description: 'Discover how to collaborate on documents with your team in real-time.',
    category: 'documents',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    duration: '15 min',
    level: 'Intermediate',
    rating: 4.8,
    format: 'video',
    featured: true
  },
  {
    id: 3,
    title: 'Setting Up Video Meetings',
    description: 'Learn how to schedule, join, and manage video meetings in Stack.',
    category: 'meetings',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    duration: '12 min',
    level: 'Beginner',
    rating: 4.7,
    format: 'video',
    featured: false
  },
  {
    id: 4,
    title: 'Team Chat Essentials',
    description: 'Master the essentials of team chat with channels, threads, and direct messages.',
    category: 'chat',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    duration: '8 min',
    level: 'Beginner',
    rating: 4.6,
    format: 'article',
    featured: false
  },
  {
    id: 5,
    title: 'Task Management for Teams',
    description: 'Learn how to create, assign, and track tasks across your team.',
    category: 'tasks',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    duration: '20 min',
    level: 'Intermediate',
    rating: 4.9,
    format: 'video',
    featured: true
  },
  {
    id: 6,
    title: 'Advanced Document Formatting',
    description: 'Master advanced formatting options for creating professional documents.',
    category: 'documents',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    duration: '25 min',
    level: 'Advanced',
    rating: 4.8,
    format: 'article',
    featured: false
  },
  {
    id: 7,
    title: 'Integrating Stack with Other Tools',
    description: 'Learn how to connect Stack with your favorite tools and services.',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    duration: '18 min',
    level: 'Advanced',
    rating: 4.7,
    format: 'video',
    featured: false
  },
  {
    id: 8,
    title: 'Stack for Project Managers',
    description: 'Discover how project managers can use Stack to streamline their workflow.',
    category: 'advanced',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    duration: '30 min',
    level: 'Intermediate',
    rating: 4.9,
    format: 'video',
    featured: true
  }
];

export default function Tutorials() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter tutorials based on active category
  const filteredTutorials = activeCategory === 'all' 
    ? tutorials 
    : tutorials.filter(tutorial => tutorial.category === activeCategory);
  
  // Get featured tutorials
  const featuredTutorials = tutorials.filter(tutorial => tutorial.featured);

  return (
    <div>
      <Head>
        <title>Tutorials | Stack</title>
        <meta name="description" content="Learn how to use Stack effectively with our comprehensive tutorials and guides." />
      </Head>

      <Navbar />
      
      {/* Tutorials Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
          color: 'white',
          padding: '120px 0 80px',
          marginTop: '30px',
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
              Tutorials
            </Badge>
            
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              Learn how to use Stack like a pro
            </Title>
            
            <Text size="xl" mb={40} sx={{ lineHeight: 1.6 }}>
              Explore our collection of tutorials, guides, and videos to help you get the most out of Stack.
            </Text>
          </Box>
        </Container>
      </Box>

      {/* Featured Tutorials */}
      <Container size="lg" mt={-60} mb={80}>
        <Card withBorder radius="lg" p={0} sx={{ overflow: 'hidden' }}>
          <Grid gutter={0}>
            <Grid.Col md={6}>
              <Box 
                sx={{ 
                  position: 'relative',
                  height: '100%',
                  minHeight: 400,
                  '@media (max-width: 768px)': {
                    minHeight: 300
                  }
                }}
              >
                <Box 
                  component="img"
                  src={featuredTutorials[0]?.image}
                  alt={featuredTutorials[0]?.title}
                  sx={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7))',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 30
                  }}
                >
                  <Badge color="pink" mb={10}>Featured</Badge>
                  <Title order={2} color="white" mb={10}>{featuredTutorials[0]?.title}</Title>
                  <Text color="rgba(255,255,255,0.8)" mb={20}>{featuredTutorials[0]?.description}</Text>
                  <Group spacing={15}>
                    <Group spacing={5}>
                      <IconClock size={16} color="rgba(255,255,255,0.8)" />
                      <Text size="sm" color="rgba(255,255,255,0.8)">{featuredTutorials[0]?.duration}</Text>
                    </Group>
                    <Group spacing={5}>
                      <IconChartBar size={16} color="rgba(255,255,255,0.8)" />
                      <Text size="sm" color="rgba(255,255,255,0.8)">{featuredTutorials[0]?.level}</Text>
                    </Group>
                    <Group spacing={5}>
                      <IconStarFilled size={16} color="#FFD700" />
                      <Text size="sm" color="rgba(255,255,255,0.8)">{featuredTutorials[0]?.rating}</Text>
                    </Group>
                  </Group>
                  <Button 
                    mt={20}
                    radius="xl"
                    leftIcon={<IconPlayerPlay size={16} />}
                    sx={{ 
                      alignSelf: 'flex-start',
                      background: 'linear-gradient(135deg, #4158D0, #C850C0)'
                    }}
                  >
                    Watch Tutorial
                  </Button>
                </Box>
              </Box>
            </Grid.Col>
            <Grid.Col md={6}>
              <Box p={30} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Title order={3} mb={20}>Popular Tutorials</Title>
                
                <Box sx={{ flex: 1 }}>
                  {featuredTutorials.slice(1, 4).map((tutorial, index) => (
                    <Box key={index} mb={index < 2 ? 20 : 0}>
                      <Group>
                        <Box 
                          sx={{ 
                            width: 100,
                            height: 70,
                            borderRadius: 8,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <Box 
                            component="img"
                            src={tutorial.image}
                            alt={tutorial.title}
                            sx={{ 
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          {tutorial.format === 'video' && (
                            <Box 
                              sx={{ 
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'rgba(0,0,0,0.5)',
                                borderRadius: '50%',
                                width: 30,
                                height: 30,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <IconPlayerPlay size={16} color="white" />
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Text weight={600} mb={5}>{tutorial.title}</Text>
                          <Group spacing={15}>
                            <Group spacing={5}>
                              <IconClock size={14} color="gray" />
                              <Text size="xs" color="dimmed">{tutorial.duration}</Text>
                            </Group>
                            <Group spacing={5}>
                              <IconStarFilled size={14} color="#FFD700" />
                              <Text size="xs" color="dimmed">{tutorial.rating}</Text>
                            </Group>
                          </Group>
                        </Box>
                      </Group>
                      {index < 2 && <Divider my={15} />}
                    </Box>
                  ))}
                </Box>
                
                <Button 
                  variant="subtle" 
                  color="blue" 
                  mt={20}
                  rightIcon={<IconArrowRight size={16} />}
                >
                  View All Featured Tutorials
                </Button>
              </Box>
            </Grid.Col>
          </Grid>
        </Card>
      </Container>

      {/* Tutorial Categories */}
      <Container size="lg" mb={50}>
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
        
        <SimpleGrid 
          cols={3} 
          spacing={30}
          breakpoints={[
            { maxWidth: 992, cols: 2 },
            { maxWidth: 576, cols: 1 }
          ]}
        >
          {filteredTutorials.map(tutorial => (
            <Card 
              key={tutorial.id} 
              withBorder 
              radius="md" 
              p={0}
              sx={{ 
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box 
                  component="img"
                  src={tutorial.image}
                  alt={tutorial.title}
                  sx={{ 
                    width: '100%',
                    height: 200,
                    objectFit: 'cover'
                  }}
                />
                {tutorial.format === 'video' && (
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%',
                      width: 50,
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.7)',
                        transform: 'translate(-50%, -50%) scale(1.1)'
                      }
                    }}
                  >
                    <IconPlayerPlay size={20} color="white" />
                  </Box>
                )}
                <Badge 
                  sx={{ 
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    textTransform: 'capitalize'
                  }}
                  color={tutorial.format === 'video' ? 'blue' : 'green'}
                >
                  {tutorial.format}
                </Badge>
              </Box>
              
              <Box p="lg">
                <Text 
                  transform="uppercase" 
                  color="dimmed" 
                  weight={700} 
                  size="xs"
                  mb={5}
                >
                  {categories.find(cat => cat.value === tutorial.category)?.label}
                </Text>
                <Title order={3} mb={10} sx={{ fontSize: 20 }}>{tutorial.title}</Title>
                <Text color="dimmed" size="sm" mb={15} sx={{ lineHeight: 1.6 }}>
                  {tutorial.description}
                </Text>
                
                <Group position="apart" mt="auto">
                  <Group spacing={10}>
                    <Group spacing={5}>
                      <IconClock size={16} color="gray" />
                      <Text size="sm" color="dimmed">{tutorial.duration}</Text>
                    </Group>
                    <Group spacing={5}>
                      <IconChartBar size={16} color="gray" />
                      <Text size="sm" color="dimmed">{tutorial.level}</Text>
                    </Group>
                  </Group>
                  <Group spacing={5}>
                    <IconStarFilled size={16} color="#FFD700" />
                    <Text weight={600}>{tutorial.rating}</Text>
                  </Group>
                </Group>
                
                <Button 
                  fullWidth 
                  mt={20}
                  radius="md"
                  variant="light"
                  color="blue"
                  rightIcon={<IconArrowRight size={16} />}
                >
                  {tutorial.format === 'video' ? 'Watch Now' : 'Read Now'}
                </Button>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
      
      {/* Newsletter */}
      <Box py={80} sx={{ background: '#f8f9fa' }}>
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
            <Title order={2} mb={15}>Stay updated with new tutorials</Title>
            <Text size="lg" color="dimmed" mb={30} sx={{ maxWidth: 600, margin: '0 auto' }}>
              Subscribe to our newsletter to receive new tutorials, tips, and updates directly in your inbox.
            </Text>
            
            <Group position="center" spacing="md" sx={{ maxWidth: 500, margin: '0 auto' }}>
              <Box 
                component="input"
                placeholder="Your email address"
                sx={{
                  flex: 1,
                  height: 50,
                  padding: '0 20px',
                  borderRadius: 25,
                  border: '1px solid #e0e0e0',
                  fontSize: 16,
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#4158D0'
                  }
                }}
              />
              <Button 
                radius="xl"
                size="md"
                sx={{ 
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                  height: 50,
                  padding: '0 30px'
                }}
              >
                Subscribe
              </Button>
            </Group>
            
            <Text size="sm" color="dimmed" mt={20}>
              We respect your privacy. Unsubscribe at any time.
            </Text>
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
