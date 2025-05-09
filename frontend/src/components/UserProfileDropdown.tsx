import React, { useState } from 'react';
import { 
  Box, Popover, ActionIcon, Text, Group, 
  ThemeIcon, Divider, Button, Avatar, 
  UnstyledButton, Menu, Transition
} from '@mantine/core';
import { 
  IconUser, IconSettings, IconLogout, 
  IconChevronDown, IconHelp, IconFileText,
  IconBell, IconCreditCard, IconUsers
} from '@tabler/icons-react';

export default function UserProfileDropdown() {
  const [opened, setOpened] = useState(false);
  
  return (
    <Menu
      width={260}
      position="bottom-end"
      shadow="md"
      opened={opened}
      onChange={setOpened}
      closeOnItemClick
      styles={{
        dropdown: {
          padding: '8px 0',
          border: '1px solid #eee',
          borderRadius: 12,
          overflow: 'hidden'
        }
      }}
    >
      <Menu.Target>
        <UnstyledButton
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'background-color 150ms ease',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
          })}
        >
          <Avatar 
            src="https://via.placeholder.com/40" 
            radius="xl" 
            size="md"
            sx={{
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Box ml={10} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text weight={600} size="sm">Alex Johnson</Text>
            <Text size="xs" color="dimmed">alex@company.com</Text>
          </Box>
          <IconChevronDown size={14} style={{ marginLeft: 10 }} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Box p="md" sx={{ background: 'linear-gradient(135deg, #4158D0, #C850C0)', color: 'white' }}>
          <Group position="apart" mb={5}>
            <Text weight={700} size="lg">Alex Johnson</Text>
          </Group>
          <Text size="xs" color="white" opacity={0.8}>alex@company.com</Text>
          <Text size="xs" color="white" opacity={0.8}>Premium Plan</Text>
        </Box>

        <Menu.Item 
          icon={<IconUser size={16} />}
          component="a"
          href="/profile"
          sx={{ 
            fontWeight: 500,
            padding: '12px 16px',
            '&:hover': {
              background: 'rgba(65, 88, 208, 0.05)'
            }
          }}
        >
          My Profile
        </Menu.Item>
        
        <Menu.Item 
          icon={<IconUsers size={16} />}
          component="a"
          href="/teams"
          sx={{ 
            fontWeight: 500,
            padding: '12px 16px',
            '&:hover': {
              background: 'rgba(65, 88, 208, 0.05)'
            }
          }}
        >
          My Teams
        </Menu.Item>
        
        <Menu.Item 
          icon={<IconFileText size={16} />}
          component="a"
          href="/documents"
          sx={{ 
            fontWeight: 500,
            padding: '12px 16px',
            '&:hover': {
              background: 'rgba(65, 88, 208, 0.05)'
            }
          }}
        >
          My Documents
        </Menu.Item>
        
        <Menu.Item 
          icon={<IconBell size={16} />}
          component="a"
          href="/notifications"
          sx={{ 
            fontWeight: 500,
            padding: '12px 16px',
            '&:hover': {
              background: 'rgba(65, 88, 208, 0.05)'
            }
          }}
        >
          Notification Settings
        </Menu.Item>
        
        <Menu.Item 
          icon={<IconCreditCard size={16} />}
          component="a"
          href="/billing"
          sx={{ 
            fontWeight: 500,
            padding: '12px 16px',
            '&:hover': {
              background: 'rgba(65, 88, 208, 0.05)'
            }
          }}
        >
          Billing & Subscription
        </Menu.Item>
        
        <Divider my={5} />
        
        <Menu.Item 
          icon={<IconSettings size={16} />}
          component="a"
          href="/settings"
          sx={{ 
            fontWeight: 500,
            padding: '12px 16px',
            '&:hover': {
              background: 'rgba(65, 88, 208, 0.05)'
            }
          }}
        >
          Settings
        </Menu.Item>
        
        <Menu.Item 
          icon={<IconHelp size={16} />}
          component="a"
          href="/help"
          sx={{ 
            fontWeight: 500,
            padding: '12px 16px',
            '&:hover': {
              background: 'rgba(65, 88, 208, 0.05)'
            }
          }}
        >
          Help & Support
        </Menu.Item>
        
        <Divider my={5} />
        
        <Menu.Item 
          color="red"
          icon={<IconLogout size={16} />}
          component="a"
          href="/logout"
          sx={{ 
            fontWeight: 500,
            padding: '12px 16px',
            '&:hover': {
              background: 'rgba(255, 0, 0, 0.05)'
            }
          }}
        >
          Logout
        </Menu.Item>
        
        <Box p="md">
          <Button 
            fullWidth 
            variant="light" 
            color="blue" 
            radius="xl"
            component="a"
            href="/upgrade"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #3a4ec0, #b845af)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            Upgrade to Pro
          </Button>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
}
