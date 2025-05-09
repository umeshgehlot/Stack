import React, { useState } from 'react';
import { 
  Container, Title, Text, Box, Accordion, 
  Group, Button, ThemeIcon, Badge, Divider
} from '@mantine/core';
import { 
  IconPlus, IconMinus, IconSearch, 
  IconArrowRight, IconQuestionMark
} from '@tabler/icons-react';

const faqs = [
  {
    category: 'general',
    questions: [
      {
        question: 'What is Stack?',
        answer: 'Stack is a comprehensive collaboration platform that helps teams work together more efficiently. It combines document editing, project management, and communication tools in one seamless interface.'
      },
      {
        question: 'How does Stack compare to other collaboration tools?',
        answer: 'Unlike other tools that focus on just one aspect of collaboration, Stack provides an all-in-one solution. It integrates features from document editors, project management tools, and communication platforms, eliminating the need to switch between multiple applications.'
      },
      {
        question: 'Is Stack suitable for small teams?',
        answer: 'Absolutely! Stack is designed to scale with your team. Our flexible pricing ensures that small teams can access powerful collaboration features without paying for enterprise-level capacity they don\'t need.'
      },
      {
        question: 'Can I try Stack before purchasing?',
        answer: 'Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial. You can also schedule a demo with our team for a personalized walkthrough.'
      }
    ]
  },
  {
    category: 'pricing',
    questions: [
      {
        question: 'How much does Stack cost?',
        answer: 'Stack offers several pricing tiers to fit different needs. Our Basic plan starts at $10 per user per month when billed annually. For detailed pricing information, please visit our Pricing page or use our interactive pricing calculator.'
      },
      {
        question: 'Do you offer discounts for nonprofits or educational institutions?',
        answer: 'Yes, we offer special pricing for qualified nonprofits, educational institutions, and open-source projects. Please contact our sales team for more information.'
      },
      {
        question: 'Can I change my plan later?',
        answer: 'Yes, you can upgrade, downgrade, or cancel your plan at any time. When upgrading, you\'ll be prorated for the remainder of your billing cycle. When downgrading, changes will take effect at the start of your next billing cycle.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) as well as PayPal. For enterprise customers, we also offer invoicing options.'
      }
    ]
  },
  {
    category: 'features',
    questions: [
      {
        question: 'Does Stack work offline?',
        answer: 'Yes, Stack has offline capabilities. You can continue working on your documents without an internet connection, and your changes will sync automatically when you reconnect.'
      },
      {
        question: 'Can I integrate Stack with other tools?',
        answer: 'Absolutely! Stack offers integrations with popular tools like Google Workspace, Microsoft Office, Slack, Zoom, Jira, GitHub, and many more. We also provide a robust API for custom integrations.'
      },
      {
        question: 'How does real-time collaboration work?',
        answer: 'Stack uses advanced operational transformation technology to enable multiple users to edit the same document simultaneously. You can see other users\' cursors and selections in real-time, and all changes are automatically merged without conflicts.'
      },
      {
        question: 'Is there a limit to the number of projects I can create?',
        answer: 'The number of projects you can create depends on your plan. Our Basic plan includes up to 3 projects, while our Pro and Enterprise plans offer unlimited projects. Check our pricing page for detailed information.'
      }
    ]
  },
  {
    category: 'security',
    questions: [
      {
        question: 'How secure is my data with Stack?',
        answer: 'Stack takes security seriously. We use industry-standard encryption for data in transit and at rest. Our infrastructure is hosted on secure cloud providers with SOC 2 and ISO 27001 certifications. We also conduct regular security audits and penetration testing.'
      },
      {
        question: 'Does Stack comply with GDPR?',
        answer: 'Yes, Stack is fully GDPR compliant. We provide data processing agreements (DPAs) for our customers and have implemented processes to fulfill data subject rights requests. For more information, please review our Privacy Policy.'
      },
      {
        question: 'Can I control who has access to my team\'s data?',
        answer: 'Yes, Stack provides granular permission controls. Team administrators can set permissions at the workspace, project, and document levels. We also support single sign-on (SSO) and role-based access control for enterprise customers.'
      },
      {
        question: 'Where is my data stored?',
        answer: 'Stack data is stored in secure data centers located in the United States and the European Union. Enterprise customers can choose their preferred data residency region.'
      }
    ]
  },
  {
    category: 'support',
    questions: [
      {
        question: 'How can I get help if I have questions?',
        answer: 'We offer multiple support channels. All customers have access to our comprehensive knowledge base and community forum. Depending on your plan, you may also have access to email support, live chat, or dedicated account management.'
      },
      {
        question: 'Do you offer training for new users?',
        answer: 'Yes, we provide free onboarding webinars, video tutorials, and documentation for all customers. Enterprise customers also receive personalized training sessions and custom onboarding plans.'
      },
      {
        question: 'What are your support hours?',
        answer: 'Our standard support hours are Monday through Friday, 9 AM to 6 PM Eastern Time. Enterprise customers with Premium Support receive 24/7 coverage for critical issues.'
      },
      {
        question: 'Is there a community of Stack users I can join?',
        answer: 'Yes, we have an active community forum where users can ask questions, share best practices, and connect with other Stack users. We also host regular webinars and user meetups.'
      }
    ]
  }
];

export default function FaqAccordion() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter questions based on search query
  const filteredFaqs = searchQuery 
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;
  
  // Get the questions for the active category
  const activeQuestions = searchQuery 
    ? filteredFaqs.flatMap(category => category.questions)
    : filteredFaqs.find(category => category.category === activeCategory)?.questions || [];
  
  return (
    <Box py={80} sx={{ background: '#f8f9fa' }}>
      <Container size="lg">
        <Box mb={50} sx={{ textAlign: 'center' }}>
          <Badge 
            size="xl" 
            radius="xl" 
            color="indigo" 
            variant="filled" 
            mb={20}
            sx={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(92, 80, 200, 0.3)'
            }}
          >
            Frequently Asked Questions
          </Badge>
          
          <Title 
            order={2} 
            mb={15}
            sx={{ 
              fontWeight: 800,
              fontSize: 36
            }}
          >
            Got Questions? We've Got Answers
          </Title>
          
          <Text 
            color="dimmed" 
            mb={30}
            sx={{ 
              maxWidth: 600, 
              margin: '0 auto',
              fontSize: 18
            }}
          >
            Find answers to common questions about Stack. Can't find what you're looking for? Contact our support team.
          </Text>
          
          {/* Search input */}
          <Box 
            sx={{ 
              position: 'relative',
              maxWidth: 500,
              margin: '0 auto'
            }}
          >
            <Box 
              component="input"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: '100%',
                height: 56,
                padding: '0 20px 0 50px',
                fontSize: 16,
                border: '1px solid #e0e0e0',
                borderRadius: 28,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                '&:focus': {
                  outline: 'none',
                  borderColor: '#4158D0',
                  boxShadow: '0 4px 12px rgba(65, 88, 208, 0.15)'
                }
              }}
            />
            <Box 
              sx={{ 
                position: 'absolute',
                top: '50%',
                left: 20,
                transform: 'translateY(-50%)',
                color: '#aaa'
              }}
            >
              <IconSearch size={20} />
            </Box>
          </Box>
        </Box>
        
        {!searchQuery && (
          <Group position="center" spacing={10} mb={40}>
            {faqs.map((category) => (
              <Button
                key={category.category}
                variant={activeCategory === category.category ? 'filled' : 'light'}
                color={activeCategory === category.category ? 'indigo' : 'gray'}
                radius="xl"
                onClick={() => setActiveCategory(category.category)}
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                {category.category}
              </Button>
            ))}
          </Group>
        )}
        
        {searchQuery && filteredFaqs.length === 0 && (
          <Box 
            sx={{ 
              textAlign: 'center',
              padding: 40,
              background: 'white',
              borderRadius: 12,
              border: '1px solid #e0e0e0'
            }}
          >
            <ThemeIcon 
              size={80} 
              radius="xl" 
              color="gray" 
              variant="light"
              mb={20}
              mx="auto"
            >
              <IconQuestionMark size={40} />
            </ThemeIcon>
            <Title order={3} mb={10}>No results found</Title>
            <Text color="dimmed" mb={20}>
              We couldn't find any answers matching "{searchQuery}".
            </Text>
            <Button 
              variant="outline" 
              color="indigo" 
              radius="xl"
              onClick={() => setSearchQuery('')}
              leftIcon={<IconArrowRight size={16} />}
              sx={{
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(65, 88, 208, 0.05)'
                }
              }}
            >
              View all FAQs
            </Button>
          </Box>
        )}
        
        {(searchQuery ? filteredFaqs.length > 0 : true) && (
          <Accordion
            variant="separated"
            radius="md"
            chevronPosition="right"
            styles={{
              chevron: {
                '&[data-position="right"]': {
                  display: 'none',
                },
              },
              control: {
                '&:hover': {
                  backgroundColor: 'rgba(65, 88, 208, 0.05)'  
                },
                padding: '20px 16px',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(65, 88, 208, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                },
                '&[aria-expanded="true"]::after': {
                  backgroundColor: '#4158D0',
                }
              },
              label: {
                fontWeight: 600,
                fontSize: 16
              },
              content: {
                padding: '0 16px 20px',
                fontSize: 15
              },
              item: {
                marginBottom: 10,
                border: '1px solid #e0e0e0',
                borderRadius: 12,
                '&[data-active]': {
                  backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }
              }
            }}
            )}
            styles={{
              item: {
                marginBottom: 10,
                border: '1px solid #e0e0e0',
                borderRadius: 12,
                '&[data-active]': {
                  backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }
              },
              control: {
                padding: '20px 16px',
                '&:hover': {
                  backgroundColor: 'rgba(65, 88, 208, 0.05)'
                }
              },
              label: {
                fontWeight: 600,
                fontSize: 16
              },
              content: {
                padding: '0 16px 20px',
                fontSize: 15
              }
            }}
          >
            {searchQuery && (
              <Box mb={20}>
                <Text size="sm" color="dimmed">
                  Showing {activeQuestions.length} results for "{searchQuery}"
                </Text>
                <Divider my={10} />
              </Box>
            )}
            
            {activeQuestions.map((faq, index) => (
              <Accordion.Item key={index} value={`item-${index}`}>
                <Accordion.Control>{faq.question}</Accordion.Control>
                <Accordion.Panel>
                  <Text>{faq.answer}</Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
        
        <Box mt={50} sx={{ textAlign: 'center' }}>
          <Text mb={20}>Still have questions?</Text>
          <Group position="center" spacing={20}>
            <Button 
              component="a" 
              href="/contact" 
              variant="gradient" 
              gradient={{ from: '#4158D0', to: '#C850C0' }}
              radius="xl"
              size="md"
              sx={{
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 16px rgba(65, 88, 208, 0.3)'
                }
              }}
            >
              Contact Support
            </Button>
            <Button 
              component="a" 
              href="/documentation" 
              variant="outline" 
              color="indigo"
              radius="xl"
              size="md"
              sx={{
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  background: 'rgba(65, 88, 208, 0.05)'
                }
              }}
            >
              Browse Documentation
            </Button>
          </Group>
        </Box>
      </Container>
    </Box>
  );
}
