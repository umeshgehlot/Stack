import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Grid, Text, Title, 
  ThemeIcon, Group, Paper, Transition
} from '@mantine/core';
import { 
  IconUsers, IconBuilding, IconDeviceDesktop, 
  IconFileText, IconWorld, IconStar
} from '@tabler/icons-react';
import { useIntersection } from '@mantine/hooks';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
  duration?: number;
}

function StatItem({ icon, value, label, suffix = '', delay = 0, duration = 2000 }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { ref, entry } = useIntersection({
    threshold: 0.5,
    rootMargin: '0px',
  });
  
  useEffect(() => {
    if (entry?.isIntersecting && !hasAnimated) {
      // Start animation after delay
      const delayTimeout = setTimeout(() => {
        const start = 0;
        const end = value;
        const increment = Math.ceil(end / 50); // Divide animation into 50 steps
        let current = start;
        
        // Clear any existing interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        // Set up new interval
        const stepDuration = duration / 50;
        intervalRef.current = setInterval(() => {
          current += increment;
          if (current >= end) {
            current = end;
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
          setCount(current);
        }, stepDuration);
        
        setHasAnimated(true);
      }, delay);
      
      return () => clearTimeout(delayTimeout);
    }
    
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [entry, value, delay, duration, hasAnimated]);
  
  return (
    <Paper 
      ref={ref}
      p={30} 
      radius="lg" 
      shadow="md"
      withBorder
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <ThemeIcon 
        size={60} 
        radius="xl" 
        mb={20}
        sx={{ 
          background: 'linear-gradient(135deg, #4158D0, #C850C0)',
        }}
      >
        {icon}
      </ThemeIcon>
      
      <Group spacing={5} position="center">
        <Title 
          order={2} 
          sx={{ 
            fontSize: 42, 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #4158D0, #C850C0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {count.toLocaleString()}
        </Title>
        {suffix && (
          <Text 
            size="xl" 
            weight={700}
            sx={{ 
              fontSize: 24,
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {suffix}
          </Text>
        )}
      </Group>
      
      <Text size="lg" color="dimmed" mt={5}>
        {label}
      </Text>
    </Paper>
  );
}

export default function StatsCounter() {
  const [visible, setVisible] = useState(false);
  const { ref, entry } = useIntersection({
    threshold: 0.1,
    rootMargin: '0px',
  });
  
  useEffect(() => {
    if (entry?.isIntersecting) {
      setVisible(true);
    }
  }, [entry]);
  
  const stats = [
    { 
      icon: <IconUsers size={30} />, 
      value: 100000, 
      label: 'Active Users',
      suffix: '+',
      delay: 0,
      duration: 2000
    },
    { 
      icon: <IconBuilding size={30} />, 
      value: 5000, 
      label: 'Enterprise Customers',
      suffix: '+',
      delay: 200,
      duration: 2000
    },
    { 
      icon: <IconDeviceDesktop size={30} />, 
      value: 99, 
      label: 'Uptime',
      suffix: '%',
      delay: 400,
      duration: 1500
    },
    { 
      icon: <IconFileText size={30} />, 
      value: 10, 
      label: 'Million Documents',
      suffix: 'M+',
      delay: 600,
      duration: 2000
    },
    { 
      icon: <IconWorld size={30} />, 
      value: 150, 
      label: 'Countries',
      suffix: '+',
      delay: 800,
      duration: 1500
    },
    { 
      icon: <IconStar size={30} />, 
      value: 4.9, 
      label: 'Customer Rating',
      suffix: '/5',
      delay: 1000,
      duration: 1500
    },
  ];
  
  return (
    <Box 
      ref={ref}
      py={40} 
      sx={{ 
        background: '#f8f9fa',
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee'
      }}
    >
      <Container size="lg">
        <Transition
          mounted={visible}
          transition="fade"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Box style={styles}>
              <Title 
                order={2} 
                align="center" 
                mb={10}
                sx={{ fontWeight: 800 }}
              >
                Trusted by Industry Leaders
              </Title>
              <Text 
                align="center" 
                color="dimmed" 
                mb={50}
                sx={{ maxWidth: 600, margin: '0 auto' }}
              >
                Join thousands of companies that rely on Stack for their business needs
              </Text>
              
              <Grid gutter={30}>
                {stats.map((stat, index) => (
                  <Grid.Col key={index} md={4} sm={6} xs={12}>
                    <StatItem
                      icon={stat.icon}
                      value={stat.value}
                      label={stat.label}
                      suffix={stat.suffix}
                      delay={stat.delay}
                      duration={stat.duration}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Box>
          )}
        </Transition>
      </Container>
    </Box>
  );
}
