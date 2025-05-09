import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, TextInput, PasswordInput,
  Checkbox, Divider, Stack, Box, Anchor, ThemeIcon, Progress
} from '@mantine/core';
import { 
  IconBrandGoogle, IconBrandGithub, IconUserPlus, IconArrowRight,
  IconCheck, IconX
} from '@tabler/icons-react';
// No navbar or footer needed for authentication pages

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Call the authentication service's register endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register');
      }
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const passwordStrength = checkPasswordStrength(password);
  
  const getStrengthColor = (strength: number) => {
    if (strength === 0) return 'gray';
    if (strength === 1) return 'red';
    if (strength === 2) return 'yellow';
    if (strength === 3) return 'blue';
    return 'green';
  };

  return (
    <div>
      <Head>
        <title>Sign Up | Stack - Real-Time Collaboration Platform</title>
        <meta name="description" content="Create a Stack account to start collaborating in real-time with your team." />
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
          top: '5%',
          right: '10%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(65, 88, 208, 0.1) 0%, rgba(65, 88, 208, 0) 70%)',
          animation: 'pulse 15s infinite ease-in-out',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200, 80, 192, 0.1) 0%, rgba(200, 80, 192, 0) 70%)',
          animation: 'pulse 12s infinite ease-in-out',
          animationDelay: '2s',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute',
          top: '40%',
          left: '20%',
          width: 250,
          height: 250,
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
              <IconUserPlus size={30} stroke={1.5} color="white" />
            </ThemeIcon>
          </Group>

          <Title order={2} align="center" mb={10} sx={{ fontWeight: 800 }}>Create your account</Title>
          <Text align="center" color="dimmed" mb={30} sx={{ maxWidth: 400, margin: '0 auto' }}>
            Join thousands of teams using Stack to collaborate more effectively
          </Text>
          
          <form onSubmit={handleSubmit}>
            <Stack spacing="lg">
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="md"
                sx={{ '& input': { fontSize: '16px' } }}
              />
              
              <TextInput
                label="Email Address"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="md"
                sx={{ '& input': { fontSize: '16px' } }}
              />
              
              <Box>
                <PasswordInput
                  label="Password"
                  placeholder="Create a strong password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="md"
                  sx={{ '& input': { fontSize: '16px' } }}
                />
                
                {password.length > 0 && (
                  <Box mt={5}>
                    <Group position="apart" mb={5} mt={5}>
                      <Text size="xs" color="dimmed">Password strength:</Text>
                      <Text size="xs" color={getStrengthColor(passwordStrength)} weight={700}>
                        {passwordStrength === 0 && 'Very weak'}
                        {passwordStrength === 1 && 'Weak'}
                        {passwordStrength === 2 && 'Fair'}
                        {passwordStrength === 3 && 'Good'}
                        {passwordStrength === 4 && 'Strong'}
                      </Text>
                    </Group>
                    <Progress 
                      value={passwordStrength * 25} 
                      color={getStrengthColor(passwordStrength)} 
                      size="xs" 
                      radius="xl"
                    />
                    <Group mt={10} spacing={7} sx={{ flexWrap: 'wrap' }}>
                      <Group spacing={5}>
                        <ThemeIcon 
                          size={16} 
                          radius="xl" 
                          color={password.length >= 8 ? 'green' : 'gray'}
                          variant={password.length >= 8 ? 'filled' : 'light'}
                        >
                          {password.length >= 8 ? <IconCheck size={10} /> : <IconX size={10} />}
                        </ThemeIcon>
                        <Text size="xs">At least 8 characters</Text>
                      </Group>
                      <Group spacing={5}>
                        <ThemeIcon 
                          size={16} 
                          radius="xl" 
                          color={/[A-Z]/.test(password) ? 'green' : 'gray'}
                          variant={/[A-Z]/.test(password) ? 'filled' : 'light'}
                        >
                          {/[A-Z]/.test(password) ? <IconCheck size={10} /> : <IconX size={10} />}
                        </ThemeIcon>
                        <Text size="xs">Uppercase letter</Text>
                      </Group>
                      <Group spacing={5}>
                        <ThemeIcon 
                          size={16} 
                          radius="xl" 
                          color={/[0-9]/.test(password) ? 'green' : 'gray'}
                          variant={/[0-9]/.test(password) ? 'filled' : 'light'}
                        >
                          {/[0-9]/.test(password) ? <IconCheck size={10} /> : <IconX size={10} />}
                        </ThemeIcon>
                        <Text size="xs">Number</Text>
                      </Group>
                      <Group spacing={5}>
                        <ThemeIcon 
                          size={16} 
                          radius="xl" 
                          color={/[^A-Za-z0-9]/.test(password) ? 'green' : 'gray'}
                          variant={/[^A-Za-z0-9]/.test(password) ? 'filled' : 'light'}
                        >
                          {/[^A-Za-z0-9]/.test(password) ? <IconCheck size={10} /> : <IconX size={10} />}
                        </ThemeIcon>
                        <Text size="xs">Special character</Text>
                      </Group>
                    </Group>
                  </Box>
                )}
              </Box>
              
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={password !== confirmPassword && confirmPassword.length > 0 ? "Passwords don't match" : null}
                size="md"
                sx={{ '& input': { fontSize: '16px' } }}
              />
              
              <Checkbox
                label={
                  <Text size="sm">
                    I agree to the{' '}
                    <Anchor component="a" href="/terms" sx={{ fontWeight: 600, '&:hover': { textDecoration: 'none' } }}>
                      Terms of Service
                    </Anchor>
                    {' '}and{' '}
                    <Anchor component="a" href="/privacy" sx={{ fontWeight: 600, '&:hover': { textDecoration: 'none' } }}>
                      Privacy Policy
                    </Anchor>
                  </Text>
                }
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
                sx={{ '& .mantine-Checkbox-label': { fontWeight: 500 } }}
              />
              
              {error && (
                <Text color="red" size="sm" mb={10} align="center" weight={500}>
                  {error}
                </Text>
              )}
              
              <Button 
                type="submit" 
                fullWidth 
                radius="xl"
                size="lg"
                rightIcon={<IconArrowRight size={18} />}
                loading={loading}
                disabled={!agreeToTerms || password !== confirmPassword || passwordStrength < 2 || loading}
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
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.5), rgba(200, 80, 192, 0.5))',
                    boxShadow: 'none',
                    transform: 'none'
                  }
                }}
              >
                Create Account
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
            Already have an account?{' '}
            <Anchor 
              component="a" 
              href="/signin"
              sx={{ 
                fontWeight: 700,
                color: '#4158D0',
                '&:hover': { textDecoration: 'none', color: '#C850C0' }
              }}
            >
              Sign In
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
