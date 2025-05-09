import React, { useState } from 'react';
import { 
  Box, Group, Text, Switch, Badge, 
  ThemeIcon, Transition, Card
} from '@mantine/core';
import { IconPercentage, IconArrowRight } from '@tabler/icons-react';

interface PricingToggleProps {
  onChange: (isAnnual: boolean) => void;
  defaultValue?: boolean;
}

export default function PricingToggle({ onChange, defaultValue = true }: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(defaultValue);
  const [showSavings, setShowSavings] = useState(false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.checked;
    setIsAnnual(newValue);
    onChange(newValue);
    
    if (newValue) {
      setShowSavings(true);
      setTimeout(() => setShowSavings(false), 3000);
    }
  };
  
  return (
    <Box sx={{ position: 'relative' }}>
      <Card 
        withBorder 
        radius="xl" 
        p="md"
        sx={{
          background: 'white',
          border: '1px solid #eee',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          overflow: 'visible'
        }}
      >
        <Group position="center" spacing={40}>
          <Box 
            sx={{ 
              textAlign: 'center',
              opacity: isAnnual ? 0.6 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <Text weight={isAnnual ? 500 : 700} size="lg" mb={5}>Monthly</Text>
            <Text size="sm" color="dimmed">Pay month-to-month</Text>
          </Box>
          
          <Switch
            checked={isAnnual}
            onChange={handleChange}
            size="lg"
            color="green"
            label={
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -30, 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  width: 'max-content'
                }}
              >
                <Badge 
                  color="green" 
                  variant="filled" 
                  size="lg"
                  radius="sm"
                  sx={{
                    padding: '4px 10px',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: 0.5,
                    boxShadow: '0 4px 8px rgba(34, 139, 34, 0.3)'
                  }}
                >
                  Save 20%
                </Badge>
              </Box>
            }
            styles={{
              track: {
                cursor: 'pointer',
                width: 60,
                height: 30,
                backgroundColor: isAnnual ? '#4CAF50' : '#eee',
                borderRadius: 30,
                border: `1px solid ${isAnnual ? '#4CAF50' : '#ddd'}`,
                position: 'relative',
                transition: 'background-color 0.3s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 2,
                  left: isAnnual ? 'calc(100% - 26px)' : '2px',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  transition: 'left 0.3s ease',
                }
              },
              thumb: {
                display: 'none'
              },
              label: {
                display: 'none'
              }
            }}
          />
          
          <Box 
            sx={{ 
              textAlign: 'center',
              opacity: isAnnual ? 1 : 0.6,
              transition: 'all 0.3s ease'
            }}
          >
            <Text weight={isAnnual ? 700 : 500} size="lg" mb={5}>Annual</Text>
            <Text size="sm" color="dimmed">Pay yearly</Text>
          </Box>
        </Group>
      </Card>
      
      <Transition
        mounted={showSavings}
        transition="slide-up"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Card
            style={{
              ...styles,
              position: 'absolute',
              top: -70,
              right: -20,
              zIndex: 10
            }}
            withBorder
            radius="md"
            p="sm"
            sx={{
              background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
              color: 'white',
              boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)'
            }}
          >
            <Group spacing={10} noWrap>
              <ThemeIcon 
                size={36} 
                radius="xl" 
                color="white" 
                variant="light"
                sx={{ color: '#4CAF50' }}
              >
                <IconPercentage size={20} />
              </ThemeIcon>
              <Box>
                <Text weight={700} size="sm">You'll save 20%</Text>
                <Text size="xs">That's $240 per year for a team of 10</Text>
              </Box>
              <ThemeIcon 
                size={24} 
                radius="xl" 
                color="white" 
                variant="filled"
                sx={{ background: 'rgba(255, 255, 255, 0.3)' }}
              >
                <IconArrowRight size={14} />
              </ThemeIcon>
            </Group>
          </Card>
        )}
      </Transition>
    </Box>
  );
}
