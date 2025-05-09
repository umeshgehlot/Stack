import React, { useState } from 'react';
import Head from 'next/head';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, Center, 
  Stack as MantineStack, Box, Divider, List, ThemeIcon, TextInput, Textarea, Select
} from '@mantine/core';
import { 
  IconSend, IconMapPin, IconPhone, IconMail, IconBrandTwitter, 
  IconBrandLinkedin, IconBrandGithub, IconCheck
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [inquiry, setInquiry] = useState('');
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
        <title>Contact Us | Stack - Real-Time Collaboration Platform</title>
        <meta name="description" content="Get in touch with the Stack team for questions, support, or partnership inquiries." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        color: 'white',
        padding: '100px 0 120px',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <Box sx={{ 
          position: 'absolute',
          top: '5%',
          left: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0
        }} />
        
        <Container size="lg">
          <MantineStack align="center" spacing={0}>
            <Badge 
              size="xl" 
              radius="xl" 
              color="pink" 
              variant="filled" 
              mb={20}
              sx={{
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(200, 80, 192, 0.3)'
              }}
            >
              Get in Touch
            </Badge>
            <Title order={1} align="center" mb={20} sx={{ 
              fontSize: '36px',
              '@media (min-width: 576px)': { fontSize: '48px' },
              '@media (min-width: 768px)': { fontSize: '56px' },
              fontWeight: 900,
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              We'd love to hear from you
            </Title>
            <Text align="center" mb={40} sx={{ 
              fontSize: '18px',
              '@media (min-width: 768px)': { fontSize: '22px' },
              maxWidth: 700,
              lineHeight: 1.6,
              opacity: 0.9
            }}>
              Have questions about Stack? Want to partner with us? Or just want to say hello? We're here to help.
            </Text>
          </MantineStack>
        </Container>
      </Box>

      {/* Contact Form Section */}
      <Container size="lg" sx={{ marginTop: -60 }}>
        <SimpleGrid cols={2} spacing={50} breakpoints={[
          { maxWidth: 980, cols: 1 },
        ]}>
          <Card 
            shadow="xl" 
            p={40} 
            radius="lg" 
            withBorder
            sx={{
              borderColor: 'rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              position: 'relative'
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
            
            <Title order={2} mb={30} sx={{ fontWeight: 800 }}>Send us a message</Title>
            
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <MantineStack spacing="lg">
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
                  
                  <Select
                    label="Inquiry Type"
                    placeholder="Select an option"
                    required
                    value={inquiry}
                    onChange={(value) => setInquiry(value || '')}
                    data={[
                      { value: 'general', label: 'General Question' },
                      { value: 'sales', label: 'Sales Inquiry' },
                      { value: 'support', label: 'Customer Support' },
                      { value: 'partnership', label: 'Partnership Opportunity' },
                      { value: 'press', label: 'Press Inquiry' }
                    ]}
                    size="md"
                    sx={{ '& input': { fontSize: '16px' } }}
                  />
                  
                  <TextInput
                    label="Subject"
                    placeholder="What's this about?"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    size="md"
                    sx={{ '& input': { fontSize: '16px' } }}
                  />
                  
                  <Textarea
                    label="Message"
                    placeholder="Tell us how we can help..."
                    required
                    minRows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    size="md"
                    sx={{ '& textarea': { fontSize: '16px' } }}
                  />
                  
                  <Button 
                    type="submit" 
                    size="lg"
                    radius="xl"
                    leftIcon={<IconSend size={18} />}
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
                    Send Message
                  </Button>
                </MantineStack>
              </form>
            ) : (
              <Box sx={{ textAlign: 'center', padding: '30px 0' }}>
                <ThemeIcon 
                  size={80} 
                  radius="xl" 
                  sx={{
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    boxShadow: '0 8px 16px rgba(65, 88, 208, 0.2)',
                    margin: '0 auto 20px'
                  }}
                >
                  <IconCheck size={40} stroke={1.5} color="white" />
                </ThemeIcon>
                <Title order={3} mb={15}>Message Sent!</Title>
                <Text size="lg" color="dimmed" mb={30} sx={{ maxWidth: 400, margin: '0 auto' }}>
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </Text>
                <Button 
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                    setInquiry('');
                  }}
                  variant="outline"
                  radius="xl"
                  sx={{
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.03)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Send Another Message
                </Button>
              </Box>
            )}
          </Card>
          
          <Box>
            <Title order={2} mb={30} sx={{ fontWeight: 800 }}>Contact Information</Title>
            
            <MantineStack spacing={30}>
              <Card 
                shadow="md" 
                p={30} 
                radius="lg" 
                withBorder
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Group spacing={20}>
                  <ThemeIcon 
                    size={50} 
                    radius="xl" 
                    sx={{
                      background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                      boxShadow: '0 8px 16px rgba(65, 88, 208, 0.2)'
                    }}
                  >
                    <IconMapPin size={24} stroke={1.5} color="white" />
                  </ThemeIcon>
                  <Box>
                    <Text weight={700} size="lg" mb={5}>Our Location</Text>
                    <Text color="dimmed">
                      123 Innovation Way<br />
                      San Francisco, CA 94107<br />
                      United States
                    </Text>
                  </Box>
                </Group>
              </Card>
              
              <Card 
                shadow="md" 
                p={30} 
                radius="lg" 
                withBorder
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Group spacing={20}>
                  <ThemeIcon 
                    size={50} 
                    radius="xl" 
                    sx={{
                      background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                      boxShadow: '0 8px 16px rgba(65, 88, 208, 0.2)'
                    }}
                  >
                    <IconPhone size={24} stroke={1.5} color="white" />
                  </ThemeIcon>
                  <Box>
                    <Text weight={700} size="lg" mb={5}>Phone</Text>
                    <Text color="dimmed">
                      +1 (555) 123-4567<br />
                      Monday - Friday, 9am - 6pm PST
                    </Text>
                  </Box>
                </Group>
              </Card>
              
              <Card 
                shadow="md" 
                p={30} 
                radius="lg" 
                withBorder
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Group spacing={20}>
                  <ThemeIcon 
                    size={50} 
                    radius="xl" 
                    sx={{
                      background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                      boxShadow: '0 8px 16px rgba(65, 88, 208, 0.2)'
                    }}
                  >
                    <IconMail size={24} stroke={1.5} color="white" />
                  </ThemeIcon>
                  <Box>
                    <Text weight={700} size="lg" mb={5}>Email</Text>
                    <Text color="dimmed">
                      info@stackplatform.com<br />
                      support@stackplatform.com
                    </Text>
                  </Box>
                </Group>
              </Card>
              
              <Box>
                <Text weight={700} size="lg" mb={15}>Follow Us</Text>
                <Group spacing={15}>
                  <ThemeIcon 
                    size={50} 
                    radius="xl" 
                    sx={{
                      background: 'linear-gradient(135deg, #1DA1F2, #0E71C8)',
                      boxShadow: '0 8px 16px rgba(29, 161, 242, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 20px rgba(29, 161, 242, 0.3)'
                      }
                    }}
                  >
                    <IconBrandTwitter size={24} stroke={1.5} color="white" />
                  </ThemeIcon>
                  <ThemeIcon 
                    size={50} 
                    radius="xl" 
                    sx={{
                      background: 'linear-gradient(135deg, #0077B5, #00669E)',
                      boxShadow: '0 8px 16px rgba(0, 119, 181, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 20px rgba(0, 119, 181, 0.3)'
                      }
                    }}
                  >
                    <IconBrandLinkedin size={24} stroke={1.5} color="white" />
                  </ThemeIcon>
                  <ThemeIcon 
                    size={50} 
                    radius="xl" 
                    sx={{
                      background: 'linear-gradient(135deg, #333333, #24292E)',
                      boxShadow: '0 8px 16px rgba(36, 41, 46, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 20px rgba(36, 41, 46, 0.3)'
                      }
                    }}
                  >
                    <IconBrandGithub size={24} stroke={1.5} color="white" />
                  </ThemeIcon>
                </Group>
              </Box>
            </MantineStack>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Map Section */}
      <Container size="lg" py={80}>
        <Card 
          shadow="md" 
          p={0} 
          radius="lg" 
          withBorder
          sx={{
            overflow: 'hidden',
            height: 400,
            borderColor: 'rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text size="lg" color="dimmed">Interactive map would be displayed here</Text>
          </Box>
        </Card>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ background: '#f8f9fa', padding: '80px 0' }}>
        <Container size="lg">
          <Title order={2} align="center" mb={10} sx={{ fontWeight: 800 }}>Frequently Asked Questions</Title>
          <Text align="center" color="dimmed" mb={50} sx={{ maxWidth: 600, margin: '0 auto' }}>
            Find quick answers to common questions about contacting us.
          </Text>
          
          <SimpleGrid cols={2} spacing={30} breakpoints={[
            { maxWidth: 755, cols: 1 },
          ]}>
            <Card 
              shadow="md" 
              p={30} 
              radius="lg" 
              withBorder
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Title order={4} mb={10}>What's the typical response time?</Title>
              <Text color="dimmed">
                We aim to respond to all inquiries within 24 hours during business days. For urgent support issues, our premium customers have access to priority support.
              </Text>
            </Card>
            
            <Card 
              shadow="md" 
              p={30} 
              radius="lg" 
              withBorder
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Title order={4} mb={10}>How can I get technical support?</Title>
              <Text color="dimmed">
                For technical support, please select "Customer Support" in the inquiry type dropdown. Our support team will get back to you as soon as possible.
              </Text>
            </Card>
            
            <Card 
              shadow="md" 
              p={30} 
              radius="lg" 
              withBorder
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Title order={4} mb={10}>I'm interested in partnering with Stack</Title>
              <Text color="dimmed">
                We're always open to partnership opportunities! Please select "Partnership Opportunity" in the form and provide details about your proposal.
              </Text>
            </Card>
            
            <Card 
              shadow="md" 
              p={30} 
              radius="lg" 
              withBorder
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Title order={4} mb={10}>Do you offer phone support?</Title>
              <Text color="dimmed">
                Yes, phone support is available for our Enterprise customers. If you're on another plan, please use our contact form and we'll get back to you via email.
              </Text>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>
      
      <Footer />
    </div>
  );
}
