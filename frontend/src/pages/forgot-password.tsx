import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, TextInput,
  Stack, Box, Anchor, Alert, ThemeIcon
} from '@mantine/core';
import { IconArrowLeft, IconCheck, IconAlertCircle, IconMail } from '@tabler/icons-react';
// No navbar or footer needed for authentication pages

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div>
      <Head>
        <title>Reset Password | Stack - Real-Time Collaboration Platform</title>
        <meta name="description" content="Reset your Stack account password." />
      </Head>


      <Box 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.05) 0%, rgba(200, 80, 192, 0.05) 50%, rgba(255, 204, 112, 0.05) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative RGB elements */}
        <Box sx={{ 
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(65, 88, 208, 0.1) 0%, rgba(65, 88, 208, 0) 70%)',
          animation: 'pulse 15s infinite ease-in-out',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200, 80, 192, 0.1) 0%, rgba(200, 80, 192, 0) 70%)',
          animation: 'pulse 12s infinite ease-in-out',
          animationDelay: '2s',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute',
          top: '50%',
          right: '25%',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 204, 112, 0.1) 0%, rgba(255, 204, 112, 0) 70%)',
          animation: 'pulse 10s infinite ease-in-out',
          animationDelay: '1s',
          zIndex: 0
        }} />
        <Container size="xs" py={80}>
          <Card 
            shadow="xl" 
            p={40} 
            radius="lg" 
            withBorder
            sx={{
              borderColor: 'rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              position: 'relative',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 15px 35px rgba(65, 88, 208, 0.2), 0 5px 15px rgba(0, 0, 0, 0.05), 0 0 10px rgba(200, 80, 192, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 20px 40px rgba(65, 88, 208, 0.3), 0 10px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(200, 80, 192, 0.2)'
              },
              zIndex: 1
            }}
          >
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #4158D0, #C850C0, #FFCC70)',
              borderTopLeftRadius: 'lg',
              borderTopRightRadius: 'lg',
            }} />
            
            <Group position="center" mb={30}>
              <ThemeIcon 
                size={70} 
                radius="xl" 
                sx={{
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                  boxShadow: '0 8px 16px rgba(65, 88, 208, 0.2)',
                  border: '3px solid rgba(255, 255, 255, 0.8)'
                }}
              >
                <IconMail size={30} stroke={1.5} color="white" />
              </ThemeIcon>
            </Group>
            
            <Title order={2} align="center" mb={10} sx={{ fontWeight: 800 }}>
              {submitted ? 'Check Your Email' : 'Reset Your Password'}
            </Title>
            
            <Text align="center" color="dimmed" mb={30} sx={{ maxWidth: 400, margin: '0 auto' }}>
              {submitted 
                ? `We've sent password reset instructions to ${email}. Please check your inbox.` 
                : "Enter your email address below and we'll send you instructions to reset your password."}
            </Text>
            
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <Stack spacing="lg">
                  <TextInput
                    label="Email Address"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="md"
                    sx={{ '& input': { fontSize: '16px' } }}
                  />
                  
                  <Button 
                    type="submit" 
                    fullWidth 
                    radius="xl"
                    size="lg"
                    loading={loading}
                    sx={{
                      height: 50,
                      fontWeight: 600,
                      fontSize: 16,
                      background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                      boxShadow: '0 8px 16px rgba(65, 88, 208, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 20px rgba(65, 88, 208, 0.4)'
                      }
                    }}
                  >
                    Send Reset Instructions
                  </Button>
                </Stack>
              </form>
            ) : (
              <Alert 
                icon={<IconCheck size={16} />} 
                title="Email Sent!" 
                color="green" 
                radius="md"
                mb={30}
              >
                Please check your email for instructions to reset your password. If you don't see it, check your spam folder.
              </Alert>
            )}
            
            <Group position="center" mt={submitted ? 30 : 20}>
              <Button 
                component="a" 
                href="/signin" 
                variant="subtle" 
                leftIcon={<IconArrowLeft size={16} />}
                sx={{
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'transparent',
                    transform: 'translateX(-5px)'
                  }
                }}
              >
                Back to Sign In
              </Button>
            </Group>
          </Card>
        </Container>
      </Box>
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
