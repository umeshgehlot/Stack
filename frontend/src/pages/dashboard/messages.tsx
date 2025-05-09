import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import {
  Container, Grid, Card, Text, Group, Avatar, TextInput,
  Button, ActionIcon, Menu, Divider, Tabs, Badge, ScrollArea,
  Paper, Tooltip, Box, Title, Textarea, Modal, Select
} from '@mantine/core';
import {
  IconSearch, IconDotsVertical, IconSend, IconMicrophone,
  IconPaperclip, IconPhoto, IconFile, IconChevronDown,
  IconPlus, IconUsers, IconUserPlus, IconSettings, IconX,
  IconCheck, IconBell, IconBellOff, IconPin, IconStar,
  IconStarOff, IconArrowsMaximize, IconInfoCircle, IconPhone,
  IconVideo, IconMessage, IconMessageCircle
} from '@tabler/icons-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// Sample data for conversations
const conversations = [
  {
    id: 1,
    type: 'direct',
    name: 'Alex Johnson',
    avatar: null,
    status: 'online',
    lastMessage: 'Can you review the marketing strategy document?',
    timestamp: '10:30 AM',
    unread: 2,
    pinned: true
  },
  {
    id: 2,
    type: 'direct',
    name: 'Sarah Miller',
    avatar: null,
    status: 'online',
    lastMessage: 'I've updated the React components',
    timestamp: 'Yesterday',
    unread: 0,
    pinned: false
  },
  {
    id: 3,
    type: 'group',
    name: 'Product Team',
    avatar: null,
    participants: ['Alex Johnson', 'Sarah Miller', 'David Chen', 'You'],
    lastMessage: 'David: Let's discuss the roadmap tomorrow',
    timestamp: 'Yesterday',
    unread: 5,
    pinned: true
  },
  {
    id: 4,
    type: 'direct',
    name: 'David Chen',
    avatar: null,
    status: 'offline',
    lastMessage: 'The design mockups look great!',
    timestamp: 'Monday',
    unread: 0,
    pinned: false
  },
  {
    id: 5,
    type: 'direct',
    name: 'Emma Wilson',
    avatar: null,
    status: 'away',
    lastMessage: 'I'll prepare the marketing assets',
    timestamp: 'Monday',
    unread: 0,
    pinned: false
  },
  {
    id: 6,
    type: 'group',
    name: 'Marketing Campaign',
    avatar: null,
    participants: ['Emma Wilson', 'Alex Johnson', 'Jennifer Lee', 'You'],
    lastMessage: 'Emma: The social media posts are scheduled',
    timestamp: 'Last week',
    unread: 0,
    pinned: false
  },
  {
    id: 7,
    type: 'direct',
    name: 'Michael Brown',
    avatar: null,
    status: 'offline',
    lastMessage: 'Let me know when you've deployed the changes',
    timestamp: 'Last week',
    unread: 0,
    pinned: false
  },
  {
    id: 8,
    type: 'direct',
    name: 'Jennifer Lee',
    avatar: null,
    status: 'online',
    lastMessage: 'The QA testing is complete',
    timestamp: 'Last week',
    unread: 0,
    pinned: false
  }
];

// Sample data for messages in the current conversation
const messages = [
  {
    id: 1,
    sender: {
      id: 2,
      name: 'Alex Johnson',
      avatar: null
    },
    content: 'Hi there! Can you review the marketing strategy document I shared yesterday?',
    timestamp: '10:30 AM',
    status: 'read'
  },
  {
    id: 2,
    sender: {
      id: 1,
      name: 'You',
      avatar: null
    },
    content: 'Sure, I'll take a look at it today. Is there anything specific you want me to focus on?',
    timestamp: '10:32 AM',
    status: 'read'
  },
  {
    id: 3,
    sender: {
      id: 2,
      name: 'Alex Johnson',
      avatar: null
    },
    content: 'Yes, please pay special attention to the Q3 campaign ideas. I want to make sure they align with our product roadmap.',
    timestamp: '10:35 AM',
    status: 'read'
  },
  {
    id: 4,
    sender: {
      id: 2,
      name: 'Alex Johnson',
      avatar: null
    },
    content: 'Also, check if the budget allocations make sense based on our previous campaigns' performance.',
    timestamp: '10:36 AM',
    status: 'read'
  },
  {
    id: 5,
    sender: {
      id: 1,
      name: 'You',
      avatar: null
    },
    content: 'Got it. I'll review both the campaign ideas and budget allocations. I should be able to provide feedback by end of day.',
    timestamp: '10:40 AM',
    status: 'read'
  },
  {
    id: 6,
    sender: {
      id: 2,
      name: 'Alex Johnson',
      avatar: null
    },
    content: 'Perfect, thank you! Let me know if you have any questions.',
    timestamp: '10:42 AM',
    status: 'read'
  },
  {
    id: 7,
    sender: {
      id: 2,
      name: 'Alex Johnson',
      avatar: null
    },
    content: 'By the way, are you joining the team meeting at 2 PM?',
    timestamp: '10:45 AM',
    status: 'delivered'
  }
];

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [newGroupModalOpen, setNewGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages on load and when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter conversations based on search query and active tab
  const filteredConversations = conversations
    .filter((conversation) => {
      // Filter by search query
      const matchesSearch = conversation.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by tab
      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'unread' && conversation.unread > 0) ||
        (activeTab === 'direct' && conversation.type === 'direct') ||
        (activeTab === 'groups' && conversation.type === 'group');
      
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      // Sort pinned conversations first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then sort by unread messages
      if (a.unread > 0 && b.unread === 0) return -1;
      if (a.unread === 0 && b.unread > 0) return 1;
      
      // Default sort by timestamp (would need to convert to Date objects in a real app)
      return 0;
    });

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // In a real app, this would send an API request to save the message
    console.log('Sending message:', messageText);
    
    // Clear the input
    setMessageText('');
  };

  // Handle creating a new group
  const handleCreateGroup = () => {
    // In a real app, this would send an API request to create a new group
    console.log('Creating group:', { name: newGroupName, members: selectedContacts });
    
    // Reset form and close modal
    setNewGroupName('');
    setSelectedContacts([]);
    setNewGroupModalOpen(false);
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    // In a real app, this would format the timestamp based on how long ago it was
    return timestamp;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'green';
      case 'away':
        return 'orange';
      case 'offline':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Messages | Stack</title>
        <meta name="description" content="Chat with your team members" />
      </Head>

      <Container fluid px={0} py={0} sx={{ height: 'calc(100vh - 120px)' }}>
        <Grid gutter={0} sx={{ height: '100%' }}>
          {/* Conversations Sidebar */}
          <Grid.Col span={3} sx={{ borderRight: '1px solid #e9ecef', height: '100%' }}>
            <Card p="md" radius={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <Group position="apart" mb="md">
                <Title order={4}>Messages</Title>
                <Group spacing={5}>
                  <Tooltip label="New Chat">
                    <ActionIcon onClick={() => setNewChatModalOpen(true)}>
                      <IconMessage size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="New Group">
                    <ActionIcon onClick={() => setNewGroupModalOpen(true)}>
                      <IconUsers size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Menu position="bottom-end" shadow="md">
                    <Menu.Target>
                      <ActionIcon>
                        <IconDotsVertical size={18} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item icon={<IconSettings size={14} />}>
                        Message Settings
                      </Menu.Item>
                      <Menu.Item icon={<IconBellOff size={14} />}>
                        Mute Notifications
                      </Menu.Item>
                      <Menu.Item icon={<IconArrowsMaximize size={14} />}>
                        Expand View
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Group>

              {/* Search */}
              <TextInput
                placeholder="Search messages"
                icon={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                mb="md"
              />

              {/* Tabs */}
              <Tabs value={activeTab} onTabChange={setActiveTab} mb="md">
                <Tabs.List>
                  <Tabs.Tab value="all">All</Tabs.Tab>
                  <Tabs.Tab 
                    value="unread" 
                    rightSection={
                      <Badge size="xs" variant="filled" color="red">
                        {conversations.reduce((acc, conv) => acc + conv.unread, 0)}
                      </Badge>
                    }
                  >
                    Unread
                  </Tabs.Tab>
                  <Tabs.Tab value="direct">Direct</Tabs.Tab>
                  <Tabs.Tab value="groups">Groups</Tabs.Tab>
                </Tabs.List>
              </Tabs>

              {/* Conversations List */}
              <ScrollArea sx={{ flex: 1 }}>
                {filteredConversations.length === 0 ? (
                  <Text align="center" color="dimmed" py={30}>
                    No conversations match your search
                  </Text>
                ) : (
                  filteredConversations.map((conversation) => (
                    <Paper
                      key={conversation.id}
                      p="sm"
                      withBorder={activeConversation.id === conversation.id}
                      sx={(theme) => ({
                        cursor: 'pointer',
                        backgroundColor: activeConversation.id === conversation.id 
                          ? theme.colors.blue[0] 
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: theme.colors.gray[0],
                        },
                        marginBottom: 5,
                        borderRadius: theme.radius.sm,
                      })}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <Group position="apart" noWrap>
                        <Group noWrap>
                          <Box sx={{ position: 'relative' }}>
                            <Avatar 
                              src={conversation.avatar} 
                              radius="xl" 
                              color={conversation.type === 'direct' ? 'blue' : 'violet'}
                            >
                              {conversation.type === 'direct' 
                                ? getInitials(conversation.name)
                                : conversation.name.substring(0, 2)}
                            </Avatar>
                            {conversation.type === 'direct' && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 0,
                                  right: 0,
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  backgroundColor: getStatusColor(conversation.status),
                                  border: '2px solid white',
                                }}
                              />
                            )}
                          </Box>
                          <div style={{ overflow: 'hidden' }}>
                            <Group position="apart" noWrap>
                              <Text size="sm" weight={500} lineClamp={1}>
                                {conversation.name}
                              </Text>
                              <Text size="xs" color="dimmed">
                                {conversation.timestamp}
                              </Text>
                            </Group>
                            <Text size="xs" color="dimmed" lineClamp={1}>
                              {conversation.lastMessage}
                            </Text>
                          </div>
                        </Group>
                        <Group spacing={5} sx={{ alignSelf: 'flex-start' }}>
                          {conversation.pinned && (
                            <Tooltip label="Pinned">
                              <ActionIcon size="xs" color="gray" variant="transparent">
                                <IconPin size={14} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                          {conversation.unread > 0 && (
                            <Badge size="sm" variant="filled" color="red">
                              {conversation.unread}
                            </Badge>
                          )}
                        </Group>
                      </Group>
                    </Paper>
                  ))
                )}
              </ScrollArea>
            </Card>
          </Grid.Col>

          {/* Chat Area */}
          <Grid.Col span={9} sx={{ height: '100%' }}>
            <Card p={0} radius={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Chat Header */}
              <Box
                p="md"
                sx={{
                  borderBottom: '1px solid #e9ecef',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <Group position="apart">
                  <Group>
                    <Avatar 
                      src={activeConversation.avatar} 
                      radius="xl" 
                      color={activeConversation.type === 'direct' ? 'blue' : 'violet'}
                    >
                      {activeConversation.type === 'direct' 
                        ? getInitials(activeConversation.name)
                        : activeConversation.name.substring(0, 2)}
                    </Avatar>
                    <div>
                      <Group spacing={5}>
                        <Text weight={500}>{activeConversation.name}</Text>
                        {activeConversation.type === 'direct' && (
                          <Badge 
                            size="xs" 
                            variant="dot" 
                            color={getStatusColor(activeConversation.status)}
                          >
                            {activeConversation.status}
                          </Badge>
                        )}
                      </Group>
                      {activeConversation.type === 'group' && (
                        <Text size="xs" color="dimmed">
                          {activeConversation.participants.join(', ')}
                        </Text>
                      )}
                    </div>
                  </Group>
                  <Group spacing={5}>
                    <Tooltip label="Voice Call">
                      <ActionIcon variant="light">
                        <IconPhone size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Video Call">
                      <ActionIcon variant="light">
                        <IconVideo size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Info">
                      <ActionIcon variant="light">
                        <IconInfoCircle size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Menu position="bottom-end" shadow="md">
                      <Menu.Target>
                        <ActionIcon variant="light">
                          <IconDotsVertical size={18} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item icon={<IconUserPlus size={14} />}>
                          Add Members
                        </Menu.Item>
                        <Menu.Item icon={<IconBell size={14} />}>
                          Notifications
                        </Menu.Item>
                        <Menu.Item icon={<IconPin size={14} />}>
                          {activeConversation.pinned ? 'Unpin Conversation' : 'Pin Conversation'}
                        </Menu.Item>
                        <Menu.Item icon={<IconStar size={14} />}>
                          Mark as Important
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item icon={<IconX size={14} />} color="red">
                          Leave Conversation
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Group>
              </Box>

              {/* Messages */}
              <ScrollArea sx={{ flex: 1, padding: 20 }}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    mb={20}
                    sx={{
                      display: 'flex',
                      flexDirection: message.sender.name === 'You' ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                    }}
                  >
                    {message.sender.name !== 'You' && (
                      <Avatar 
                        src={message.sender.avatar} 
                        radius="xl" 
                        color="blue"
                        mr={10}
                      >
                        {getInitials(message.sender.name)}
                      </Avatar>
                    )}
                    <div style={{ maxWidth: '70%' }}>
                      {message.sender.name !== 'You' && (
                        <Text size="xs" color="dimmed" mb={5}>
                          {message.sender.name}
                        </Text>
                      )}
                      <Paper
                        p="sm"
                        radius="md"
                        sx={{
                          backgroundColor: message.sender.name === 'You' 
                            ? '#4158D0' 
                            : '#f1f3f5',
                          color: message.sender.name === 'You' 
                            ? 'white' 
                            : 'inherit',
                        }}
                      >
                        <Text size="sm">{message.content}</Text>
                      </Paper>
                      <Group spacing={5} position={message.sender.name === 'You' ? 'right' : 'left'} mt={5}>
                        <Text size="xs" color="dimmed">
                          {formatTimestamp(message.timestamp)}
                        </Text>
                        {message.sender.name === 'You' && (
                          <Text size="xs" color="dimmed">
                            {message.status === 'read' ? 'Read' : 'Delivered'}
                          </Text>
                        )}
                      </Group>
                    </div>
                    {message.sender.name === 'You' && (
                      <Avatar 
                        src={message.sender.avatar} 
                        radius="xl" 
                        color="blue"
                        ml={10}
                      >
                        {getInitials(message.sender.name)}
                      </Avatar>
                    )}
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Message Input */}
              <Box
                p="md"
                sx={{
                  borderTop: '1px solid #e9ecef',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <Group position="apart" mb={10}>
                  <Group spacing={5}>
                    <Tooltip label="Attach File">
                      <ActionIcon variant="light">
                        <IconPaperclip size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Send Photo">
                      <ActionIcon variant="light">
                        <IconPhoto size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Attach Document">
                      <ActionIcon variant="light">
                        <IconFile size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
                <Group spacing={10} noWrap>
                  <TextInput
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    sx={{ flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Tooltip label="Voice Message">
                    <ActionIcon variant="light" size="lg">
                      <IconMicrophone size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Button
                    leftIcon={<IconSend size={16} />}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    sx={{
                      background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    }}
                  >
                    Send
                  </Button>
                </Group>
              </Box>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      {/* New Chat Modal */}
      <Modal
        opened={newChatModalOpen}
        onClose={() => setNewChatModalOpen(false)}
        title="New Conversation"
        size="md"
      >
        <TextInput
          placeholder="Search contacts..."
          icon={<IconSearch size={16} />}
          mb={20}
        />
        
        <ScrollArea style={{ height: 300 }}>
          {conversations
            .filter(c => c.type === 'direct')
            .map((contact) => (
              <Group key={contact.id} position="apart" mb={10} p="sm" sx={{ cursor: 'pointer' }}>
                <Group>
                  <Avatar 
                    src={contact.avatar} 
                    radius="xl" 
                    color="blue"
                  >
                    {getInitials(contact.name)}
                  </Avatar>
                  <div>
                    <Text size="sm">{contact.name}</Text>
                    <Badge 
                      size="xs" 
                      variant="dot" 
                      color={getStatusColor(contact.status)}
                    >
                      {contact.status}
                    </Badge>
                  </div>
                </Group>
                <Button 
                  variant="subtle" 
                  compact
                  onClick={() => {
                    setActiveConversation(contact);
                    setNewChatModalOpen(false);
                  }}
                >
                  Message
                </Button>
              </Group>
            ))}
        </ScrollArea>
      </Modal>

      {/* New Group Modal */}
      <Modal
        opened={newGroupModalOpen}
        onClose={() => setNewGroupModalOpen(false)}
        title="Create Group Chat"
        size="md"
      >
        <TextInput
          label="Group Name"
          placeholder="Enter group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          required
          mb={20}
        />
        
        <Text weight={500} size="sm" mb={10}>
          Add Members
        </Text>
        
        <TextInput
          placeholder="Search contacts..."
          icon={<IconSearch size={16} />}
          mb={10}
        />
        
        <ScrollArea style={{ height: 200 }} mb={20}>
          {conversations
            .filter(c => c.type === 'direct')
            .map((contact) => (
              <Group key={contact.id} position="apart" mb={10} p="sm">
                <Group>
                  <Avatar 
                    src={contact.avatar} 
                    radius="xl" 
                    color="blue"
                  >
                    {getInitials(contact.name)}
                  </Avatar>
                  <Text size="sm">{contact.name}</Text>
                </Group>
                <Checkbox
                  checked={selectedContacts.includes(contact.name)}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setSelectedContacts([...selectedContacts, contact.name]);
                    } else {
                      setSelectedContacts(selectedContacts.filter(name => name !== contact.name));
                    }
                  }}
                />
              </Group>
            ))}
        </ScrollArea>
        
        {selectedContacts.length > 0 && (
          <Box mb={20}>
            <Text weight={500} size="sm" mb={10}>
              Selected ({selectedContacts.length})
            </Text>
            <Group spacing={5}>
              {selectedContacts.map((name) => (
                <Badge 
                  key={name} 
                  sx={{ paddingRight: 3 }}
                  rightSection={
                    <ActionIcon
                      size="xs"
                      color="blue"
                      radius="xl"
                      variant="transparent"
                      onClick={() => {
                        setSelectedContacts(selectedContacts.filter(n => n !== name));
                      }}
                    >
                      <IconX size={10} />
                    </ActionIcon>
                  }
                >
                  {name}
                </Badge>
              ))}
            </Group>
          </Box>
        )}
        
        <Group position="right">
          <Button variant="subtle" onClick={() => setNewGroupModalOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup}
            disabled={!newGroupName || selectedContacts.length < 2}
            sx={{
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
            }}
          >
            Create Group
          </Button>
        </Group>
      </Modal>
    </DashboardLayout>
  );
}
