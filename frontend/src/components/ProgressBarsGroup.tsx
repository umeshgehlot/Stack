import React from 'react';
import { Box, Text, Group, Progress, ThemeIcon, Stack } from '@mantine/core';
import { 
  IconUsers, IconCloudUpload, IconBuildingSkyscraper, 
  IconWorld, IconClock 
} from '@tabler/icons-react';
import { useIntersection } from '@mantine/hooks';

// Define metrics data
const metrics = [
  {
    label: 'Active Users',
    value: 85,
    icon: <IconUsers size={20} />,
    color: 'blue',
    suffix: 'K+',
    description: '85,000+ active users worldwide'
  },
  {
    label: 'Data Processed',
    value: 95,
    icon: <IconCloudUpload size={20} />,
    color: 'violet',
    suffix: 'TB',
    description: 'Processing 95TB of data monthly'
  },
  {
    label: 'Enterprise Clients',
    value: 70,
    icon: <IconBuildingSkyscraper size={20} />,
    color: 'indigo',
    suffix: '+',
    description: 'Trusted by 70+ Fortune 500 companies'
  },
  {
    label: 'Global Reach',
    value: 60,
    icon: <IconWorld size={20} />,
    color: 'cyan',
    suffix: '+',
    description: 'Available in 60+ countries worldwide'
  },
  {
    label: 'Time Saved',
    value: 80,
    icon: <IconClock size={20} />,
    color: 'pink',
    suffix: '%',
    description: 'Teams report 80% time savings on average'
  }
];

export default function ProgressBarsGroup() {
  // Use intersection observer to trigger animation when component is visible
  const { ref, entry } = useIntersection({
    threshold: 0.2,
    rootMargin: '0px',
  });

  const visible = entry?.isIntersecting;

  return (
    <Box ref={ref}>
      <Stack spacing={30}>
        {metrics.map((metric, index) => (
          <Box key={index}>
            <Group position="apart" mb={5}>
              <Group spacing={10}>
                <ThemeIcon 
                  color={metric.color} 
                  variant="light" 
                  size={36} 
                  radius="xl"
                >
                  {metric.icon}
                </ThemeIcon>
                <Text weight={600}>{metric.label}</Text>
              </Group>
              <Text 
                weight={700} 
                size="xl" 
                sx={{ 
                  fontFeatureSettings: '"tnum"',
                  background: `linear-gradient(90deg, var(--mantine-color-${metric.color}-6) 0%, var(--mantine-color-${metric.color}-4) 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {visible ? metric.value : 0}{metric.suffix}
              </Text>
            </Group>
            
            <Progress 
              value={visible ? metric.value : 0} 
              color={metric.color} 
              size="lg" 
              radius="xl"
              animate
              sx={{ 
                transition: 'width 1.5s ease-in-out',
                transitionDelay: `${index * 0.2}s`,
                height: 12,
                '.mantine-Progress-bar': {
                  background: `linear-gradient(90deg, var(--mantine-color-${metric.color}-6) 0%, var(--mantine-color-${metric.color}-4) 100%)`,
                }
              }}
            />
            
            <Text color="dimmed" size="sm" mt={5}>
              {metric.description}
            </Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
