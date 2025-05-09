import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Group,
  Box,
  UnstyledButton,
  ThemeIcon,
  Avatar,
  Menu,
  Divider,
  ActionIcon,
  Tooltip,
  Badge,
  Indicator
} from '@mantine/core';
import {
  IconDashboard,
  IconUsers,
  IconCalendarEvent,
  IconMessage,
  IconFile,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconBell,
  IconSearch,
  IconHelp,
  IconUser,
  IconSwitchHorizontal,
  IconMoon,
  IconSun,
  IconBrandSlack,
  IconBrandZoom,
  IconBrandGithub,
  IconBrandTrello,
  IconBrandAsana,
  IconApps
} from '@tabler/icons-react';

// Define the navigation items
const mainNavItems = [
  { icon: IconDashboard, color: 'blue', label: 'Dashboard', link: '/dashboard' },
  { icon: IconUsers, color: 'teal', label: 'Team', link: '/dashboard/team' },
  { icon: IconCalendarEvent, color: 'violet', label: 'Calendar', link: '/dashboard/calendar' },
  { icon: IconMessage, color: 'grape', label: 'Messages', link: '/dashboard/messages', notifications: 3 },
  { icon: IconFile, color: 'orange', label: 'Documents', link: '/dashboard/documents' },
];

const settingsNavItems = [
  { icon: IconSettings, color: 'gray', label: 'Settings', link: '/dashboard/settings' },
  { icon: IconHelp, color: 'gray', label: 'Help & Support', link: '/dashboard/support' },
];

// Define the integrations
const integrations = [
  { icon: IconBrandSlack, color: '#4A154B', label: 'Slack', connected: true },
  { icon: IconBrandZoom, color: '#2D8CFF', label: 'Zoom', connected: true },
  { icon: IconBrandGithub, color: '#24292E', label: 'GitHub', connected: false },
  { icon: IconBrandTrello, color: '#0079BF', label: 'Trello', connected: true },
  { icon: IconBrandAsana, color: '#F06A6A', label: 'Asana', connected: false },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        router.push('/auth/login');
        return;
      }
      
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Failed to parse user data', err);
        router.push('/auth/login');
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would apply the theme change here
  };

  // If user is not loaded yet, don't render anything
  if (!user) {
    return null;
  }

  return (
    <AppShell
      styles={{
        main: {
          background: darkMode ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 250, lg: 280 }}
          sx={(theme) => ({
            backgroundColor: darkMode ? theme.colors.dark[7] : theme.white,
            transition: 'width 200ms ease, min-width 200ms ease',
          })}
        >
          <Navbar.Section mt="xs">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                marginBottom: 20,
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 20,
                  color: 'white',
                  marginRight: 10,
                  boxShadow: '0 4px 10px rgba(65, 88, 208, 0.2)'
                }}
              >
                S
              </Box>
              <Text weight={700} size="xl" sx={{ color: darkMode ? theme.white : theme.black }}>
                Stack
              </Text>
            </Box>
          </Navbar.Section>

          <Navbar.Section
            grow
            sx={{
              paddingBottom: theme.spacing.sm,
            }}
          >
            <Box>
              <Text
                size="xs"
                weight={500}
                color="dimmed"
                sx={{ textTransform: 'uppercase', marginBottom: 10, marginLeft: 10 }}
              >
                Main
              </Text>

              {mainNavItems.map((item) => (
                <UnstyledButton
                  key={item.label}
                  component={Link}
                  href={item.link}
                  sx={(theme) => ({
                    display: 'block',
                    width: '100%',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color: darkMode ? theme.colors.dark[0] : theme.black,
                    backgroundColor: router.pathname === item.link 
                      ? darkMode ? theme.colors.dark[6] : theme.colors.gray[0]
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: darkMode ? theme.colors.dark[6] : theme.colors.gray[0],
                    },
                    marginBottom: 5,
                  })}
                >
                  <Group>
                    <ThemeIcon color={item.color} variant="light" size={32}>
                      <item.icon size={18} />
                    </ThemeIcon>
                    <Box sx={{ flex: 1 }}>
                      <Text size="sm" weight={500}>
                        {item.label}
                      </Text>
                    </Box>
                    {item.notifications && (
                      <Badge color="red" variant="filled" size="sm">
                        {item.notifications}
                      </Badge>
                    )}
                  </Group>
                </UnstyledButton>
              ))}

              <Text
                size="xs"
                weight={500}
                color="dimmed"
                sx={{ textTransform: 'uppercase', marginTop: 20, marginBottom: 10, marginLeft: 10 }}
              >
                Integrations
              </Text>

              <Menu
                shadow="md"
                width={200}
                position="right-start"
                offset={10}
                withArrow
              >
                <Menu.Target>
                  <UnstyledButton
                    sx={(theme) => ({
                      display: 'block',
                      width: '100%',
                      padding: theme.spacing.xs,
                      borderRadius: theme.radius.sm,
                      color: darkMode ? theme.colors.dark[0] : theme.black,
                      '&:hover': {
                        backgroundColor: darkMode ? theme.colors.dark[6] : theme.colors.gray[0],
                      },
                      marginBottom: 5,
                    })}
                  >
                    <Group>
                      <ThemeIcon color="cyan" variant="light" size={32}>
                        <IconApps size={18} />
                      </ThemeIcon>
                      <Box sx={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                          Integrations
                        </Text>
                      </Box>
                      <IconChevronRight size={16} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  {integrations.map((integration) => (
                    <Menu.Item
                      key={integration.label}
                      icon={
                        <ThemeIcon
                          size={24}
                          radius="xl"
                          sx={{ backgroundColor: integration.color }}
                        >
                          <integration.icon size={16} color="#fff" />
                        </ThemeIcon>
                      }
                      rightSection={
                        integration.connected ? (
                          <Badge size="xs" color="teal" variant="filled">
                            Connected
                          </Badge>
                        ) : (
                          <Badge size="xs" color="gray" variant="outline">
                            Connect
                          </Badge>
                        )
                      }
                    >
                      {integration.label}
                    </Menu.Item>
                  ))}
                  <Divider />
                  <Menu.Item icon={<IconSettings size={16} />}>
                    Manage Integrations
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <Text
                size="xs"
                weight={500}
                color="dimmed"
                sx={{ textTransform: 'uppercase', marginTop: 20, marginBottom: 10, marginLeft: 10 }}
              >
                Settings
              </Text>

              {settingsNavItems.map((item) => (
                <UnstyledButton
                  key={item.label}
                  component={Link}
                  href={item.link}
                  sx={(theme) => ({
                    display: 'block',
                    width: '100%',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color: darkMode ? theme.colors.dark[0] : theme.black,
                    backgroundColor: router.pathname === item.link 
                      ? darkMode ? theme.colors.dark[6] : theme.colors.gray[0]
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: darkMode ? theme.colors.dark[6] : theme.colors.gray[0],
                    },
                    marginBottom: 5,
                  })}
                >
                  <Group>
                    <ThemeIcon color={item.color} variant="light" size={32}>
                      <item.icon size={18} />
                    </ThemeIcon>
                    <Box sx={{ flex: 1 }}>
                      <Text size="sm" weight={500}>
                        {item.label}
                      </Text>
                    </Box>
                  </Group>
                </UnstyledButton>
              ))}
            </Box>
          </Navbar.Section>

          <Navbar.Section>
            <Divider mb="sm" />
            <UnstyledButton
              sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: darkMode ? theme.colors.dark[0] : theme.black,
                '&:hover': {
                  backgroundColor: darkMode ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              })}
              onClick={handleLogout}
            >
              <Group>
                <Avatar
                  src={null}
                  alt={user.name}
                  color="blue"
                  radius="xl"
                >
                  {user.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {user.name}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {user.email}
                  </Text>
                </Box>
                <Menu shadow="md" width={200} position="top-end">
                  <Menu.Target>
                    <ActionIcon>
                      <IconChevronRight size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item>
                    <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
                    <Menu.Item icon={<IconSwitchHorizontal size={14} />}>
                      Switch account
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item 
                      icon={darkMode ? <IconSun size={14} /> : <IconMoon size={14} />}
                      onClick={toggleDarkMode}
                    >
                      {darkMode ? 'Light mode' : 'Dark mode'}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item 
                      color="red" 
                      icon={<IconLogout size={14} />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </UnstyledButton>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="md" sx={(theme) => ({
          backgroundColor: darkMode ? theme.colors.dark[7] : theme.white,
          borderBottom: `1px solid ${darkMode ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        })}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Group>
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Text weight={700} size="lg" sx={{ color: darkMode ? theme.white : theme.black }}>
                  {router.pathname === '/dashboard' ? 'Dashboard' : 
                   router.pathname === '/dashboard/team' ? 'Team' :
                   router.pathname === '/dashboard/calendar' ? 'Calendar' :
                   router.pathname === '/dashboard/messages' ? 'Messages' :
                   router.pathname === '/dashboard/documents' ? 'Documents' :
                   router.pathname === '/dashboard/settings' ? 'Settings' :
                   router.pathname === '/dashboard/support' ? 'Help & Support' :
                   'Dashboard'}
                </Text>
              </MediaQuery>
            </Group>

            <Group>
              <Tooltip label="Search" position="bottom">
                <ActionIcon size="lg" variant="subtle">
                  <IconSearch size={20} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="Notifications" position="bottom">
                <Indicator color="red" size={10} offset={4} withBorder>
                  <ActionIcon size="lg" variant="subtle">
                    <IconBell size={20} />
                  </ActionIcon>
                </Indicator>
              </Tooltip>
            </Group>
          </div>
        </Header>
      }
      footer={
        <Footer height={60} p="md" sx={(theme) => ({
          backgroundColor: darkMode ? theme.colors.dark[7] : theme.white,
          borderTop: `1px solid ${darkMode ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        })}>
          <Group position="apart" sx={{ height: '100%' }}>
            <Text color="dimmed" size="sm">
              © 2025 Stack, Inc. All rights reserved.
            </Text>
            <Group spacing="xs">
              <Tooltip label="Documentation" position="top">
                <ActionIcon size="md" variant="subtle">
                  <IconFile size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Support" position="top">
                <ActionIcon size="md" variant="subtle">
                  <IconHelp size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Footer>
      }
    >
      {children}
    </AppShell>
  );
}
