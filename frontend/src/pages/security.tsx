import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Box, SimpleGrid, Card, Group, Badge,
  List, ThemeIcon, Divider, Button, Accordion
} from '@mantine/core';
import {
  IconShield, IconLock, IconFingerprint, IconServer, IconAlertCircle,
  IconCheck, IconBug, IconCertificate, IconArrowRight
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';

// Security features
const securityFeatures = [
  {
    icon: <IconLock size={30} />,
    title: 'End-to-End Encryption',
    description: 'All data is encrypted in transit and at rest using industry-standard encryption protocols.'
  },
  {
    icon: <IconFingerprint size={30} />,
    title: 'Multi-Factor Authentication',
    description: 'Add an extra layer of security with SMS, authenticator apps, or hardware security keys.'
  },
  {
    icon: <IconServer size={30} />,
    title: 'Secure Infrastructure',
    description: 'Our infrastructure is hosted in SOC 2 compliant data centers with 24/7 monitoring.'
  },
  {
    icon: <IconShield size={30} />,
    title: 'Regular Security Audits',
    description: 'We conduct regular penetration testing and security audits by third-party experts.'
  }
];

// Compliance certifications
const certifications = [
  {
    title: 'SOC 2 Type II',
    description: 'Stack has completed SOC 2 Type II audit, verifying our security, availability, and confidentiality controls.'
  },
  {
    title: 'GDPR Compliant',
    description: "We're fully compliant with the General Data Protection Regulation (GDPR) for EU data subjects."
  },
  {
    title: 'HIPAA Compliant',
    description: 'Stack offers a HIPAA-compliant environment for customers in the healthcare industry.'
  },
  {
    title: 'ISO 27001',
    description: 'Our information security management system is certified to ISO 27001 standards.'
  }
];

// FAQ items
const faqItems = [
  {
    question: 'How does Stack protect my data?',
    answer: 'Stack employs multiple layers of security to protect your data. We use end-to-end encryption for all data in transit and at rest, implement strict access controls, regularly update our systems with security patches, and conduct security audits to identify and address potential vulnerabilities.'
  },
  {
    question: 'What authentication methods does Stack support?',
    answer: 'Stack supports various authentication methods including email/password, single sign-on (SSO) with SAML 2.0, OAuth 2.0 integration with Google, Microsoft, and other identity providers, and multi-factor authentication via SMS, authenticator apps, or hardware security keys.'
  },
  {
    question: 'Where is my data stored?',
    answer: 'Stack stores customer data in SOC 2 compliant data centers located in the United States and the European Union. Enterprise customers can choose their preferred data residency region to comply with local regulations.'
  },
  {
    question: 'How does Stack handle security incidents?',
    answer: 'We have a comprehensive incident response plan that includes detection, containment, eradication, recovery, and post-incident analysis. In the event of a security incident that affects customer data, we notify affected customers promptly and provide regular updates until the issue is resolved.'
  },
  {
    question: 'Does Stack have a bug bounty program?',
    answer: 'Yes, Stack maintains a bug bounty program to encourage security researchers to report vulnerabilities responsibly. We offer rewards based on the severity and impact of the reported issues. Visit our security page for more details on how to participate.'
  }
];

export default function Security() {
  return (
    <div>
      <Head>
        <title>Security | Stack</title>
        <meta name="description" content="Learn about Stack's security practices, compliance certifications, and how we protect your data." />
      </Head>

      <Navbar />
      
      {/* Security Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
          color: 'white',
          padding: '120px 0 80px',
          marginTop: '-1px',
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
              Security
            </Badge>
            
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              Your data's security is our top priority
            </Title>
            
            <Text size="xl" mb={40} sx={{ lineHeight: 1.6 }}>
              Stack is built with security at its core. We employ industry-leading practices to ensure your data remains safe, private, and accessible only to authorized users.
            </Text>
            
            <Button 
              component="a"
              href="#security-features"
              size="lg"
              radius="xl"
              sx={{ 
                background: 'white',
                color: '#4158D0',
                padding: '0 35px',
                height: 54,
                fontWeight: 600,
                '&:hover': {
                  background: 'white',
                  transform: 'translateY(-5px)'
                }
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Security Features */}
      <Container size="lg" py={80} id="security-features">
        <Title order={2} align="center" mb={50}>Security Features</Title>
        
        <SimpleGrid 
          cols={4} 
          spacing={30}
          breakpoints={[
            { maxWidth: 992, cols: 2 },
            { maxWidth: 576, cols: 1 }
          ]}
        >
          {securityFeatures.map((feature, index) => (
            <Card 
              key={index} 
              withBorder 
              radius="md" 
              p="xl"
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box 
                sx={{ 
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.1) 0%, rgba(200, 80, 192, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4158D0',
                  marginBottom: 20
                }}
              >
                {feature.icon}
              </Box>
              
              <Title order={3} mb={15}>{feature.title}</Title>
              <Text color="dimmed">{feature.description}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
      
      {/* Security Practices */}
      <Box py={80} sx={{ background: '#f8f9fa' }}>
        <Container size="lg">
          <SimpleGrid cols={2} spacing={50} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
            <Box>
              <Title order={2} mb={30}>Our Security Practices</Title>
              
              <List spacing="md">
                <List.Item
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <Text weight={600} mb={5}>Secure Development Lifecycle</Text>
                  <Text color="dimmed">
                    Our development process includes security reviews, threat modeling, and automated security testing to identify and fix vulnerabilities before deployment.
                  </Text>
                </List.Item>
                
                <List.Item
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <Text weight={600} mb={5}>Access Controls</Text>
                  <Text color="dimmed">
                    We implement strict access controls based on the principle of least privilege. Employee access to production systems is limited and regularly audited.
                  </Text>
                </List.Item>
                
                <List.Item
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <Text weight={600} mb={5}>Network Security</Text>
                  <Text color="dimmed">
                    Our infrastructure is protected by firewalls, intrusion detection systems, and DDoS protection. We perform regular vulnerability scans and penetration tests.
                  </Text>
                </List.Item>
                
                <List.Item
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <Text weight={600} mb={5}>Data Encryption</Text>
                  <Text color="dimmed">
                    All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption. Customer data is isolated in separate database instances.
                  </Text>
                </List.Item>
                
                <List.Item
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <Text weight={600} mb={5}>Security Monitoring</Text>
                  <Text color="dimmed">
                    We maintain 24/7 security monitoring with automated alerts for suspicious activities. Our security team reviews logs and responds to incidents promptly.
                  </Text>
                </List.Item>
                
                <List.Item
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <Text weight={600} mb={5}>Business Continuity</Text>
                  <Text color="dimmed">
                    We maintain comprehensive backup and disaster recovery plans. Data is backed up regularly, and we test our recovery procedures to ensure minimal downtime.
                  </Text>
                </List.Item>
              </List>
            </Box>
            
            <Box>
              <Title order={2} mb={30}>Compliance & Certifications</Title>
              
              <SimpleGrid cols={1} spacing={20}>
                {certifications.map((cert, index) => (
                  <Card 
                    key={index} 
                    withBorder 
                    radius="md" 
                    p="lg"
                    sx={{ 
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <Group mb={10}>
                      <ThemeIcon size={40} radius="md" color="blue">
                        <IconCertificate size={24} />
                      </ThemeIcon>
                      <Title order={3}>{cert.title}</Title>
                    </Group>
                    <Text color="dimmed">{cert.description}</Text>
                  </Card>
                ))}
              </SimpleGrid>
              
              <Button 
                component={Link}
                href="/contact"
                variant="outline"
                color="blue"
                fullWidth
                mt={30}
                radius="md"
              >
                Request Compliance Documentation
              </Button>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Security FAQ */}
      <Container size="lg" py={80}>
        <Title order={2} align="center" mb={20}>Security FAQ</Title>
        <Text align="center" color="dimmed" mb={50} sx={{ maxWidth: 700, margin: '0 auto' }}>
          Common questions about Stack's security practices and how we protect your data.
        </Text>
        
        <Accordion 
          variant="separated"
          radius="md"
          styles={{
            item: {
              marginBottom: 15,
              border: '1px solid #eee',
              '&[data-active]': {
                backgroundColor: 'rgba(65, 88, 208, 0.05)'
              }
            },
            control: {
              padding: '20px',
              '&:hover': {
                backgroundColor: 'rgba(65, 88, 208, 0.03)'
              }
            },
            label: {
              fontWeight: 600,
              fontSize: 18
            },
            content: {
              padding: '0 20px 20px'
            }
          }}
        >
          {faqItems.map((item, index) => (
            <Accordion.Item key={index} value={`question-${index}`}>
              <Accordion.Control>{item.question}</Accordion.Control>
              <Accordion.Panel>
                <Text sx={{ lineHeight: 1.6 }}>{item.answer}</Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
      
      {/* Report Vulnerability */}
      <Box py={80} sx={{ background: '#f8f9fa' }}>
        <Container size="lg">
          <SimpleGrid cols={2} spacing={50} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
            <Box>
              <Title order={2} mb={20}>Report a Vulnerability</Title>
              <Text mb={30} sx={{ lineHeight: 1.8 }}>
                We appreciate the work of security researchers in improving the security of our platform. If you believe you've found a security vulnerability in Stack, we encourage you to report it to us through our responsible disclosure program.
              </Text>
              
              <List spacing="md" mb={30}>
                <List.Item
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <Text>
                    Email your findings to <Text component="span" weight={600}>security@stack.com</Text>
                  </Text>
                </List.Item>
                
                <List.Item
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <Text>
                    Include detailed steps to reproduce the vulnerability
                  </Text>
                </List.Item>
                
                <List.Item
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <Text>
                    We'll acknowledge receipt within 24 hours
                  </Text>
                </List.Item>
                
                <List.Item
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  <Text>
                    Rewards are based on severity and impact
                  </Text>
                </List.Item>
              </List>
              
              <Button 
                component={Link}
                href="/security/bug-bounty"
                variant="filled"
                color="blue"
                radius="md"
                leftIcon={<IconBug size={20} />}
                sx={{ 
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)'
                }}
              >
                View Bug Bounty Program
              </Button>
            </Box>
            
            <Box>
              <Card 
                withBorder 
                radius="lg" 
                p={30}
                sx={{
                  background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.05) 0%, rgba(200, 80, 192, 0.05) 100%)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Group mb={20}>
                  <ThemeIcon size={40} radius="md" color="red">
                    <IconAlertCircle size={24} />
                  </ThemeIcon>
                  <Title order={3}>Security Incident?</Title>
                </Group>
                
                <Text mb={30} sx={{ lineHeight: 1.6 }}>
                  If you believe you've experienced a security incident or data breach related to your Stack account, please contact our security team immediately.
                </Text>
                
                <Box 
                  p={20} 
                  mb={30}
                  sx={{ 
                    background: 'white',
                    borderRadius: 10,
                    border: '1px solid #eee'
                  }}
                >
                  <Text weight={600} mb={10}>Emergency Contact:</Text>
                  <Text>Email: security-emergency@stack.com</Text>
                  <Text>Phone: +1 (800) 123-4567 (24/7 Support)</Text>
                </Box>
                
                <Text mb={20} sx={{ lineHeight: 1.6 }}>
                  Our security team will respond promptly and work with you to investigate and resolve the issue.
                </Text>
                
                <Button 
                  component={Link}
                  href="/contact"
                  variant="outline"
                  color="red"
                  radius="md"
                  mt="auto"
                >
                  Contact Security Team
                </Button>
              </Card>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Security Whitepaper */}
      <Container size="lg" py={80}>
        <Card 
          withBorder 
          radius="lg" 
          p={40}
          sx={{
            background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.05) 0%, rgba(200, 80, 192, 0.05) 100%)',
            textAlign: 'center'
          }}
        >
          <Title order={2} mb={15}>Want to learn more about our security practices?</Title>
          <Text size="lg" color="dimmed" mb={30} sx={{ maxWidth: 700, margin: '0 auto' }}>
            Download our security whitepaper for a comprehensive overview of Stack's security architecture, controls, and compliance certifications.
          </Text>
          
          <Button 
            component={Link}
            href="/resources/security-whitepaper.pdf"
            size="lg"
            radius="xl"
            leftIcon={<IconArrowRight size={20} />}
            sx={{ 
              background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              padding: '0 35px',
              height: 54
            }}
          >
            Download Security Whitepaper
          </Button>
        </Card>
      </Container>

      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
    </div>
  );
}
