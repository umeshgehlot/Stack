import React, { useState } from 'react';
import { 
  Container, Title, Text, Box, Group, 
  Card, Badge, ThemeIcon, Button, Tabs,
  Image, Grid, Overlay
} from '@mantine/core';
import { 
  IconDeviceDesktop, IconUsers, IconLock, 
  IconDeviceAnalytics, IconArrowRight
} from '@tabler/icons-react';

const features = [
  {
    id: 'collaboration',
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time. See changes as they happen and never worry about version conflicts again.',
    icon: <IconUsers size={24} />,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#4158D0',
    highlights: [
      'Multiple editors at once',
      'Live cursors and selections',
      'Comment threads',
      'Instant sync across devices'
    ]
  },
  {
    id: 'integrations',
    title: 'Seamless Integrations',
    description: 'Connect with all your favorite tools and services. Our platform integrates with over 100+ popular applications.',
    icon: <IconDeviceDesktop size={24} />,
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#38BDF8',
    highlights: [
      'Google Workspace',
      'Microsoft 365',
      'Slack & Teams',
      'Zapier workflows'
    ]
  },
  {
    id: 'security',
    title: 'Enterprise-grade Security',
    description: 'Your data is protected with industry-leading security measures. Control access with granular permissions.',
    icon: <IconLock size={24} />,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#C850C0',
    highlights: [
      'End-to-end encryption',
      'SSO integration',
      'Audit logs',
      'Compliance certifications'
    ]
  },
  {
    id: 'analytics',
    title: 'Powerful Analytics',
    description: "Gain insights into your team's productivity and document usage with detailed analytics.",
    icon: <IconDeviceAnalytics size={24} />,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#6C63FF',
    highlights: [
      'Team activity dashboard',
      'Document engagement metrics',
      'Custom reports',
      'Data export options'
    ]
  }
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState<string | null>(features[0].id);
  const [hovered, setHovered] = useState(false);
  
  const activeFeature = features.find(feature => feature.id === activeTab) || features[0];
  
  return (
    <Box py={40} sx={{ background: '#f8f9fa' }}>
      <Container size="lg">
        <Box mb={50} sx={{ textAlign: 'center' }}>
          <Badge 
            size="xl" 
            radius="xl" 
            color="blue" 
            variant="filled" 
            mb={20}
            sx={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(65, 88, 208, 0.3)'
            }}
          >
            Powerful Features
          </Badge>
          
          <Title 
            order={2} 
            mb={15}
            sx={{ 
              fontWeight: 800,
              fontSize: 36
            }}
          >
            Everything You Need in One Platform
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
            Discover how Stack helps teams collaborate more efficiently with real-time document editing, meetings, and task management.
          </Text>
        </Box>
        
        <Group position="center" mb={40} spacing="md">
          <Button
            key="collaboration"
            variant={activeTab === 'collaboration' ? "filled" : "light"}
            color="blue"
            radius="xl"
            size="md"
            leftIcon={<IconUsers size={20} />}
            onClick={() => setActiveTab('collaboration')}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              padding: '10px 20px',
              backgroundColor: activeTab === 'collaboration' ? '#6470f3' : undefined,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            Real-time Collaboration
          </Button>

          <Button
            key="integrations"
            variant={activeTab === 'integrations' ? "filled" : "light"}
            color="cyan"
            radius="xl"
            size="md"
            leftIcon={<IconDeviceDesktop size={20} />}
            onClick={() => setActiveTab('integrations')}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              padding: '10px 20px',
              backgroundColor: activeTab === 'integrations' ? '#38BDF8' : undefined,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            Seamless Integrations
          </Button>

          <Button
            key="security"
            variant={activeTab === 'security' ? "filled" : "light"}
            color="violet"
            radius="xl"
            size="md"
            leftIcon={<IconLock size={20} />}
            onClick={() => setActiveTab('security')}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              padding: '10px 20px',
              backgroundColor: activeTab === 'security' ? '#C850C0' : undefined,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            Enterprise-grade Security
          </Button>

          <Button
            key="analytics"
            variant={activeTab === 'analytics' ? "filled" : "light"}
            color="indigo"
            radius="xl"
            size="md"
            leftIcon={<IconDeviceAnalytics size={20} />}
            onClick={() => setActiveTab('analytics')}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              padding: '10px 20px',
              backgroundColor: activeTab === 'analytics' ? '#6C63FF' : undefined,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            Powerful Analytics
          </Button>
        </Group>
        
        <Grid gutter={40}>
          <Grid.Col md={6}>
            <Box 
              sx={{ 
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Title 
                order={3} 
                mb={15}
                sx={{ 
                  fontWeight: 700,
                  fontSize: 28,
                  background: `linear-gradient(135deg, ${activeFeature.color}, #C850C0)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {activeFeature.title}
              </Title>
              
              <Text size="lg" mb={30} sx={{ lineHeight: 1.6 }}>
                {activeFeature.description}
              </Text>
              
              <Group spacing={15} mb={30} sx={{ flexWrap: 'wrap' }}>
                {activeFeature.highlights.map((highlight, index) => (
                  <Button
                    key={index}
                    variant="light"
                    radius="xl"
                    leftIcon={
                      <ThemeIcon 
                        size={24} 
                        radius="xl" 
                        sx={{ background: `linear-gradient(135deg, ${activeFeature.color}, #C850C0)` }}
                      >
                        <IconArrowRight size={14} />
                      </ThemeIcon>
                    }
                    sx={{
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    {highlight}
                  </Button>
                ))}
              </Group>
              
              <Button 
                component="a" 
                href="/features" 
                variant="gradient" 
                gradient={{ from: activeFeature.color, to: '#C850C0' }}
                radius="xl"
                size="lg"
                sx={{
                  alignSelf: 'flex-start',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 16px rgba(65, 88, 208, 0.3)'
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
          </Grid.Col>
          
          <Grid.Col md={6}>
            <Box 
              sx={{ 
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.5s ease',
                transform: hovered ? 'perspective(1000px) rotateY(-5deg) rotateX(5deg)' : 'perspective(1000px) rotateY(0) rotateX(0)',
                '&:hover': {
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                },
                height: '400px'
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Image 
                src={activeFeature.image} 
                alt={activeFeature.title}
                height={400}
                sx={{ 
                  objectFit: 'cover',
                  width: '100%',
                  transition: 'all 0.5s ease',
                  transform: hovered ? 'scale(1.05)' : 'scale(1)'
                }}
              />
              <Overlay 
                gradient={`linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 50%)`}
                opacity={0.3}
              />
              
              {/* Add decorative elements to make the image more interesting */}
              <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '80%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                zIndex: 2
              }} />
              
              <Box sx={{ 
                position: 'absolute', 
                bottom: '10%', 
                right: '10%',
                padding: '15px 25px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                zIndex: 3
              }}>
                {activeFeature.title}
              </Box>
              
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${activeFeature.color}, #C850C0)`,
                  opacity: 0.2,
                  transition: 'all 0.5s ease',
                  transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
                }}
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: '15%',
                  right: '10%',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, #C850C0, ${activeFeature.color})`,
                  opacity: 0.2,
                  transition: 'all 0.5s ease',
                  transform: hovered ? 'translateY(10px)' : 'translateY(0)',
                }}
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: '40%',
                  right: '5%',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${activeFeature.color}, #4158D0)`,
                  opacity: 0.2,
                  transition: 'all 0.5s ease',
                  transform: hovered ? 'translateX(10px)' : 'translateX(0)',
                }}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
