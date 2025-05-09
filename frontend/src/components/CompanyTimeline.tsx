import React, { useState } from 'react';
import { 
  Container, Title, Text, Box, Group, 
  Timeline, ThemeIcon, Badge, Card, 
  Transition, Image
} from '@mantine/core';
import { 
  IconFlag, IconRocket, IconUsers, 
  IconBuildingSkyscraper, IconAward, IconStar
} from '@tabler/icons-react';
import { useIntersection } from '@mantine/hooks';

const timelineData = [
  {
    year: '2018',
    title: 'Company Founded',
    description: 'Stack was founded with a mission to revolutionize how teams collaborate and share knowledge.',
    icon: <IconFlag size={20} />,
    image: 'https://via.placeholder.com/400x300',
    achievements: [
      'Secured $2M seed funding',
      'Built founding team of 5 engineers',
      'Released alpha version to 50 test users'
    ]
  },
  {
    year: '2019',
    title: 'Product Launch',
    description: 'We launched our first public version of Stack, introducing real-time collaboration features.',
    icon: <IconRocket size={20} />,
    image: 'https://via.placeholder.com/400x300',
    achievements: [
      'Reached 10,000 active users',
      'Featured in TechCrunch and Product Hunt',
      'Released mobile apps for iOS and Android'
    ]
  },
  {
    year: '2020',
    title: 'Rapid Growth',
    description: 'Stack experienced exponential growth as remote work became essential worldwide.',
    icon: <IconUsers size={20} />,
    image: 'https://via.placeholder.com/400x300',
    achievements: [
      'Grew to 100,000+ active users',
      'Raised $15M Series A funding',
      'Expanded team to 50 employees'
    ]
  },
  {
    year: '2021',
    title: 'Enterprise Expansion',
    description: 'We expanded our offering to enterprise customers with advanced security and compliance features.',
    icon: <IconBuildingSkyscraper size={20} />,
    image: 'https://via.placeholder.com/400x300',
    achievements: [
      'Signed 100+ enterprise customers',
      'Achieved SOC 2 and GDPR compliance',
      'Launched Stack for Enterprise'
    ]
  },
  {
    year: '2022',
    title: 'Global Recognition',
    description: 'Stack received multiple industry awards and continued to innovate with new features.',
    icon: <IconAward size={20} />,
    image: 'https://via.placeholder.com/400x300',
    achievements: [
      'Named "Best Collaboration Tool" by TechAwards',
      'Reached 1M+ active users',
      'Expanded to 15 languages'
    ]
  },
  {
    year: '2023',
    title: 'The Future',
    description: "We're just getting started. Our vision is to become the world's most trusted platform for team collaboration.",
    icon: <IconStar size={20} />,
    image: 'https://via.placeholder.com/400x300',
    achievements: [
      'Launching AI-powered features',
      'Expanding global data centers',
      'Building the future of work'
    ]
  }
];

export default function CompanyTimeline() {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const { ref, entry } = useIntersection({
    threshold: 0.3,
    rootMargin: '0px',
  });
  
  const handleItemHover = (index: number) => {
    setActiveItem(index);
  };
  
  const handleItemLeave = () => {
    setActiveItem(null);
  };
  
  return (
    <Box py={40} sx={{ background: '#f8f9fa' }} ref={ref}>
      <Container size="lg">
        <Box mb={50} sx={{ textAlign: 'center' }}>
          <Badge 
            size="xl" 
            radius="xl" 
            color="violet" 
            variant="filled" 
            mb={20}
            sx={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(149, 80, 200, 0.3)'
            }}
          >
            Our Journey
          </Badge>
          
          <Title 
            order={2} 
            mb={15}
            sx={{ 
              fontWeight: 800,
              fontSize: 36
            }}
          >
            The Stack Story
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
            From a small startup to a global company, see how we've evolved over the years.
          </Text>
        </Box>
        
        <Timeline 
          active={activeItem !== null ? activeItem : -1} 
          bulletSize={40}
          lineWidth={3}
          sx={{
            '.mantine-Timeline-item': {
              paddingBottom: 50
            }
          }}
        >
          {timelineData.map((item, index) => (
            <Timeline.Item
              key={index}
              bullet={
                <ThemeIcon 
                  size={40} 
                  radius="xl"
                  sx={{ 
                    background: activeItem === index 
                      ? 'linear-gradient(135deg, #4158D0, #C850C0)' 
                      : '#f1f3f5',
                    color: activeItem === index ? 'white' : '#4158D0',
                    border: '3px solid white',
                    boxShadow: activeItem === index 
                      ? '0 8px 16px rgba(65, 88, 208, 0.3)' 
                      : '0 4px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {item.icon}
                </ThemeIcon>
              }
              title={
                <Group spacing={10} mb={5}>
                  <Badge 
                    size="lg" 
                    radius="sm" 
                    color={activeItem === index ? "violet" : "gray"}
                    variant={activeItem === index ? "filled" : "light"}
                    sx={{
                      transition: 'all 0.3s ease',
                      fontWeight: 700
                    }}
                  >
                    {item.year}
                  </Badge>
                  <Title 
                    order={4}
                    sx={{ 
                      fontWeight: 700,
                      transition: 'all 0.3s ease',
                      color: activeItem === index ? '#4158D0' : undefined
                    }}
                  >
                    {item.title}
                  </Title>
                </Group>
              }
              onMouseEnter={() => handleItemHover(index)}
              onMouseLeave={handleItemLeave}
            >
              <Card 
                p={0} 
                radius="lg" 
                withBorder
                sx={{
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  transform: activeItem === index ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: activeItem === index 
                    ? '0 12px 24px rgba(0, 0, 0, 0.1)' 
                    : '0 4px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'row',
                    '@media (max-width: 768px)': {
                      flexDirection: 'column'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '40%', 
                      position: 'relative',
                      overflow: 'hidden',
                      '@media (max-width: 768px)': {
                        width: '100%',
                        height: 200
                      }
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      height="100%"
                      width="100%"
                      sx={{
                        transition: 'all 0.5s ease',
                        transform: activeItem === index ? 'scale(1.05)' : 'scale(1)',
                      }}
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.3), rgba(200, 80, 192, 0.3))',
                        opacity: activeItem === index ? 1 : 0,
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Box>
                  
                  <Box p={25} sx={{ width: '60%', '@media (max-width: 768px)': { width: '100%' } }}>
                    <Text size="lg" mb={15}>
                      {item.description}
                    </Text>
                    
                    <Title order={5} mb={10}>Key Achievements:</Title>
                    {item.achievements.map((achievement, i) => (
                      <Group key={i} spacing={10} mb={8}>
                        <ThemeIcon 
                          size={24} 
                          radius="xl" 
                          sx={{ 
                            background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                            flexShrink: 0
                          }}
                        >
                          <IconStar size={14} />
                        </ThemeIcon>
                        <Text>{achievement}</Text>
                      </Group>
                    ))}
                  </Box>
                </Box>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </Container>
    </Box>
  );
}
