import { useRouter } from 'next/router';
import { Box, Container, Title, Text, Image, Button, Group, Divider, Badge } from '@mantine/core';
import { IconArrowLeft, IconCalendar, IconClock, IconTag } from '@tabler/icons-react';
import Link from 'next/link';

// Import blog post data
import { blogPosts } from '../blog';

export default function BlogPostDetail() {
  const router = useRouter();
  const { slug } = router.query;
  
  // Find the blog post with the matching slug
  const post = blogPosts.find(post => post.slug === slug);
  
  // If no post is found or the page is still loading, show a loading state
  if (!post && typeof slug === 'string') {
    return (
      <Container size="lg" py={50}>
        <Box sx={{ textAlign: 'center' }}>
          <Title order={2} mb={20}>Blog post not found</Title>
          <Text mb={30}>The blog post you're looking for doesn't exist or has been removed.</Text>
          <Button 
            component={Link} 
            href="/blog"
            leftIcon={<IconArrowLeft size={16} />}
            variant="outline"
          >
            Back to All Posts
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!post) {
    return (
      <Container size="lg" py={50}>
        <Box sx={{ textAlign: 'center' }}>
          <Title order={2}>Loading...</Title>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero section with gradient background */}
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
          <Box sx={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <Badge color="pink" size="lg" radius="sm" mb={15}>{post.category}</Badge>
            <Title order={1} mb={20}>{post.title}</Title>
            <Group spacing="lg" mb={30}>
              <Group spacing="xs">
                <IconCalendar size={16} />
                <Text>{post.date}</Text>
              </Group>
              <Group spacing="xs">
                <IconClock size={16} />
                <Text>{post.readTime} min read</Text>
              </Group>
              <Group spacing="xs">
                <IconTag size={16} />
                <Text>{post.category}</Text>
              </Group>
            </Group>
          </Box>
        </Container>
      </Box>

      {/* Main content */}
      <Container size="lg" py={50}>
        <Box sx={(theme) => ({ 
          display: 'flex', 
          gap: 40, 
          flexDirection: 'column',
          [theme.fn.largerThan('md')]: {
            flexDirection: 'row'
          }
        })}>
          {/* Article content */}
          <Box sx={{ flex: '1 1 70%' }}>
            {/* Featured image */}
            <Image 
              src={post.image} 
              alt={post.title}
              radius="md"
              mb={30}
              sx={{ 
                width: '100%', 
                height: 400, 
                objectFit: 'cover',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            {/* Author info */}
            <Group mb={30} position="apart">
              <Group>
                <Image 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  width={50}
                  height={50}
                  radius="xl"
                />
                <Box>
                  <Text weight={600}>{post.author.name}</Text>
                  <Text size="sm" color="dimmed">{post.author.title}</Text>
                </Box>
              </Group>
              <Button 
                component={Link} 
                href="/blog"
                leftIcon={<IconArrowLeft size={16} />}
                variant="subtle"
              >
                Back to All Posts
              </Button>
            </Group>
            
            <Divider mb={30} />
            
            {/* Post content */}
            <Text size="lg" mb={40}>{post.content}</Text>
            
            {/* Tags */}
            <Box mb={40}>
              <Text weight={600} mb={10}>Tags:</Text>
              <Group>
                <Badge color="blue" size="lg">{post.category}</Badge>
                <Badge color="grape" size="lg">Stack</Badge>
                <Badge color="cyan" size="lg">Updates</Badge>
              </Group>
            </Box>
            
            <Divider mb={30} />
            
            {/* Share and navigation */}
            <Group position="apart" mb={50}>
              <Button 
                component={Link} 
                href="/blog"
                leftIcon={<IconArrowLeft size={16} />}
                variant="outline"
              >
                Back to All Posts
              </Button>
            </Group>
            
            {/* Comments section */}
            <Box>
              <Title order={3} mb={30}>Comments (3)</Title>
              
              {/* Comment form */}
              <Box mb={40}>
                <Text weight={600} mb={15}>Leave a comment</Text>
                <Box mb={15}>
                  <Text size="sm" mb={5}>Your name</Text>
                  <Box
                    component="input"
                    placeholder="Enter your name"
                    sx={{
                      width: '100%',
                      padding: '10px 15px',
                      borderRadius: 5,
                      border: '1px solid #e0e0e0',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#4158D0'
                      }
                    }}
                  />
                </Box>
                
                <Box mb={15}>
                  <Text size="sm" mb={5}>Your email</Text>
                  <Box
                    component="input"
                    placeholder="Enter your email"
                    sx={{
                      width: '100%',
                      padding: '10px 15px',
                      borderRadius: 5,
                      border: '1px solid #e0e0e0',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#4158D0'
                      }
                    }}
                  />
                </Box>
                
                <Box mb={15}>
                  <Text size="sm" mb={5}>Your comment</Text>
                  <Box
                    component="textarea"
                    placeholder="Write your comment here..."
                    sx={{
                      width: '100%',
                      padding: '10px 15px',
                      borderRadius: 5,
                      border: '1px solid #e0e0e0',
                      minHeight: 120,
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      fontSize: 14,
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#4158D0'
                      }
                    }}
                  />
                </Box>
                
                <Button
                  sx={{ 
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)'
                  }}
                >
                  Submit Comment
                </Button>
              </Box>
              
              {/* Existing comments */}
              <Box>
                {/* Comment 1 */}
                <Box mb={30} p={20} sx={{ backgroundColor: '#f8f9fa', borderRadius: 10 }}>
                  <Group position="apart" mb={15}>
                    <Group>
                      <Image 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                        width={40} 
                        height={40} 
                        radius="xl" 
                        alt="User avatar"
                      />
                      <Box>
                        <Text weight={600}>John Smith</Text>
                        <Text size="xs" color="dimmed">Product Designer</Text>
                      </Box>
                    </Group>
                    <Text size="xs" color="dimmed">2 days ago</Text>
                  </Group>
                  <Text>This is exactly what our team needed! We've been looking for a solution like Stack for months. The real-time collaboration features are game-changing for our remote team.</Text>
                </Box>
                
                {/* Comment 2 */}
                <Box mb={30} p={20} sx={{ backgroundColor: '#f8f9fa', borderRadius: 10 }}>
                  <Group position="apart" mb={15}>
                    <Group>
                      <Image 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                        width={40} 
                        height={40} 
                        radius="xl" 
                        alt="User avatar"
                      />
                      <Box>
                        <Text weight={600}>Emma Johnson</Text>
                        <Text size="xs" color="dimmed">Marketing Manager</Text>
                      </Box>
                    </Group>
                    <Text size="xs" color="dimmed">3 days ago</Text>
                  </Group>
                  <Text>I appreciate the detailed walkthrough. Would love to see a follow-up post about integrating Stack with other tools we use like Figma and Notion.</Text>
                </Box>
                
                {/* Comment 3 */}
                <Box mb={30} p={20} sx={{ backgroundColor: '#f8f9fa', borderRadius: 10 }}>
                  <Group position="apart" mb={15}>
                    <Group>
                      <Image 
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                        width={40} 
                        height={40} 
                        radius="xl" 
                        alt="User avatar"
                      />
                      <Box>
                        <Text weight={600}>Michael Chen</Text>
                        <Text size="xs" color="dimmed">Software Engineer</Text>
                      </Box>
                    </Group>
                    <Text size="xs" color="dimmed">5 days ago</Text>
                  </Group>
                  <Text>Great article! One question though - how does Stack handle version control for documents? Is there a way to revert to previous versions if needed?</Text>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* Sidebar */}
          <Box sx={{ flex: '1 1 30%' }}>
            <Box sx={{ 
              background: '#f8f9fa', 
              padding: 20, 
              borderRadius: 10,
              position: 'sticky',
              top: 20
            }}>
              <Title order={4} mb={15}>Recent Posts</Title>
              <Divider mb={20} />
              
              {blogPosts.slice(0, 3).map(recentPost => (
                <Box key={recentPost.id} mb={15}>
                  <Link href={`/blog/${recentPost.slug}`} passHref>
                    <Text component="a" weight={500} sx={{ 
                      display: 'block', 
                      color: 'inherit', 
                      textDecoration: 'none',
                      '&:hover': { color: '#C850C0' }
                    }}>
                      {recentPost.title}
                    </Text>
                  </Link>
                  <Text size="sm" color="dimmed">{recentPost.date} • {recentPost.readTime} min read</Text>
                </Box>
              ))}
              
              <Divider my={20} />
              
              <Title order={4} mb={15}>Categories</Title>
              <Group>
                <Badge color="blue" size="lg">Product</Badge>
                <Badge color="green" size="lg">Engineering</Badge>
                <Badge color="orange" size="lg">Design</Badge>
                <Badge color="grape" size="lg">Company</Badge>
              </Group>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
