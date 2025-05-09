import React from 'react';
import Link from 'next/link';
import { 
  Container, Grid, Group, Text, Title, Box, Divider, 
  Stack as MantineStack, Button, TextInput, ActionIcon 
} from '@mantine/core';
import { 
  IconBrandTwitter, IconBrandLinkedin, IconBrandGithub, 
  IconArrowRight, IconBrandYoutube, IconBrandInstagram 
} from '@tabler/icons-react';

export default function Footer() {
  const [email, setEmail] = React.useState('');

  return (
    <Box component="footer" sx={{ 
      background: '#f8f9fa',
      borderTop: '1px solid #e9ecef',
      paddingTop: 80,
      paddingBottom: 40
    }}>
      <Container size="lg">
        <Grid gutter={50}>
          <Grid.Col md={4}>
            <MantineStack spacing={20}>
              <Box>
                <Link href="/" 
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <Box 
                    sx={{ 
                      background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 20,
                      color: 'white',
                      marginRight: 10,
                      boxShadow: '0 4px 10px rgba(65, 88, 208, 0.2)'
                    }}
                  >
                    S
                  </Box>
                  <Text weight={800} size="xl">Stack</Text>
                </Link>
              </Box>
              
              <Text color="dimmed" size="sm" sx={{ maxWidth: 300 }}>
                Stack is a real-time collaboration platform that helps teams work together more efficiently, no matter where they are.
              </Text>
              
              <Group spacing={10}>
                <ActionIcon 
                  size="lg" 
                  radius="xl" 
                  variant="filled" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #1DA1F2, #0E71C8)',
                    boxShadow: '0 4px 10px rgba(29, 161, 242, 0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 14px rgba(29, 161, 242, 0.3)'
                    }
                  }}
                >
                  <IconBrandTwitter size={18} />
                </ActionIcon>
                <ActionIcon 
                  size="lg" 
                  radius="xl" 
                  variant="filled" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #0077B5, #00669E)',
                    boxShadow: '0 4px 10px rgba(0, 119, 181, 0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 14px rgba(0, 119, 181, 0.3)'
                    }
                  }}
                >
                  <IconBrandLinkedin size={18} />
                </ActionIcon>
                <ActionIcon 
                  size="lg" 
                  radius="xl" 
                  variant="filled" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #333333, #24292E)',
                    boxShadow: '0 4px 10px rgba(36, 41, 46, 0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 14px rgba(36, 41, 46, 0.3)'
                    }
                  }}
                >
                  <IconBrandGithub size={18} />
                </ActionIcon>
                <ActionIcon 
                  size="lg" 
                  radius="xl" 
                  variant="filled" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #FF0000, #CC0000)',
                    boxShadow: '0 4px 10px rgba(255, 0, 0, 0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 14px rgba(255, 0, 0, 0.3)'
                    }
                  }}
                >
                  <IconBrandYoutube size={18} />
                </ActionIcon>
                <ActionIcon 
                  size="lg" 
                  radius="xl" 
                  variant="filled" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    boxShadow: '0 4px 10px rgba(220, 39, 67, 0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 14px rgba(220, 39, 67, 0.3)'
                    }
                  }}
                >
                  <IconBrandInstagram size={18} />
                </ActionIcon>
              </Group>
            </MantineStack>
          </Grid.Col>
          
          <Grid.Col md={2} sm={4} xs={6}>
            <Title order={4} mb={20} sx={{ fontWeight: 700 }}>Product</Title>
            <MantineStack spacing={10}>
              <Link href="/features"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Features
                </Text>
              </Link>
              <Link href="/pricing"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Pricing
                </Text>
              </Link>
              <Link href="/integrations"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Integrations
                </Text>
              </Link>
              <Link href="/api-docs"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  API
                </Text>
              </Link>
            </MantineStack>
          </Grid.Col>
          
          <Grid.Col md={2} sm={4} xs={6}>
            <Title order={4} mb={20} sx={{ fontWeight: 700 }}>Company</Title>
            <MantineStack spacing={10}>
              <Link href="/about"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  About
                </Text>
              </Link>
              <Link href="/careers"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Careers
                </Text>
              </Link>
              <Link href="/contact"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Contact
                </Text>
              </Link>
              <Link href="/blog"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Blog
                </Text>
              </Link>
            </MantineStack>
          </Grid.Col>
          
          <Grid.Col md={2} sm={4} xs={6}>
            <Title order={4} mb={20} sx={{ fontWeight: 700 }}>Resources</Title>
            <MantineStack spacing={10}>
              <Link href="/documentation"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Documentation
                </Text>
              </Link>
              <Link href="/help-center"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Help Center
                </Text>
              </Link>
              <Link href="/tutorials"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Tutorials
                </Text>
              </Link>
              <Link href="/webinars"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Webinars
                </Text>
              </Link>
            </MantineStack>
          </Grid.Col>
          
          <Grid.Col md={2} sm={4} xs={6}>
            <Title order={4} mb={20} sx={{ fontWeight: 700 }}>Legal</Title>
            <MantineStack spacing={10}>
              <Link href="/terms"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Terms of Service
                </Text>
              </Link>
              <Link href="/privacy"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Privacy Policy
                </Text>
              </Link>
              <Link href="/cookie-policy-fixed"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Cookie Policy
                </Text>
              </Link>
              <Link href="/security"
                style={{ textDecoration: 'none' }}
              >
                <Text 
                  color="dimmed" 
                  size="sm"
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4158D0',
                      transform: 'translateX(3px)'
                    },
                    display: 'inline-block'
                  }}
                >
                  Security
                </Text>
              </Link>
            </MantineStack>
          </Grid.Col>
        </Grid>
        
        <Box mt={80} mb={30} sx={{ 
          background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.05) 0%, rgba(200, 80, 192, 0.05) 100%)',
          borderRadius: 16,
          padding: '30px 40px',
          '@media (max-width: 768px)': {
            padding: '20px'
          }
        }}>
          <Grid gutter={30} align="center">
            <Grid.Col md={7}>
              <Title order={3} mb={5} sx={{ fontWeight: 700 }}>Stay in the loop</Title>
              <Text color="dimmed">
                Subscribe to our newsletter to get the latest updates and news.
              </Text>
            </Grid.Col>
            <Grid.Col md={5}>
              <Group spacing={10} noWrap sx={{ 
                '@media (max-width: 768px)': {
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }
              }}>
                <TextInput 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  radius="xl"
                  size="md"
                  sx={{ 
                    flexGrow: 1,
                    '& input': { 
                      height: 46,
                      borderColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    '@media (max-width: 768px)': {
                      marginBottom: 10
                    }
                  }}
                />
                <Button 
                  rightIcon={<IconArrowRight size={16} />}
                  radius="xl"
                  size="md"
                  sx={{
                    height: 46,
                    paddingLeft: 25,
                    paddingRight: 25,
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    boxShadow: '0 4px 10px rgba(65, 88, 208, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 14px rgba(65, 88, 208, 0.4)'
                    }
                  }}
                >
                  Subscribe
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Box>
        
        <Divider my={30} />
        
        <Group position="apart" sx={{ 
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
              marginBottom: 15
            }
          }
        }}>
          <Text size="sm" color="dimmed">
            © {new Date().getFullYear()} Stack. All rights reserved.
          </Text>
          <Group spacing={30} sx={{ 
            '@media (max-width: 768px)': {
              justifyContent: 'center'
            }
          }}>
            <Text 
              component="a" 
              href="#" 
              color="dimmed" 
              size="sm"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: '#4158D0' }
              }}
            >
              Status
            </Text>
            <Text 
              component="a" 
              href="#" 
              color="dimmed" 
              size="sm"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: '#4158D0' }
              }}
            >
              Accessibility
            </Text>
            <Text 
              component="a" 
              href="#" 
              color="dimmed" 
              size="sm"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: '#4158D0' }
              }}
            >
              Sitemap
            </Text>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
