import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureComparisonTable from '../components/FeatureComparisonTable';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';
import PricingToggle from '../components/PricingToggle';
import PricingCalculator from '../components/PricingCalculator';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, Center, 
  Stack as MantineStack, Transition, Image, Box, Divider, List, ThemeIcon,
  Switch, useMantineTheme
} from '@mantine/core';
import { 
  IconCheck, IconX, IconRocket, IconCrown, IconBuilding, 
  IconArrowRight, IconUsers, IconFileText, IconVideo, 
  IconChecklist, IconQuestionMark
} from '@tabler/icons-react';

const pricingPlans = [
  {
    title: 'Free',
    description: 'For individuals and small teams just getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: 'Up to 3 team members', included: true },
      { text: 'Unlimited documents', included: true },
      { text: '5GB storage', included: true },
      { text: 'Basic task management', included: true },
      { text: 'Video meetings (up to 20 min)', included: true },
      { text: 'Team chat', included: true },
      { text: 'Email support', included: true },
      { text: 'Advanced security features', included: false },
      { text: 'Admin controls', included: false },
      { text: 'Custom integrations', included: false },
    ],
    ctaText: 'Get Started',
    ctaLink: '/documents',
    highlight: false,
    color: 'gray',
    icon: <IconRocket size={30} />
  },
  {
    title: 'Pro',
    description: 'For growing teams that need more power and flexibility',
    monthlyPrice: 12,
    yearlyPrice: 10,
    features: [
      { text: 'Up to 20 team members', included: true },
      { text: 'Unlimited documents', included: true },
      { text: '50GB storage', included: true },
      { text: 'Advanced task management', included: true },
      { text: 'Unlimited video meetings', included: true },
      { text: 'Team chat with history', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Basic security features', included: true },
      { text: 'Admin controls', included: true },
      { text: 'Custom integrations', included: false },
    ],
    ctaText: 'Upgrade to Pro',
    ctaLink: '/documents',
    highlight: true,
    color: 'indigo',
    icon: <IconCrown size={30} />
  },
  {
    title: 'Enterprise',
    description: 'For organizations that need advanced features and support',
    monthlyPrice: 'Custom',
    yearlyPrice: 'Custom',
    features: [
      { text: 'Unlimited team members', included: true },
      { text: 'Unlimited documents', included: true },
      { text: 'Unlimited storage', included: true },
      { text: 'Enterprise task management', included: true },
      { text: 'Unlimited video meetings', included: true },
      { text: 'Team chat with unlimited history', included: true },
      { text: '24/7 dedicated support', included: true },
      { text: 'Advanced security features', included: true },
      { text: 'Advanced admin controls', included: true },
      { text: 'Custom integrations', included: true },
    ],
    ctaText: 'Contact Sales',
    ctaLink: '/contact',
    highlight: false,
    color: 'dark',
    icon: <IconBuilding size={30} />
  }
];

const faqs = [
  {
    question: 'Can I try Stack before purchasing?',
    answer: 'Yes! You can start with our Free plan which includes core features for up to 3 team members. No credit card required.'
  },
  {
    question: 'How does billing work?',
    answer: "You can choose between monthly or annual billing. Annual billing saves you 15% compared to monthly billing. You'll be billed at the beginning of each billing cycle."
  },
  {
    question: 'Can I change plans later?',
    answer: "Absolutely! You can upgrade, downgrade, or cancel your plan at any time. If you upgrade, you'll be prorated for the remainder of your billing cycle."
  },
  {
    question: 'Is there a limit to how many documents I can create?',
    answer: 'No, all plans include unlimited documents. Storage limits apply to the total size of your files and attachments.'
  },
  {
    question: 'Do you offer discounts for nonprofits or educational institutions?',
    answer: 'Yes, we offer special pricing for nonprofits, educational institutions, and open-source projects. Please contact our sales team for more information.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal. Enterprise customers can also pay by invoice.'
  }
];

export default function Pricing() {
  const theme = useMantineTheme();
  const [billingInterval, setBillingInterval] = useState('annual');
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      <Head>
        <title>Pricing | Stack - Real-Time Collaboration Platform</title>
        <meta name="description" content="Choose the perfect Stack plan for your team. From Free to Enterprise, we have options for teams of all sizes." />
      </Head>

      {/* Hero Section */}
      <Box sx={(theme) => ({
        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        color: 'white',
        padding: '100px 0 120px',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        position: 'relative',
        overflow: 'hidden'
      })}>
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
              Pricing
            </Badge>
            <Title order={1} align="center" mb={20} sx={{ 
              fontSize: '36px',
              '@media (min-width: 576px)': { fontSize: '48px' },
              '@media (min-width: 768px)': { fontSize: '56px' },
              fontWeight: 900,
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              Choose the perfect plan for your team
            </Title>
            <Text align="center" mb={40} sx={{ 
              fontSize: '18px',
              '@media (min-width: 768px)': { fontSize: '22px' },
              maxWidth: 700,
              lineHeight: 1.6,
              opacity: 0.9
            }}>
              No hidden fees or complicated pricing structures. Just simple, transparent pricing that scales with your team.
            </Text>
            
            <Box mb={30} sx={{ maxWidth: 400, margin: '0 auto' }}>
              <PricingToggle 
                onChange={(isAnnual) => setYearly(isAnnual)}
                defaultValue={yearly}
              />
            </Box>
          </MantineStack>
        </Container>
      </Box>

      {/* Pricing Cards */}
      <Container size="lg" sx={{ marginTop: -60 }}>
        <SimpleGrid cols={3} spacing={30} breakpoints={[
          { maxWidth: 980, cols: 2 },
          { maxWidth: 755, cols: 1 },
        ]}>
          {pricingPlans.map((plan) => {
            const price = typeof plan.monthlyPrice === 'number' && typeof plan.yearlyPrice === 'number'
              ? (yearly ? plan.yearlyPrice : plan.monthlyPrice)
              : plan.monthlyPrice;
              
            return (
              <Card 
                key={plan.title} 
                shadow="md" 
                p="xl" 
                radius="lg" 
                withBorder
                sx={(theme) => ({
                  borderColor: plan.highlight ? theme.colors[plan.color][5] : theme.colors.gray[3],
                  transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
                  position: 'relative',
                  overflow: 'visible',
                  '@media (max-width: 980px)': {
                    transform: 'scale(1)',
                  }
                })}
              >
                {plan.highlight && (
                  <Badge 
                    color={plan.color} 
                    variant="filled"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      right: 20,
                      fontSize: '0.9rem',
                      padding: '0.3rem 0.8rem',
                    }}
                  >
                    Most Popular
                  </Badge>
                )}
                
                <Group position="apart" mb={20}>
                  <Box>
                    <Group spacing={10}>
                      <ThemeIcon 
                        size={50} 
                        radius="md" 
                        color={plan.color} 
                        variant="light"
                        sx={{
                          boxShadow: `0 8px 16px ${plan.color === 'indigo' ? 'rgba(92, 107, 192, 0.2)' : 
                                     plan.color === 'dark' ? 'rgba(66, 66, 66, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                          border: '3px solid rgba(255, 255, 255, 0.8)'
                        }}
                      >
                        {plan.icon}
                      </ThemeIcon>
                      <Title order={3} sx={{ fontWeight: 700 }}>{plan.title}</Title>
                    </Group>
                    <Text color="dimmed" size="sm" mt={8} sx={{ lineHeight: 1.5 }}>
                      {plan.description}
                    </Text>
                  </Box>
                </Group>

                <Box mb={30}>
                  <Group spacing={5} align="flex-end">
                    {typeof price === 'number' ? (
                      <>
                        <Text 
                          size={48} 
                          weight={800} 
                          sx={{ 
                            background: plan.highlight ? 'linear-gradient(135deg, #4158D0, #C850C0)' : 'inherit',
                            WebkitBackgroundClip: plan.highlight ? 'text' : 'inherit',
                            WebkitTextFillColor: plan.highlight ? 'transparent' : 'inherit',
                          }}
                        >
                          ${price}
                        </Text>
                        <Text size="sm" color="dimmed" pb={8} sx={{ fontWeight: 500 }}>/ user / month</Text>
                      </>
                    ) : (
                      <Text 
                        size={48} 
                        weight={800}
                        sx={{ 
                          background: 'linear-gradient(135deg, #333, #666)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {price}
                      </Text>
                    )}
                  </Group>
                  {yearly && typeof plan.yearlyPrice === 'number' && typeof plan.monthlyPrice === 'number' && (
                    <Text size="sm" color="dimmed" sx={{ fontStyle: 'italic' }}>
                      Billed annually (${plan.yearlyPrice * 12}/year)
                    </Text>
                  )}
                </Box>

                <Divider mb={20} />

                <List spacing="sm" mb={30} center>
                  {plan.features.map((feature, index) => (
                    <List.Item 
                      key={index}
                      icon={
                        <ThemeIcon 
                          color={feature.included ? plan.color : 'gray'} 
                          size={24} 
                          radius="xl"
                          variant={feature.included ? 'light' : 'subtle'}
                        >
                          {feature.included ? <IconCheck size={16} /> : <IconX size={16} />}
                        </ThemeIcon>
                      }
                      sx={{ opacity: feature.included ? 1 : 0.6 }}
                    >
                      {feature.text}
                    </List.Item>
                  ))}
                </List>

                <Button 
                  fullWidth 
                  size="lg" 
                  radius="xl"
                  color={plan.color}
                  variant={plan.highlight ? 'filled' : 'outline'}
                  component="a"
                  href={plan.ctaLink}
                  sx={{
                    height: 50,
                    fontWeight: 600,
                    fontSize: 16,
                    transition: 'all 0.3s ease',
                    ...(plan.highlight ? {
                      background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                      boxShadow: '0 8px 16px rgba(65, 88, 208, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 20px rgba(65, 88, 208, 0.4)'
                      }
                    } : {
                      borderWidth: 2,
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)'
                      }
                    })
                  }}
                >
                  {plan.ctaText}
                </Button>
              </Card>
            );
          })}
        </SimpleGrid>
      </Container>

      {/* Feature Comparison */}
      <Container size="lg" py={80}>
        <Title order={2} align="center" mb={50}>
          Compare all features
        </Title>
        
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 800 }}>
            <Group position="apart" mb={20} px={20}>
              <Box style={{ width: '30%' }}>
                <Title order={4}>Features</Title>
              </Box>
              {pricingPlans.map((plan) => (
                <Box key={plan.title} style={{ width: '20%' }}>
                  <Group>
                    <ThemeIcon size={24} radius="md" color={plan.color} variant="light">
                      {plan.icon}
                    </ThemeIcon>
                    <Title order={4}>{plan.title}</Title>
                  </Group>
                </Box>
              ))}
            </Group>
            
            <Divider mb={20} />
            
            {/* Collaboration Features */}
            <Box mb={30}>
              <Group position="apart" mb={10} px={20} sx={{ background: theme.colors.gray[0], padding: 10 }}>
                <Box style={{ width: '100%' }}>
                  <Title order={5}>Collaboration Features</Title>
                </Box>
              </Group>
              
              <Group position="apart" mb={15} px={20}>
                <Box style={{ width: '30%' }}>
                  <Group>
                    <IconFileText size={20} />
                    <Text>Documents</Text>
                  </Group>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Basic</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Advanced</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Enterprise</Text>
                </Box>
              </Group>
              
              <Group position="apart" mb={15} px={20}>
                <Box style={{ width: '30%' }}>
                  <Group>
                    <IconVideo size={20} />
                    <Text>Video Meetings</Text>
                  </Group>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>20 min limit</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Unlimited</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Unlimited + Recording</Text>
                </Box>
              </Group>
              
              <Group position="apart" mb={15} px={20}>
                <Box style={{ width: '30%' }}>
                  <Group>
                    <IconUsers size={20} />
                    <Text>Team Chat</Text>
                  </Group>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Basic</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Advanced</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Enterprise</Text>
                </Box>
              </Group>
              
              <Group position="apart" mb={15} px={20}>
                <Box style={{ width: '30%' }}>
                  <Group>
                    <IconChecklist size={20} />
                    <Text>Task Management</Text>
                  </Group>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Basic</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Advanced</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Enterprise</Text>
                </Box>
              </Group>
            </Box>
            
            {/* Security Features */}
            <Box>
              <Group position="apart" mb={10} px={20} sx={{ background: theme.colors.gray[0], padding: 10 }}>
                <Box style={{ width: '100%' }}>
                  <Title order={5}>Security & Support</Title>
                </Box>
              </Group>
              
              <Group position="apart" mb={15} px={20}>
                <Box style={{ width: '30%' }}>
                  <Text>Two-factor authentication</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <ThemeIcon color="gray" size={20} radius="xl" variant="subtle">
                    <IconX size={14} />
                  </ThemeIcon>
                </Box>
                <Box style={{ width: '20%' }}>
                  <ThemeIcon color="indigo" size={20} radius="xl" variant="light">
                    <IconCheck size={14} />
                  </ThemeIcon>
                </Box>
                <Box style={{ width: '20%' }}>
                  <ThemeIcon color="dark" size={20} radius="xl" variant="light">
                    <IconCheck size={14} />
                  </ThemeIcon>
                </Box>
              </Group>
              
              <Group position="apart" mb={15} px={20}>
                <Box style={{ width: '30%' }}>
                  <Text>SSO Integration</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <ThemeIcon color="gray" size={20} radius="xl" variant="subtle">
                    <IconX size={14} />
                  </ThemeIcon>
                </Box>
                <Box style={{ width: '20%' }}>
                  <ThemeIcon color="gray" size={20} radius="xl" variant="subtle">
                    <IconX size={14} />
                  </ThemeIcon>
                </Box>
                <Box style={{ width: '20%' }}>
                  <ThemeIcon color="dark" size={20} radius="xl" variant="light">
                    <IconCheck size={14} />
                  </ThemeIcon>
                </Box>
              </Group>
              
              <Group position="apart" mb={15} px={20}>
                <Box style={{ width: '30%' }}>
                  <Text>Support</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Email</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>Priority Email</Text>
                </Box>
                <Box style={{ width: '20%' }}>
                  <Text>24/7 Dedicated</Text>
                </Box>
              </Group>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* FAQs */}
      <Box sx={(theme) => ({
        background: theme.colors.gray[0],
        padding: '80px 0',
      })}>
        <Container size="lg">
          <Title order={2} align="center" mb={50}>
            Frequently Asked Questions
          </Title>
          
          <SimpleGrid cols={2} spacing={30} breakpoints={[
            { maxWidth: 768, cols: 1 },
          ]}>
            {faqs.map((faq, index) => (
              <Card key={index} shadow="sm" p="lg" radius="md" withBorder>
                <Group spacing={10} mb={10}>
                  <ThemeIcon size={30} radius="xl" color="indigo" variant="light">
                    <IconQuestionMark size={18} />
                  </ThemeIcon>
                  <Title order={4}>{faq.question}</Title>
                </Group>
                <Text color="dimmed">{faq.answer}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container size="md" py={80}>
        <Card shadow="xl" p={40} radius="lg" withBorder sx={{
          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
          color: 'white',
        }}>
          <MantineStack align="center">
            <Title order={2} align="center" mb={10}>
              Ready to get started with Stack?
            </Title>
            <Text size="lg" align="center" mb={30}>
              Join thousands of teams that use Stack to collaborate more effectively and get more done.
            </Text>
            <Group>
              <Button 
                component={Link} 
                href="/documents" 
                size="lg" 
                radius="xl" 
                color="white"
                variant="filled"
                leftIcon={<IconRocket size={20} />}
              >
                Start for Free
              </Button>
              <Button 
                component={Link} 
                href="/contact" 
                size="lg" 
                radius="xl" 
                variant="outline"
                color="white"
              >
                Contact Sales
              </Button>
            </Group>
          </MantineStack>
        </Card>
      </Container>
      
      {/* Pricing Calculator */}
      <PricingCalculator />
      
      {/* Feature Comparison Table */}
      <FeatureComparisonTable />
      
      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
    </div>
  );
}
