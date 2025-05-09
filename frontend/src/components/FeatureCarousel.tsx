import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Title, Text, Badge, 
  Card, Group, ThemeIcon, Button,
  Transition, useMantineTheme
} from '@mantine/core';
import { 
  IconArrowRight, IconArrowLeft, IconDeviceAnalytics, 
  IconUsers, IconLock, IconDeviceDesktop, IconArrowUpRight
} from '@tabler/icons-react';

const features = [
  {
    id: 1,
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time. See changes as they happen and never worry about version conflicts again.',
    icon: <IconUsers size={24} />,
    color: '#4158D0',
    image: 'https://via.placeholder.com/600x400',
    highlights: [
      'Multiple editors at once',
      'Live cursors and selections',
      'Comment threads',
      'Instant sync across devices'
    ]
  },
  {
    id: 2,
    title: 'Enterprise-grade Security',
    description: 'Your data is protected with industry-leading security measures. Control access with granular permissions.',
    icon: <IconLock size={24} />,
    color: '#C850C0',
    image: 'https://via.placeholder.com/600x400',
    highlights: [
      'End-to-end encryption',
      'SSO integration',
      'Audit logs',
      'Compliance certifications'
    ]
  },
  {
    id: 3,
    title: 'Powerful Analytics',
    description: "Gain insights into your team's productivity and document usage with detailed analytics.",
    icon: <IconDeviceAnalytics size={24} />,
    color: '#6C63FF',
    image: 'https://via.placeholder.com/600x400',
    highlights: [
      'Team activity dashboard',
      'Document engagement metrics',
      'Custom reports',
      'Data export options'
    ]
  },
  {
    id: 4,
    title: 'Seamless Integrations',
    description: 'Connect Stack with your favorite tools and services for a streamlined workflow.',
    icon: <IconDeviceDesktop size={24} />,
    color: '#FF6B6B',
    image: 'https://via.placeholder.com/600x400',
    highlights: [
      'Google Workspace',
      'Microsoft Office',
      'Slack & Teams',
      'Jira & GitHub'
    ]
  }
];

export default function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const theme = useMantineTheme();
  
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('right');
    setActiveIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('left');
    setActiveIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [activeIndex, isAnimating]);
  
  const activeFeature = features[activeIndex];
  
  // Calculate positions for the 3D carousel
  const getCardStyles = (index: number) => {
    const diff = index - activeIndex;
    let normalizedDiff = diff;
    
    // Handle wrapping for circular carousel
    if (diff > features.length / 2) normalizedDiff = diff - features.length;
    if (diff < -features.length / 2) normalizedDiff = diff + features.length;
    
    // Calculate z-index, opacity, and transform based on position
    const zIndex = 10 - Math.abs(normalizedDiff);
    const opacity = Math.max(0.4, 1 - Math.abs(normalizedDiff) * 0.3);
    const scale = Math.max(0.8, 1 - Math.abs(normalizedDiff) * 0.1);
    
    let translateX = 0;
    if (normalizedDiff < 0) translateX = -110 * Math.abs(normalizedDiff);
    if (normalizedDiff > 0) translateX = 110 * normalizedDiff;
    
    const rotateY = normalizedDiff * 10; // Rotate cards for 3D effect
    
    return {
      zIndex,
      opacity,
      transform: `perspective(1500px) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      transition: 'all 0.5s ease',
    };
  };
  
  return (
    <Box py={40} sx={{ background: '#f8f9fa', overflow: 'hidden' }}>
      <Container size="lg">
        <Box mb={50} sx={{ textAlign: 'center' }}>
          <Badge 
            size="xl" 
            radius="xl" 
            color="indigo" 
            variant="filled" 
            mb={20}
            sx={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(92, 80, 200, 0.3)'
            }}
          >
            Key Features
          </Badge>
          
          <Title 
            order={2} 
            mb={15}
            sx={{ 
              fontWeight: 800,
              fontSize: 36
            }}
          >
            Discover What Makes Stack Different
          </Title>
          
          <Text 
            color="dimmed" 
            mb={30}
            sx={{ 
              maxWidth: 600, 
              margin: '0 auto',
              fontSize: 18
            }}
          >
            Explore our powerful features designed to help teams collaborate more efficiently
          </Text>
        </Box>
        
        <Box sx={{ position: 'relative', height: 500, marginBottom: 40 }}>
          {/* Carousel Navigation */}
          <Group position="apart" sx={{ position: 'absolute', top: '50%', left: 0, right: 0, zIndex: 20, transform: 'translateY(-50%)' }}>
            <Button 
              onClick={prevSlide}
              variant="filled"
              radius="xl"
              size="lg"
              sx={{
                width: 50,
                height: 50,
                padding: 0,
                background: 'rgba(255, 255, 255, 0.9)',
                color: theme.colors.dark[7],
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                border: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <IconArrowLeft size={20} />
            </Button>
            
            <Button 
              onClick={nextSlide}
              variant="filled"
              radius="xl"
              size="lg"
              sx={{
                width: 50,
                height: 50,
                padding: 0,
                background: 'rgba(255, 255, 255, 0.9)',
                color: theme.colors.dark[7],
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                border: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <IconArrowRight size={20} />
            </Button>
          </Group>
          
          {/* Carousel Cards */}
          <Box sx={{ 
            position: 'relative', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            perspective: '1000px'
          }}>
            {features.map((feature, index) => (
              <Card
                key={feature.id}
                radius="lg"
                shadow="md"
                p={0}
                sx={{
                  position: 'absolute',
                  width: '80%',
                  maxWidth: 800,
                  height: 400,
                  overflow: 'hidden',
                  background: 'white',
                  border: '1px solid #eee',
                  ...getCardStyles(index),
                  cursor: index === activeIndex ? 'default' : 'pointer',
                  '&:hover': {
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                  }
                }}
                onClick={() => {
                  if (index !== activeIndex) {
                    if (index > activeIndex) {
                      nextSlide();
                    } else {
                      prevSlide();
                    }
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'row',
                  height: '100%',
                  '@media (max-width: 768px)': {
                    flexDirection: 'column'
                  }
                }}>
                  <Box 
                    sx={{ 
                      width: '40%', 
                      background: `linear-gradient(135deg, ${feature.color}, #C850C0)`,
                      color: 'white',
                      padding: 30,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '@media (max-width: 768px)': {
                        width: '100%',
                        height: '40%',
                        padding: 20
                      }
                    }}
                  >
                    <ThemeIcon 
                      size={60} 
                      radius="xl" 
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        marginBottom: 20
                      }}
                    >
                      {feature.icon}
                    </ThemeIcon>
                    
                    <Title order={3} mb={10} sx={{ color: 'white' }}>
                      {feature.title}
                    </Title>
                    
                    <Text mb={20} sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                      {feature.description}
                    </Text>
                    
                    <Button 
                      variant="white" 
                      radius="xl"
                      rightIcon={<IconArrowUpRight size={16} />}
                      sx={{
                        alignSelf: 'flex-start',
                        fontWeight: 600,
                        color: feature.color,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      width: '60%', 
                      padding: 30,
                      '@media (max-width: 768px)': {
                        width: '100%',
                        height: '60%',
                        padding: 20
                      }
                    }}
                  >
                    <Title order={4} mb={20}>Key Highlights</Title>
                    
                    {feature.highlights.map((highlight, i) => (
                      <Group key={i} spacing={10} mb={15}>
                        <ThemeIcon 
                          size={28} 
                          radius="xl" 
                          sx={{ background: feature.color }}
                        >
                          <IconArrowRight size={16} />
                        </ThemeIcon>
                        <Text size="lg">{highlight}</Text>
                      </Group>
                    ))}
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
        
        {/* Carousel Indicators */}
        <Group position="center" spacing={10}>
          {features.map((_, index) => (
            <Box
              key={index}
              onClick={() => {
                if (index > activeIndex) {
                  setDirection('right');
                } else if (index < activeIndex) {
                  setDirection('left');
                }
                setActiveIndex(index);
              }}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: index === activeIndex ? 
                  `linear-gradient(135deg, ${features[activeIndex].color}, #C850C0)` : 
                  '#e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: index === activeIndex ? 'scale(1.2)' : 'scale(1)',
                boxShadow: index === activeIndex ? 
                  '0 2px 8px rgba(0, 0, 0, 0.2)' : 
                  'none',
              }}
            />
          ))}
        </Group>
      </Container>
    </Box>
  );
}
