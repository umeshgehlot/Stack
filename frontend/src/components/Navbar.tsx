import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Group, Button, Box, Text, Burger, Drawer, Stack, ThemeIcon, Divider, Container, Badge, Avatar } from '@mantine/core';
import { 
  IconRocket, IconChevronDown, IconBrandGithub, IconBrandTwitter, 
  IconBrandLinkedin, IconArrowRight, IconUser
} from '@tabler/icons-react';
import NotificationCenter from './NotificationCenter';
import UserProfileDropdown from './UserProfileDropdown';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [opened, setOpened] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Check if user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navItems = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Resources', href: '#', hasDropdown: true, dropdownItems: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Community', href: '/community' },
    ]},
  ];

  return (
    <>
      {/* Floating Navbar */}
      <Box
        style={{
          position: 'fixed',
          top: scrolled ? 0 : 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: scrolled ? '100%' : 'calc(100% - 40px)',
          maxWidth: scrolled ? '100%' : 1400,
          zIndex: 100,
          padding: scrolled ? '12px 20px' : '14px 24px',
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : transparent ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 2px 15px rgba(0, 0, 0, 0.08)' : 'none',
          borderRadius: scrolled ? '0' : '20px',
          color: scrolled ? '#333' : transparent ? 'white' : '#333',
          transition: 'all 0.3s ease',
          borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none'
        }}
      >
        <Container size="xl" px={0}>
        <Group position="apart" style={{ width: '100%' }}>
          {/* Logo */}
          <Group spacing={10} style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
            <ThemeIcon 
              size={42} 
              radius="xl" 
              sx={{
                background: scrolled || !transparent 
                  ? 'linear-gradient(135deg, #4158D0, #C850C0)' 
                  : 'rgba(255, 255, 255, 0.9)',
                color: scrolled || !transparent ? 'white' : '#4158D0',
                border: scrolled || !transparent ? 'none' : '2px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <IconRocket size={24} stroke={1.5} />
            </ThemeIcon>
            <Text 
              size="xl" 
              weight={800}
              color={scrolled || !transparent ? undefined : "white"}
              sx={{ 
                letterSpacing: '-0.5px',
                background: scrolled || !transparent 
                  ? 'linear-gradient(135deg, #4158D0, #C850C0)' 
                  : 'white',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: scrolled || !transparent ? 'transparent' : 'white',
              }}
            >
              Stack
            </Text>
            {scrolled && (
              <Badge 
                variant="filled" 
                color="pink" 
                radius="sm" 
                size="sm"
                sx={{ 
                  textTransform: 'lowercase', 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #C850C0, #FFCC70)'
                }}
              >
                beta
              </Badge>
            )}
          </Group>

          {/* Desktop Navigation */}
          <Group spacing={30} sx={{ '@media (max-width: 768px)': { display: 'none' } }}>
            {navItems.map((item) => (
              <Group key={item.label} spacing={5} sx={{ position: 'relative' }}>
                <Text 
                  component="a"
                  href={item.hasDropdown ? undefined : item.href}
                  weight={600}
                  color={scrolled ? undefined : transparent ? "white" : undefined}
                  style={{
                    cursor: 'pointer',
                    opacity: router.pathname === item.href ? 1 : 0.8,
                    position: 'relative',
                    padding: '5px 0',
                  }}
                  sx={{
                    '&:hover': { 
                      textDecoration: 'none', 
                      opacity: 1,
                    },
                    '&::after': router.pathname === item.href ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'linear-gradient(90deg, #4158D0, #C850C0)',
                      borderRadius: '2px',
                    } : {}
                  }}
                >
                  {item.label}
                </Text>
                {item.hasDropdown && (
                  <IconChevronDown 
                    size={16} 
                    color={scrolled || !transparent ? undefined : "white"} 
                    style={{ opacity: 0.7 }}
                  />
                )}
              </Group>
            ))}
          </Group>

          {/* Notification Center, User Profile, and Auth Buttons */}
          <Group spacing={15} sx={{ '@media (max-width: 768px)': { display: 'none' } }}>
            <NotificationCenter />
            
            {/* Toggle between auth buttons and user profile dropdown */}
            {false ? ( // Change to a state variable or auth check in a real app
              <UserProfileDropdown />
            ) : (
              <Group spacing={10}>
                <Button 
                  component="a"
                  href="/signin" 
                  variant="subtle" 
                  radius="xl"
                  color={scrolled ? "dark" : transparent ? "white" : "dark"}
                  sx={{
                    fontWeight: 600,
                    fontSize: '15px',
                    padding: '0 15px',
                    height: '42px',
                    '&:hover': {
                      backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.05)' : transparent ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  component="a"
                  href="/signup" 
                  variant={scrolled ? "filled" : transparent ? "white" : "filled"} 
                  radius="xl"
                  rightIcon={<IconArrowRight size={16} />}
                  sx={{
                    fontWeight: 600,
                    fontSize: '15px',
                    padding: '0 20px',
                    height: '42px',
                    border: scrolled || !transparent ? 'none' : '1px solid white',
                    background: 'linear-gradient(90deg, #4F46E5, #C026D3)',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #4338CA, #A21CAF)',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Sign Up Free
                </Button>
              </Group>
            )}
          </Group>

          {/* Mobile Menu Button */}
          <Burger 
            opened={opened} 
            onClick={() => setOpened(true)} 
            size="sm"
            color={scrolled || !transparent ? undefined : "white"}
            sx={{ '@media (min-width: 769px)': { display: 'none' } }}
          />
        </Group>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        size="100%"
        padding="md"
        title={
          <Group spacing={8}>
            <ThemeIcon size={40} radius="xl" color="indigo">
              <IconRocket size={24} />
            </ThemeIcon>
            <Text size="xl" weight={700}>Stack</Text>
          </Group>
        }
        zIndex={1000}
      >
        <Divider my="sm" />
        <Stack spacing="sm">
          {navItems.map((item) => (
            <Text
              key={item.label}
              component="a"
              href={item.href}
              size="lg"
              weight={500}
              onClick={() => setOpened(false)}
              style={{
                display: 'block',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              sx={{
                '&:hover': { backgroundColor: '#f8f9fa' }
              }}
            >
              {item.label}
            </Text>
          ))}
          <Divider my="sm" />
          <Group position="center" grow pb="xl" px="md">
            <Button 
              component="a" 
              href="/signin" 
              variant="outline" 
              radius="xl"
              sx={{
                fontWeight: 600,
                height: 46,
                borderWidth: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </Button>
            <Button 
              component="a" 
              href="/signup" 
              radius="xl"
              sx={{
                fontWeight: 600,
                height: 46,
                background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3a4ec0, #b845af)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Sign Up Free
            </Button>
          </Group>
          
          <Divider my="sm" />
          
          <Group position="center" spacing={20} py="md">
            <ThemeIcon 
              size={36} 
              radius="xl" 
              variant="light"
              sx={{
                '&:hover': { transform: 'translateY(-3px)' },
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <IconBrandTwitter size={20} stroke={1.5} />
            </ThemeIcon>
            <ThemeIcon 
              size={36} 
              radius="xl" 
              variant="light"
              sx={{
                '&:hover': { transform: 'translateY(-3px)' },
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <IconBrandGithub size={20} stroke={1.5} />
            </ThemeIcon>
            <ThemeIcon 
              size={36} 
              radius="xl" 
              variant="light"
              sx={{
                '&:hover': { transform: 'translateY(-3px)' },
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <IconBrandLinkedin size={20} stroke={1.5} />
            </ThemeIcon>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
