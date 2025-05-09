import React, { useState, useEffect } from 'react';
import { 
  Paper, Title, Text, Group, NumberInput, Slider, 
  Box, Divider, Badge, ThemeIcon, Tooltip, 
  Container, Grid, Card, Button, RangeSlider
} from '@mantine/core';
import { 
  IconInfoCircle, IconUsers, IconDeviceDesktop, 
  IconFileText, IconArrowRight, IconCalculator
} from '@tabler/icons-react';

export default function PricingCalculator() {
  // State for calculator inputs
  const [users, setUsers] = useState(10);
  const [storage, setStorage] = useState(50);
  const [projects, setProjects] = useState(5);
  const [billing, setBilling] = useState('annual'); // 'monthly' or 'annual'
  
  // Calculated values
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [annualPrice, setAnnualPrice] = useState(0);
  const [savings, setSavings] = useState(0);
  
  // Calculate pricing based on inputs
  useEffect(() => {
    // Base price per user
    const basePrice = 10;
    
    // Calculate user cost with volume discount
    let userCost = users * basePrice;
    if (users > 20) userCost = userCost * 0.9; // 10% discount for more than 20 users
    if (users > 50) userCost = userCost * 0.85; // Additional 15% discount for more than 50 users
    
    // Calculate storage cost
    const storageCost = Math.max(0, (storage - 50) * 0.2); // First 50GB free, then $0.20 per GB
    
    // Calculate project cost
    const projectCost = Math.max(0, (projects - 3) * 5); // First 3 projects free, then $5 per project
    
    // Total monthly cost
    const totalMonthly = userCost + storageCost + projectCost;
    
    // Annual discount (20% off)
    const totalAnnual = totalMonthly * 12 * 0.8;
    
    // Calculate savings
    const annualSavings = totalMonthly * 12 - totalAnnual;
    
    // Update state
    setMonthlyPrice(totalMonthly);
    setAnnualPrice(totalAnnual);
    setSavings(annualSavings);
  }, [users, storage, projects, billing]);
  
  return (
    <Box py={40} sx={{ background: '#f8f9fa' }}>
      <Container size="lg">
        <Title 
          order={2} 
          align="center" 
          mb={10}
          sx={{ fontWeight: 800 }}
        >
          Calculate Your Price
        </Title>
        <Text 
          align="center" 
          color="dimmed" 
          mb={50}
          sx={{ maxWidth: 600, margin: '0 auto' }}
        >
          Get a custom price estimate based on your team size and needs
        </Text>
        
        <Grid gutter={40}>
          <Grid.Col md={7}>
            <Paper 
              shadow="md" 
              radius="lg" 
              p={30} 
              withBorder
              sx={{ height: '100%' }}
            >
              <Title order={4} mb={30}>Customize Your Plan</Title>
              
              <Box mb={40}>
                <Group position="apart" mb={10}>
                  <Group>
                    <ThemeIcon 
                      size={36} 
                      radius="xl" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #4158D0, #6C63FF)',
                      }}
                    >
                      <IconUsers size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text weight={600}>Team Members</Text>
                      <Text size="sm" color="dimmed">How many people will use Stack?</Text>
                    </Box>
                  </Group>
                  <NumberInput
                    value={users}
                    onChange={(val) => setUsers(val || 1)}
                    min={1}
                    max={100}
                    step={1}
                    size="md"
                    styles={{ input: { width: 100, textAlign: 'center', fontWeight: 700 } }}
                  />
                </Group>
                <Slider
                  value={users}
                  onChange={setUsers}
                  min={1}
                  max={100}
                  step={1}
                  label={null}
                  size="md"
                  marks={[
                    { value: 1, label: '1' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' },
                    { value: 75, label: '75' },
                    { value: 100, label: '100' },
                  ]}
                  sx={{ marginTop: 25 }}
                />
              </Box>
              
              <Box mb={40}>
                <Group position="apart" mb={10}>
                  <Group>
                    <ThemeIcon 
                      size={36} 
                      radius="xl" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #4158D0, #6C63FF)',
                      }}
                    >
                      <IconFileText size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text weight={600}>Storage</Text>
                      <Text size="sm" color="dimmed">How much storage do you need?</Text>
                    </Box>
                  </Group>
                  <Group spacing={5}>
                    <NumberInput
                      value={storage}
                      onChange={(val) => setStorage(val || 5)}
                      min={5}
                      max={1000}
                      step={5}
                      size="md"
                      styles={{ input: { width: 100, textAlign: 'center', fontWeight: 700 } }}
                    />
                    <Text weight={600}>GB</Text>
                  </Group>
                </Group>
                <Slider
                  value={storage}
                  onChange={setStorage}
                  min={5}
                  max={1000}
                  step={5}
                  label={null}
                  size="md"
                  marks={[
                    { value: 5, label: '5GB' },
                    { value: 250, label: '250GB' },
                    { value: 500, label: '500GB' },
                    { value: 750, label: '750GB' },
                    { value: 1000, label: '1TB' },
                  ]}
                  sx={{ marginTop: 25 }}
                />
              </Box>
              
              <Box mb={40}>
                <Group position="apart" mb={10}>
                  <Group>
                    <ThemeIcon 
                      size={36} 
                      radius="xl" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #4158D0, #6C63FF)',
                      }}
                    >
                      <IconDeviceDesktop size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text weight={600}>Projects</Text>
                      <Text size="sm" color="dimmed">How many projects will you manage?</Text>
                    </Box>
                  </Group>
                  <NumberInput
                    value={projects}
                    onChange={(val) => setProjects(val || 1)}
                    min={1}
                    max={50}
                    step={1}
                    size="md"
                    styles={{ input: { width: 100, textAlign: 'center', fontWeight: 700 } }}
                  />
                </Group>
                <Slider
                  value={projects}
                  onChange={setProjects}
                  min={1}
                  max={50}
                  step={1}
                  label={null}
                  size="md"
                  marks={[
                    { value: 1, label: '1' },
                    { value: 10, label: '10' },
                    { value: 20, label: '20' },
                    { value: 30, label: '30' },
                    { value: 40, label: '40' },
                    { value: 50, label: '50' },
                  ]}
                  sx={{ marginTop: 25 }}
                />
              </Box>
              
              <Divider my={30} />
              
              <Group position="center" spacing={40}>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: 15,
                    borderRadius: 8,
                    background: billing === 'monthly' ? 'rgba(65, 88, 208, 0.05)' : 'transparent',
                    border: billing === 'monthly' ? '1px solid #4158D0' : '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setBilling('monthly')}
                >
                  <Text weight={700} mb={5}>Monthly</Text>
                  <Text size="sm" color="dimmed">Pay month-to-month</Text>
                </Box>
                
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: 15,
                    borderRadius: 8,
                    background: billing === 'annual' ? 'rgba(65, 88, 208, 0.05)' : 'transparent',
                    border: billing === 'annual' ? '1px solid #4158D0' : '1px solid transparent',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setBilling('annual')}
                >
                  {billing === 'annual' && (
                    <Badge 
                      color="green" 
                      variant="filled" 
                      sx={{ 
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontSize: 10
                      }}
                    >
                      Save 20%
                    </Badge>
                  )}
                  <Text weight={700} mb={5}>Annual</Text>
                  <Text size="sm" color="dimmed">Pay yearly</Text>
                </Box>
              </Group>
            </Paper>
          </Grid.Col>
          
          <Grid.Col md={5}>
            <Card 
              shadow="md" 
              radius="lg" 
              p={0} 
              withBorder
              sx={{ 
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box 
                p={30} 
                sx={{ 
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                  color: 'white'
                }}
              >
                <Group position="apart" mb={20}>
                  <Title order={3}>Your Estimate</Title>
                  <ThemeIcon 
                    size={40} 
                    radius="xl" 
                    variant="light" 
                    color="blue"
                  >
                    <IconCalculator size={24} />
                  </ThemeIcon>
                </Group>
                
                <Text size="sm" opacity={0.8} mb={5}>Based on your selections:</Text>
                <Group spacing={5} mb={10}>
                  <Text weight={700}>{users}</Text>
                  <Text>users</Text>
                  <Text>•</Text>
                  <Text weight={700}>{storage}GB</Text>
                  <Text>storage</Text>
                  <Text>•</Text>
                  <Text weight={700}>{projects}</Text>
                  <Text>projects</Text>
                </Group>
              </Box>
              
              <Box p={30} sx={{ flexGrow: 1 }}>
                <Box mb={30}>
                  <Group position="apart" mb={5}>
                    <Text size="sm" color="dimmed">Base price per user</Text>
                    <Text weight={600}>$10 / month</Text>
                  </Group>
                  
                  {users > 20 && (
                    <Group position="apart" mb={5}>
                      <Group spacing={5}>
                        <Text size="sm" color="dimmed">Volume discount</Text>
                        <Tooltip label="10% discount for more than 20 users">
                          <ThemeIcon 
                            color="gray" 
                            radius="xl" 
                            size={16} 
                            variant="light"
                          >
                            <IconInfoCircle size={12} />
                          </ThemeIcon>
                        </Tooltip>
                      </Group>
                      <Text weight={600} color="green">-10%</Text>
                    </Group>
                  )}
                  
                  {users > 50 && (
                    <Group position="apart" mb={5}>
                      <Group spacing={5}>
                        <Text size="sm" color="dimmed">Enterprise discount</Text>
                        <Tooltip label="Additional 15% discount for more than 50 users">
                          <ThemeIcon 
                            color="gray" 
                            radius="xl" 
                            size={16} 
                            variant="light"
                          >
                            <IconInfoCircle size={12} />
                          </ThemeIcon>
                        </Tooltip>
                      </Group>
                      <Text weight={600} color="green">-15%</Text>
                    </Group>
                  )}
                  
                  {storage > 50 && (
                    <Group position="apart" mb={5}>
                      <Group spacing={5}>
                        <Text size="sm" color="dimmed">Additional storage</Text>
                        <Tooltip label="First 50GB included, then $0.20 per GB">
                          <ThemeIcon 
                            color="gray" 
                            radius="xl" 
                            size={16} 
                            variant="light"
                          >
                            <IconInfoCircle size={12} />
                          </ThemeIcon>
                        </Tooltip>
                      </Group>
                      <Text weight={600}>${((storage - 50) * 0.2).toFixed(2)} / month</Text>
                    </Group>
                  )}
                  
                  {projects > 3 && (
                    <Group position="apart" mb={5}>
                      <Group spacing={5}>
                        <Text size="sm" color="dimmed">Additional projects</Text>
                        <Tooltip label="First 3 projects included, then $5 per project">
                          <ThemeIcon 
                            color="gray" 
                            radius="xl" 
                            size={16} 
                            variant="light"
                          >
                            <IconInfoCircle size={12} />
                          </ThemeIcon>
                        </Tooltip>
                      </Group>
                      <Text weight={600}>${((projects - 3) * 5).toFixed(2)} / month</Text>
                    </Group>
                  )}
                </Box>
                
                <Divider my={20} />
                
                <Box mb={20}>
                  <Group position="apart" mb={10}>
                    <Text weight={700}>Monthly price</Text>
                    <Text weight={700} size="xl">${monthlyPrice.toFixed(2)}</Text>
                  </Group>
                  
                  <Group position="apart">
                    <Text weight={700}>Annual price</Text>
                    <Group spacing={10} align="center">
                      <Text 
                        size="sm" 
                        sx={{ 
                          textDecoration: 'line-through',
                          opacity: 0.5
                        }}
                      >
                        ${(monthlyPrice * 12).toFixed(2)}
                      </Text>
                      <Text weight={700} size="xl" color="#4158D0">
                        ${annualPrice.toFixed(2)}
                      </Text>
                    </Group>
                  </Group>
                  
                  {billing === 'annual' && (
                    <Group position="apart" mt={10}>
                      <Text size="sm" color="dimmed">You save</Text>
                      <Text weight={700} color="green">${savings.toFixed(2)}</Text>
                    </Group>
                  )}
                </Box>
                
                <Button 
                  fullWidth 
                  size="lg" 
                  radius="xl"
                  rightIcon={<IconArrowRight size={18} />}
                  sx={{
                    marginTop: 'auto',
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    height: 54,
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 16px rgba(65, 88, 208, 0.3)'
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
