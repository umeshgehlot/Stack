import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Accordion, Box, List, ThemeIcon, 
  Divider, Button, Group, Badge
} from '@mantine/core';
import { IconCookie, IconCheck, IconArrowRight } from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';

export default function CookiePolicy() {
  return (
    <div>
      <Head>
        <title>Cookie Policy | Stack</title>
        <meta name="description" content="Learn about how Stack uses cookies and similar technologies to provide, improve, and secure our services." />
      </Head>

      <Navbar />
      
      {/* Header */}
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
              Policy
            </Badge>
            
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              Cookie Policy
            </Title>
            
            <Text size="xl" mb={40} sx={{ lineHeight: 1.6 }}>
              Learn about how Stack uses cookies and similar technologies to provide, improve, and secure our services.
            </Text>
            
            <Text size="md" color="rgba(255,255,255,0.8)">
              Last Updated: May 15, 2025
            </Text>
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Container size="lg" py={80}>
        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            This Cookie Policy explains how Stack ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website at <Link href="/">stack.com</Link> ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </Text>
          
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.
          </Text>
          
          <Title order={2} mt={50} mb={20}>What are cookies?</Title>
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </Text>
          
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            Cookies set by the website owner (in this case, Stack) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
          </Text>
          
          <Title order={2} mt={50} mb={20}>Why do we use cookies?</Title>
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.
          </Text>
          
          <Title order={2} mt={50} mb={20}>Types of cookies we use</Title>
          <Accordion 
            variant="separated"
            radius="md"
            mb={50}
            styles={{
              item: {
                marginBottom: 10,
                border: '1px solid #eee',
                '&[data-active]': {
                  backgroundColor: 'rgba(65, 88, 208, 0.05)'
                }
              },
              control: {
                padding: '15px 20px',
                '&:hover': {
                  backgroundColor: 'rgba(65, 88, 208, 0.03)'
                }
              },
              label: {
                fontWeight: 600
              },
              content: {
                padding: '0 20px 15px'
              }
            }}
          >
            <Accordion.Item value="essential">
              <Accordion.Control>Essential Cookies</Accordion.Control>
              <Accordion.Panel>
                <Text mb={15} sx={{ lineHeight: 1.6 }}>
                  These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.
                </Text>
                <Text weight={600} mb={10}>Examples:</Text>
                <List spacing="xs" mb={15}>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Authentication cookies that identify you when you log into our platform
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Security cookies that help prevent fraudulent use of login credentials
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Session cookies that remember your preferences during your visit
                  </List.Item>
                </List>
                <Text>
                  Because these cookies are strictly necessary to deliver the Website to you, you cannot refuse them.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="performance">
              <Accordion.Control>Performance and Functionality Cookies</Accordion.Control>
              <Accordion.Panel>
                <Text mb={15} sx={{ lineHeight: 1.6 }}>
                  These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
                </Text>
                <Text weight={600} mb={10}>Examples:</Text>
                <List spacing="xs" mb={15}>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies that remember your preferences (like language or region)
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies that enable enhanced features and functionality
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies that help load balance server traffic
                  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="analytics">
              <Accordion.Control>Analytics and Customization Cookies</Accordion.Control>
              <Accordion.Panel>
                <Text mb={15} sx={{ lineHeight: 1.6 }}>
                  These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.
                </Text>
                <Text weight={600} mb={10}>Examples:</Text>
                <List spacing="xs" mb={15}>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies that collect data about how users interact with our Website
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies that help us analyze which features are most popular
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies that measure the effectiveness of our marketing campaigns
                  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="advertising">
              <Accordion.Control>Advertising Cookies</Accordion.Control>
              <Accordion.Panel>
                <Text mb={15} sx={{ lineHeight: 1.6 }}>
                  These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.
                </Text>
                <Text weight={600} mb={10}>Examples:</Text>
                <List spacing="xs" mb={15}>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies used for retargeting ads based on your browsing history
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies that help measure the performance of ad campaigns
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies from our advertising partners that build a profile of your interests
                  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="social">
              <Accordion.Control>Social Media Cookies</Accordion.Control>
              <Accordion.Panel>
                <Text mb={15} sx={{ lineHeight: 1.6 }}>
                  These cookies are used to enable you to share pages and content that you find interesting on our Website through third-party social networking and other websites. These cookies may also be used for advertising purposes.
                </Text>
                <Text weight={600} mb={10}>Examples:</Text>
                <List spacing="xs" mb={15}>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies that enable sharing functionality from social media platforms
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies that track your activity across websites for social media platforms
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={16} />
                      </ThemeIcon>
                    }
                  >
                    Cookies that allow you to share content directly to social networks
                  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          
          <Title order={2} mt={50} mb={20}>How can you control cookies?</Title>
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
          </Text>
          
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            The Cookie Consent Manager can be found in the notification banner and on our website. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.
          </Text>
          
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            The specific types of first and third-party cookies served through our Website and the purposes they perform are described in the table below:
          </Text>
          
          <Box 
            mb={50} 
            p={30} 
            sx={{ 
              background: '#f8f9fa',
              borderRadius: 10,
              border: '1px solid #eee'
            }}
          >
            <Title order={3} mb={20}>Essential Cookies</Title>
            <Box mb={30}>
              <Text weight={600} mb={5}>Name: session_id</Text>
              <Text mb={5}>Purpose: Used to maintain your authenticated session</Text>
              <Text mb={5}>Provider: Stack</Text>
              <Text>Expiry: Session</Text>
            </Box>
            
            <Box mb={30}>
              <Text weight={600} mb={5}>Name: csrf_token</Text>
              <Text mb={5}>Purpose: Used to prevent cross-site request forgery attacks</Text>
              <Text mb={5}>Provider: Stack</Text>
              <Text>Expiry: Session</Text>
            </Box>
            
            <Title order={3} mt={40} mb={20}>Analytics Cookies</Title>
            <Box mb={30}>
              <Text weight={600} mb={5}>Name: _ga</Text>
              <Text mb={5}>Purpose: Used to distinguish users for Google Analytics</Text>
              <Text mb={5}>Provider: Google</Text>
              <Text>Expiry: 2 years</Text>
            </Box>
            
            <Box mb={30}>
              <Text weight={600} mb={5}>Name: _gid</Text>
              <Text mb={5}>Purpose: Used to distinguish users for Google Analytics</Text>
              <Text mb={5}>Provider: Google</Text>
              <Text>Expiry: 24 hours</Text>
            </Box>
            
            <Title order={3} mt={40} mb={20}>Marketing Cookies</Title>
            <Box mb={30}>
              <Text weight={600} mb={5}>Name: _fbp</Text>
              <Text mb={5}>Purpose: Used by Facebook to deliver advertisements</Text>
              <Text mb={5}>Provider: Facebook</Text>
              <Text>Expiry: 3 months</Text>
            </Box>
            
            <Box mb={30}>
              <Text weight={600} mb={5}>Name: _gcl_au</Text>
              <Text mb={5}>Purpose: Used by Google AdSense for experimenting with advertisement efficiency</Text>
              <Text mb={5}>Provider: Google</Text>
              <Text>Expiry: 3 months</Text>
            </Box>
          </Box>
          
          <Title order={2} mt={50} mb={20}>How often will we update this Cookie Policy?</Title>
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </Text>
          
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            The date at the top of this Cookie Policy indicates when it was last updated.
          </Text>
          
          <Title order={2} mt={50} mb={20}>Where can you get further information?</Title>
          <Text mb={30} sx={{ fontSize: 18, lineHeight: 1.8 }}>
            If you have any questions about our use of cookies or other technologies, please email us at privacy@stack.com or contact us at:
          </Text>
          
          <Box mb={50} p={30} sx={{ background: '#f8f9fa', borderRadius: 10 }}>
            <Text>Stack Inc.</Text>
            <Text>123 Tech Street</Text>
            <Text>San Francisco, CA 94107</Text>
            <Text>United States</Text>
            <Text mt={10}>Phone: (123) 456-7890</Text>
          </Box>
          
          <Divider my={50} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Title order={3} mb={20}>Need more information?</Title>
            <Text size="lg" mb={30}>
              Check out our other policies or contact our support team.
            </Text>
            
            <Group position="center" spacing="md">
              <Button 
                component={Link}
                href="/privacy-policy"
                variant="outline"
                color="blue"
                radius="xl"
                leftIcon={<IconArrowRight size={16} />}
              >
                Privacy Policy
              </Button>
              
              <Button 
                component={Link}
                href="/terms-of-service"
                variant="outline"
                color="blue"
                radius="xl"
                leftIcon={<IconArrowRight size={16} />}
              >
                Terms of Service
              </Button>
              
              <Button 
                component={Link}
                href="/contact"
                variant="filled"
                color="blue"
                radius="xl"
                leftIcon={<IconArrowRight size={16} />}
                sx={{ 
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)'
                }}
              >
                Contact Us
              </Button>
            </Group>
          </Box>
        </Box>
      </Container>

      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
    </div>
  );
}
