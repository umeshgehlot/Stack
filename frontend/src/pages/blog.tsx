import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, 
  Box, Image, Tabs, Divider, Avatar, Grid
} from '@mantine/core';
import { 
  IconCalendar, IconClock, IconArrowRight, IconSearch,
  IconUser, IconTag, IconChevronRight
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';

// Blog categories
const categories = [
  { value: 'all', label: 'All Posts' },
  { value: 'product', label: 'Product Updates' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'case-studies', label: 'Case Studies' },
  { value: 'company', label: 'Company News' },
  { value: 'remote-work', label: 'Remote Work' }
];

// Blog posts
export const blogPosts = [
  {
    id: 1,
    title: 'Introducing Stack: The All-in-One Collaboration Platform',
    slug: 'introducing-stack',
    excerpt: "Today, we're excited to announce the launch of Stack, a new collaboration platform designed to help teams work together more efficiently, no matter where they are.",
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      title: 'Co-Founder & CEO'
    },
    date: 'May 15, 2025',
    readTime: '5 min read',
    category: 'company',
    featured: true
  },
  {
    id: 2,
    title: 'How to Set Up Your First Workspace in Stack',
    slug: 'set-up-first-workspace',
    excerpt: 'Learn how to set up your first workspace in Stack and invite your team members to start collaborating right away.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      title: 'Product Manager'
    },
    date: 'May 10, 2025',
    readTime: '8 min read',
    category: 'tutorials',
    featured: false
  },
  {
    id: 3,
    title: 'Real-time Document Collaboration: A Game Changer for Teams',
    slug: 'real-time-document-collaboration',
    excerpt: 'Discover how real-time document collaboration can transform the way your team works together and boost productivity.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    author: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      title: 'Content Marketing Manager'
    },
    date: 'May 5, 2025',
    readTime: '6 min read',
    category: 'product',
    featured: true
  },
  {
    id: 4,
    title: 'How TechGlobe Improved Team Collaboration with Stack',
    slug: 'techglobe-case-study',
    excerpt: 'Learn how TechGlobe, a leading technology company, improved team collaboration and productivity by 35% after implementing Stack.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    author: {
      name: 'David Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      title: 'Customer Success Manager'
    },
    date: 'April 28, 2025',
    readTime: '10 min read',
    category: 'case-studies',
    featured: false
  },
  {
    id: 5,
    title: '10 Tips for Effective Remote Team Management',
    slug: 'remote-team-management-tips',
    excerpt: 'Discover practical tips and strategies for managing remote teams effectively and maintaining high productivity.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      title: 'Co-Founder & CEO'
    },
    date: 'April 20, 2025',
    readTime: '7 min read',
    category: 'remote-work',
    featured: false
  },
  {
    id: 6,
    title: 'Introducing Video Meetings in Stack',
    slug: 'introducing-video-meetings',
    excerpt: "We're excited to announce the launch of video meetings in Stack, making it easier than ever to collaborate with your team in real-time.",
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      title: 'Product Manager'
    },
    date: 'April 15, 2025',
    readTime: '5 min read',
    category: 'product',
    featured: true
  }
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter blog posts based on active category and search query
  const filteredPosts = blogPosts.filter(post => 
    (activeCategory === 'all' || post.category === activeCategory) &&
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div>
      <Head>
        <title>Blog | Stack</title>
        <meta name="description" content="Read the latest articles, tutorials, and updates from the Stack team." />
      </Head>

      <Navbar />
      
      {/* Blog Header */}
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
              Blog
            </Badge>
            
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              Latest insights & updates
            </Title>
            
            <Text size="xl" mb={40} sx={{ lineHeight: 1.6 }}>
              Stay up to date with the latest news, tutorials, and product updates from the Stack team.
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
                placeholder="Search articles..."
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

      {/* Featured Posts */}
      <Container size="lg" py={60}>
        <Card withBorder radius="lg" p={0} mb={60}>
          <Grid gutter={0}>
            <Grid.Col md={6}>
              <Box 
                sx={{ 
                  height: '100%', 
                  backgroundImage: `url(${featuredPosts[0]?.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: 400
                }}
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <Box p={30} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Badge color="pink" size="lg" radius="sm" mb={15}>Featured</Badge>
                <Title order={2} mb={15}>{featuredPosts[0]?.title}</Title>
                <Text mb={20} color="dimmed" sx={{ lineHeight: 1.6 }}>
                  {featuredPosts[0]?.excerpt}
                </Text>
                
                <Group spacing={15} mb={20}>
                  <Group spacing={10}>
                    <Avatar src={featuredPosts[0]?.author.avatar} radius="xl" size={24} />
                    <Text size="sm">{featuredPosts[0]?.author.name}</Text>
                  </Group>
                  <Group spacing={5}>
                    <IconCalendar size={16} color="gray" />
                    <Text size="sm" color="dimmed">{featuredPosts[0]?.date}</Text>
                  </Group>
                  <Group spacing={5}>
                    <IconClock size={16} color="gray" />
                    <Text size="sm" color="dimmed">{featuredPosts[0]?.readTime}</Text>
                  </Group>
                </Group>
                
                <Box sx={{ flex: 1 }} />
                
                <Button 
                  component={Link}
                  href={`/blog/${featuredPosts[0]?.slug}`}
                  size="md" 
                  mt={20}
                  radius="xl"
                  sx={{ 
                    alignSelf: 'flex-start',
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)'
                  }}
                >
                  Read More
                </Button>
              </Box>
            </Grid.Col>
            <Grid.Col md={6}>
              <Card p="lg" radius="md" withBorder component={Link} href={`/blog/${featuredPosts[0]?.slug}`} sx={(theme) => ({
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows.md
                }
              })}>
                <Title order={3} mb={20}>Popular Articles</Title>
                
                <Box sx={{ flex: 1 }}>
                  {featuredPosts.slice(1, 4).map((post, index) => (
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
                            src={post.image}
                            alt={post.title}
                            sx={{ 
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Text weight={600} mb={5}>{post.title}</Text>
                          <Group spacing={15}>
                            <Group spacing={5}>
                              <IconCalendar size={14} color="gray" />
                              <Text size="xs" color="dimmed">{post.date}</Text>
                            </Group>
                            <Group spacing={5}>
                              <IconClock size={14} color="gray" />
                              <Text size="xs" color="dimmed">{post.readTime}</Text>
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
                  View All Featured Articles
                </Button>
              </Card>
            </Grid.Col>
          </Grid>
        </Card>
      </Container>

      {/* Blog Categories */}
      <Container size="lg" mb={50}>
        <Tabs
          value={activeCategory}
          onTabChange={(value) => value !== null && setActiveCategory(value.toString())}
          variant="pills"
          radius="xl"
          sx={{
            '.mantine-Tabs-tabsList': {
              borderBottom: 'none',
              marginBottom: 30
            },
            '.mantine-Tabs-tab': {
              fontWeight: 500,
              padding: '8px 16px',
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
        
        {filteredPosts.length > 0 ? (
          <SimpleGrid 
            cols={3} 
            spacing={30}
            breakpoints={[
              { maxWidth: 992, cols: 2 },
              { maxWidth: 576, cols: 1 }
            ]}
          >
            {filteredPosts.map(post => (
              <Card 
                key={post.id} 
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
                    src={post.image}
                    alt={post.title}
                    sx={{ 
                      width: '100%',
                      height: 200,
                      objectFit: 'cover'
                    }}
                  />
                  <Badge 
                    sx={{ 
                      position: 'absolute',
                      top: 15,
                      right: 15,
                      textTransform: 'capitalize'
                    }}
                    color="blue"
                  >
                    {categories.find(cat => cat.value === post.category)?.label}
                  </Badge>
                </Box>
                
                <Box p="lg">
                  <Group spacing={10} mb={10}>
                    <Group spacing={5}>
                      <IconCalendar size={14} color="gray" />
                      <Text size="xs" color="dimmed">{post.date}</Text>
                    </Group>
                    <Group spacing={5}>
                      <IconClock size={14} color="gray" />
                      <Text size="xs" color="dimmed">{post.readTime}</Text>
                    </Group>
                  </Group>
                  
                  <Title order={3} mb={10} sx={{ fontSize: 20 }}>{post.title}</Title>
                  <Text color="dimmed" size="sm" mb={15} sx={{ lineHeight: 1.6 }}>
                    {post.excerpt}
                  </Text>
                  
                  <Divider my={15} />
                  
                  <Group position="apart">
                    <Group>
                      <Avatar src={post.author.avatar} radius="xl" size={30} />
                      <Box>
                        <Text size="sm" weight={600}>{post.author.name}</Text>
                        <Text size="xs" color="dimmed">{post.author.title}</Text>
                      </Box>
                    </Group>
                    
                    <Button 
                      variant="subtle" 
                      color="blue" 
                      compact
                      rightIcon={<IconChevronRight size={16} />}
                      component={Link}
                      href={`/blog/${post.slug}`}
                    >
                      Read
                    </Button>
                  </Group>
                </Box>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Box py={60} sx={{ textAlign: 'center' }}>
            <Title order={3} mb={15} color="dimmed">No posts found</Title>
            <Text mb={20}>Try adjusting your search or filter to find what you're looking for.</Text>
            <Button 
              variant="outline" 
              color="blue" 
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              View All Posts
            </Button>
          </Box>
        )}
      </Container>

      {/* Related Posts */}
      <Container size="lg" py={60}>
        <Title order={2} mb={30} sx={{ fontWeight: 700 }}>You might also like</Title>
        <SimpleGrid 
          cols={4} 
          spacing={20}
          breakpoints={[
            { maxWidth: 992, cols: 3 },
            { maxWidth: 768, cols: 2 },
            { maxWidth: 576, cols: 1 }
          ]}
        >
          {blogPosts.slice(0, 4).map(post => (
            <Card 
              key={post.id} 
              withBorder 
              radius="md" 
              p={0}
              component={Link}
              href={`/blog/${post.slug}`}
              sx={{ 
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box 
                component="img"
                src={post.image}
                alt={post.title}
                sx={{ 
                  width: '100%',
                  height: 150,
                  objectFit: 'cover'
                }}
              />
              <Box p="md">
                <Badge 
                  size="sm" 
                  color="blue" 
                  mb={10}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {categories.find(cat => cat.value === post.category)?.label}
                </Badge>
                <Title order={4} mb={10} lineClamp={2}>{post.title}</Title>
                <Group spacing={10}>
                  <Group spacing={5}>
                    <IconCalendar size={14} color="gray" />
                    <Text size="xs" color="dimmed">{post.date}</Text>
                  </Group>
                  <Group spacing={5}>
                    <IconClock size={14} color="gray" />
                    <Text size="xs" color="dimmed">{post.readTime}</Text>
                  </Group>
                </Group>
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
            <Title order={2} mb={15}>Subscribe to our newsletter</Title>
            <Text size="lg" color="dimmed" mb={30} sx={{ maxWidth: 600, margin: '0 auto' }}>
              Get the latest articles, tutorials, and updates from the Stack team delivered straight to your inbox.
            </Text>
            
            <Group position="center" spacing={15} align="flex-start">
              <Box 
                component="input"
                placeholder="Enter your email"
                sx={{
                  height: 54,
                  width: '100%',
                  maxWidth: 400,
                  padding: '0 20px',
                  borderRadius: 30,
                  border: '1px solid #e0e0e0',
                  fontSize: 16,
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#4158D0'
                  }
                }}
              />
              <Button 
                size="lg"
                radius="xl"
                sx={{ 
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                  height: 54
                }}
              >
                Subscribe
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
