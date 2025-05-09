import React, { useState, useEffect } from 'react';
import { 
  Paper, Text, Group, Button, Box, Divider, 
  Collapse, List, ThemeIcon 
} from '@mantine/core';
import { IconCheck, IconCookie, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

export default function CookieConsent() {
  const [accepted, setAccepted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookieConsent') === 'true';
    setAccepted(hasAccepted);
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setAccepted(true);
  };
  
  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'false');
    setAccepted(true);
  };
  
  if (accepted) {
    return null;
  }
  
  return (
    <Paper
      shadow="md"
      p="md"
      withBorder
      sx={{
        position: 'fixed',
        bottom: 100,
        left: 20,
        right: 20,
        maxWidth: 500,
        margin: '0 auto',
        zIndex: 1000,
        borderRadius: 12,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        '@media (max-width: 576px)': {
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: '12px 12px 0 0',
        }
      }}
    >
      <Group position="apart" mb={10}>
        <Group>
          <ThemeIcon 
            size={36} 
            radius="xl" 
            sx={{
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              boxShadow: '0 4px 10px rgba(65, 88, 208, 0.2)'
            }}
          >
            <IconCookie size={20} />
          </ThemeIcon>
          <Text weight={700} size="lg">Cookie Settings</Text>
        </Group>
        <Button 
          variant="subtle" 
          compact 
          onClick={() => setShowDetails(!showDetails)}
          rightIcon={showDetails ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        >
          {showDetails ? 'Less' : 'More'} info
        </Button>
      </Group>
      
      <Text size="sm" color="dimmed" mb={15}>
        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
      </Text>
      
      <Collapse in={showDetails}>
        <Box mb={15}>
          <Divider my={15} />
          <Text weight={600} mb={10}>We use cookies for:</Text>
          <List spacing={8} size="sm" center icon={
            <ThemeIcon color="blue" size={20} radius="xl">
              <IconCheck size={12} />
            </ThemeIcon>
          }>
            <List.Item>Essential website functionality</List.Item>
            <List.Item>Remembering your preferences</List.Item>
            <List.Item>Analytics to improve our services</List.Item>
            <List.Item>Marketing and personalized content</List.Item>
          </List>
          <Text size="xs" color="dimmed" mt={10}>
            You can change your preferences anytime by visiting our Privacy Policy page.
          </Text>
          <Divider my={15} />
        </Box>
      </Collapse>
      
      <Group position="right" spacing={10}>
        <Button 
          variant="outline" 
          color="gray" 
          onClick={handleReject}
          size="sm"
          sx={{
            borderRadius: 8,
            fontWeight: 600,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.05)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Reject All
        </Button>
        <Button 
          onClick={handleAccept}
          size="sm"
          sx={{
            borderRadius: 8,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #4158D0, #C850C0)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(65, 88, 208, 0.3)'
            }
          }}
        >
          Accept All
        </Button>
      </Group>
    </Paper>
  );
}
