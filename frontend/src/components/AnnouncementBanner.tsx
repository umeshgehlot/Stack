import React, { useState } from 'react';
import { 
  Box, Text, Group, Button, Container, 
  Transition, ActionIcon 
} from '@mantine/core';
import { IconX, IconArrowRight } from '@tabler/icons-react';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClose = () => {
    setIsVisible(false);
    // Store in localStorage to keep it closed for the session
    localStorage.setItem('announcementClosed', 'true');
  };
  
  // Check localStorage on component mount
  React.useEffect(() => {
    const isClosed = localStorage.getItem('announcementClosed') === 'true';
    setIsVisible(!isClosed);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <Transition mounted={isVisible} transition="slide-down" duration={400} timingFunction="ease">
      {(styles) => (
        <Box 
          style={styles}
          sx={{ 
            background: 'linear-gradient(90deg, #4158D0, #C850C0)',
            padding: '8px 0',
            position: 'relative',
            zIndex: 1001
          }}
        >
          <Container size="lg">
            <Group position="apart" spacing={0}>
              <Group spacing={10}>
                <Text 
                  color="white" 
                  size="sm" 
                  weight={500}
                  sx={{
                    '@media (max-width: 768px)': {
                      fontSize: 12
                    }
                  }}
                >
                  🚀 Introducing Stack Enterprise: Advanced collaboration tools for teams
                </Text>
                <Button 
                  variant="white" 
                  compact 
                  rightIcon={<IconArrowRight size={14} />}
                  size="xs"
                  radius="xl"
                  sx={{
                    fontWeight: 600,
                    color: '#C850C0',
                    '&:hover': {
                      background: 'white',
                      transform: 'translateY(-1px)'
                    },
                    '@media (max-width: 768px)': {
                      display: 'none'
                    }
                  }}
                >
                  Learn more
                </Button>
              </Group>
              <ActionIcon 
                variant="transparent" 
                color="white" 
                onClick={handleClose}
                size="sm"
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          </Container>
        </Box>
      )}
    </Transition>
  );
}
