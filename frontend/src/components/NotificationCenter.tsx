import React, { useState, useEffect } from 'react';
import { 
  Box, Popover, ActionIcon, Badge, 
  Text, Group, ThemeIcon, Divider, 
  Button, Avatar, Indicator, Transition,
  ScrollArea, Card
} from '@mantine/core';
import { 
  IconBell, IconX, IconCheck, IconFileText, 
  IconUsers, IconMessage, IconSettings, IconClock
} from '@tabler/icons-react';

// Sample notification data
const initialNotifications = [
  {
    id: 1,
    type: 'mention',
    title: 'John mentioned you in a comment',
    description: '"@you Can you review this document when you have a chance?"',
    time: '10 minutes ago',
    read: false,
    avatar: 'https://via.placeholder.com/40',
    icon: <IconMessage size={16} />,
    color: '#4158D0'
  },
  {
    id: 2,
    type: 'share',
    title: 'Sarah shared a document with you',
    description: 'Q2 Marketing Strategy.docx',
    time: '1 hour ago',
    read: false,
    avatar: 'https://via.placeholder.com/40',
    icon: <IconFileText size={16} />,
    color: '#C850C0'
  },
  {
    id: 3,
    type: 'invite',
    title: 'Team invitation',
    description: 'You have been invited to join the Product team',
    time: '3 hours ago',
    read: true,
    avatar: 'https://via.placeholder.com/40',
    icon: <IconUsers size={16} />,
    color: '#6C63FF'
  },
  {
    id: 4,
    type: 'system',
    title: 'System update completed',
    description: 'Stack has been updated to version 2.4.0',
    time: 'Yesterday',
    read: true,
    avatar: null,
    icon: <IconSettings size={16} />,
    color: '#FF6B6B'
  },
  {
    id: 5,
    type: 'reminder',
    title: 'Meeting reminder',
    description: 'Weekly team sync in 30 minutes',
    time: 'Yesterday',
    read: true,
    avatar: null,
    icon: <IconClock size={16} />,
    color: '#20C997'
  }
];

export default function NotificationCenter() {
  const [opened, setOpened] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  
  // Count unread notifications
  useEffect(() => {
    const unreadCount = notifications.filter(notification => !notification.read).length;
    setNewNotificationCount(unreadCount);
  }, [notifications]);
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };
  
  // Mark a single notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Delete a notification
  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
  };
  
  // Simulate receiving a new notification
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddNotification = Math.random() > 0.7; // 30% chance
      
      if (shouldAddNotification) {
        const newNotification = {
          id: Date.now(),
          type: 'mention',
          title: 'New notification',
          description: 'You have a new activity in your account',
          time: 'Just now',
          read: false,
          avatar: 'https://via.placeholder.com/40',
          icon: <IconMessage size={16} />,
          color: '#4158D0'
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setShowNewNotification(true);
        
        setTimeout(() => {
          setShowNewNotification(false);
        }, 3000);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Box sx={{ position: 'relative' }}>
      <Popover
        opened={opened}
        onChange={setOpened}
        width={350}
        position="bottom-end"
        shadow="md"
        withArrow
        trapFocus={false}
        closeOnEscape
        transition="pop-top-right"
        styles={{
          dropdown: {
            padding: 0,
            border: '1px solid #eee',
            borderRadius: 12,
            overflow: 'hidden'
          }
        }}
      >
        <Popover.Target>
          <Indicator
            inline
            label={newNotificationCount > 0 ? newNotificationCount : undefined}
            size={16}
            disabled={newNotificationCount === 0}
            color="red"
            withBorder
            processing={showNewNotification}
            sx={{ cursor: 'pointer' }}
          >
            <ActionIcon 
              size="lg" 
              radius="xl" 
              variant="light" 
              onClick={() => setOpened((o) => !o)}
              sx={{
                color: opened ? '#4158D0' : undefined,
                background: opened ? 'rgba(65, 88, 208, 0.1)' : undefined,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(65, 88, 208, 0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <IconBell size={20} />
            </ActionIcon>
          </Indicator>
        </Popover.Target>
        
        <Popover.Dropdown>
          <Box 
            p="md" 
            sx={{ 
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              color: 'white'
            }}
          >
            <Group position="apart">
              <Text weight={700} size="lg">Notifications</Text>
              {newNotificationCount > 0 && (
                <Button 
                  variant="white" 
                  compact 
                  radius="xl"
                  leftIcon={<IconCheck size={14} />}
                  onClick={markAllAsRead}
                  sx={{
                    fontWeight: 600,
                    fontSize: 12,
                    color: '#4158D0',
                    '&:hover': {
                      background: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  Mark all as read
                </Button>
              )}
            </Group>
          </Box>
          
          <ScrollArea style={{ height: 400 }} offsetScrollbars>
            {notifications.length === 0 ? (
              <Box p="xl" sx={{ textAlign: 'center' }}>
                <ThemeIcon 
                  size={60} 
                  radius="xl" 
                  color="gray" 
                  variant="light"
                  mx="auto"
                  mb="md"
                >
                  <IconBell size={30} />
                </ThemeIcon>
                <Text weight={600} mb={5}>No notifications</Text>
                <Text size="sm" color="dimmed">
                  You're all caught up! Check back later for new updates.
                </Text>
              </Box>
            ) : (
              notifications.map((notification) => (
                <Box key={notification.id}>
                  <Box 
                    p="md" 
                    sx={{ 
                      position: 'relative',
                      background: notification.read ? 'white' : 'rgba(65, 88, 208, 0.05)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(65, 88, 208, 0.05)',
                      }
                    }}
                  >
                    <Group noWrap align="flex-start">
                      {notification.avatar ? (
                        <Avatar src={notification.avatar} radius="xl" size="md" />
                      ) : (
                        <ThemeIcon 
                          size={40} 
                          radius="xl" 
                          sx={{ background: notification.color }}
                        >
                          {notification.icon}
                        </ThemeIcon>
                      )}
                      
                      <Box sx={{ flex: 1 }}>
                        <Group position="apart" mb={5}>
                          <Text weight={600} size="sm">
                            {notification.title}
                          </Text>
                          <Text size="xs" color="dimmed">
                            {notification.time}
                          </Text>
                        </Group>
                        
                        <Text size="sm" color="dimmed" lineClamp={2}>
                          {notification.description}
                        </Text>
                        
                        {!notification.read && (
                          <Badge 
                            size="xs" 
                            variant="filled" 
                            color="red" 
                            mt={5}
                            sx={{ textTransform: 'uppercase' }}
                          >
                            New
                          </Badge>
                        )}
                      </Box>
                      
                      <Group spacing={5} sx={{ alignSelf: 'flex-start' }}>
                        {!notification.read && (
                          <ActionIcon 
                            size="sm" 
                            radius="xl" 
                            color="blue" 
                            variant="light"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <IconCheck size={14} />
                          </ActionIcon>
                        )}
                        
                        <ActionIcon 
                          size="sm" 
                          radius="xl" 
                          color="red" 
                          variant="light"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <IconX size={14} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Box>
                  <Divider />
                </Box>
              ))
            )}
          </ScrollArea>
          
          <Box p="md">
            <Button 
              fullWidth 
              variant="light" 
              color="blue" 
              radius="xl"
              component="a"
              href="/notifications"
              sx={{
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              View All Notifications
            </Button>
          </Box>
        </Popover.Dropdown>
      </Popover>
      
      <Transition
        mounted={showNewNotification}
        transition="slide-up"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Card
            style={{
              ...styles,
              position: 'absolute',
              top: 50,
              right: 0,
              zIndex: 1000,
              width: 300
            }}
            withBorder
            radius="md"
            p="sm"
            shadow="lg"
          >
            <Group noWrap>
              <ThemeIcon 
                size={40} 
                radius="xl" 
                sx={{ background: '#4158D0' }}
              >
                <IconMessage size={20} />
              </ThemeIcon>
              
              <Box sx={{ flex: 1 }}>
                <Text weight={600} size="sm">
                  New notification
                </Text>
                <Text size="xs" color="dimmed">
                  You have a new activity in your account
                </Text>
              </Box>
              
              <ActionIcon 
                size="sm" 
                radius="xl" 
                color="gray" 
                variant="light"
                onClick={() => setShowNewNotification(false)}
              >
                <IconX size={14} />
              </ActionIcon>
            </Group>
          </Card>
        )}
      </Transition>
    </Box>
  );
}
