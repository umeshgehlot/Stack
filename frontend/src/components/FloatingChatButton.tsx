import React, { useState } from 'react';
import { 
  Paper, Text, Group, Button, Box, Avatar, 
  TextInput, ActionIcon, Collapse, Indicator
} from '@mantine/core';
import { 
  IconMessageCircle, IconSend, IconX, 
  IconMinimize, IconArrowRight 
} from '@tabler/icons-react';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'agent', text: string}[]>([
    {type: 'agent', text: 'Hi there! 👋 How can I help you today?'}
  ]);
  const [showIndicator, setShowIndicator] = useState(true);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowIndicator(false);
    }
  };
  
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, {type: 'user', text: message}]);
    setMessage('');
    
    // Simulate agent response after a short delay
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        {
          type: 'agent', 
          text: 'Thanks for reaching out! Our team will get back to you shortly. In the meantime, feel free to explore our documentation or FAQ section.'
        }
      ]);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <>
      {/* Chat Window */}
      <Collapse 
        in={isOpen} 
        sx={{ 
          position: 'fixed', 
          bottom: 80, 
          right: 20, 
          zIndex: 1000,
          width: 320,
          '@media (max-width: 576px)': {
            right: 10,
            left: 10,
            width: 'auto'
          }
        }}
      >
        <Paper
          shadow="md"
          radius="md"
          p={0}
          withBorder
          sx={{
            overflow: 'hidden',
            background: 'white',
            height: 400,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <Box 
            sx={{ 
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              padding: '15px 20px',
              color: 'white'
            }}
          >
            <Group position="apart">
              <Group>
                <Avatar 
                  size={36} 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                  radius="xl"
                />
                <Box>
                  <Text weight={600} size="sm">Stack Support</Text>
                  <Text size="xs" opacity={0.8}>Usually replies in a few minutes</Text>
                </Box>
              </Group>
              <ActionIcon 
                variant="transparent" 
                color="white" 
                onClick={toggleChat}
              >
                <IconMinimize size={18} />
              </ActionIcon>
            </Group>
          </Box>
          
          {/* Chat Messages */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              padding: 15,
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            {chatHistory.map((msg, index) => (
              <Box 
                key={index}
                sx={{ 
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <Paper
                  p="sm"
                  radius="md"
                  sx={{
                    background: msg.type === 'user' 
                      ? 'linear-gradient(135deg, #4158D0, #C850C0)' 
                      : '#f1f3f5',
                    color: msg.type === 'user' ? 'white' : 'inherit'
                  }}
                >
                  <Text size="sm">{msg.text}</Text>
                </Paper>
              </Box>
            ))}
          </Box>
          
          {/* Input Area */}
          <Box p="sm" sx={{ borderTop: '1px solid #eee' }}>
            <Group spacing={5} noWrap>
              <TextInput
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ flexGrow: 1 }}
                size="sm"
              />
              <ActionIcon 
                color="blue" 
                variant="filled" 
                onClick={handleSendMessage}
                disabled={message.trim() === ''}
                size="lg"
                radius="xl"
                sx={{
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <IconSend size={18} />
              </ActionIcon>
            </Group>
          </Box>
        </Paper>
      </Collapse>
      
      {/* Floating Button */}
      <Indicator 
        position="top-end" 
        color="red" 
        size={10} 
        withBorder 
        processing 
        disabled={!showIndicator}
        sx={{ 
          position: 'fixed', 
          bottom: 30, 
          right: 90, 
          zIndex: 1000 
        }}
      >
        <ActionIcon
          size={56}
          radius={28}
          variant="filled"
          onClick={toggleChat}
          sx={{
            background: isOpen 
              ? '#f1f3f5' 
              : 'linear-gradient(135deg, #4158D0, #C850C0)',
            color: isOpen ? '#333' : 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: isOpen ? '1px solid #ddd' : 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          {isOpen ? <IconX size={24} /> : <IconMessageCircle size={24} />}
        </ActionIcon>
      </Indicator>
    </>
  );
}
