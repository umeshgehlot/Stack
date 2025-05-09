import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Group,
  Badge,
  Button,
  RingProgress,
  List,
  ThemeIcon,
  SimpleGrid,
  Paper,
  Divider,
  Avatar,
  Box,
  Progress,
  Tabs,
  Timeline,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconUsers,
  IconCalendarEvent,
  IconMessage,
  IconFile,
  IconCheck,
  IconClock,
  IconChartBar,
  IconChartPie,
  IconChartLine,
  IconPlus,
  IconDotsVertical,
  IconRefresh,
  IconEye,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// Sample data for the dashboard
const stats = [
  {
    title: 'Team Members',
    value: '24',
    change: '+12%',
    changeType: 'increase',
    icon: IconUsers,
    color: 'blue'
  },
  {
    title: 'Upcoming Events',
    value: '8',
    change: '+5%',
    changeType: 'increase',
    icon: IconCalendarEvent,
    color: 'violet'
  },
  {
    title: 'Unread Messages',
    value: '12',
    change: '-3%',
    changeType: 'decrease',
    icon: IconMessage,
    color: 'grape'
  },
  {
    title: 'Documents',
    value: '142',
    change: '+22%',
    changeType: 'increase',
    icon: IconFile,
    color: 'orange'
  }
];

const recentActivity = [
  {
    id: 1,
    user: {
      name: 'Alex Johnson',
      avatar: null,
      initials: 'AJ'
    },
    action: 'created a new document',
    target: 'Q2 Marketing Strategy',
    time: '10 minutes ago'
  },
  {
    id: 2,
    user: {
      name: 'Sarah Miller',
      avatar: null,
      initials: 'SM'
    },
    action: 'commented on',
    target: 'Product Roadmap',
    time: '1 hour ago'
  },
  {
    id: 3,
    user: {
      name: 'David Chen',
      avatar: null,
      initials: 'DC'
    },
    action: 'scheduled a meeting',
    target: 'Weekly Sprint Planning',
    time: '3 hours ago'
  },
  {
    id: 4,
    user: {
      name: 'Emma Wilson',
      avatar: null,
      initials: 'EW'
    },
    action: 'completed task',
    target: 'Finalize Q2 Budget',
    time: '5 hours ago'
  }
];

const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    progress: 75,
    status: 'In Progress',
    dueDate: 'May 20, 2025',
    members: 5
  },
  {
    id: 2,
    name: 'Mobile App Development',
    progress: 45,
    status: 'In Progress',
    dueDate: 'June 15, 2025',
    members: 8
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    progress: 90,
    status: 'Almost Done',
    dueDate: 'May 12, 2025',
    members: 3
  },
  {
    id: 4,
    name: 'Product Launch',
    progress: 20,
    status: 'Just Started',
    dueDate: 'July 5, 2025',
    members: 12
  }
];

const tasks = [
  {
    id: 1,
    title: 'Review design mockups',
    priority: 'High',
    dueDate: 'Today',
    completed: false
  },
  {
    id: 2,
    title: 'Prepare presentation for client meeting',
    priority: 'High',
    dueDate: 'Tomorrow',
    completed: false
  },
  {
    id: 3,
    title: 'Update project documentation',
    priority: 'Medium',
    dueDate: 'May 10, 2025',
    completed: false
  },
  {
    id: 4,
    title: 'Send weekly report to stakeholders',
    priority: 'Medium',
    dueDate: 'May 12, 2025',
    completed: true
  },
  {
    id: 5,
    title: 'Research competitor products',
    priority: 'Low',
    dueDate: 'May 15, 2025',
    completed: true
  }
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated and load user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | Stack</title>
        <meta name="description" content="Stack dashboard - manage your projects, tasks, and team collaboration" />
      </Head>

      <Container fluid px="md" py="xl">
        {/* Welcome Section */}
        <Grid mb={30}>
          <Grid.Col span={12}>
            <Card p="lg" radius="md" withBorder>
              <Group position="apart">
                <div>
                  <Text size="sm" color="dimmed">Welcome back,</Text>
                  <Title order={2} mb={5}>{user?.name || 'User'}</Title>
                  <Text>Here's what's happening with your projects today.</Text>
                </div>
                <Button
                  leftIcon={<IconPlus size={16} />}
                  sx={{
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  New Project
                </Button>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Stats Section */}
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'xs', cols: 1 }
          ]}
          mb={30}
        >
          {stats.map((stat) => (
            <Card key={stat.title} p="lg" radius="md" withBorder>
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed" transform="uppercase" weight={700}>
                    {stat.title}
                  </Text>
                  <Text weight={700} size="xl" my={5}>
                    {stat.value}
                  </Text>
                  <Group spacing={5}>
                    {stat.changeType === 'increase' ? (
                      <IconArrowUpRight size={16} color="teal" />
                    ) : (
                      <IconArrowDownRight size={16} color="red" />
                    )}
                    <Text
                      size="sm"
                      color={stat.changeType === 'increase' ? 'teal' : 'red'}
                      weight={500}
                    >
                      {stat.change}
                    </Text>
                    <Text size="sm" color="dimmed">
                      from last month
                    </Text>
                  </Group>
                </div>
                <ThemeIcon
                  size={56}
                  radius="md"
                  color={stat.color}
                  variant="light"
                >
                  <stat.icon size={28} />
                </ThemeIcon>
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        {/* Main Content */}
        <Grid gutter="md">
          {/* Projects Section */}
          <Grid.Col md={8} sm={12}>
            <Card p="lg" radius="md" withBorder mb={20}>
              <Group position="apart" mb={20}>
                <Title order={3}>Active Projects</Title>
                <Group spacing={8}>
                  <Tooltip label="Refresh">
                    <ActionIcon variant="light" color="gray">
                      <IconRefresh size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="More options">
                    <ActionIcon variant="light" color="gray">
                      <IconDotsVertical size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>

              {projects.map((project) => (
                <Paper key={project.id} p="md" radius="md" withBorder mb={10}>
                  <Group position="apart" mb={10}>
                    <div>
                      <Text weight={600}>{project.name}</Text>
                      <Group spacing={8} mt={5}>
                        <Badge 
                          color={
                            project.status === 'Almost Done' ? 'teal' :
                            project.status === 'In Progress' ? 'blue' :
                            'orange'
                          }
                          variant="filled"
                          size="sm"
                        >
                          {project.status}
                        </Badge>
                        <Text size="xs" color="dimmed">Due: {project.dueDate}</Text>
                        <Badge size="sm" color="gray" variant="outline">
                          {project.members} members
                        </Badge>
                      </Group>
                    </div>
                    <Group spacing={8}>
                      <Tooltip label="View">
                        <ActionIcon size="sm" variant="subtle">
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Edit">
                        <ActionIcon size="sm" variant="subtle">
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>
                  <Progress 
                    value={project.progress} 
                    size="sm" 
                    color={
                      project.progress > 80 ? 'teal' :
                      project.progress > 40 ? 'blue' :
                      'orange'
                    }
                    radius="xl"
                  />
                  <Text size="xs" color="dimmed" align="right" mt={5}>
                    {project.progress}% complete
                  </Text>
                </Paper>
              ))}
              
              <Button 
                variant="subtle" 
                fullWidth 
                mt={10}
                leftIcon={<IconEye size={16} />}
              >
                View All Projects
              </Button>
            </Card>

            {/* Analytics Section */}
            <Card p="lg" radius="md" withBorder>
              <Group position="apart" mb={20}>
                <Title order={3}>Analytics Overview</Title>
                <Group spacing={8}>
                  <Tooltip label="Refresh">
                    <ActionIcon variant="light" color="gray">
                      <IconRefresh size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="More options">
                    <ActionIcon variant="light" color="gray">
                      <IconDotsVertical size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>

              <Tabs defaultValue="productivity">
                <Tabs.List mb={20}>
                  <Tabs.Tab value="productivity" icon={<IconChartBar size={14} />}>
                    Productivity
                  </Tabs.Tab>
                  <Tabs.Tab value="tasks" icon={<IconChartPie size={14} />}>
                    Tasks
                  </Tabs.Tab>
                  <Tabs.Tab value="activity" icon={<IconChartLine size={14} />}>
                    Activity
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="productivity">
                  <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
                    <Card p="md" radius="md" withBorder>
                      <Text size="sm" color="dimmed" mb={10}>Team Productivity</Text>
                      <RingProgress
                        sections={[{ value: 78, color: 'blue' }]}
                        label={
                          <Text size="xl" align="center" weight={700}>
                            78%
                          </Text>
                        }
                        size={140}
                        thickness={14}
                        roundCaps
                        sx={{ margin: '0 auto' }}
                      />
                      <Text size="xs" color="dimmed" align="center" mt={10}>
                        +12% from last month
                      </Text>
                    </Card>
                    <Card p="md" radius="md" withBorder>
                      <Text size="sm" color="dimmed" mb={10}>Tasks Completed</Text>
                      <RingProgress
                        sections={[{ value: 65, color: 'violet' }]}
                        label={
                          <Text size="xl" align="center" weight={700}>
                            65%
                          </Text>
                        }
                        size={140}
                        thickness={14}
                        roundCaps
                        sx={{ margin: '0 auto' }}
                      />
                      <Text size="xs" color="dimmed" align="center" mt={10}>
                        +5% from last month
                      </Text>
                    </Card>
                    <Card p="md" radius="md" withBorder>
                      <Text size="sm" color="dimmed" mb={10}>Time Utilization</Text>
                      <RingProgress
                        sections={[{ value: 82, color: 'teal' }]}
                        label={
                          <Text size="xl" align="center" weight={700}>
                            82%
                          </Text>
                        }
                        size={140}
                        thickness={14}
                        roundCaps
                        sx={{ margin: '0 auto' }}
                      />
                      <Text size="xs" color="dimmed" align="center" mt={10}>
                        +8% from last month
                      </Text>
                    </Card>
                  </SimpleGrid>
                </Tabs.Panel>

                <Tabs.Panel value="tasks">
                  <Text>Task distribution analytics will be displayed here.</Text>
                </Tabs.Panel>

                <Tabs.Panel value="activity">
                  <Text>Activity trend analytics will be displayed here.</Text>
                </Tabs.Panel>
              </Tabs>
            </Card>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col md={4} sm={12}>
            {/* Tasks Section */}
            <Card p="lg" radius="md" withBorder mb={20}>
              <Group position="apart" mb={20}>
                <Title order={3}>My Tasks</Title>
                <Button 
                  variant="subtle" 
                  compact
                  leftIcon={<IconPlus size={14} />}
                >
                  Add Task
                </Button>
              </Group>

              {tasks.map((task) => (
                <Group key={task.id} position="apart" mb={10}>
                  <Group>
                    <Checkbox 
                      checked={task.completed}
                      onChange={() => {}}
                      radius="xl"
                      size="md"
                    />
                    <div>
                      <Text 
                        size="sm" 
                        weight={500}
                        sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                      >
                        {task.title}
                      </Text>
                      <Group spacing={8} mt={3}>
                        <Badge 
                          size="xs" 
                          color={
                            task.priority === 'High' ? 'red' :
                            task.priority === 'Medium' ? 'yellow' :
                            'blue'
                          }
                        >
                          {task.priority}
                        </Badge>
                        <Text size="xs" color="dimmed">
                          Due: {task.dueDate}
                        </Text>
                      </Group>
                    </div>
                  </Group>
                  <Group spacing={5}>
                    <ActionIcon size="sm" variant="subtle">
                      <IconEdit size={14} />
                    </ActionIcon>
                    <ActionIcon size="sm" variant="subtle" color="red">
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Group>
              ))}

              <Button 
                variant="subtle" 
                fullWidth 
                mt={10}
                leftIcon={<IconEye size={16} />}
              >
                View All Tasks
              </Button>
            </Card>

            {/* Recent Activity */}
            <Card p="lg" radius="md" withBorder mb={20}>
              <Group position="apart" mb={20}>
                <Title order={3}>Recent Activity</Title>
                <Button 
                  variant="subtle" 
                  compact
                  rightIcon={<IconRefresh size={14} />}
                >
                  Refresh
                </Button>
              </Group>

              <Timeline active={4} bulletSize={24} lineWidth={2}>
                {recentActivity.map((activity) => (
                  <Timeline.Item
                    key={activity.id}
                    bullet={
                      <Avatar
                        size={24}
                        radius="xl"
                        src={activity.user.avatar}
                        color="blue"
                      >
                        {activity.user.initials}
                      </Avatar>
                    }
                    title={
                      <Text size="sm" weight={500}>
                        {activity.user.name}
                      </Text>
                    }
                  >
                    <Text size="xs" mt={4}>
                      {activity.action}{' '}
                      <Text component="span" weight={500} inherit>
                        {activity.target}
                      </Text>
                    </Text>
                    <Text size="xs" color="dimmed" mt={4}>
                      {activity.time}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>

              <Button 
                variant="subtle" 
                fullWidth 
                mt={10}
                leftIcon={<IconEye size={16} />}
              >
                View All Activity
              </Button>
            </Card>

            {/* Quick Links */}
            <Card p="lg" radius="md" withBorder>
              <Title order={3} mb={20}>Quick Links</Title>
              
              <SimpleGrid cols={2} spacing="md">
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  leftIcon={<IconUsers size={16} />}
                >
                  Team
                </Button>
                <Button
                  variant="light"
                  color="violet"
                  fullWidth
                  leftIcon={<IconCalendarEvent size={16} />}
                >
                  Calendar
                </Button>
                <Button
                  variant="light"
                  color="grape"
                  fullWidth
                  leftIcon={<IconMessage size={16} />}
                >
                  Messages
                </Button>
                <Button
                  variant="light"
                  color="orange"
                  fullWidth
                  leftIcon={<IconFile size={16} />}
                >
                  Documents
                </Button>
              </SimpleGrid>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
