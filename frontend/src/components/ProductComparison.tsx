import React, { useState } from 'react';
import { 
  Container, Title, Text, Box, Group, 
  Table, ThemeIcon, Badge, Button, 
  Tooltip, Tabs, Card, SimpleGrid
} from '@mantine/core';
import { 
  IconCheck, IconX, IconInfoCircle, 
  IconArrowRight, IconChartBar, IconUsers, 
  IconLock, IconDeviceDesktop
} from '@tabler/icons-react';

const competitors = [
  { id: 'competitor1', name: 'Competitor A' },
  { id: 'competitor2', name: 'Competitor B' },
  { id: 'competitor3', name: 'Competitor C' }
];

const categories = [
  {
    id: 'collaboration',
    name: 'Collaboration',
    icon: <IconUsers size={20} />,
    color: '#4158D0'
  },
  {
    id: 'security',
    name: 'Security',
    icon: <IconLock size={20} />,
    color: '#C850C0'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: <IconChartBar size={20} />,
    color: '#6C63FF'
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: <IconDeviceDesktop size={20} />,
    color: '#FF6B6B'
  }
];

const features = [
  {
    category: 'collaboration',
    items: [
      {
        name: 'Real-time collaboration',
        description: 'Edit documents simultaneously with multiple team members',
        stack: true,
        competitor1: true,
        competitor2: true,
        competitor3: false
      },
      {
        name: 'Live cursors and selections',
        description: 'See where teammates are working in real-time',
        stack: true,
        competitor1: true,
        competitor2: false,
        competitor3: false
      },
      {
        name: 'Commenting and annotations',
        description: 'Add comments and feedback directly on documents',
        stack: true,
        competitor1: true,
        competitor2: true,
        competitor3: true
      },
      {
        name: 'Version history',
        description: 'Track changes and restore previous versions',
        stack: true,
        competitor1: true,
        competitor2: true,
        competitor3: true
      },
      {
        name: 'Offline editing',
        description: 'Continue working without an internet connection',
        stack: true,
        competitor1: false,
        competitor2: false,
        competitor3: false
      }
    ]
  },
  {
    category: 'security',
    items: [
      {
        name: 'End-to-end encryption',
        description: 'Data is encrypted in transit and at rest',
        stack: true,
        competitor1: true,
        competitor2: false,
        competitor3: false
      },
      {
        name: 'SSO integration',
        description: 'Single sign-on with major identity providers',
        stack: true,
        competitor1: true,
        competitor2: true,
        competitor3: false
      },
      {
        name: 'Role-based access control',
        description: 'Granular permissions for users and teams',
        stack: true,
        competitor1: true,
        competitor2: true,
        competitor3: true
      },
      {
        name: 'Audit logs',
        description: 'Detailed activity tracking for compliance',
        stack: true,
        competitor1: true,
        competitor2: false,
        competitor3: false
      },
      {
        name: 'Data residency options',
        description: 'Choose where your data is stored',
        stack: true,
        competitor1: false,
        competitor2: false,
        competitor3: false
      }
    ]
  },
  {
    category: 'analytics',
    items: [
      {
        name: 'Team activity dashboard',
        description: 'Overview of team productivity and engagement',
        stack: true,
        competitor1: false,
        competitor2: true,
        competitor3: false
      },
      {
        name: 'Document engagement metrics',
        description: 'Track views, edits, and comments on documents',
        stack: true,
        competitor1: false,
        competitor2: true,
        competitor3: false
      },
      {
        name: 'Custom reports',
        description: 'Create and schedule custom analytics reports',
        stack: true,
        competitor1: false,
        competitor2: false,
        competitor3: false
      },
      {
        name: 'User adoption insights',
        description: 'Understand how teams are using the platform',
        stack: true,
        competitor1: false,
        competitor2: false,
        competitor3: false
      },
      {
        name: 'Export capabilities',
        description: 'Export data for further analysis',
        stack: true,
        competitor1: true,
        competitor2: true,
        competitor3: false
      }
    ]
  },
  {
    category: 'integrations',
    items: [
      {
        name: 'Google Workspace',
        description: 'Seamless integration with Google apps',
        stack: true,
        competitor1: true,
        competitor2: true,
        competitor3: true
      },
      {
        name: 'Microsoft Office',
        description: 'Work with Office files directly',
        stack: true,
        competitor1: true,
        competitor2: true,
        competitor3: false
      },
      {
        name: 'Slack & Microsoft Teams',
        description: 'Communication platform integrations',
        stack: true,
        competitor1: true,
        competitor2: true,
        competitor3: true
      },
      {
        name: 'Jira & GitHub',
        description: 'Development tool integrations',
        stack: true,
        competitor1: false,
        competitor2: true,
        competitor3: false
      },
      {
        name: 'Custom API',
        description: 'Build custom integrations with our API',
        stack: true,
        competitor1: false,
        competitor2: false,
        competitor3: false
      }
    ]
  }
];

export default function ProductComparison() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([competitors[0].id]);
  
  const toggleCompetitor = (id: string) => {
    if (selectedCompetitors.includes(id)) {
      if (selectedCompetitors.length > 1) {
        setSelectedCompetitors(selectedCompetitors.filter(c => c !== id));
      }
    } else {
      setSelectedCompetitors([...selectedCompetitors, id]);
    }
  };
  
  const currentCategoryFeatures = features.find(f => f.category === activeCategory)?.items || [];
  const activeCategoryObj = categories.find(c => c.id === activeCategory);
  
  return (
    <Box py={40} sx={{ background: '#f8f9fa' }}>
      <Container size="lg">
        <Box mb={50} sx={{ textAlign: 'center' }}>
          <Badge 
            size="xl" 
            radius="xl" 
            color="cyan" 
            variant="filled" 
            mb={20}
            sx={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(80, 192, 200, 0.3)'
            }}
          >
            Stack vs. Competitors
          </Badge>
          
          <Title 
            order={2} 
            mb={15}
            sx={{ 
              fontWeight: 800,
              fontSize: 36
            }}
          >
            See How Stack Compares
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
            Stack offers the most comprehensive set of features for team collaboration. 
            See how we compare to other solutions in the market.
          </Text>
        </Box>
        
        <Card 
          radius="lg" 
          p={0} 
          withBorder
          shadow="md"
          sx={{ overflow: 'hidden' }}
        >
          <Box 
            p={20} 
            sx={{ 
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              color: 'white'
            }}
          >
            <Group position="apart" align="center">
              <Title order={3}>Feature Comparison</Title>
              <Group spacing={10}>
                {competitors.map(competitor => (
                  <Button
                    key={competitor.id}
                    variant={selectedCompetitors.includes(competitor.id) ? "filled" : "outline"}
                    color={selectedCompetitors.includes(competitor.id) ? "white" : "gray"}
                    radius="xl"
                    compact
                    onClick={() => toggleCompetitor(competitor.id)}
                    sx={{
                      borderColor: 'white',
                      color: selectedCompetitors.includes(competitor.id) ? 'black' : 'white',
                      fontWeight: 600,
                      '&:hover': {
                        background: selectedCompetitors.includes(competitor.id) 
                          ? 'white' 
                          : 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {competitor.name}
                  </Button>
                ))}
              </Group>
            </Group>
          </Box>
          
          <Tabs
            value={activeCategory}
            onTabChange={(value) => value && setActiveCategory(value)}
            radius="xs"
            variant="outline"
            styles={{
              tabsList: {
                borderBottom: '1px solid #eee',
                padding: '0 20px'
              },
              tab: {
                fontWeight: 600,
                padding: '15px 20px',
                '&[data-active]': {
                  borderBottom: `3px solid ${activeCategoryObj?.color || '#4158D0'}`,
                  color: activeCategoryObj?.color || '#4158D0'
                }
              }
            }}
          >
            {categories.map((category) => (
              <Tabs.Tab 
                key={category.id} 
                value={category.id}
                icon={
                  <ThemeIcon 
                    size={24} 
                    radius="xl" 
                    variant={activeCategory === category.id ? 'filled' : 'light'}
                    color={activeCategory === category.id ? category.color : 'gray'}
                  >
                    {category.icon}
                  </ThemeIcon>
                }
              >
                {category.name}
              </Tabs.Tab>
            ))}
          </Tabs>
          
          <Table 
            striped 
            highlightOnHover
            sx={{ 
              'td, th': { 
                padding: '15px 20px',
                textAlign: 'center',
                '&:first-of-type': {
                  textAlign: 'left'
                }
              },
              'thead tr th': {
                background: '#f8f9fa',
                fontWeight: 700
              }
            }}
          >
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Feature</th>
                <th style={{ width: '17.5%' }}>
                  <Group position="center" spacing={5}>
                    <Text weight={700} color={activeCategoryObj?.color}>Stack</Text>
                    <ThemeIcon 
                      size={20} 
                      radius="xl" 
                      sx={{ background: activeCategoryObj?.color || '#4158D0' }}
                    >
                      <IconCheck size={14} />
                    </ThemeIcon>
                  </Group>
                </th>
                {selectedCompetitors.map(competitorId => {
                  const competitor = competitors.find(c => c.id === competitorId);
                  return (
                    <th key={competitorId} style={{ width: `${52.5 / selectedCompetitors.length}%` }}>
                      {competitor?.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {currentCategoryFeatures.map((feature, index) => (
                <tr key={index}>
                  <td>
                    <Group spacing={5} noWrap>
                      <Text weight={600}>{feature.name}</Text>
                      <Tooltip label={feature.description} position="right" withArrow>
                        <ThemeIcon 
                          size={18} 
                          radius="xl" 
                          variant="light" 
                          color="gray"
                          sx={{ cursor: 'help' }}
                        >
                          <IconInfoCircle size={12} />
                        </ThemeIcon>
                      </Tooltip>
                    </Group>
                  </td>
                  <td>
                    <ThemeIcon 
                      size={28} 
                      radius="xl" 
                      sx={{ 
                        background: feature.stack 
                          ? activeCategoryObj?.color || '#4158D0' 
                          : 'transparent',
                        color: feature.stack ? 'white' : 'red',
                        border: feature.stack ? 'none' : '1px solid red',
                        margin: '0 auto'
                      }}
                    >
                      {feature.stack ? <IconCheck size={16} /> : <IconX size={16} />}
                    </ThemeIcon>
                  </td>
                  {selectedCompetitors.map(competitorId => (
                    <td key={competitorId}>
                      <ThemeIcon 
                        size={28} 
                        radius="xl" 
                        sx={{ 
                          background: feature[competitorId as keyof typeof feature] ? '#eee' : 'transparent',
                          color: feature[competitorId as keyof typeof feature] ? 'green' : 'red',
                          border: feature[competitorId as keyof typeof feature] ? 'none' : '1px solid red',
                          margin: '0 auto'
                        }}
                      >
                        {feature[competitorId as keyof typeof feature] ? <IconCheck size={16} /> : <IconX size={16} />}
                      </ThemeIcon>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        
        <Box mt={40} sx={{ textAlign: 'center' }}>
          <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'md', cols: 2 }, { maxWidth: 'sm', cols: 1 }]} spacing={20}>
            {categories.map((category) => (
              <Card 
                key={category.id}
                p={20}
                radius="lg"
                withBorder
                sx={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                    borderColor: category.color
                  }
                }}
                onClick={() => setActiveCategory(category.id)}
              >
                <ThemeIcon 
                  size={50} 
                  radius="xl" 
                  sx={{ 
                    background: category.color,
                    margin: '0 auto 15px'
                  }}
                >
                  {category.icon}
                </ThemeIcon>
                <Title order={4} mb={10}>{category.name}</Title>
                <Text color="dimmed" size="sm">
                  {category.id === 'collaboration' && 'Work together in real-time'}
                  {category.id === 'security' && 'Enterprise-grade protection'}
                  {category.id === 'analytics' && 'Insights into team productivity'}
                  {category.id === 'integrations' && 'Connect with your favorite tools'}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
        
        <Group position="center" mt={40}>
          <Button 
            component="a" 
            href="/pricing" 
            variant="gradient" 
            gradient={{ from: '#4158D0', to: '#C850C0' }}
            radius="xl"
            size="lg"
            rightIcon={<IconArrowRight size={18} />}
            sx={{
              height: 56,
              padding: '0 30px',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 16px rgba(65, 88, 208, 0.3)'
              }
            }}
          >
            See Pricing Plans
          </Button>
        </Group>
      </Container>
    </Box>
  );
}
