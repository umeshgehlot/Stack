import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, 
  Box, Image, Tabs, Divider
} from '@mantine/core';
import { 
  IconVideo, IconCalendar, IconClock, IconUsers, IconArrowRight,
  IconPlayerPlay, IconDownload, IconBrandYoutube
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';

// Webinar data
const webinars = [
  {
    id: 1,
    title: 'Getting Started with Stack: A Complete Overview',
    description: 'Join us for a comprehensive overview of Stack and learn how to get your team up and running quickly.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    date: 'June 15, 2025',
    time: '2:00 PM EST',
    duration: '60 min',
    speaker: 'Sarah Johnson',
    speakerTitle: 'Product Manager',
    status: 'upcoming',
    registrationLink: '#'
  },
  {
    id: 2,
    title: 'Advanced Document Collaboration Techniques',
    description: 'Discover advanced techniques for document collaboration that will boost your team\'s productivity.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    date: 'June 22, 2025',
    time: '1:00 PM EST',
    duration: '45 min',
    speaker: 'Michael Chen',
    speakerTitle: 'Senior Engineer',
    status: 'upcoming',
    registrationLink: '#'
  },
  {
    id: 3,
    title: 'Maximizing Team Productivity with Stack',
    description: 'Learn how to maximize your team\'s productivity using Stack\'s powerful features.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    date: 'May 10, 2025',
    time: '11:00 AM EST',
    duration: '60 min',
    speaker: 'Emily Rodriguez',
    speakerTitle: 'Customer Success Manager',
    status: 'past',
    recordingLink: '#',
    slidesLink: '#'
  },
  {
    id: 4,
    title: 'Stack for Enterprise: Security and Compliance',
    description: 'Explore Stack\'s enterprise-grade security features and compliance capabilities.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    date: 'April 28, 2025',
    time: '3:00 PM EST',
    duration: '75 min',
    speaker: 'David Wilson',
    speakerTitle: 'Security Director',
    status: 'past',
    recordingLink: '#',
    slidesLink: '#'
  }
];

export default function Webinars() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const upcomingWebinars = webinars.filter(webinar => webinar.status === 'upcoming');
  const pastWebinars = webinars.filter(webinar => webinar.status === 'past');
  
  const displayedWebinars = activeTab === 'upcoming' ? upcomingWebinars : pastWebinars;

  return (
    <div>
      <Head>
        <title>Webinars | Stack</title>
        <meta name="description" content="Join our live webinars to learn how to get the most out of Stack and boost your team's productivity." />
      </Head>

      <Navbar />
      
      {/* Webinars Header */}
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
              Webinars
            </Badge>
            
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              Learn from Stack experts
            </Title>
            
            <Text size="xl" mb={40} sx={{ lineHeight: 1.6 }}>
              Join our live webinars to learn how to get the most out of Stack and boost your team's productivity.
            </Text>
            
            <Button 
              component="a"
              href="#webinars"
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
              Browse Webinars
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Webinar */}
      <Container size="lg" mt={-60} mb={80}>
        <Card withBorder radius="lg" p={0} sx={{ overflow: 'hidden' }}>
          <Group spacing={0} noWrap sx={{ '@media (max-width: 768px)': { flexDirection: 'column' } }}>
            <Box 
              sx={{ 
                flex: '0 0 50%',
                position: 'relative',
                '@media (max-width: 768px)': {
                  width: '100%'
                }
              }}
            >
              <Box 
                component="img"
                src={upcomingWebinars[0]?.image}
                alt={upcomingWebinars[0]?.title}
                sx={{ 
                  width: '100%',
                  height: '100%',
                  minHeight: 400,
                  objectFit: 'cover',
                  '@media (max-width: 768px)': {
                    minHeight: 250
                  }
                }}
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 30
                }}
              >
                <Badge color="pink" mb={10}>Featured Webinar</Badge>
                <Title order={2} color="white" mb={10}>{upcomingWebinars[0]?.title}</Title>
                <Group spacing={15}>
                  <Group spacing={5}>
                    <IconCalendar size={16} color="white" />
                    <Text size="sm" color="white">{upcomingWebinars[0]?.date}</Text>
                  </Group>
                  <Group spacing={5}>
                    <IconClock size={16} color="white" />
                    <Text size="sm" color="white">{upcomingWebinars[0]?.time}</Text>
                  </Group>
                </Group>
              </Box>
            </Box>
            
            <Box 
              p={40} 
              sx={{ 
                flex: '0 0 50%',
                '@media (max-width: 768px)': {
                  width: '100%'
                }
              }}
            >
              <Text size="lg" mb={20}>{upcomingWebinars[0]?.description}</Text>
              
              <Group mb={30}>
                <Box 
                  sx={{ 
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 20
                  }}
                >
                  {upcomingWebinars[0]?.speaker.charAt(0)}
                </Box>
                <Box>
                  <Text weight={600}>{upcomingWebinars[0]?.speaker}</Text>
                  <Text size="sm" color="dimmed">{upcomingWebinars[0]?.speakerTitle}</Text>
                </Box>
              </Group>
              
              <Group spacing={15} mb={30}>
                <Group spacing={5}>
                  <IconClock size={16} color="gray" />
                  <Text size="sm" color="dimmed">{upcomingWebinars[0]?.duration}</Text>
                </Group>
                <Group spacing={5}>
                  <IconUsers size={16} color="gray" />
                  <Text size="sm" color="dimmed">Live Q&A Session</Text>
                </Group>
              </Group>
              
              <Button 
                component="a"
                href={upcomingWebinars[0]?.registrationLink}
                size="lg"
                radius="xl"
                sx={{ 
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                  padding: '0 35px',
                  height: 50
                }}
              >
                Register Now
              </Button>
            </Box>
          </Group>
        </Card>
      </Container>

      {/* Webinar Tabs */}
      <Container size="lg" mb={80} id="webinars">
        <Tabs
          value={activeTab}
          onTabChange={(value) => value !== null && setActiveTab(value.toString())}
          variant="pills"
          radius="xl"
          sx={{
            '.mantine-Tabs-tabsList': {
              borderBottom: '1px solid #eee',
              paddingBottom: 15,
              marginBottom: 30
            },
            '.mantine-Tabs-tab': {
              fontWeight: 600,
              padding: '8px 20px',
              '&[data-active]': {
                background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                color: 'white'
              }
            }
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="upcoming" icon={<IconCalendar size={16} />}>
              Upcoming Webinars
            </Tabs.Tab>
            <Tabs.Tab value="past" icon={<IconVideo size={16} />}>
              Past Webinars
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        
        <SimpleGrid 
          cols={2} 
          spacing={30}
          breakpoints={[{ maxWidth: 768, cols: 1 }]}
        >
          {displayedWebinars.map((webinar, index) => (
            <Card 
              key={webinar.id} 
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
                  src={webinar.image}
                  alt={webinar.title}
                  sx={{ 
                    width: '100%',
                    height: 200,
                    objectFit: 'cover'
                  }}
                />
                {webinar.status === 'past' && (
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
              </Box>
              
              <Box p="lg">
                <Group position="apart" mb={10}>
                  <Group spacing={5}>
                    <IconCalendar size={16} color="gray" />
                    <Text size="sm" color="dimmed">{webinar.date}</Text>
                  </Group>
                  <Group spacing={5}>
                    <IconClock size={16} color="gray" />
                    <Text size="sm" color="dimmed">{webinar.time}</Text>
                  </Group>
                </Group>
                
                <Title order={3} mb={10} sx={{ fontSize: 20 }}>{webinar.title}</Title>
                <Text color="dimmed" size="sm" mb={15} sx={{ lineHeight: 1.6 }}>
                  {webinar.description}
                </Text>
                
                <Group mb={20}>
                  <Text weight={600} size="sm">Speaker:</Text>
                  <Text size="sm">{webinar.speaker}, {webinar.speakerTitle}</Text>
                </Group>
                
                {webinar.status === 'upcoming' ? (
                  <Button 
                    fullWidth 
                    radius="md"
                    component="a"
                    href={webinar.registrationLink}
                    sx={{ 
                      background: 'linear-gradient(135deg, #4158D0, #C850C0)'
                    }}
                  >
                    Register Now
                  </Button>
                ) : (
                  <Group grow>
                    <Button 
                      component="a"
                      href={webinar.recordingLink}
                      variant="light"
                      color="blue"
                      radius="md"
                      leftIcon={<IconBrandYoutube size={16} />}
                    >
                      Watch
                    </Button>
                    <Button 
                      component="a"
                      href={webinar.slidesLink}
                      variant="outline"
                      color="blue"
                      radius="md"
                      leftIcon={<IconDownload size={16} />}
                    >
                      Slides
                    </Button>
                  </Group>
                )}
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
      
      {/* Subscribe Section */}
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
            <Title order={2} mb={15}>Never miss a webinar</Title>
            <Text size="lg" color="dimmed" mb={30} sx={{ maxWidth: 600, margin: '0 auto' }}>
              Subscribe to our newsletter to receive webinar invitations and updates directly in your inbox.
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
