import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductComparison from '../components/ProductComparison';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';
import FeatureCarousel from '../components/FeatureCarousel';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, Center, 
  Stack as MantineStack, Transition, Image, Box, Divider, List, ThemeIcon
} from '@mantine/core';
import { 
  IconFileText, IconVideo, IconUsers, IconChecklist, IconRocket, 
  IconBrandGithub, IconCheck, IconArrowRight, IconBolt, IconLock, 
  IconCloudComputing, IconDeviceAnalytics
} from '@tabler/icons-react';

const featureGroups = [
  {
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time, no matter where they are located.",
    features: [
      {
        title: 'Real-time Documents',
        description: 'Edit documents together with multiple cursors, instant updates, and zero lag.',
        icon: <IconFileText size={40} stroke={1.5} />,
        color: 'blue',
        details: [
          'Collaborative editing with multiple cursors',
          'Automatic version history and backups',
          'Rich text formatting and media embedding',
          'Comment threads and @mentions',
          'Document templates and organization'
        ]
      },
      {
        title: 'Meetings',
        description: 'Crystal-clear video meetings with screen sharing, recording, and transcription.',
        icon: <IconVideo size={40} stroke={1.5} />,
        color: 'green',
        details: [
          'HD video and audio quality',
          'Screen sharing and remote control',
          'Meeting recording and transcription',
          'Calendar integration',
          'Virtual backgrounds and noise cancellation'
        ]
      },
    ]
  },
  {
    title: "Team Productivity",
    description: "Streamline your workflow and keep everyone on the same page.",
    features: [
      {
        title: 'Team Chat',
        description: 'Organized conversations with channels, threads, and direct messages.',
        icon: <IconUsers size={40} stroke={1.5} />,
        color: 'violet',
        details: [
          'Channels for team communication',
          'Thread replies for organized discussions',
          'Direct messages and group chats',
          'File sharing and previews',
          'Emoji reactions and GIF support'
        ]
      },
      {
        title: 'Task Management',
        description: 'Track projects with customizable boards, lists, and automated workflows.',
        icon: <IconChecklist size={40} stroke={1.5} />,
        color: 'teal',
        details: [
          'Kanban boards and list views',
          'Task assignment and due dates',
          'Progress tracking and reporting',
          'Custom fields and labels',
          'Automated workflows and reminders'
        ]
      },
    ]
  },
  {
    title: "Enterprise-Grade Security",
    description: "Keep your data safe with industry-leading security features.",
    features: [
      {
        title: 'Advanced Security',
        description: 'Enterprise-grade encryption, compliance, and access controls.',
        icon: <IconLock size={40} stroke={1.5} />,
        color: 'red',
        details: [
          'End-to-end encryption',
          'SOC 2, GDPR, and HIPAA compliance',
          'Single sign-on (SSO) integration',
          'Role-based access controls',
          'Audit logs and security reporting'
        ]
      },
      {
        title: 'Cloud Infrastructure',
        description: 'Reliable, scalable, and high-performance cloud infrastructure.',
        icon: <IconCloudComputing size={40} stroke={1.5} />,
        color: 'indigo',
        details: [
          '99.9% uptime guarantee',
          'Global data centers for low latency',
          'Automatic backups and disaster recovery',
          'Horizontal scaling for enterprise workloads',
          'Regular security updates and patches'
        ]
      },
    ]
  }
];

export default function Features() {
  return (
    <div>
      <Head>
        <title>Features | Stack - Real-Time Collaboration Platform</title>
        <meta name="description" content="Discover all the powerful features that make Stack the ultimate platform for team collaboration and productivity." />
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
              Powerful Features
            </Badge>
            <Title order={1} align="center" mb={20} sx={{ 
              fontSize: '36px',
              '@media (min-width: 576px)': { fontSize: '48px' },
              '@media (min-width: 768px)': { fontSize: '56px' },
              fontWeight: 900,
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              Everything you need for seamless collaboration
            </Title>
            <Text align="center" mb={40} sx={{ 
              fontSize: '18px',
              '@media (min-width: 768px)': { fontSize: '22px' },
              maxWidth: 700,
              lineHeight: 1.6,
              opacity: 0.9
            }}>
              Stack brings together documents, meetings, chat, and tasks in one unified platform, 
              designed to make your team more productive than ever before.
            </Text>
            <Group spacing={20}>
              <Button 
                component="a" 
                href="/pricing" 
                size="lg" 
                radius="xl" 
                variant="white" 
                color="dark"
                rightIcon={<IconArrowRight size={18} />}
                sx={{
                  height: 54,
                  padding: '0 32px',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                See Pricing
              </Button>
              <Button 
                component="a" 
                href="/" 
                size="lg" 
                radius="xl" 
                variant="outline" 
                color="white"
                sx={{
                  height: 54,
                  padding: '0 32px',
                  fontWeight: 600,
                  fontSize: 16,
                  borderWidth: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                Back to Home
              </Button>
            </Group>
          </MantineStack>
        </Container>
      </Box>

      {/* Feature Groups */}
      <Container size="lg" py={80}>
        {featureGroups.map((group, groupIndex) => (
          <Box key={group.title} mb={groupIndex < featureGroups.length - 1 ? 80 : 0}>
            <MantineStack align="center" mb={50}>
              <Title order={2} align="center" mb={10}>
                {group.title}
              </Title>
              <Text size="lg" color="dimmed" align="center" style={{ maxWidth: 700 }}>
                {group.description}
              </Text>
            </MantineStack>

            <SimpleGrid cols={2} spacing={40} breakpoints={[
              { maxWidth: 980, cols: 1, spacing: 'md' },
            ]}>
              {group.features.map((feature) => (
                <Card 
                  key={feature.title} 
                  shadow="md" 
                  p={0} 
                  radius="lg" 
                  withBorder
                  sx={{
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 30px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Box p="xl" sx={(theme) => ({
                    borderBottom: `1px solid ${theme.colors.gray[2]}`
                  })}>
                    <Group spacing={20} mb={20}>
                      <ThemeIcon 
                        size={60} 
                        radius="md" 
                        color={feature.color} 
                        variant="light"
                        sx={{
                          boxShadow: `0 8px 16px ${feature.color === 'blue' ? 'rgba(34, 139, 230, 0.2)' : 
                                     feature.color === 'green' ? 'rgba(38, 192, 160, 0.2)' : 
                                     feature.color === 'violet' ? 'rgba(112, 72, 232, 0.2)' : 
                                     feature.color === 'teal' ? 'rgba(23, 162, 184, 0.2)' : 
                                     feature.color === 'red' ? 'rgba(255, 107, 107, 0.2)' : 
                                     feature.color === 'indigo' ? 'rgba(92, 107, 192, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)'
                          }
                        }}
                      >
                        {feature.icon}
                      </ThemeIcon>
                      <Box>
                        <Title order={3}>{feature.title}</Title>
                        <Text color="dimmed">{feature.description}</Text>
                      </Box>
                    </Group>
                  </Box>
                  
                  <Box p="xl">
                    <List
                      spacing="sm"
                      icon={
                        <ThemeIcon color={feature.color} size={24} radius="xl">
                          <IconCheck size={16} />
                        </ThemeIcon>
                      }
                    >
                      {feature.details.map((detail, i) => (
                        <List.Item key={i}>{detail}</List.Item>
                      ))}
                    </List>
                  </Box>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </Container>

      {/* CTA Section */}
      <Box sx={(theme) => ({
        background: theme.colors.gray[0],
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden'
      })}>
        <Box sx={{ 
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(65, 88, 208, 0.05) 0%, rgba(65, 88, 208, 0) 70%)',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: '5%',
          left: '10%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200, 80, 192, 0.05) 0%, rgba(200, 80, 192, 0) 70%)',
          zIndex: 0
        }} />
        <Container size="md">
          <Card 
            shadow="xl" 
            p={50} 
            radius="lg" 
            withBorder
            sx={{
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: 'white'
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
            <MantineStack align="center">
              <ThemeIcon 
                size={90} 
                radius="xl" 
                sx={{
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                <IconBolt size={45} stroke={1.2} color="white" />
              </ThemeIcon>
              <Title order={2} align="center" mb={10} sx={{ fontSize: 36, fontWeight: 800 }}>
                Ready to supercharge your team?
              </Title>
              <Text size="lg" color="dimmed" align="center" mb={30}>
                Join thousands of teams that use Stack to collaborate more effectively and get more done.
              </Text>
              <Group spacing={20}>
                <Button 
                  component="a" 
                  href="/signup" 
                  size="lg" 
                  radius="xl" 
                  color="indigo"
                  leftIcon={<IconRocket size={20} />}
                  sx={{
                    height: 56,
                    padding: '0 32px',
                    fontWeight: 600,
                    fontSize: 16,
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    boxShadow: '0 8px 16px rgba(65, 88, 208, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 20px rgba(65, 88, 208, 0.4)'
                    }
                  }}
                >
                  Get Started Free
                </Button>
                <Button 
                  component="a" 
                  href="/pricing" 
                  size="lg" 
                  radius="xl" 
                  variant="outline"
                  sx={{
                    height: 56,
                    padding: '0 32px',
                    fontWeight: 600,
                    fontSize: 16,
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.03)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  View Pricing
                </Button>
              </Group>
              
              <Text size="sm" mt={30} color="dimmed">
                No credit card required • Free 14-day trial • Cancel anytime
              </Text>
            </MantineStack>
          </Card>
        </Container>
      </Box>
      
      {/* Feature Carousel */}
      <FeatureCarousel />
      
      {/* Product Comparison */}
      <ProductComparison />
      
      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
    </div>
  );
}
