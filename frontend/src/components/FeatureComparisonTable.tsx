import React, { useState } from 'react';
import { 
  Table, Text, Group, Switch, Box, 
  ThemeIcon, Tooltip, Container, Title, 
  Paper, Badge, Divider
} from '@mantine/core';
import { 
  IconCheck, IconX, IconInfoCircle, 
  IconChevronRight, IconAlertCircle
} from '@tabler/icons-react';

// Define feature data
const features = [
  {
    category: 'Core Features',
    items: [
      { 
        name: 'Real-time collaboration', 
        free: true, 
        pro: true, 
        enterprise: true,
        tooltip: 'Collaborate with team members in real-time'
      },
      { 
        name: 'Document editing', 
        free: true, 
        pro: true, 
        enterprise: true,
        tooltip: 'Create and edit documents'
      },
      { 
        name: 'File storage', 
        free: '5 GB', 
        pro: '50 GB', 
        enterprise: 'Unlimited',
        tooltip: 'Store your files securely in the cloud'
      },
      { 
        name: 'Version history', 
        free: '7 days', 
        pro: '90 days', 
        enterprise: 'Unlimited',
        tooltip: 'Access previous versions of your documents'
      }
    ]
  },
  {
    category: 'Collaboration',
    items: [
      { 
        name: 'Team workspaces', 
        free: '1', 
        pro: 'Unlimited', 
        enterprise: 'Unlimited',
        tooltip: 'Create dedicated spaces for different teams'
      },
      { 
        name: 'Guest access', 
        free: false, 
        pro: true, 
        enterprise: true,
        tooltip: 'Invite external collaborators to specific documents'
      },
      { 
        name: 'Comments & annotations', 
        free: true, 
        pro: true, 
        enterprise: true,
        tooltip: 'Leave comments and feedback on documents'
      },
      { 
        name: 'Advanced permissions', 
        free: false, 
        pro: true, 
        enterprise: true,
        tooltip: 'Set granular access controls for documents and folders'
      }
    ]
  },
  {
    category: 'Security & Compliance',
    items: [
      { 
        name: 'Two-factor authentication', 
        free: false, 
        pro: true, 
        enterprise: true,
        tooltip: 'Add an extra layer of security to your account'
      },
      { 
        name: 'SSO integration', 
        free: false, 
        pro: false, 
        enterprise: true,
        tooltip: 'Single Sign-On with your identity provider'
      },
      { 
        name: 'Audit logs', 
        free: false, 
        pro: 'Basic', 
        enterprise: 'Advanced',
        tooltip: 'Track user activity and document changes'
      },
      { 
        name: 'Data encryption', 
        free: 'Standard', 
        pro: 'Advanced', 
        enterprise: 'Enterprise-grade',
        tooltip: 'Keep your data secure with encryption'
      }
    ]
  },
  {
    category: 'Support',
    items: [
      { 
        name: 'Customer support', 
        free: 'Email', 
        pro: 'Priority email', 
        enterprise: '24/7 dedicated',
        tooltip: 'Get help when you need it'
      },
      { 
        name: 'SLA', 
        free: false, 
        pro: false, 
        enterprise: true,
        tooltip: 'Service Level Agreement with guaranteed uptime'
      },
      { 
        name: 'Onboarding', 
        free: 'Self-serve', 
        pro: 'Guided', 
        enterprise: 'Dedicated success manager',
        tooltip: 'Get help setting up your account'
      },
      { 
        name: 'Training resources', 
        free: 'Documentation', 
        pro: 'Documentation + Webinars', 
        enterprise: 'Custom training',
        tooltip: 'Learn how to use Stack effectively'
      }
    ]
  }
];

export default function FeatureComparisonTable() {
  const [showAnnual, setShowAnnual] = useState(true);
  
  // Render check or x icon based on feature availability
  const renderAvailability = (value: boolean | string) => {
    if (value === true) {
      return (
        <ThemeIcon 
          color="green" 
          radius="xl" 
          size={24} 
          sx={{ background: 'rgba(51, 204, 51, 0.15)' }}
        >
          <IconCheck size={16} stroke={2.5} />
        </ThemeIcon>
      );
    } else if (value === false) {
      return (
        <ThemeIcon 
          color="red" 
          radius="xl" 
          size={24} 
          sx={{ background: 'rgba(255, 76, 76, 0.15)' }}
        >
          <IconX size={16} stroke={2.5} />
        </ThemeIcon>
      );
    } else {
      return <Text size="sm">{value}</Text>;
    }
  };
  
  return (
    <Box py={40}>
      <Container size="lg">
        <Title 
          order={2} 
          align="center" 
          mb={10}
          sx={{ fontWeight: 800 }}
        >
          Compare Plans
        </Title>
        <Text 
          align="center" 
          color="dimmed" 
          mb={30}
          sx={{ maxWidth: 600, margin: '0 auto' }}
        >
          Choose the plan that's right for you and your team
        </Text>
        
        <Group position="center" mb={50}>
          <Text size="sm" weight={600} color={!showAnnual ? 'blue' : 'dimmed'}>Monthly</Text>
          <Switch 
            checked={showAnnual} 
            onChange={() => setShowAnnual(!showAnnual)}
            size="md"
            label={
              <Badge 
                color="green" 
                variant="filled" 
                sx={{ 
                  marginLeft: 10,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: 10
                }}
              >
                Save 20%
              </Badge>
            }
          />
          <Text size="sm" weight={600} color={showAnnual ? 'blue' : 'dimmed'}>Annual</Text>
        </Group>
        
        <Paper 
          shadow="md" 
          radius="lg" 
          withBorder 
          p={0} 
          sx={{ overflow: 'hidden' }}
        >
          <Table 
            horizontalSpacing="xl" 
            verticalSpacing="md" 
            fontSize="sm"
            striped
            highlightOnHover
            sx={{ 
              '& thead tr th': { 
                background: '#f8f9fa',
                borderBottom: '2px solid #e9ecef'
              }
            }}
          >
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Features</th>
                <th style={{ width: '20%' }}>
                  <Text weight={700} size="md">Free</Text>
                  <Text color="dimmed" size="xs">$0</Text>
                </th>
                <th style={{ width: '20%' }}>
                  <Text weight={700} size="md" color="#4158D0">Pro</Text>
                  <Group spacing={5} position="left">
                    <Text weight={700} size="md">${showAnnual ? '8' : '10'}</Text>
                    <Text color="dimmed" size="xs">/ user / month</Text>
                  </Group>
                  {showAnnual && (
                    <Text color="dimmed" size="xs">billed annually</Text>
                  )}
                </th>
                <th style={{ width: '20%' }}>
                  <Text weight={700} size="md" sx={{ 
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>Enterprise</Text>
                  <Text color="dimmed" size="xs">Custom pricing</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  <tr>
                    <td colSpan={4} style={{ background: '#f8f9fa' }}>
                      <Text weight={700} my={10}>{category.category}</Text>
                    </td>
                  </tr>
                  {category.items.map((feature, featureIndex) => (
                    <tr key={featureIndex}>
                      <td>
                        <Group spacing={5} noWrap>
                          <Text size="sm">{feature.name}</Text>
                          {feature.tooltip && (
                            <Tooltip label={feature.tooltip} position="top" withArrow>
                              <ThemeIcon 
                                color="gray" 
                                radius="xl" 
                                size={16} 
                                variant="light"
                              >
                                <IconInfoCircle size={12} />
                              </ThemeIcon>
                            </Tooltip>
                          )}
                        </Group>
                      </td>
                      <td>{renderAvailability(feature.free)}</td>
                      <td>{renderAvailability(feature.pro)}</td>
                      <td>{renderAvailability(feature.enterprise)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              <tr>
                <td></td>
                <td>
                  <Badge 
                    variant="outline" 
                    color="gray" 
                    size="lg" 
                    radius="sm"
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 600,
                      padding: '10px 15px'
                    }}
                  >
                    Current Plan
                  </Badge>
                </td>
                <td>
                  <Badge 
                    variant="filled" 
                    color="blue" 
                    size="lg" 
                    radius="sm"
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 600,
                      padding: '10px 15px',
                      background: 'linear-gradient(135deg, #4158D0, #6C63FF)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 5px 10px rgba(108, 99, 255, 0.2)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Upgrade Now
                  </Badge>
                </td>
                <td>
                  <Group spacing={5} sx={{ cursor: 'pointer' }}>
                    <Text size="sm" weight={600} color="blue">Contact Sales</Text>
                    <IconChevronRight size={14} color="#4158D0" />
                  </Group>
                </td>
              </tr>
            </tbody>
          </Table>
        </Paper>
        
        <Box mt={30} p={20} sx={{ background: 'rgba(65, 88, 208, 0.05)', borderRadius: 12 }}>
          <Group spacing={10} align="flex-start">
            <ThemeIcon 
              color="blue" 
              variant="light" 
              size={30} 
              radius="xl"
            >
              <IconAlertCircle size={18} />
            </ThemeIcon>
            <Box>
              <Text weight={600} mb={5}>Need a custom plan?</Text>
              <Text size="sm" color="dimmed">
                Contact our sales team for a tailored solution that meets your specific requirements. 
                We offer flexible pricing and custom features for large organizations.
              </Text>
            </Box>
          </Group>
        </Box>
      </Container>
    </Box>
  );
}
