import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, TextInput, PasswordInput,
  Checkbox, Divider, Stack, Box, Anchor, ThemeIcon, Alert
} from '@mantine/core';
import { 
  IconBrandGoogle, IconBrandGithub, IconLock, IconAlertCircle,
  IconArrowRight
} from '@tabler/icons-react';
// No navbar or footer needed for authentication pages

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Call the authentication service's login endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // If remember me is checked, store a flag
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Sign In | Stack - Real-Time Collaboration Platform</title>
        <meta name="description" content="Sign in to your Stack account to access real-time collaboration tools." />
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
          top: '10%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(65, 88, 208, 0.1) 0%, rgba(65, 88, 208, 0) 70%)',
          animation: 'pulse 15s infinite ease-in-out',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200, 80, 192, 0.1) 0%, rgba(200, 80, 192, 0) 70%)',
          animation: 'pulse 12s infinite ease-in-out',
          animationDelay: '2s',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: '30%',
          left: '15%',
          width: 200,
          height: 200,
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
              }
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
              <IconLock size={30} stroke={1.5} color="white" />
            </ThemeIcon>
          </Group>

          <Title order={2} align="center" mb={10} sx={{ fontWeight: 800 }}>Welcome Back</Title>
          <Text align="center" color="dimmed" mb={30} sx={{ maxWidth: 400, margin: '0 auto' }}>
            Sign in to your Stack account to access all your collaboration tools and workspaces
          </Text>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert 
                icon={<IconAlertCircle size={16} />} 
                title="Authentication Error" 
                color="red" 
                mb={20}
                withCloseButton
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}
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
              
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="md"
                sx={{ '& input': { fontSize: '16px' } }}
              />
              
              <Group position="apart">
                <Checkbox
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ '& .mantine-Checkbox-label': { fontWeight: 500 } }}
                />
                <Anchor 
                  component="a" 
                  href="/forgot-password" 
                  size="sm"
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'none' }
                  }}
                >
                  Forgot password?
                </Anchor>
              </Group>
              
              <Button 
                type="submit" 
                fullWidth 
                radius="xl"
                size="lg"
                loading={loading}
                rightIcon={<IconArrowRight size={18} />}
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
                Sign In
              </Button>
            </Stack>
          </form>
          
          <Divider 
            label="Or continue with" 
            labelPosition="center" 
            my="xl"
            labelProps={{ size: 'sm', color: 'dimmed', weight: 500 }}
            sx={{ opacity: 0.8 }}
          />
          
          <Group grow mb="xl">
            <Button 
              leftIcon={<IconBrandGoogle size={20} />} 
              variant="outline"
              radius="xl"
              size="md"
              onClick={() => setError('Social login is not implemented yet')}
              sx={{
                borderColor: 'rgba(0, 0, 0, 0.1)',
                color: '#333',
                fontWeight: 600,
                height: 48,
                '&:hover': {
                  backgroundColor: 'rgba(219, 68, 55, 0.05)',
                  borderColor: 'rgba(219, 68, 55, 0.5)'
                }
              }}
            >
              Google
            </Button>
            <Button 
              leftIcon={<IconBrandGithub size={20} />} 
              variant="outline"
              radius="xl"
              size="md"
              onClick={() => setError('Social login is not implemented yet')}
              sx={{
                borderColor: 'rgba(0, 0, 0, 0.1)',
                color: '#333',
                fontWeight: 600,
                height: 48,
                '&:hover': {
                  backgroundColor: 'rgba(36, 41, 47, 0.05)',
                  borderColor: 'rgba(36, 41, 47, 0.5)'
                }
              }}
            >
              GitHub
            </Button>
          </Group>
          
          <Text align="center" size="sm" sx={{ fontWeight: 500 }}>
            Don't have an account?{' '}
            <Anchor 
              component="a" 
              href="/signup"
              sx={{ 
                fontWeight: 700,
                color: '#4158D0',
                '&:hover': { textDecoration: 'none', color: '#C850C0' }
              }}
            >
              Sign Up
            </Anchor>
          </Text>
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
