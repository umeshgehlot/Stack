import React from 'react';
import Head from 'next/head';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, Center, 
  Stack as MantineStack, Box, Divider, List, ThemeIcon, Anchor
} from '@mantine/core';
import { IconArrowRight, IconCalendar, IconShield, IconLock } from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div>
      <Head>
        <title>Privacy Policy | Stack - Real-Time Collaboration Platform</title>
        <meta name="description" content="Learn how Stack protects your privacy and handles your data." />
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
              Privacy Policy
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
          <Group mb={30} spacing={15}>
            <ThemeIcon 
              size={50} 
              radius="xl" 
              sx={{
                background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                boxShadow: '0 8px 16px rgba(65, 88, 208, 0.2)'
              }}
            >
              <IconLock size={24} stroke={1.5} color="white" />
            </ThemeIcon>
            <Box>
              <Text weight={500}>Your privacy is important to us</Text>
              <Text size="sm" color="dimmed">This policy outlines how we collect, use, and protect your data</Text>
            </Box>
          </Group>

          <Text mb={30}>
            At Stack, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>1. Information We Collect</Title>
          <Text mb={10}>We may collect information about you in a variety of ways. The information we may collect includes:</Text>
          <List spacing="sm" mb={30}>
            <List.Item>
              <Text weight={600}>Personal Data:</Text> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the platform or when you choose to participate in various activities related to the platform.
            </List.Item>
            <List.Item>
              <Text weight={600}>Derivative Data:</Text> Information our servers automatically collect when you access the platform, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the platform.
            </List.Item>
            <List.Item>
              <Text weight={600}>Financial Data:</Text> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services.
            </List.Item>
            <List.Item>
              <Text weight={600}>User Content:</Text> Content such as text, files, documents, graphics, images, music, software, audio and video that you may create, post, upload, or store while using our platform.
            </List.Item>
          </List>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>2. How We Use Your Information</Title>
          <Text mb={10}>We may use the information we collect about you for various purposes, including to:</Text>
          <List spacing="sm" mb={30}>
            <List.Item>Create and manage your account</List.Item>
            <List.Item>Provide and maintain our platform's functionality</List.Item>
            <List.Item>Personalize your experience</List.Item>
            <List.Item>Process transactions and send related information</List.Item>
            <List.Item>Send administrative information, such as updates, security alerts, and support messages</List.Item>
            <List.Item>Respond to customer service requests and support needs</List.Item>
            <List.Item>Administer promotions, contests, surveys, or other site features</List.Item>
            <List.Item>Protect our platform from unauthorized access and abuse</List.Item>
            <List.Item>Improve our platform, marketing, and customer experiences</List.Item>
          </List>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>3. Disclosure of Your Information</Title>
          <Text mb={10}>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</Text>
          <List spacing="sm" mb={30}>
            <List.Item>
              <Text weight={600}>By Law or to Protect Rights:</Text> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
            </List.Item>
            <List.Item>
              <Text weight={600}>Third-Party Service Providers:</Text> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
            </List.Item>
            <List.Item>
              <Text weight={600}>Marketing Communications:</Text> With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes.
            </List.Item>
            <List.Item>
              <Text weight={600}>Business Transfers:</Text> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
            </List.Item>
          </List>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>4. Security of Your Information</Title>
          <Text mb={30}>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>5. Your Choices About Your Information</Title>
          <Text mb={10}>You have certain choices regarding the information we collect and how it is used:</Text>
          <List spacing="sm" mb={30}>
            <List.Item>
              <Text weight={600}>Account Information:</Text> You can review and change your personal information by logging into the platform and visiting your account profile page.
            </List.Item>
            <List.Item>
              <Text weight={600}>Communications:</Text> You can opt out of receiving certain emails from us by following the unsubscribe instructions provided in the emails you receive or by contacting us directly.
            </List.Item>
            <List.Item>
              <Text weight={600}>Cookies and Similar Technologies:</Text> Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject cookies.
            </List.Item>
            <List.Item>
              <Text weight={600}>Do Not Track:</Text> Some browsers feature a "Do Not Track" setting. Our platform does not currently respond to Do Not Track signals.
            </List.Item>
          </List>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>6. Data Retention</Title>
          <Text mb={30}>
            We will retain your information for as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements. If you wish to request that we no longer use your information to provide you services, please contact us.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>7. Children's Privacy</Title>
          <Text mb={30}>
            Our platform is not intended for children under the age of 18. We do not knowingly collect or solicit personal information from children under 18. If you are under 18, please do not attempt to register for the platform or send any personal information about yourself to us.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>8. Changes to This Privacy Policy</Title>
          <Text mb={30}>
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date at the top of this page. You are advised to review this privacy policy periodically for any changes.
          </Text>

          <Title order={3} mb={15} sx={{ fontWeight: 700 }}>9. Contact Us</Title>
          <Text mb={30}>
            If you have questions or concerns about this Privacy Policy, please <Anchor href="/contact" sx={{ fontWeight: 600 }}>contact us</Anchor>.
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
              href="/terms" 
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
              View Terms of Service
            </Button>
          </Group>
        </Card>
      </Container>
      
      <Footer />
    </div>
  );
}
