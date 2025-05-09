import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Container,
  Title,
  Text,
  Card,
  Grid,
  Avatar,
  Group,
  Badge,
  Button,
  ActionIcon,
  Menu,
  Tabs,
  TextInput,
  Select,
  Modal,
  Textarea,
  Paper,
  Divider,
  Box,
  SimpleGrid,
  Progress,
  Tooltip
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconDotsVertical,
  IconMail,
  IconMessage,
  IconUserPlus,
  IconUserMinus,
  IconUserX,
  IconUserCheck,
  IconStar,
  IconStarOff,
  IconUsers,
  IconUsersGroup,
  IconBuildingSkyscraper,
  IconChartBar,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// Sample data for team members
const teamMembers = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'Product Manager',
    department: 'Product',
    avatar: null,
    status: 'active',
    joinedAt: '2023-05-10',
    lastActive: '2025-05-07T10:30:00',
    skills: ['Product Strategy', 'Roadmapping', 'User Research'],
    projects: 4,
    tasksCompleted: 28,
    tasksInProgress: 5
  },
  {
    id: 2,
    name: 'Sarah Miller',
    email: 'sarah.miller@example.com',
    role: 'Senior Developer',
    department: 'Engineering',
    avatar: null,
    status: 'active',
    joinedAt: '2023-02-15',
    lastActive: '2025-05-08T09:15:00',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    projects: 3,
    tasksCompleted: 42,
    tasksInProgress: 3
  },
  {
    id: 3,
    name: 'David Chen',
    email: 'david.chen@example.com',
    role: 'UX Designer',
    department: 'Design',
    avatar: null,
    status: 'active',
    joinedAt: '2023-08-22',
    lastActive: '2025-05-07T16:45:00',
    skills: ['UI/UX Design', 'Figma', 'User Testing', 'Wireframing'],
    projects: 5,
    tasksCompleted: 31,
    tasksInProgress: 2
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    role: 'Marketing Specialist',
    department: 'Marketing',
    avatar: null,
    status: 'active',
    joinedAt: '2024-01-08',
    lastActive: '2025-05-08T11:20:00',
    skills: ['Content Marketing', 'SEO', 'Social Media', 'Analytics'],
    projects: 2,
    tasksCompleted: 19,
    tasksInProgress: 4
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'Frontend Developer',
    department: 'Engineering',
    avatar: null,
    status: 'inactive',
    joinedAt: '2023-11-14',
    lastActive: '2025-04-28T14:10:00',
    skills: ['React', 'JavaScript', 'CSS', 'HTML'],
    projects: 3,
    tasksCompleted: 24,
    tasksInProgress: 0
  },
  {
    id: 6,
    name: 'Jennifer Lee',
    email: 'jennifer.lee@example.com',
    role: 'QA Engineer',
    department: 'Engineering',
    avatar: null,
    status: 'active',
    joinedAt: '2023-09-05',
    lastActive: '2025-05-08T08:45:00',
    skills: ['Test Automation', 'Manual Testing', 'Selenium', 'JIRA'],
    projects: 4,
    tasksCompleted: 36,
    tasksInProgress: 3
  },
  {
    id: 7,
    name: 'Robert Garcia',
    email: 'robert.garcia@example.com',
    role: 'Backend Developer',
    department: 'Engineering',
    avatar: null,
    status: 'active',
    joinedAt: '2023-07-19',
    lastActive: '2025-05-07T17:30:00',
    skills: ['Node.js', 'Python', 'MongoDB', 'AWS'],
    projects: 2,
    tasksCompleted: 29,
    tasksInProgress: 4
  },
  {
    id: 8,
    name: 'Lisa Wang',
    email: 'lisa.wang@example.com',
    role: 'Product Designer',
    department: 'Design',
    avatar: null,
    status: 'active',
    joinedAt: '2023-10-11',
    lastActive: '2025-05-08T10:05:00',
    skills: ['Product Design', 'Figma', 'Adobe XD', 'Prototyping'],
    projects: 3,
    tasksCompleted: 22,
    tasksInProgress: 2
  }
];

// Sample data for departments
const departments = [
  { value: 'all', label: 'All Departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Design', label: 'Design' },
  { value: 'Product', label: 'Product' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' }
];

// Sample data for roles
const roles = [
  { value: 'all', label: 'All Roles' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Designer', label: 'Designer' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Marketing Specialist', label: 'Marketing Specialist' },
  { value: 'QA Engineer', label: 'QA Engineer' }
];

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberDepartment, setNewMemberDepartment] = useState('');
  const [newMemberMessage, setNewMemberMessage] = useState('');

  // Filter and sort team members
  const filteredTeamMembers = teamMembers
    .filter((member) => {
      // Filter by search query
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by department
      const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
      
      // Filter by role
      const matchesRole = selectedRole === 'all' || member.role.includes(selectedRole);
      
      return matchesSearch && matchesDepartment && matchesRole;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'role') {
        return sortDirection === 'asc'
          ? a.role.localeCompare(b.role)
          : b.role.localeCompare(a.role);
      } else if (sortBy === 'department') {
        return sortDirection === 'asc'
          ? a.department.localeCompare(b.department)
          : b.department.localeCompare(a.department);
      } else if (sortBy === 'joinedAt') {
        return sortDirection === 'asc'
          ? new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
          : new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      }
      return 0;
    });

  // Handle invite submission
  const handleInviteSubmit = () => {
    // In a real app, this would send an API request to invite the user
    console.log('Inviting:', { email: newMemberEmail, role: newMemberRole, department: newMemberDepartment, message: newMemberMessage });
    
    // Reset form and close modal
    setNewMemberEmail('');
    setNewMemberRole('');
    setNewMemberDepartment('');
    setNewMemberMessage('');
    setInviteModalOpen(false);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Team Management | Stack</title>
        <meta name="description" content="Manage your team members, roles, and permissions" />
      </Head>

      <Container fluid px="md" py="xl">
        {/* Header */}
        <Grid mb={30}>
          <Grid.Col span={12}>
            <Card p="lg" radius="md" withBorder>
              <Group position="apart">
                <div>
                  <Title order={2} mb={5}>Team Management</Title>
                  <Text color="dimmed">Manage your team members, roles, and permissions</Text>
                </div>
                <Button
                  leftIcon={<IconUserPlus size={16} />}
                  onClick={() => setInviteModalOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Invite Team Member
                </Button>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Team Overview */}
        <SimpleGrid 
          cols={4} 
          breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'xs', cols: 1 }
          ]}
          mb={30}
        >
          <Card p="lg" radius="md" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" transform="uppercase" weight={700}>
                  Total Members
                </Text>
                <Text weight={700} size="xl" my={5}>
                  {teamMembers.length}
                </Text>
                <Text size="sm" color="dimmed">
                  Across {new Set(teamMembers.map(m => m.department)).size} departments
                </Text>
              </div>
              <ThemeIcon
                size={56}
                radius="md"
                color="blue"
                variant="light"
              >
                <IconUsers size={28} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card p="lg" radius="md" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" transform="uppercase" weight={700}>
                  Active Members
                </Text>
                <Text weight={700} size="xl" my={5}>
                  {teamMembers.filter(m => m.status === 'active').length}
                </Text>
                <Text size="sm" color="dimmed">
                  {Math.round((teamMembers.filter(m => m.status === 'active').length / teamMembers.length) * 100)}% of total
                </Text>
              </div>
              <ThemeIcon
                size={56}
                radius="md"
                color="teal"
                variant="light"
              >
                <IconUserCheck size={28} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card p="lg" radius="md" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" transform="uppercase" weight={700}>
                  Departments
                </Text>
                <Text weight={700} size="xl" my={5}>
                  {new Set(teamMembers.map(m => m.department)).size}
                </Text>
                <Text size="sm" color="dimmed">
                  With {new Set(teamMembers.map(m => m.role)).size} different roles
                </Text>
              </div>
              <ThemeIcon
                size={56}
                radius="md"
                color="violet"
                variant="light"
              >
                <IconBuildingSkyscraper size={28} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card p="lg" radius="md" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" transform="uppercase" weight={700}>
                  Avg. Productivity
                </Text>
                <Text weight={700} size="xl" my={5}>
                  87%
                </Text>
                <Text size="sm" color="dimmed">
                  Based on tasks completion rate
                </Text>
              </div>
              <ThemeIcon
                size={56}
                radius="md"
                color="orange"
                variant="light"
              >
                <IconChartBar size={28} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Team Members List */}
        <Card p="lg" radius="md" withBorder mb={30}>
          <Group position="apart" mb={20}>
            <Title order={3}>Team Members</Title>
            
            <Group spacing={10}>
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <Button variant="light" leftIcon={<IconFilter size={16} />} compact>
                    Filter
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Status</Menu.Label>
                  <Menu.Item icon={<IconCheck size={14} />}>Active</Menu.Item>
                  <Menu.Item icon={<IconX size={14} />}>Inactive</Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Sort By</Menu.Label>
                  <Menu.Item 
                    icon={<IconSortAscending size={14} />}
                    onClick={() => {
                      setSortBy('name');
                      setSortDirection('asc');
                    }}
                  >
                    Name (A-Z)
                  </Menu.Item>
                  <Menu.Item 
                    icon={<IconSortDescending size={14} />}
                    onClick={() => {
                      setSortBy('name');
                      setSortDirection('desc');
                    }}
                  >
                    Name (Z-A)
                  </Menu.Item>
                  <Menu.Item 
                    icon={<IconSortAscending size={14} />}
                    onClick={() => {
                      setSortBy('joinedAt');
                      setSortDirection('asc');
                    }}
                  >
                    Newest First
                  </Menu.Item>
                  <Menu.Item 
                    icon={<IconSortDescending size={14} />}
                    onClick={() => {
                      setSortBy('joinedAt');
                      setSortDirection('desc');
                    }}
                  >
                    Oldest First
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>

          <Group mb={20} position="apart">
            <TextInput
              placeholder="Search by name, email, or role"
              icon={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: '100%', maxWidth: 400 }}
            />
            
            <Group spacing={10}>
              <Select
                placeholder="Department"
                data={departments}
                value={selectedDepartment}
                onChange={(value) => setSelectedDepartment(value || 'all')}
                clearable
                sx={{ width: 180 }}
              />
              
              <Select
                placeholder="Role"
                data={roles}
                value={selectedRole}
                onChange={(value) => setSelectedRole(value || 'all')}
                clearable
                sx={{ width: 180 }}
              />
            </Group>
          </Group>

          <Divider mb={20} />

          {filteredTeamMembers.length === 0 ? (
            <Text align="center" color="dimmed" py={30}>
              No team members match your search criteria
            </Text>
          ) : (
            <div>
              {filteredTeamMembers.map((member) => (
                <Paper key={member.id} p="md" radius="md" withBorder mb={15}>
                  <Grid>
                    <Grid.Col md={6} sm={12}>
                      <Group>
                        <Avatar 
                          src={member.avatar} 
                          radius="xl" 
                          size="lg" 
                          color={member.status === 'active' ? 'blue' : 'gray'}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        
                        <div>
                          <Group spacing={8}>
                            <Text weight={600}>{member.name}</Text>
                            {member.status === 'active' ? (
                              <Badge color="green" size="xs">Active</Badge>
                            ) : (
                              <Badge color="gray" size="xs">Inactive</Badge>
                            )}
                          </Group>
                          
                          <Text size="sm" color="dimmed">{member.email}</Text>
                          
                          <Group spacing={8} mt={5}>
                            <Badge color="blue" size="sm">{member.role}</Badge>
                            <Badge color="violet" size="sm" variant="outline">{member.department}</Badge>
                          </Group>
                        </div>
                      </Group>
                    </Grid.Col>
                    
                    <Grid.Col md={4} sm={8} xs={12}>
                      <Group spacing={5} noWrap>
                        <Box sx={{ flex: 1 }}>
                          <Text size="xs" color="dimmed" mb={5}>Productivity</Text>
                          <Progress 
                            value={Math.round((member.tasksCompleted / (member.tasksCompleted + member.tasksInProgress)) * 100)} 
                            size="sm" 
                            color="teal" 
                            radius="xl" 
                          />
                        </Box>
                        
                        <Box sx={{ width: 70, textAlign: 'right' }}>
                          <Text size="sm" weight={600}>
                            {Math.round((member.tasksCompleted / (member.tasksCompleted + member.tasksInProgress)) * 100)}%
                          </Text>
                        </Box>
                      </Group>
                      
                      <Group position="apart" mt={10}>
                        <Text size="xs">Projects: {member.projects}</Text>
                        <Text size="xs">Tasks: {member.tasksCompleted + member.tasksInProgress}</Text>
                      </Group>
                    </Grid.Col>
                    
                    <Grid.Col md={2} sm={4} xs={12}>
                      <Group position="right" spacing={8}>
                        <Tooltip label="Send email">
                          <ActionIcon color="blue" variant="light">
                            <IconMail size={18} />
                          </ActionIcon>
                        </Tooltip>
                        
                        <Tooltip label="Send message">
                          <ActionIcon color="teal" variant="light">
                            <IconMessage size={18} />
                          </ActionIcon>
                        </Tooltip>
                        
                        <Menu position="bottom-end" shadow="md">
                          <Menu.Target>
                            <ActionIcon>
                              <IconDotsVertical size={18} />
                            </ActionIcon>
                          </Menu.Target>
                          
                          <Menu.Dropdown>
                            <Menu.Label>Member Actions</Menu.Label>
                            <Menu.Item icon={<IconStar size={14} />}>
                              Make Admin
                            </Menu.Item>
                            <Menu.Item icon={<IconUserX size={14} />}>
                              {member.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item icon={<IconUserMinus size={14} />} color="red">
                              Remove from Team
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Paper>
              ))}
            </div>
          )}
        </Card>

        {/* Invite Member Modal */}
        <Modal
          opened={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          title="Invite Team Member"
          size="md"
        >
          <TextInput
            label="Email Address"
            placeholder="colleague@example.com"
            required
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            mb={15}
          />
          
          <Select
            label="Role"
            placeholder="Select a role"
            data={roles.filter(r => r.value !== 'all')}
            value={newMemberRole}
            onChange={(value) => setNewMemberRole(value || '')}
            mb={15}
            required
          />
          
          <Select
            label="Department"
            placeholder="Select a department"
            data={departments.filter(d => d.value !== 'all')}
            value={newMemberDepartment}
            onChange={(value) => setNewMemberDepartment(value || '')}
            mb={15}
            required
          />
          
          <Textarea
            label="Personal Message (Optional)"
            placeholder="Add a personal message to the invitation email"
            value={newMemberMessage}
            onChange={(e) => setNewMemberMessage(e.target.value)}
            mb={20}
            minRows={3}
          />
          
          <Group position="right">
            <Button variant="subtle" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleInviteSubmit}
              disabled={!newMemberEmail || !newMemberRole || !newMemberDepartment}
              sx={{
                background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              }}
            >
              Send Invitation
            </Button>
          </Group>
        </Modal>
      </Container>
    </DashboardLayout>
  );
}
