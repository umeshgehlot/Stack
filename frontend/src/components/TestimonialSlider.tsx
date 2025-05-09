import React, { useState, useEffect } from 'react';
import { 
  Box, Text, Container, Paper, Avatar, Group, 
  Title, Divider, Rating, useMantineTheme
} from '@mantine/core';
import { IconQuote, IconBuildingSkyscraper, IconCode, IconBuildingBank } from '@tabler/icons-react';

const testimonials = [
  {
    id: 1,
    content: "Stack has transformed how our team collaborates. The real-time editing features and intuitive interface have increased our productivity by 35%.",
    author: "Sarah Johnson",
    position: "CTO at TechGlobe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    company: "TechGlobe",
    icon: IconBuildingSkyscraper
  },
  {
    id: 2,
    content: "We've tried numerous collaboration tools, but Stack stands out with its seamless integration capabilities and robust security features. It's now an essential part of our workflow.",
    author: "Michael Chen",
    position: "Director of Engineering at InnovateCorp",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    company: "InnovateCorp",
    icon: IconCode
  },
  {
    id: 3,
    content: "The customer support team at Stack is exceptional. They've been responsive and helpful throughout our onboarding process, making the transition smooth for our entire organization.",
    author: "Emily Rodriguez",
    position: "Operations Manager at GlobalFirm",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    rating: 4,
    company: "GlobalFirm",
    icon: IconBuildingBank
  }
];

export default function TestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = useMantineTheme();
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Box 
      py={40}
      sx={{
        background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.05) 0%, rgba(200, 80, 192, 0.05) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Elements */}
      <Box sx={{ 
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(65, 88, 208, 0.05) 0%, rgba(65, 88, 208, 0) 70%)',
        zIndex: 0
      }} />
      <Box sx={{ 
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200, 80, 192, 0.05) 0%, rgba(200, 80, 192, 0) 70%)',
        zIndex: 0
      }} />
      
      <Container size="lg">
        <Title 
          order={2} 
          align="center" 
          mb={50}
          sx={{ 
            fontWeight: 800,
            position: 'relative',
            zIndex: 1
          }}
        >
          Trusted by industry leaders
        </Title>
        
        <Box 
          sx={{ 
            position: 'relative',
            height: 320,
            '@media (max-width: 768px)': {
              height: 400
            }
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Paper
              key={testimonial.id}
              shadow="md"
              radius="lg"
              p={40}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                opacity: index === activeIndex ? 1 : 0,
                transform: `translateY(${index === activeIndex ? 0 : 20}px)`,
                transition: 'all 0.5s ease',
                pointerEvents: index === activeIndex ? 'auto' : 'none',
                maxWidth: 800,
                margin: '0 auto',
                background: 'white',
                zIndex: index === activeIndex ? 2 : 1,
                '@media (max-width: 768px)': {
                  padding: 20
                }
              }}
            >
              <Box mb={20}>
                <IconQuote 
                  size={40} 
                  color={theme.colors.gray[3]} 
                  style={{ opacity: 0.5 }}
                />
              </Box>
              
              <Text 
                size="lg" 
                mb={30}
                sx={{ 
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  color: theme.colors.gray[7],
                  '@media (max-width: 768px)': {
                    fontSize: theme.fontSizes.md
                  }
                }}
              >
                "{testimonial.content}"
              </Text>
              
              <Divider mb={20} />
              
              <Group position="apart" align="center">
                <Group>
                  <Avatar 
                    src={testimonial.avatar} 
                    size={50} 
                    radius="xl"
                  />
                  <Box>
                    <Text weight={700}>{testimonial.author}</Text>
                    <Text size="sm" color="dimmed">{testimonial.position}</Text>
                    <Rating value={testimonial.rating} readOnly size="sm" mt={5} />
                  </Box>
                </Group>
                <Group spacing={8} align="center">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.colors.blue[6],
                    }}
                  >
                    {React.createElement(testimonial.icon, { size: 24, stroke: 1.5 })}
                  </Box>
                  <Text weight={600} size="sm" color={theme.colors.gray[7]}>
                    {testimonial.company}
                  </Text>
                </Group>
              </Group>
            </Paper>
          ))}
        </Box>
        
        <Group position="center" mt={30}>
          {testimonials.map((_, index) => (
            <Box
              key={index}
              onClick={() => setActiveIndex(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: index === activeIndex 
                  ? 'linear-gradient(135deg, #4158D0, #C850C0)' 
                  : theme.colors.gray[3],
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)'
                }
              }}
            />
          ))}
        </Group>
      </Container>
    </Box>
  );
}
