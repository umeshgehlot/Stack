import React, { useState, useEffect } from 'react';
import { Box, Text, Group, ThemeIcon, Transition, useMantineTheme } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { IconCheck, IconArrowUp, IconTrendingUp } from '@tabler/icons-react';

interface ProgressBarProps {
  value: number;
  label: string;
  color?: string;
  icon?: React.ReactNode;
  description?: string;
  animationDelay?: number;
}

export default function AnimatedProgressBar({
  value,
  label,
  color,
  icon,
  description,
  animationDelay = 0
}: ProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const theme = useMantineTheme();
  
  // Use intersection observer to trigger animation when component is visible
  const { ref, entry } = useIntersection({
    threshold: 0.3,
    rootMargin: '0px',
  });
  
  // Set default color based on theme if not provided
  const barColor = color || theme.colors.blue[6];
  
  // Animate progress when component becomes visible
  useEffect(() => {
    if (entry?.isIntersecting) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= value) {
              clearInterval(interval);
              return value;
            }
            return prev + 1;
          });
        }, 15);
        
        return () => clearInterval(interval);
      }, animationDelay);
      
      return () => clearTimeout(timer);
    }
  }, [entry?.isIntersecting, value, animationDelay]);
  
  // Default icon if none provided
  const defaultIcon = value >= 100 ? 
    <IconCheck size={16} /> : 
    <IconTrendingUp size={16} />;
  
  return (
    <Box ref={ref} mb={25}>
      <Group position="apart" mb={5}>
        <Group spacing={10}>
          <ThemeIcon 
            size="sm" 
            radius="xl" 
            color={barColor}
            variant="light"
          >
            {icon || defaultIcon}
          </ThemeIcon>
          <Text weight={600} size="sm">{label}</Text>
        </Group>
        <Text 
          weight={700} 
          size="sm"
          sx={{
            background: `linear-gradient(90deg, ${barColor}, ${theme.fn.lighten(barColor, 0.3)})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {progress}%
        </Text>
      </Group>
      
      <Box
        sx={{
          position: 'relative',
          height: 8,
          width: '100%',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
          borderRadius: theme.radius.xl,
          overflow: 'hidden'
        }}
      >
        <Transition mounted={isVisible} transition="slide-right" duration={1500}>
          {(styles) => (
            <Box
              style={{
                ...styles,
                width: `${progress}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${barColor}, ${theme.fn.lighten(barColor, 0.3)})`,
                borderRadius: theme.radius.xl,
                transition: 'width 0.5s ease-out'
              }}
            />
          )}
        </Transition>
        
        {/* Animated glow effect */}
        <Transition mounted={isVisible && progress === value} transition="fade" duration={1000}>
          {(styles) => (
            <Box
              style={{
                ...styles,
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${progress}%`,
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${theme.fn.rgba(barColor, 0.6)}, transparent)`,
                animation: 'glow 2s ease-in-out infinite',
                borderRadius: theme.radius.xl
              }}
            />
          )}
        </Transition>
      </Box>
      
      {description && (
        <Text size="xs" color="dimmed" mt={5}>
          {description}
        </Text>
      )}
      
      <style jsx global>{`
        @keyframes glow {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </Box>
  );
}

// Component to display multiple progress bars
export function ProgressBarsGroup() {
  const theme = useMantineTheme();
  
  const progressData = [
    {
      label: 'Productivity Increase',
      value: 87,
      color: theme.colors.indigo[6],
      icon: <IconTrendingUp size={16} />,
      description: 'Average productivity boost reported by teams',
      delay: 0
    },
    {
      label: 'Customer Satisfaction',
      value: 95,
      color: theme.colors.pink[6],
      icon: <IconCheck size={16} />,
      description: 'Based on customer feedback and surveys',
      delay: 200
    },
    {
      label: 'Implementation Speed',
      value: 78,
      color: theme.colors.teal[6],
      icon: <IconArrowUp size={16} />,
      description: 'Average time to full deployment',
      delay: 400
    },
    {
      label: 'ROI Achievement',
      value: 92,
      color: theme.colors.violet[6],
      icon: <IconTrendingUp size={16} />,
      description: 'Customers reporting positive ROI within 6 months',
      delay: 600
    }
  ];
  
  return (
    <Box>
      {progressData.map((item, index) => (
        <AnimatedProgressBar
          key={index}
          label={item.label}
          value={item.value}
          color={item.color}
          icon={item.icon}
          description={item.description}
          animationDelay={item.delay}
        />
      ))}
    </Box>
  );
}
