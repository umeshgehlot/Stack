import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Container,
  Grid,
  Paper,
  Text,
  Title,
  Button,
  TextInput,
  Loader,
  Avatar,
  Group,
  Stack,
  ScrollArea,
  Badge,
  ActionIcon,
  Menu,
  Divider,
  Modal,
  MultiSelect,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Chat {
  id: string;
  name?: string;
  type: 'direct' | 'group';
  participants: {
    id: string;
    name: string;
    email: string;
    joinedAt: string;
  }[];
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName?: string;
  content: string;
  attachments: any[];
  createdAt: string;
  updatedAt?: string;
  readBy: {
    userId: string;
    readAt: string;
  }[];
}

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
  const [newChatType, setNewChatType] = useState<'direct' | 'group'>('direct');
  const [newChatName, setNewChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<{ value: string; label: string }[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Simulate API URL - replace with actual environment variable in production
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get current user
    const fetchCurrentUser = async () => {
      try {
        // In a real app, this would be an API call to your auth service
        // For demo purposes, we'll simulate a user
        setUser({
          id: 'user-1',
          name: 'Demo User',
          email: 'demo@example.com',
        });
        
        // Fetch chats
        fetchChats();
        
        // Connect to socket
        connectSocket(token);
      } catch (err) {
        console.error('Error fetching current user:', err);
        router.push('/login');
      }
    };

    fetchCurrentUser();

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const connectSocket = (token: string) => {
    const newSocket = io(API_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat service');
    });

    newSocket.on('user:joined', (data) => {
      setOnlineUsers(prev => ({ ...prev, [data.userId]: true }));
    });

    newSocket.on('user:left', (data) => {
      setOnlineUsers(prev => ({ ...prev, [data.userId]: false }));
    });

    newSocket.on('message:received', (message) => {
      if (selectedChat && message.chatId === selectedChat.id) {
        setMessages(prev => [...prev, message]);
        // Mark message as read
        newSocket.emit('message:read', {
          messageId: message.id,
          chatId: message.chatId,
        });
      }

      // Update last message in chat list
      setChats(prev => prev.map(chat => {
        if (chat.id === message.chatId) {
          return {
            ...chat,
            lastMessage: {
              id: message.id,
              content: message.content,
              senderId: message.senderId,
              createdAt: message.createdAt,
            },
          };
        }
        return chat;
      }));
    });

    newSocket.on('user:typing', (data) => {
      if (selectedChat && data.chatId === selectedChat.id) {
        setTypingUsers(prev => ({ ...prev, [data.userId]: true }));
      }
    });

    newSocket.on('user:stopped-typing', (data) => {
      if (selectedChat && data.chatId === selectedChat.id) {
        setTypingUsers(prev => ({ ...prev, [data.userId]: false }));
      }
    });

    newSocket.on('message:read-receipt', (data) => {
      if (selectedChat && data.chatId === selectedChat.id) {
        setMessages(prev => prev.map(msg => {
          if (msg.id === data.messageId) {
            return {
              ...msg,
              readBy: [...msg.readBy, { userId: data.userId, readAt: data.readAt }],
            };
          }
          return msg;
        }));
      }
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to your chat service
      // For demo purposes, we'll simulate an API response
      setTimeout(() => {
        const mockChats: Chat[] = [
          {
            id: 'chat-1',
            type: 'direct',
            participants: [
              {
                id: 'user-1',
                name: 'Demo User',
                email: 'demo@example.com',
                joinedAt: new Date().toISOString(),
              },
              {
                id: 'user-2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                joinedAt: new Date().toISOString(),
              },
            ],
            lastMessage: {
              id: 'msg-1',
              content: 'Hey, how are you?',
              senderId: 'user-2',
              createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          },
          {
            id: 'chat-2',
            name: 'Project Team',
            type: 'group',
            participants: [
              {
                id: 'user-1',
                name: 'Demo User',
                email: 'demo@example.com',
                joinedAt: new Date().toISOString(),
              },
              {
                id: 'user-2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                joinedAt: new Date().toISOString(),
              },
              {
                id: 'user-3',
                name: 'Bob Johnson',
                email: 'bob@example.com',
                joinedAt: new Date().toISOString(),
              },
            ],
            lastMessage: {
              id: 'msg-2',
              content: 'Let\'s discuss the project tomorrow',
              senderId: 'user-3',
              createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            },
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            updatedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          },
        ];
        
        setChats(mockChats);
        setLoading(false);
        
        // Also populate available users for new chats
        setAvailableUsers([
          { value: 'user-2', label: 'Jane Smith' },
          { value: 'user-3', label: 'Bob Johnson' },
          { value: 'user-4', label: 'Alice Williams' },
        ]);
      }, 1000);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      setLoadingMessages(true);
      
      // In a real app, this would be an API call to your chat service
      // For demo purposes, we'll simulate an API response
      setTimeout(() => {
        const mockMessages: Message[] = [
          {
            id: 'msg-1',
            chatId,
            senderId: 'user-2',
            senderName: 'Jane Smith',
            content: 'Hey, how are you?',
            attachments: [],
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            readBy: [
              { userId: 'user-1', readAt: new Date().toISOString() },
              { userId: 'user-2', readAt: new Date(Date.now() - 3600000).toISOString() },
            ],
          },
          {
            id: 'msg-2',
            chatId,
            senderId: 'user-1',
            senderName: 'Demo User',
            content: 'I\'m good, thanks! Working on the new project.',
            attachments: [],
            createdAt: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
            readBy: [
              { userId: 'user-1', readAt: new Date(Date.now() - 3500000).toISOString() },
              { userId: 'user-2', readAt: new Date(Date.now() - 3400000).toISOString() },
            ],
          },
          {
            id: 'msg-3',
            chatId,
            senderId: 'user-2',
            senderName: 'Jane Smith',
            content: 'That sounds great! Can you share some details?',
            attachments: [],
            createdAt: new Date(Date.now() - 3400000).toISOString(), // 56 minutes ago
            readBy: [
              { userId: 'user-1', readAt: new Date().toISOString() },
              { userId: 'user-2', readAt: new Date(Date.now() - 3400000).toISOString() },
            ],
          },
        ];
        
        setMessages(mockMessages);
        setLoadingMessages(false);
      }, 500);
      
      // Join chat room via socket
      if (socket) {
        socket.emit('join:chat', chatId);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setLoadingMessages(false);
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.id);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || !socket || !user) return;
    
    // In a real app, this would be an API call to your chat service
    // For demo purposes, we'll simulate sending a message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: selectedChat.id,
      senderId: user.id,
      senderName: user.name,
      content: messageInput,
      attachments: [],
      createdAt: new Date().toISOString(),
      readBy: [{ userId: user.id, readAt: new Date().toISOString() }],
    };
    
    // Add message to local state
    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in chat list
    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          lastMessage: {
            id: newMessage.id,
            content: newMessage.content,
            senderId: newMessage.senderId,
            createdAt: newMessage.createdAt,
          },
        };
      }
      return chat;
    }));
    
    // Send message via socket
    socket.emit('message:new', {
      chatId: selectedChat.id,
      content: messageInput,
    });
    
    // Clear input
    setMessageInput('');
    
    // Stop typing indicator
    socket.emit('typing:stop', selectedChat.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (!selectedChat || !socket) return;
    
    // Send typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    socket.emit('typing:start', selectedChat.id);
    
    // Stop typing after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      if (socket) {
        socket.emit('typing:stop', selectedChat.id);
      }
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  const handleCreateChat = () => {
    if (!user) return;
    
    if (newChatType === 'group' && !newChatName.trim()) {
      alert('Please enter a name for the group chat');
      return;
    }
    
    if (selectedUsers.length === 0) {
      alert('Please select at least one participant');
      return;
    }
    
    // In a real app, this would be an API call to your chat service
    // For demo purposes, we'll simulate creating a chat
    const participants = selectedUsers.map(userId => {
      const userInfo = availableUsers.find(u => u.value === userId);
      return {
        id: userId,
        name: userInfo?.label || `User ${userId}`,
        email: `user${userId}@example.com`,
        joinedAt: new Date().toISOString(),
      };
    });
    
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      name: newChatType === 'group' ? newChatName : undefined,
      type: newChatType,
      participants: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          joinedAt: new Date().toISOString(),
        },
        ...participants,
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChat);
    setMessages([]);
    closeCreateModal();
    
    // Reset form
    setNewChatType('direct');
    setNewChatName('');
    setSelectedUsers([]);
  };

  const getChatName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.name;
    }
    
    // For direct chats, show the other participant's name
    if (user) {
      const otherParticipant = chat.participants.find(p => p.id !== user.id);
      return otherParticipant?.name || 'Unknown User';
    }
    
    return 'Loading...';
  };

  const getTypingIndicator = () => {
    if (!selectedChat || !user) return null;
    
    const typingUserIds = Object.entries(typingUsers)
      .filter(([id, isTyping]) => isTyping && id !== user.id)
      .map(([id]) => id);
    
    if (typingUserIds.length === 0) return null;
    
    const typingUserNames = typingUserIds.map(id => {
      const participant = selectedChat.participants.find(p => p.id === id);
      return participant?.name || 'Someone';
    });
    
    if (typingUserNames.length === 1) {
      return <Text size="xs" color="dimmed">{typingUserNames[0]} is typing...</Text>;
    }
    
    return <Text size="xs" color="dimmed">Multiple people are typing...</Text>;
  };

  return (
    <div>
      <Head>
        <title>Chat | Real-Time Collaboration Platform</title>
        <meta name="description" content="Chat with your team in real-time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container size="xl" py={20}>
        <Title order={2} mb={20}>Chat</Title>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
            <Loader size="lg" />
          </div>
        ) : (
          <Grid>
            <Grid.Col span={4}>
              <Paper shadow="xs" p="md" withBorder>
                <Group position="apart" mb={15}>
                  <Title order={4}>Conversations</Title>
                  <Button size="xs" onClick={openCreateModal}>New Chat</Button>
                </Group>
                
                <Stack spacing="xs">
                  {chats.map(chat => (
                    <Paper 
                      key={chat.id} 
                      p="sm" 
                      withBorder 
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: selectedChat?.id === chat.id ? '#f0f0f0' : 'transparent',
                      }}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <Group position="apart">
                        <div style={{ flex: 1 }}>
                          <Group>
                            <Avatar radius="xl" size="md" color="blue">
                              {getChatName(chat).charAt(0)}
                            </Avatar>
                            <div>
                              <Text weight={500}>{getChatName(chat)}</Text>
                              {chat.lastMessage && (
                                <Text size="xs" color="dimmed" lineClamp={1}>
                                  {chat.lastMessage.senderId === user?.id ? 'You: ' : ''}
                                  {chat.lastMessage.content}
                                </Text>
                              )}
                            </div>
                          </Group>
                        </div>
                        <div>
                          {chat.lastMessage && (
                            <Text size="xs" color="dimmed">
                              {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          )}
                          {chat.type === 'group' && (
                            <Badge size="xs" variant="outline">
                              {chat.participants.length} members
                            </Badge>
                          )}
                        </div>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid.Col>
            
            <Grid.Col span={8}>
              {selectedChat ? (
                <Paper shadow="xs" p={0} withBorder style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
                  <div style={{ padding: '10px 15px', borderBottom: '1px solid #e0e0e0' }}>
                    <Group position="apart">
                      <Group>
                        <Avatar radius="xl" size="md" color="blue">
                          {getChatName(selectedChat).charAt(0)}
                        </Avatar>
                        <div>
                          <Text weight={500}>{getChatName(selectedChat)}</Text>
                          <Text size="xs" color="dimmed">
                            {selectedChat.type === 'group' 
                              ? `${selectedChat.participants.length} members` 
                              : 'Direct message'}
                          </Text>
                        </div>
                      </Group>
                      <Menu position="bottom-end">
                        <Menu.Target>
                          <ActionIcon>
                            <span>⋮</span>
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          {selectedChat.type === 'group' && (
                            <>
                              <Menu.Item>Add members</Menu.Item>
                              <Menu.Item>Leave group</Menu.Item>
                              <Divider />
                            </>
                          )}
                          <Menu.Item color="red">Delete chat</Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </div>
                  
                  <ScrollArea style={{ flex: 1, padding: 15 }}>
                    {loadingMessages ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
                        <Loader size="sm" />
                      </div>
                    ) : messages.length === 0 ? (
                      <Text align="center" color="dimmed" py={50}>
                        No messages yet. Start the conversation!
                      </Text>
                    ) : (
                      <Stack spacing="xs">
                        {messages.map(message => {
                          const isOwnMessage = message.senderId === user?.id;
                          return (
                            <div 
                              key={message.id} 
                              style={{ 
                                display: 'flex', 
                                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                marginBottom: 10,
                              }}
                            >
                              {!isOwnMessage && (
                                <Avatar radius="xl" size="sm" color="blue" mr={8}>
                                  {message.senderName?.charAt(0) || '?'}
                                </Avatar>
                              )}
                              <div 
                                style={{ 
                                  maxWidth: '70%',
                                  padding: '8px 12px',
                                  borderRadius: 8,
                                  backgroundColor: isOwnMessage ? '#e3f2fd' : '#f5f5f5',
                                }}
                              >
                                {!isOwnMessage && (
                                  <Text size="xs" weight={500} mb={4}>
                                    {message.senderName}
                                  </Text>
                                )}
                                <Text>{message.content}</Text>
                                <Group position="right" spacing={5} mt={4}>
                                  <Text size="xs" color="dimmed">
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </Text>
                                  {isOwnMessage && (
                                    <Text size="xs" color="dimmed">
                                      {message.readBy.length > 1 ? 'Read' : 'Sent'}
                                    </Text>
                                  )}
                                </Group>
                              </div>
                            </div>
                          );
                        })}
                        {getTypingIndicator()}
                        <div ref={messagesEndRef} />
                      </Stack>
                    )}
                  </ScrollArea>
                  
                  <div style={{ padding: 15, borderTop: '1px solid #e0e0e0' }}>
                    <Group>
                      <TextInput
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        style={{ flex: 1 }}
                      />
                      <Button onClick={handleSendMessage}>Send</Button>
                    </Group>
                  </div>
                </Paper>
              ) : (
                <Paper shadow="xs" p="xl" withBorder style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Title order={3} mb={10}>Select a conversation</Title>
                    <Text color="dimmed">Choose an existing conversation or start a new one</Text>
                    <Button mt={20} onClick={openCreateModal}>New Chat</Button>
                  </div>
                </Paper>
              )}
            </Grid.Col>
          </Grid>
        )}
      </Container>
      
      <Modal
        opened={createModalOpened}
        onClose={closeCreateModal}
        title="Create New Chat"
        size="md"
      >
        <div>
          <Group mb={15}>
            <Button 
              variant={newChatType === 'direct' ? 'filled' : 'outline'}
              onClick={() => setNewChatType('direct')}
            >
              Direct Message
            </Button>
            <Button 
              variant={newChatType === 'group' ? 'filled' : 'outline'}
              onClick={() => setNewChatType('group')}
            >
              Group Chat
            </Button>
          </Group>
          
          {newChatType === 'group' && (
            <TextInput
              label="Group Name"
              placeholder="Enter group name"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              mb={15}
              required
            />
          )}
          
          <MultiSelect
            label="Select Participants"
            placeholder="Choose users to chat with"
            data={availableUsers}
            value={selectedUsers}
            onChange={setSelectedUsers}
            mb={20}
            required
          />
          
          <Group position="right">
            <Button variant="outline" onClick={closeCreateModal}>Cancel</Button>
            <Button onClick={handleCreateChat}>Create</Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
}