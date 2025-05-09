import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, Center, 
  Stack as MantineStack, Transition, Image, Box, Divider, List, ThemeIcon
} from '@mantine/core';
import { 
  IconFileText, IconVideo, IconUsers, IconChecklist, IconRocket, 
  IconBrandGithub, IconBrandGoogle, IconBrandSlack, IconBrandZoom,
  IconArrowRight, IconBolt, IconDeviceAnalytics, IconLock, IconBrandTwitter,
  IconStar, IconArrowUpRight, IconBrandLinkedin, IconBrandApple,
  IconEye, IconDeviceDesktop
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import AnnouncementBanner from '../components/AnnouncementBanner';
import TestimonialSlider from '../components/TestimonialSlider';
import BackToTopButton from '../components/BackToTopButton';
// Product tour removed
import StatsCounter from '../components/StatsCounter';
import SimpleFaqAccordion from '../components/SimpleFaqAccordion';
import FeatureShowcase from '../components/FeatureShowcase';
import ParallaxImageSlider from '../components/ParallaxImageSlider';

const features = [
  {
    title: 'Real-time Documents',
    description: 'Edit documents together with multiple cursors, instant updates, and zero lag.',
    icon: <IconFileText size={40} stroke={1.2} />,
    color: 'blue',
    gradient: 'linear-gradient(135deg, #4158D0, #2b8af9)',
  },
  {
    title: 'Video Meetings',
    description: 'Crystal-clear video meetings with screen sharing, recording, and transcription.',
    icon: <IconVideo size={40} stroke={1.2} />,
    color: 'green',
    gradient: 'linear-gradient(135deg, #0ba360, #3cba92)',
  },
  {
    title: 'Team Chat',
    description: 'Organized conversations with channels, threads, and direct messages.',
    icon: <IconUsers size={40} stroke={1.2} />,
    color: 'violet',
    gradient: 'linear-gradient(135deg, #8e2de2, #ae3ec9)',
  },
  {
    title: 'Task Management',
    description: 'Track projects with customizable boards, lists, and automated workflows.',
    icon: <IconChecklist size={40} stroke={1.2} />,
    color: 'teal',
    gradient: 'linear-gradient(135deg, #12b886, #20c997)',
  },
];

const testimonials = [
  {
    quote: "Stack has transformed how our team collaborates. The seamless integration between documents, meetings, and tasks has boosted our productivity by 35%.",
    author: "Sarah Johnson",
    position: "CTO at TechFlow",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
  },
  {
    quote: "We've tried many collaboration tools, but Stack is the first one that truly delivers on the promise of an all-in-one solution.",
    author: "Michael Chen",
    position: "Product Manager at InnovateCorp",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
  },
  {
    quote: "The real-time collaboration in Stack is unmatched. It's like having your team in the same room, even when working remotely.",
    author: "Emily Rodriguez",
    position: "Design Director at CreativeStudio",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
  }
];

const trustedBy = [
  { name: 'GitHub', icon: <IconBrandGithub size={36} stroke={1.2} color="#333" /> },
  { name: 'Google', icon: <IconBrandGoogle size={36} stroke={1.2} color="#ea4335" /> },
  { name: 'Slack', icon: <IconBrandSlack size={36} stroke={1.2} color="#611f69" /> },
  { name: 'Zoom', icon: <IconBrandZoom size={36} stroke={1.2} color="#2d8cff" /> },
  { name: 'Twitter', icon: <IconBrandTwitter size={36} stroke={1.2} color="#1DA1F2" /> },
  { name: 'LinkedIn', icon: <IconBrandLinkedin size={36} stroke={1.2} color="#0077B5" /> },
  { name: 'Apple', icon: <IconBrandApple size={36} stroke={1.2} color="#555" /> },
];

export default function Home() {
  // Product tour state removed
  return (
    <div>
      <Head>
        <title>Stack | Real-Time Collaboration Platform</title>
        <meta name="description" content="Stack: The all-in-one platform for real-time document collaboration, meetings, chat, and tasks." />
      </Head>

      <AnnouncementBanner />

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        color: 'white',
        padding: '160px 0 220px',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: '180px 180px',
          opacity: 0.3,
          zIndex: 0,
          animation: 'patternMove 60s linear infinite',
          '@keyframes patternMove': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '1000px 1000px' },
          },
        }
      }}>
        {/* Interactive Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {/* Main animated gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(76, 0, 255, 0.15) 0%, rgba(76, 0, 255, 0) 50%)',
              animation: 'pulse 15s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.5, transform: 'scale(1)' },
                '50%': { opacity: 0.8, transform: 'scale(1.1)' },
                '100%': { opacity: 0.5, transform: 'scale(1)' },
              },
            }}
          />
          
          {/* Secondary gradient for depth */}
          <Box
            sx={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '70%',
              height: '70%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0) 70%)',
              animation: 'floatSlow 20s ease-in-out infinite',
              '@keyframes floatSlow': {
                '0%': { transform: 'translate(0, 0) scale(1)' },
                '33%': { transform: 'translate(-5%, 5%) scale(1.1)' },
                '66%': { transform: 'translate(5%, -5%) scale(0.9)' },
                '100%': { transform: 'translate(0, 0) scale(1)' },
              },
            }}
          />
          
          {/* Interactive particle system */}
          {Array.from({ length: 20 }).map((_, i) => {
            const size = Math.random() * 8 + 2;
            const initialX = Math.random() * 100;
            const initialY = Math.random() * 100;
            const speed = Math.random() * 15 + 10;
            const delay = Math.random() * 5;
            
            return (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                  top: `${initialY}%`,
                  left: `${initialX}%`,
                  animation: `particle ${speed}s linear infinite`,
                  animationDelay: `${delay}s`,
                  opacity: Math.random() * 0.5 + 0.3,
                  '@keyframes particle': {
                    '0%': { transform: 'translate(0, 0)' },
                    '25%': { transform: 'translate(30px, 30px)' },
                    '50%': { transform: 'translate(-30px, 50px)' },
                    '75%': { transform: 'translate(30px, -50px)' },
                    '100%': { transform: 'translate(0, 0)' },
                  },
                }}
              />
            );
          })}
          
          {/* Floating geometric shapes with 3D effect */}
          {Array.from({ length: 6 }).map((_, i) => {
            const isCircle = Math.random() > 0.5;
            const size = Math.random() * 120 + 60;
            const xPos = Math.random() * 100;
            const yPos = Math.random() * 100;
            const duration = Math.random() * 20 + 15;
            const delay = Math.random() * 5;
            const rotationSpeed = Math.random() * 20 + 10;
            
            return (
              <Box
                key={`shape-${i}`}
                sx={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  borderRadius: isCircle ? '50%' : '30%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)',
                  top: `${yPos}%`,
                  left: `${xPos}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: 'float 20s ease-in-out infinite, rotate 30s linear infinite',
                  animationDelay: `${delay}s`,
                  '@keyframes float': {
                    '0%': { transform: 'translate(-50%, -50%) translateY(0)' },
                    '50%': { transform: 'translate(-50%, -50%) translateY(20px)' },
                    '100%': { transform: 'translate(-50%, -50%) translateY(0)' },
                  },
                  '@keyframes rotate': {
                    '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                    '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
                  },
                }}
              />
            );
          })}
        </Box>

        <Container size="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            maxWidth: 850, 
            margin: '0 auto', 
            textAlign: 'center',
            position: 'relative',
            '@keyframes fadeUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}>
            <Badge 
              size="xl" 
              radius="xl" 
              color="pink" 
              variant="filled" 
              mb={25}
              sx={{
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: '0 8px 16px rgba(200, 80, 192, 0.25)',
                animation: 'fadeUp 0.6s ease-out forwards, shimmer 3s ease-in-out infinite',
                background: 'linear-gradient(90deg, #FF6B6B, #FF8E8E, #FF6B6B)',
                backgroundSize: '200% 100%',
                border: 'none',
                '@keyframes fadeUp': {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                '@keyframes shimmer': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
              }}
            >
              All-in-One Collaboration
            </Badge>
            
            <Title 
              order={1} 
              mb={35} 
              sx={{ 
                fontWeight: 900, 
                fontSize: 68,
                lineHeight: 1.1,
                letterSpacing: '-1px',
                animation: 'fadeUp 0.8s ease-out forwards',
                animationDelay: '0.2s',
                opacity: 0,
                '@media (max-width: 768px)': {
                  fontSize: 42,
                },
              }}
            >
              Work Together,{' '}
              <Text 
                component="span" 
                inherit 
                variant="gradient" 
                gradient={{ from: '#FF9A8B', to: '#FF6A88', deg: 35 }}
              >
                Better Than Ever
              </Text>
            </Title>
            
            <Text 
              size="xl" 
              mb={45} 
              sx={{ 
                lineHeight: 1.6,
                maxWidth: 700,
                margin: '0 auto',
                fontSize: 22,
                color: 'rgba(255, 255, 255, 0.9)',
                animation: 'fadeUp 1s ease-out forwards',
                animationDelay: '0.4s',
                opacity: 0,
                '@media (max-width: 768px)': {
                  fontSize: 18,
                },
              }}
            >
              Stack brings together documents, meetings, chat, and tasks in one unified platform, 
              designed to make your team more productive than ever before.
            </Text>
            
            <Group 
              position="center" 
              spacing="md"
              sx={{
                animation: 'fadeUp 1.2s ease-out forwards',
                animationDelay: '0.6s',
                opacity: 0,
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Interactive glow effect behind buttons */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  background: 'radial-gradient(circle at center, rgba(255, 107, 107, 0.3) 0%, rgba(255, 107, 107, 0) 70%)',
                  filter: 'blur(40px)',
                  opacity: 0.6,
                  zIndex: -1,
                  transform: 'translateY(20px)',
                  animation: 'glowPulse 4s ease-in-out infinite',
                  '@keyframes glowPulse': {
                    '0%': { opacity: 0.4, transform: 'translateY(20px) scale(0.8)' },
                    '50%': { opacity: 0.8, transform: 'translateY(20px) scale(1.2)' },
                    '100%': { opacity: 0.4, transform: 'translateY(20px) scale(0.8)' },
                  },
                }}
              />
              <Button 
                component={Link} 
                href="/signup" 
                size="xl" 
                radius="xl" 
                color="pink"
                rightIcon={<IconArrowRight size={20} />}
                sx={{ 
                  boxShadow: '0 8px 20px rgba(200, 80, 192, 0.4)',
                  padding: '0 36px',
                  height: 58,
                  fontSize: 18,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    animation: 'shine 3s infinite',
                    '@keyframes shine': {
                      '0%': { left: '-100%' },
                      '20%': { left: '100%' },
                      '100%': { left: '100%' },
                    },
                  },
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 24px rgba(200, 80, 192, 0.5)',
                  }
                }}
              >
                Get Started Free
              </Button>
              <Button 
                component={Link} 
                href="/features" 
                size="xl" 
                radius="xl" 
                variant="outline"
                color="white"
                leftIcon={<IconEye size={20} />}
                sx={{ 
                  padding: '0 36px',
                  height: 58,
                  fontSize: 18,
                  fontWeight: 600,
                  borderWidth: 2,
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-5px)',
                    '&::after': {
                      opacity: 1,
                    }
                  }
                }}
              >
                See Features
              </Button>
            </Group>
            
            {/* Animated feature icons */}
            <Box 
              sx={{ 
                position: 'relative',
                height: 120,
                width: '100%',
                marginTop: 60,
                animation: 'fadeUp 1.4s ease-out forwards',
                animationDelay: '0.8s',
                opacity: 0,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '80%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0,
                }
              }}
            >
              <Group position="center" spacing={50}>
                {[
                  { icon: <IconUsers size={28} />, label: 'Team Collaboration' },
                  { icon: <IconLock size={28} />, label: 'Enterprise Security' },
                  { icon: <IconDeviceDesktop size={28} />, label: 'Seamless Integration' },
                  { icon: <IconDeviceAnalytics size={28} />, label: 'Advanced Analytics' }
                ].map((item, i) => (
                  <Box 
                    key={i} 
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 10,
                      animation: `pulse 3s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' },
                        '100%': { transform: 'scale(1)' },
                      },
                    }}
                  >
                    <ThemeIcon 
                      size={56} 
                      radius="xl" 
                      variant="light" 
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {item.icon}
                    </ThemeIcon>
                    <Text size="sm" weight={500}>{item.label}</Text>
                  </Box>
                ))}
              </Group>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Trusted By Section */}
      <Container size="lg" mt={-50} mb={80}>
        <Card 
          shadow="xl" 
          radius="lg" 
          p="xl" 
          withBorder
          sx={{ 
            background: 'white',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(65, 88, 208, 0.05) 0%, rgba(65, 88, 208, 0) 70%)',
            zIndex: 0
          }} />
          <Group position="apart" align="center" spacing={20}>
            <Box>
              <Text size="lg" weight={600} color="dimmed" mb={5}>Trusted by innovative teams</Text>
              <Text size="sm" color="dimmed" sx={{ maxWidth: 300 }}>Join thousands of companies already using Stack</Text>
            </Box>
            <Group spacing={40} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {trustedBy.map((brand) => (
                <Box 
                  key={brand.name} 
                  sx={{ 
                    filter: 'grayscale(0.3)', 
                    opacity: 0.8,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      filter: 'grayscale(0)',
                      opacity: 1,
                      transform: 'translateY(-3px)'
                    }
                  }}
                  title={brand.name}
                >
                  {brand.icon}
                </Box>
              ))}
            </Group>
          </Group>
        </Card>
      </Container>

      {/* Parallax Image Slider */}
      <ParallaxImageSlider />

      {/* Features Section */}
      <Container size="lg" py={30}>
        <MantineStack align="center" mb={60}>
          <Badge size="lg" radius="xl" color="indigo" variant="filled" mb={10}>
            Powerful Features
          </Badge>
          <Title order={2} size={36} align="center" mb={10} style={{ fontWeight: 800 }}>
            Everything you need to collaborate effectively
          </Title>
          <Text size="xl" align="center" color="dimmed" style={{ maxWidth: 700 }}>
            Stack combines the best tools for document collaboration, meetings, chat, and task management in one seamless platform.
          </Text>
        </MantineStack>

        <SimpleGrid cols={2} spacing={30} breakpoints={[
          { maxWidth: 768, cols: 1 },
        ]}>
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              shadow="md" 
              p={30} 
              radius="lg" 
              withBorder
              sx={{ 
                transition: 'all 0.3s ease',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 30px rgba(0, 0, 0, 0.1)',
                  '& .feature-icon': {
                    transform: 'scale(1.1) rotate(5deg)'
                  }
                }
              }}
            >
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 5,
                  height: '40%',
                  background: feature.gradient,
                  borderTopLeftRadius: 'lg'
                }}
              />
              <ThemeIcon 
                className="feature-icon"
                size={70} 
                radius="xl" 
                sx={{ 
                  background: feature.gradient,
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                  border: '4px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease'
                }} 
                mb={20}
              >
                {feature.icon}
              </ThemeIcon>
              <Title order={3} mb={10}>{feature.title}</Title>
              <Text color="dimmed" size="lg" mb={20}>
                {feature.description}
              </Text>
              <Button 
                variant="subtle" 
                color={feature.color} 
                rightIcon={<IconArrowUpRight size={16} />}
                component="a"
                href="/features"
                sx={{
                  fontWeight: 600,
                  padding: '8px 16px',
                  '&:hover': {
                    background: 'transparent',
                    transform: 'translateX(5px)'
                  }
                }}
              >
                Learn more
              </Button>
            </Card>
          ))}
        </SimpleGrid>

        <Group position="center" mt={60}>
          <Button 
            component="a" 
            href="/features" 
            size="lg" 
            radius="xl" 
            variant="outline"
            rightIcon={<IconArrowRight size={18} />}
            sx={{
              borderWidth: 2,
              padding: '0 30px',
              height: 52,
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            View All Features
          </Button>
        </Group>
      </Container>

      {/* Feature Showcase */}
      <FeatureShowcase />
      
      {/* Stats Counter */}
      <StatsCounter />

      {/* Testimonial Section */}
      <TestimonialSlider />

      {/* FAQ Section */}
      <SimpleFaqAccordion />

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
        color: 'white',
        padding: '80px 0',
        marginTop: 0,
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
            
            <ThemeIcon 
              size={90} 
              radius="xl" 
              color="white" 
              variant="filled" 
              mb={30} 
              mx="auto"
              sx={{
                background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              <IconRocket size={45} stroke={1.2} color="white" />
            </ThemeIcon>
            
            <Title order={2} mb={10} sx={{ fontSize: 36, fontWeight: 800 }}>Ready to transform how your team works?</Title>
            
            <Text size="xl" mb={40} mx="auto" style={{ maxWidth: 600, lineHeight: 1.6 }}>
              Join thousands of teams that use Stack to collaborate more effectively and get more done.
            </Text>
            
            <Group position="center" spacing={20}>
              <Button 
                component="a" 
                href="/signup" 
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
                Sign Up Free
              </Button>
              <Group spacing={15}>
                <Button 
                  component="a" 
                  href="/signin" 
                  size="lg" 
                  radius="xl"
                  sx={{
                    height: 56,
                    paddingLeft: 30,
                    paddingRight: 30,
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    boxShadow: '0 8px 16px rgba(65, 88, 208, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(65, 88, 208, 0.4)'
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  component="a" 
                  href="/features" 
                  size="lg" 
                  radius="xl" 
                  variant="outline"
                  color="white"
                  sx={{
                    height: 56,
                    paddingLeft: 30,
                    paddingRight: 30,
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  Learn More
                </Button>
                {/* Product tour button removed */}
              </Group>
            </Group>
            
            <Text size="sm" mt={30} color="rgba(255, 255, 255, 0.7)">
              No credit card required • Free 14-day trial • Cancel anytime
            </Text>
          </Card>
        </Container>
      </Box>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
      
      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
      {/* Product tour modal removed */}
    </div>
  );
}