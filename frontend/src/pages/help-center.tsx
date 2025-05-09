import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, 
  Tabs, Accordion, Box, List, ThemeIcon, Divider, Anchor, Code
} from '@mantine/core';
import { 
  IconHeadset, IconSearch, IconBook, IconQuestionMark, IconVideo,
  IconArrowRight, IconCircleCheck, IconExternalLink, IconBrandSlack
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';

// Help categories
const helpCategories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of Stack and how to set up your account',
    icon: <IconBook size={24} />,
    articles: [
      'How to create an account',
      'Setting up your first workspace',
      'Inviting team members',
      'Navigating the dashboard'
    ]
  },
  {
    title: 'Documents',
    description: 'Learn how to create, edit, and share documents',
    icon: <IconBook size={24} />,
    articles: [
      'Creating a new document',
      'Real-time collaboration features',
      'Document formatting options',
      'Sharing and permissions'
    ]
  },
  {
    title: 'Meetings',
    description: 'Learn how to schedule and conduct video meetings',
    icon: <IconVideo size={24} />,
    articles: [
      'Scheduling a meeting',
      'Joining a meeting',
      'Screen sharing and recording',
      'Meeting settings and controls'
    ]
  },
  {
    title: 'Account & Billing',
    description: 'Manage your account settings and billing information',
    icon: <IconHeadset size={24} />,
    articles: [
      'Updating account information',
      'Managing subscription plans',
      'Payment methods and billing',
      'Upgrading or downgrading'
    ]
  }
];

// FAQ items
const faqItems = [
  {
    question: 'How do I reset my password?',
    answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you a link to reset your password. Follow the instructions in the email to create a new password.'
  },
  {
    question: 'Can I use Stack on mobile devices?',
    answer: 'Yes, Stack is fully responsive and works on mobile devices. You can access Stack through your mobile browser, or download our native mobile apps for iOS and Android for an optimized experience.'
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'To cancel your subscription, go to Account Settings > Billing > Subscription and click on "Cancel Subscription". Follow the prompts to complete the cancellation. Your account will remain active until the end of your current billing period.'
  },
  {
    question: 'Is my data secure with Stack?',
    answer: 'Yes, we take security very seriously. Stack uses industry-standard encryption for all data, both in transit and at rest. We implement strict access controls, regular security audits, and compliance with major security standards.'
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can contact our customer support team through the chat widget in the bottom right corner of any page, by emailing support@stackapp.com, or by visiting our Contact page to submit a support ticket.'
  }
];

export default function HelpCenter() {
  return (
    <div>
      <Head>
        <title>Help Center | Stack</title>
        <meta name="description" content="Get help with Stack - find answers to common questions and learn how to use our platform effectively." />
      </Head>

      <Navbar />
      
      {/* Help Center Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
          color: 'white',
          padding: '120px 0 80px',
          marginTop: '30px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container size="lg">
          <Box sx={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <Badge 
              size="xl" 
              radius="xl" 
              color="pink" 
              variant="filled" 
              mb={20}
              sx={{
                padding: '10px 20px',
                textTransform: 'uppercase',
                fontWeight: 700
              }}
            >
              Help Center
            </Badge>
            
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              How can we help you?
            </Title>
            
            <Text size="xl" mb={40} sx={{ lineHeight: 1.6 }}>
              Find answers to common questions and learn how to use Stack effectively.
            </Text>
            
            {/* Search Bar */}
            <Box 
              sx={{ 
                position: 'relative',
                maxWidth: 600,
                margin: '0 auto'
              }}
            >
              <Box 
                component="input"
                placeholder="Search for help articles..."
                sx={{
                  width: '100%',
                  height: 56,
                  padding: '0 20px 0 50px',
                  borderRadius: 30,
                  border: 'none',
                  fontSize: 16,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  '&:focus': {
                    outline: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                  }
                }}
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: '50%',
                  left: 20,
                  transform: 'translateY(-50%)',
                  color: '#4158D0'
                }}
              >
                <IconSearch size={20} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Help Categories */}
      <Container size="lg" py={80}>
        <Title order={2} mb={50} align="center">Browse by category</Title>
        
        <SimpleGrid cols={2} spacing={30} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          {helpCategories.map((category, index) => (
            <Card key={index} p="xl" radius="md" withBorder>
              <Group position="apart" mb={20}>
                <Group>
                  <ThemeIcon 
                    size={50} 
                    radius="md" 
                    variant="light" 
                    color="blue"
                    sx={{ 
                      background: 'rgba(65, 88, 208, 0.1)',
                      color: '#4158D0'
                    }}
                  >
                    {category.icon}
                  </ThemeIcon>
                  <div>
                    <Title order={3} size="h4">{category.title}</Title>
                    <Text color="dimmed" size="sm">{category.description}</Text>
                  </div>
                </Group>
              </Group>
              
              <List spacing="sm">
                {category.articles.map((article, articleIndex) => (
                  <List.Item 
                    key={articleIndex}
                    icon={
                      <ThemeIcon color="blue" size={20} radius="xl">
                        <IconArrowRight size={12} />
                      </ThemeIcon>
                    }
                  >
                    <Text component="a" href="#" sx={{ 
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { color: '#4158D0' }
                    }}>
                      {article}
                    </Text>
                  </List.Item>
                ))}
              </List>
              
              <Button 
                variant="subtle" 
                color="blue" 
                mt={20}
                rightIcon={<IconArrowRight size={16} />}
                sx={{ fontWeight: 600 }}
              >
                View all articles
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
      
      {/* FAQ Section */}
      <Box py={80} sx={{ background: '#f8f9fa' }}>
        <Container size="lg">
          <Title order={2} mb={50} align="center">Frequently Asked Questions</Title>
          
          <Accordion 
            variant="separated"
            radius="md"
            chevronPosition="right"
            styles={{
              chevron: {
                '&[data-position="right"]': {
                  display: 'none'
                }
              },
              control: {
                '&:hover': {
                  backgroundColor: 'rgba(65, 88, 208, 0.05)'
                },
                padding: '20px 30px',
                '&::after': {
                  content: '"+"',
                  fontWeight: 700,
                  fontSize: 20,
                  color: '#4158D0'
                },
                '&[aria-expanded="true"]::after': {
                  content: '"-"',
                  fontWeight: 700,
                  fontSize: 20,
                  color: '#4158D0'
                }
              },
              label: {
                fontWeight: 600,
                fontSize: 18
              },
              content: {
                padding: '0 30px 20px'
              }
            }}
            sx={{ maxWidth: 800, margin: '0 auto' }}
          >
            {faqItems.map((item, index) => (
              <Accordion.Item key={index} value={`faq-${index}`}>
                <Accordion.Control>
                  <Text>{item.question}</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text>{item.answer}</Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Container>
      </Box>
      
      {/* Contact Support */}
      <Container size="md" py={80}>
        <Card withBorder radius="lg" p={40}>
          <Group position="apart" align="flex-start">
            <Box sx={{ maxWidth: 500 }}>
              <Title order={2} mb={15}>Still need help?</Title>
              <Text size="lg" color="dimmed" mb={30}>
                Our support team is available to assist you with any questions or issues you may have.
              </Text>
              
              <List 
                spacing="md" 
                mb={30}
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <IconCircleCheck size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <Text weight={500}>24/7 customer support</Text>
                </List.Item>
                <List.Item>
                  <Text weight={500}>Dedicated account managers for Business and Enterprise plans</Text>
                </List.Item>
                <List.Item>
                  <Text weight={500}>Comprehensive onboarding assistance</Text>
                </List.Item>
              </List>
              
              <Group>
                <Button 
                  component={Link}
                  href="/contact"
                  size="md"
                  radius="xl"
                  leftIcon={<IconHeadset size={20} />}
                  sx={{ 
                    background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                    padding: '0 30px',
                    height: 48
                  }}
                >
                  Contact Support
                </Button>
                
                <Button 
                  component="a"
                  href="https://slack.stackapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="md"
                  radius="xl"
                  variant="outline"
                  color="blue"
                  leftIcon={<IconBrandSlack size={20} />}
                  sx={{ 
                    padding: '0 30px',
                    height: 48
                  }}
                >
                  Join Community
                </Button>
              </Group>
            </Box>
            
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.1), rgba(200, 80, 192, 0.1))',
                borderRadius: 16,
                padding: 30,
                maxWidth: 300,
                '@media (max-width: 768px)': {
                  display: 'none'
                }
              }}
            >
              <Title order={4} mb={15}>Support Hours</Title>
              <Text mb={20}>
                Our support team is available Monday through Friday, 9am-6pm EST.
              </Text>
              
              <Title order={4} mb={15}>Average Response Time</Title>
              <Text mb={20}>
                We typically respond to all inquiries within 2 hours during business hours.
              </Text>
              
              <Button 
                component="a"
                href="mailto:support@stackapp.com"
                variant="subtle"
                color="blue"
                fullWidth
                leftIcon={<IconExternalLink size={16} />}
              >
                support@stackapp.com
              </Button>
            </Box>
          </Group>
        </Card>
      </Container>

      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
    </div>
  );
}
