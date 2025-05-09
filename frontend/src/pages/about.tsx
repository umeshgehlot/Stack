import React from 'react';
import Head from 'next/head';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, Center, 
  Stack as MantineStack, Box, Divider, List, ThemeIcon, Avatar, Grid, Image
} from '@mantine/core';
import { 
  IconCheck, IconBuildingSkyscraper, IconUsers, IconRocket, 
  IconArrowRight, IconBrandTwitter, IconBrandLinkedin, IconMail
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CompanyTimeline from '../components/CompanyTimeline';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';
import ProgressBarsGroup from '../components/ProgressBarsGroup';

const teamMembers = [
  {
    name: 'Alex Johnson',
    position: 'CEO & Co-Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    bio: 'Former product lead at Google. Passionate about building tools that help teams work better together.',
    twitter: '#',
    linkedin: '#',
    email: 'alex@stackplatform.com'
  },
  {
    name: 'Sarah Chen',
    position: 'CTO & Co-Founder',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    bio: 'MIT graduate with 10+ years of experience in building scalable systems. Previously led engineering at Dropbox.',
    twitter: '#',
    linkedin: '#',
    email: 'sarah@stackplatform.com'
  },
  {
    name: 'Michael Rodriguez',
    position: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    bio: 'Product manager with experience at Slack and Microsoft. Focused on creating intuitive user experiences.',
    twitter: '#',
    linkedin: '#',
    email: 'michael@stackplatform.com'
  },
  {
    name: 'Emily Wong',
    position: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    bio: 'Award-winning designer who previously worked at Figma. Passionate about creating beautiful, functional interfaces.',
    twitter: '#',
    linkedin: '#',
    email: 'emily@stackplatform.com'
  }
];

const investors = [
  { name: 'Sequoia Capital', logo: 'https://via.placeholder.com/150x80?text=Sequoia' },
  { name: 'Andreessen Horowitz', logo: 'https://via.placeholder.com/150x80?text=a16z' },
  { name: 'Y Combinator', logo: 'https://via.placeholder.com/150x80?text=YC' },
  { name: 'Accel', logo: 'https://via.placeholder.com/150x80?text=Accel' }
];

const values = [
  {
    title: 'User-Focused',
    description: 'We build for our users first, always striving to solve real problems and create genuine value.'
  },
  {
    title: 'Transparency',
    description: 'We believe in open communication, both within our team and with our customers.'
  },
  {
    title: 'Innovation',
    description: 'We continuously push boundaries and explore new ideas to create the best possible product.'
  },
  {
    title: 'Quality',
    description: 'We\'re committed to excellence in everything we do, from code to customer support.'
  }
];

export default function About() {
  return (
    <div>
      <Head>
        <title>About Us | Stack - Real-Time Collaboration Platform</title>
        <meta name="description" content="Learn about Stack's mission, team, and the story behind our real-time collaboration platform." />
      </Head>


      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        color: 'white',
        padding: '100px 0 120px',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <Box sx={{ 
          position: 'absolute',
          top: '5%',
          left: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0
        }} />
        
        <Container size="lg">
          <MantineStack align="center" spacing={0}>
            <Badge 
              size="xl" 
              radius="xl" 
              color="pink" 
              variant="filled" 
              mb={20}
              sx={{
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(200, 80, 192, 0.3)'
              }}
            >
              Our Story
            </Badge>
            <Title order={1} align="center" mb={20} sx={{ 
              fontSize: '36px',
              '@media (min-width: 576px)': { fontSize: '48px' },
              '@media (min-width: 768px)': { fontSize: '56px' },
              fontWeight: 900,
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              Building the future of collaboration
            </Title>
            <Text align="center" mb={40} sx={{ 
              fontSize: '18px',
              '@media (min-width: 768px)': { fontSize: '22px' },
              maxWidth: 700,
              lineHeight: 1.6,
              opacity: 0.9
            }}>
              We're on a mission to make teamwork more efficient, creative, and enjoyable for teams of all sizes.
            </Text>
          </MantineStack>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container size="lg" py={80}>
        <Grid gutter={50} align="center">
          <Grid.Col md={6}>
            <Box>
              <Badge color="indigo" size="lg" radius="sm" mb={15}>Our Mission</Badge>
              <Title order={2} mb={20} sx={{ fontWeight: 800, fontSize: 36 }}>
                Empowering teams to do their best work together
              </Title>
              <Text size="lg" color="dimmed" sx={{ lineHeight: 1.7 }} mb={30}>
                Stack was founded in 2021 with a simple but powerful vision: to create a platform that brings together all the tools teams need to collaborate effectively in one seamless experience.
              </Text>
              <Text size="lg" color="dimmed" sx={{ lineHeight: 1.7 }} mb={30}>
                We noticed that teams were struggling with fragmented workflows across multiple apps, leading to lost information, context switching, and inefficient processes. We set out to solve this problem by building a unified platform that combines documents, meetings, chat, and tasks.
              </Text>
              <List
                spacing="md"
                size="lg"
                center
                icon={
                  <ThemeIcon size={28} radius="xl" color="indigo">
                    <IconCheck size={18} />
                  </ThemeIcon>
                }
              >
                <List.Item>Raised $25M in funding from top investors</List.Item>
                <List.Item>Growing team of 50+ across 12 countries</List.Item>
                <List.Item>Supporting 10,000+ teams worldwide</List.Item>
                <List.Item>Committed to privacy and security first</List.Item>
              </List>
            </Box>
          </Grid.Col>
          <Grid.Col md={6}>
            <Box sx={{ 
              position: 'relative',
              height: 400,
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}>
              <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <ThemeIcon 
                  size={120} 
                  radius="xl" 
                  sx={{
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    boxShadow: '0 15px 30px rgba(65, 88, 208, 0.3)',
                    marginBottom: 20
                  }}
                >
                  <IconRocket size={60} stroke={1.5} color="white" />
                </ThemeIcon>
                <Title order={3} sx={{ fontWeight: 700 }}>Founded in 2021</Title>
                <Text size="lg" mt={10} sx={{ maxWidth: 300, margin: '0 auto' }}>
                  From a small team of 5 to a global company
                </Text>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ background: '#f8f9fa', padding: '80px 0' }}>
        <Container size="lg">
          <Title order={2} align="center" mb={10} sx={{ fontWeight: 800 }}>Our Values</Title>
          <Text align="center" color="dimmed" mb={50} sx={{ maxWidth: 600, margin: '0 auto' }}>
            These core principles guide everything we do, from product decisions to how we interact with our customers.
          </Text>
          
          <SimpleGrid cols={4} spacing={30} breakpoints={[
            { maxWidth: 980, cols: 2 },
            { maxWidth: 755, cols: 1 },
          ]}>
            {values.map((value, index) => (
              <Card 
                key={index} 
                shadow="md" 
                p={30} 
                radius="lg" 
                withBorder
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Box 
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'white'
                  }}
                >
                  {index + 1}
                </Box>
                <Title order={4} mb={10}>{value.title}</Title>
                <Text color="dimmed">{value.description}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container size="lg" py={80}>
        <Title order={2} align="center" mb={10} sx={{ fontWeight: 800 }}>Meet Our Team</Title>
        <Text align="center" color="dimmed" mb={50} sx={{ maxWidth: 600, margin: '0 auto' }}>
          We're a diverse group of passionate individuals working together to build something special.
        </Text>
        
        <SimpleGrid cols={4} spacing={30} breakpoints={[
          { maxWidth: 980, cols: 2 },
          { maxWidth: 755, cols: 1 },
        ]}>
          {teamMembers.map((member, index) => (
            <Card 
              key={index} 
              shadow="md" 
              p={0} 
              radius="lg" 
              withBorder
              sx={{
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box sx={{ height: 200, overflow: 'hidden' }}>
                <Box 
                  component="img" 
                  src={member.image} 
                  alt={member.name}
                  sx={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'all 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                />
              </Box>
              <Box p={20}>
                <Title order={4} mb={5}>{member.name}</Title>
                <Text size="sm" color="dimmed" mb={10}>{member.position}</Text>
                <Text size="sm" mb={15}>{member.bio}</Text>
                <Group spacing={10}>
                  <ThemeIcon 
                    size={34} 
                    radius="xl" 
                    variant="light" 
                    color="blue"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { transform: 'translateY(-3px)' },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <IconBrandTwitter size={18} />
                  </ThemeIcon>
                  <ThemeIcon 
                    size={34} 
                    radius="xl" 
                    variant="light" 
                    color="indigo"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { transform: 'translateY(-3px)' },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <IconBrandLinkedin size={18} />
                  </ThemeIcon>
                  <ThemeIcon 
                    size={34} 
                    radius="xl" 
                    variant="light" 
                    color="pink"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { transform: 'translateY(-3px)' },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <IconMail size={18} />
                  </ThemeIcon>
                </Group>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Investors Section */}
      <Box sx={{ background: '#f8f9fa', padding: '80px 0' }}>
        <Container size="lg">
          <Title order={2} align="center" mb={10} sx={{ fontWeight: 800 }}>Backed by the Best</Title>
          <Text align="center" color="dimmed" mb={50} sx={{ maxWidth: 600, margin: '0 auto' }}>
            We're proud to be supported by leading investors who believe in our vision.
          </Text>
          
          <SimpleGrid cols={4} spacing={30} breakpoints={[
            { maxWidth: 980, cols: 2 },
            { maxWidth: 755, cols: 2 },
          ]}>
            {investors.map((investor, index) => (
              <Card 
                key={index} 
                shadow="sm" 
                p={30} 
                radius="lg" 
                withBorder
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <img src={investor.logo} alt={investor.name} style={{ maxWidth: '100%', height: 'auto' }} />
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
        color: 'white',
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <Box sx={{ 
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: '5%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0
        }} />
        
        <Container size="md">
          <Card 
            shadow="xl" 
            p={50} 
            radius="lg"
            withBorder
            sx={{
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: 'linear-gradient(90deg, #4158D0, #C850C0, #FFCC70)',
              borderTopLeftRadius: 'lg',
              borderTopRightRadius: 'lg',
            }} />
            
            <Title order={2} mb={20} sx={{ fontSize: 36, fontWeight: 800 }}>Join our growing team</Title>
            <Text size="xl" mb={30} mx="auto" style={{ maxWidth: 600, lineHeight: 1.6 }}>
              We're always looking for talented individuals who are passionate about building great products and solving interesting problems.
            </Text>
            
            <Group position="center" spacing={20}>
              <Button 
                component="a" 
                href="/careers" 
                size="xl" 
                radius="xl" 
                color="white"
                variant="filled"
                rightIcon={<IconArrowRight size={20} />}
                sx={{ 
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.4)',
                  padding: '0 32px',
                  height: 56,
                  fontSize: 18,
                  fontWeight: 600,
                  background: 'rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 20px rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                View Open Positions
              </Button>
            </Group>
          </Card>
        </Container>
      </Box>

      {/* Company Metrics */}
      <Box py={40} sx={{ background: '#f8f9fa' }}>
        <Container size="lg">
          <MantineStack align="center" mb={50}>
            <Badge size="lg" radius="xl" color="indigo" variant="filled" mb={10}>
              Company Metrics
            </Badge>
            <Title order={2} size={36} align="center" mb={10} style={{ fontWeight: 800 }}>
              Our Impact by the Numbers
            </Title>
            <Text size="xl" align="center" color="dimmed" style={{ maxWidth: 700 }}>
              See how Stack has transformed the way teams work together
            </Text>
          </MantineStack>
          
          <SimpleGrid cols={2} spacing={50} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
            <Box>
              <ProgressBarsGroup />
            </Box>
            <Box>
              <Image
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Team collaboration"
                radius="md"
                sx={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)'
                  }
                }}
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Company Timeline */}
      <CompanyTimeline />
      
      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
    </div>
  );
}
