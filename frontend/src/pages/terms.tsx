import React from 'react';
import Head from 'next/head';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, Center, 
  Stack as MantineStack, Box, Divider, List, ThemeIcon, Anchor
} from '@mantine/core';
import { IconArrowRight, IconCalendar, IconShield } from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div>
      <Head>
        <title>Terms of Service | Stack - Real-Time Collaboration Platform</title>
        <meta name="description" content="Read Stack's terms of service and legal agreements." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        color: 'white',
        padding: '80px 0 100px',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
              Legal
            </Badge>
            <Title order={1} align="center" mb={20} sx={{ 
              fontSize: '36px',
              '@media (min-width: 576px)': { fontSize: '48px' },
              fontWeight: 900,
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              Terms of Service
            </Title>
            <Text align="center" mb={10} sx={{ 
              fontSize: '18px',
              maxWidth: 700,
              lineHeight: 1.6,
              opacity: 0.9
            }}>
              Last Updated: May 7, 2025
            </Text>
          </MantineStack>
        </Container>
      </Box>

      {/* Content Section */}
      <Container size="md" py={60}>
        <Card 
          shadow="md" 
          p={40} 
          radius="lg" 
          withBorder
          sx={{
            borderColor: 'rgba(0, 0, 0, 0.05)',
            marginTop: -40
          }}
        >
          <Text mb={30}>
            Welcome to Stack. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using the Stack platform, you agree to comply with and be bound by these Terms.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>1. Acceptance of Terms</Title>
          <Text mb={30}>
            By registering for and/or using the Services in any manner, you agree to these Terms and all other operating rules, policies, and procedures that may be published by Stack from time to time. Stack may, in its sole discretion, modify or revise these Terms at any time by posting the changes on this page. Your continued use of the Services following the posting of any changes to these Terms constitutes acceptance of those changes.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>2. Eligibility</Title>
          <Text mb={30}>
            You must be at least 18 years old to use the Services. By agreeing to these Terms, you represent and warrant that you are at least 18 years of age. If you are using the Services on behalf of a company, entity, or organization, you represent and warrant that you have the authority to bind such organization to these Terms and you agree to be bound by these Terms on behalf of such organization.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>3. Your Account</Title>
          <Text mb={30}>
            When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the Services and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account. Stack will not be liable for any loss or damage arising from your failure to comply with these requirements.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>4. User Content</Title>
          <Text mb={30}>
            The Services may allow you to store or share content such as text, files, documents, graphics, images, music, software, audio and video. Anything that you post, upload, share, store, or otherwise provide through the Services is your "User Content." You are solely responsible for all User Content you submit to the Services. You represent that all User Content provided by you is accurate, complete, up-to-date, and in compliance with all applicable laws, rules and regulations.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>5. Privacy</Title>
          <Text mb={30}>
            Please refer to our <Anchor href="/privacy" sx={{ fontWeight: 600 }}>Privacy Policy</Anchor> for information about how we collect, use, and disclose information about you.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>6. Security</Title>
          <Text mb={30}>
            We care about the security of our users. While we work to protect the security of your account and related information, Stack cannot guarantee that unauthorized third parties will not be able to defeat our security measures. Please notify us immediately of any compromise or unauthorized use of your account.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>7. Subscription and Payments</Title>
          <Text mb={30}>
            Some of our Services are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Billing cycles are set on a monthly or annual basis, depending on the subscription plan you select when purchasing a subscription. At the end of each billing cycle, your subscription will automatically renew under the same conditions unless you cancel it or Stack cancels it.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>8. Termination</Title>
          <Text mb={30}>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Services will immediately cease. If you wish to terminate your account, you may simply discontinue using the Services, or delete your account within the platform settings.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>9. Limitation of Liability</Title>
          <Text mb={30}>
            In no event shall Stack, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>10. Changes to Terms</Title>
          <Text mb={30}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>11. Contact Us</Title>
          <Text mb={30}>
            If you have any questions about these Terms, please <Anchor href="/contact" sx={{ fontWeight: 600 }}>contact us</Anchor>.
          </Text>

          <Divider my={30} />

          <Group position="apart" align="center">
            <Group spacing={10}>
              <ThemeIcon 
                size={36} 
                radius="xl" 
                sx={{
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                }}
              >
                <IconCalendar size={20} stroke={1.5} color="white" />
              </ThemeIcon>
              <Text size="sm" color="dimmed">Last updated: May 7, 2025</Text>
            </Group>
            <Button 
              component="a" 
              href="/privacy" 
              variant="subtle" 
              rightIcon={<IconArrowRight size={16} />}
              sx={{
                fontWeight: 600,
                '&:hover': {
                  background: 'transparent',
                  transform: 'translateX(5px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              View Privacy Policy
            </Button>
          </Group>
        </Card>
      </Container>
      
      <Footer />
    </div>
  );
}
