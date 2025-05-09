import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Title, Text, Button, Group, Card, SimpleGrid, Badge, 
  Tabs, Box, Code, Accordion, CopyButton, ActionIcon, Divider
} from '@mantine/core';
import { 
  IconCode, IconBrandGithub, IconCheck, IconCopy, IconTerminal,
  IconBrandPython, IconBrandJavascript, IconBrandPhp, IconArrowRight
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FloatingChatButton from '../components/FloatingChatButton';
import BackToTopButton from '../components/BackToTopButton';

// API endpoints
const apiEndpoints = [
  {
    name: 'Authentication',
    description: 'Authenticate users and manage API tokens',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/auth/token',
        description: 'Generate an API token',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email' },
          { name: 'password', type: 'string', required: true, description: 'User password' }
        ],
        response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2025-06-07T19:34:19+05:30"
}`
      },
      {
        method: 'DELETE',
        path: '/api/v1/auth/token',
        description: 'Revoke an API token',
        parameters: [],
        response: `{
  "message": "Token revoked successfully"
}`
      }
    ]
  },
  {
    name: 'Documents',
    description: 'Create, read, update, and delete documents',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/documents',
        description: 'List all documents',
        parameters: [
          { name: 'page', type: 'integer', required: false, description: 'Page number' },
          { name: 'limit', type: 'integer', required: false, description: 'Items per page' }
        ],
        response: `{
  "documents": [
    {
      "id": "doc_123",
      "title": "Project Proposal",
      "created_at": "2025-05-01T10:30:00Z",
      "updated_at": "2025-05-02T14:15:00Z"
    },
    {
      "id": "doc_124",
      "title": "Meeting Notes",
      "created_at": "2025-05-03T09:00:00Z",
      "updated_at": "2025-05-03T09:45:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10
}`
      },
      {
        method: 'POST',
        path: '/api/v1/documents',
        description: 'Create a new document',
        parameters: [
          { name: 'title', type: 'string', required: true, description: 'Document title' },
          { name: 'content', type: 'string', required: true, description: 'Document content' }
        ],
        response: `{
  "id": "doc_125",
  "title": "New Document",
  "content": "Document content goes here...",
  "created_at": "2025-05-07T19:34:19Z",
  "updated_at": "2025-05-07T19:34:19Z"
}`
      }
    ]
  },
  {
    name: 'Users',
    description: 'Manage users and permissions',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/users',
        description: 'List all users',
        parameters: [
          { name: 'page', type: 'integer', required: false, description: 'Page number' },
          { name: 'limit', type: 'integer', required: false, description: 'Items per page' }
        ],
        response: `{
  "users": [
    {
      "id": "user_123",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "admin"
    },
    {
      "id": "user_124",
      "email": "jane@example.com",
      "name": "Jane Smith",
      "role": "member"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10
}`
      },
      {
        method: 'POST',
        path: '/api/v1/users/invite',
        description: 'Invite a new user',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email' },
          { name: 'role', type: 'string', required: true, description: 'User role (admin, member, guest)' }
        ],
        response: `{
  "message": "Invitation sent successfully",
  "invitation_id": "inv_123"
}`
      }
    ]
  }
];

// Code examples
const codeExamples = {
  javascript: `// Authentication
const response = await fetch('https://api.stackapp.com/v1/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'your-password'
  })
});

const data = await response.json();
const token = data.token;

// Using the token to fetch documents
const documents = await fetch('https://api.stackapp.com/v1/documents', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});

const documentsData = await documents.json();
console.log(documentsData);`,

  python: `import requests

# Authentication
response = requests.post(
    'https://api.stackapp.com/v1/auth/token',
    json={
        'email': 'user@example.com',
        'password': 'your-password'
    }
)

data = response.json()
token = data['token']

# Using the token to fetch documents
headers = {
    'Authorization': f'Bearer {token}'
}

documents = requests.get(
    'https://api.stackapp.com/v1/documents',
    headers=headers
)

documents_data = documents.json()
print(documents_data)`,

  php: `<?php
// Authentication
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.stackapp.com/v1/auth/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'user@example.com',
    'password' => 'your-password'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$token = $data['token'];

// Using the token to fetch documents
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.stackapp.com/v1/documents');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token
]);

$documents = curl_exec($ch);
curl_close($ch);

$documents_data = json_decode($documents, true);
print_r($documents_data);`
};

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState('authentication');
  const [activeLanguage, setActiveLanguage] = useState('javascript');
  
  const selectedCategory = apiEndpoints.find(category => 
    category.name.toLowerCase() === activeTab
  ) || apiEndpoints[0];

  return (
    <div>
      <Head>
        <title>API Documentation | Stack</title>
        <meta name="description" content="Comprehensive API documentation for Stack - build integrations and extend functionality." />
      </Head>

      <Navbar />
      
      {/* API Docs Header */}
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
              API
            </Badge>
            
            <Title order={1} mb={20} sx={{ fontWeight: 900, fontSize: 48 }}>
              Stack API Documentation
            </Title>
            
            <Text size="xl" mb={40} sx={{ lineHeight: 1.6 }}>
              Build integrations and extend Stack's functionality with our powerful API.
            </Text>
            
            <Group position="center" spacing="md">
              <Button 
                component="a"
                href="#endpoints"
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
                API Reference
              </Button>
              
              <Button 
                component="a"
                href="https://github.com/stackapp/api-examples"
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                radius="xl"
                variant="outline"
                color="white"
                leftIcon={<IconBrandGithub size={20} />}
                sx={{ 
                  padding: '0 35px',
                  height: 54,
                  borderColor: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                GitHub Examples
              </Button>
            </Group>
          </Box>
        </Container>
      </Box>

      {/* API Overview */}
      <Container size="lg" py={80}>
        <SimpleGrid cols={3} spacing={30} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          <Card withBorder p="xl" radius="md">
            <IconCode size={40} color="#4158D0" style={{ marginBottom: 15 }} />
            <Title order={3} mb={10}>RESTful API</Title>
            <Text color="dimmed" sx={{ lineHeight: 1.6 }}>
              Our API follows REST principles, making it easy to integrate with any application or service.
            </Text>
          </Card>
          
          <Card withBorder p="xl" radius="md">
            <IconTerminal size={40} color="#4158D0" style={{ marginBottom: 15 }} />
            <Title order={3} mb={10}>Comprehensive</Title>
            <Text color="dimmed" sx={{ lineHeight: 1.6 }}>
              Access all Stack features programmatically, from document management to user administration.
            </Text>
          </Card>
          
          <Card withBorder p="xl" radius="md">
            <IconBrandGithub size={40} color="#4158D0" style={{ marginBottom: 15 }} />
            <Title order={3} mb={10}>Open Source SDKs</Title>
            <Text color="dimmed" sx={{ lineHeight: 1.6 }}>
              Use our official SDKs for popular languages or contribute to our open source libraries.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>
      
      {/* API Reference */}
      <Box py={80} sx={{ background: '#f8f9fa' }} id="endpoints">
        <Container size="lg">
          <Title order={2} mb={50} align="center">API Reference</Title>
          
          <Card withBorder radius="md">
            <Group position="apart" p="md" sx={{ borderBottom: '1px solid #eee' }}>
              <Text weight={700} size="lg">Endpoints</Text>
              <Badge color="blue">v1</Badge>
            </Group>
            
            <Group spacing={0} noWrap sx={{ 
              '@media (max-width: 768px)': { 
                flexDirection: 'column',
                '& > div': {
                  width: '100%',
                  borderRight: 'none',
                  borderBottom: '1px solid #eee'
                }
              } 
            }}>
              {/* Sidebar */}
              <Box 
                sx={{ 
                  width: 250,
                  borderRight: '1px solid #eee',
                  '@media (max-width: 768px)': {
                    width: '100%'
                  }
                }}
              >
                {apiEndpoints.map(category => (
                  <Box
                    key={category.name}
                    sx={{
                      padding: '15px 20px',
                      cursor: 'pointer',
                      background: activeTab === category.name.toLowerCase() ? 'rgba(65, 88, 208, 0.05)' : 'transparent',
                      borderLeft: activeTab === category.name.toLowerCase() ? '3px solid #4158D0' : '3px solid transparent',
                      '&:hover': {
                        background: 'rgba(65, 88, 208, 0.03)'
                      }
                    }}
                    onClick={() => setActiveTab(category.name.toLowerCase())}
                  >
                    <Text weight={600}>{category.name}</Text>
                    <Text size="xs" color="dimmed">{category.description}</Text>
                  </Box>
                ))}
              </Box>
              
              {/* Content */}
              <Box sx={{ flex: 1, padding: 20 }}>
                <Title order={3} mb={20}>{selectedCategory.name}</Title>
                <Text mb={30}>{selectedCategory.description}</Text>
                
                {selectedCategory.endpoints.map((endpoint, index) => (
                  <Box key={index} mb={index < selectedCategory.endpoints.length - 1 ? 40 : 0}>
                    <Group mb={10}>
                      <Badge 
                        color={
                          endpoint.method === 'GET' ? 'blue' : 
                          endpoint.method === 'POST' ? 'green' : 
                          endpoint.method === 'PUT' ? 'yellow' : 
                          endpoint.method === 'DELETE' ? 'red' : 'gray'
                        }
                        size="lg"
                        sx={{ minWidth: 70, textAlign: 'center' }}
                      >
                        {endpoint.method}
                      </Badge>
                      <Text weight={600} sx={{ fontFamily: 'monospace', fontSize: 16 }}>
                        {endpoint.path}
                      </Text>
                    </Group>
                    
                    <Text mb={15}>{endpoint.description}</Text>
                    
                    {endpoint.parameters.length > 0 && (
                      <>
                        <Text weight={600} size="sm" mb={10}>Parameters</Text>
                        <Box 
                          sx={{ 
                            border: '1px solid #eee',
                            borderRadius: 8,
                            overflow: 'hidden',
                            marginBottom: 15
                          }}
                        >
                          <Box 
                            sx={{ 
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr 100px',
                              padding: '10px 15px',
                              background: '#f8f9fa',
                              borderBottom: '1px solid #eee',
                              '@media (max-width: 576px)': {
                                gridTemplateColumns: '1fr 1fr 80px'
                              }
                            }}
                          >
                            <Text weight={600} size="sm">Name</Text>
                            <Text weight={600} size="sm">Type</Text>
                            <Text weight={600} size="sm">Required</Text>
                          </Box>
                          {endpoint.parameters.map((param, paramIndex) => (
                            <Box 
                              key={paramIndex}
                              sx={{ 
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 100px',
                                padding: '10px 15px',
                                borderBottom: paramIndex < endpoint.parameters.length - 1 ? '1px solid #eee' : 'none',
                                '@media (max-width: 576px)': {
                                  gridTemplateColumns: '1fr 1fr 80px'
                                }
                              }}
                            >
                              <Text size="sm" sx={{ fontFamily: 'monospace' }}>{param.name}</Text>
                              <Text size="sm">{param.type}</Text>
                              <Text size="sm">{param.required ? 'Yes' : 'No'}</Text>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                    
                    <Text weight={600} size="sm" mb={10}>Response</Text>
                    <Box sx={{ position: 'relative' }}>
                      <Code 
                        block 
                        sx={{ 
                          background: '#2d2d2d',
                          color: '#fff',
                          padding: 15,
                          borderRadius: 8,
                          fontFamily: 'monospace',
                          fontSize: 14,
                          lineHeight: 1.5
                        }}
                      >
                        {endpoint.response}
                      </Code>
                      <CopyButton value={endpoint.response}>
                        {({ copied, copy }) => (
                          <ActionIcon
                            color={copied ? 'teal' : 'gray'}
                            onClick={copy}
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              background: 'rgba(45, 45, 45, 0.5)',
                              '&:hover': {
                                background: 'rgba(45, 45, 45, 0.8)'
                              }
                            }}
                          >
                            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          </ActionIcon>
                        )}
                      </CopyButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Group>
          </Card>
        </Container>
      </Box>
      
      {/* Code Examples */}
      <Container size="lg" py={80}>
        <Title order={2} mb={50} align="center">Code Examples</Title>
        
        <Card withBorder radius="md">
          <Tabs
            value={activeLanguage}
            onTabChange={(value) => value !== null && setActiveLanguage(value.toString())}
            sx={{
              '.mantine-Tabs-tabsList': {
                borderBottom: '1px solid #eee',
                padding: '0 20px'
              },
              '.mantine-Tabs-tab': {
                padding: '15px 20px',
                fontWeight: 600,
                '&[data-active]': {
                  color: '#4158D0',
                  borderBottom: '2px solid #4158D0'
                }
              }
            }}
          >
            <Tabs.List>
              <Tabs.Tab 
                value="javascript" 
                icon={<IconBrandJavascript size={16} color="#F7DF1E" />}
              >
                JavaScript
              </Tabs.Tab>
              <Tabs.Tab 
                value="python" 
                icon={<IconBrandPython size={16} color="#3776AB" />}
              >
                Python
              </Tabs.Tab>
              <Tabs.Tab 
                value="php" 
                icon={<IconBrandPhp size={16} color="#777BB4" />}
              >
                PHP
              </Tabs.Tab>
            </Tabs.List>
            
            <Box p={20}>
              <Box sx={{ position: 'relative' }}>
                <Code 
                  block 
                  sx={{ 
                    background: '#2d2d2d',
                    color: '#fff',
                    padding: 15,
                    borderRadius: 8,
                    fontFamily: 'monospace',
                    fontSize: 14,
                    lineHeight: 1.5
                  }}
                >
                  {codeExamples[activeLanguage]}
                </Code>
                <CopyButton value={codeExamples[activeLanguage]}>
                  {({ copied, copy }) => (
                    <ActionIcon
                      color={copied ? 'teal' : 'gray'}
                      onClick={copy}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(45, 45, 45, 0.5)',
                        '&:hover': {
                          background: 'rgba(45, 45, 45, 0.8)'
                        }
                      }}
                    >
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                  )}
                </CopyButton>
              </Box>
            </Box>
          </Tabs>
        </Card>
      </Container>
      
      {/* Get API Key */}
      <Box py={80} sx={{ background: '#f8f9fa' }}>
        <Container size="md">
          <Card 
            withBorder 
            radius="lg" 
            p={40}
            sx={{
              background: 'linear-gradient(135deg, rgba(65, 88, 208, 0.05) 0%, rgba(200, 80, 192, 0.05) 100%)',
              textAlign: 'center'
            }}
          >
            <Title order={2} mb={15}>Ready to get started?</Title>
            <Text size="lg" color="dimmed" mb={30} sx={{ maxWidth: 600, margin: '0 auto' }}>
              Sign up for a free account to get your API key and start building integrations with Stack.
            </Text>
            
            <Group position="center" spacing="md">
              <Button 
                component={Link}
                href="/signup"
                size="lg"
                radius="xl"
                sx={{ 
                  background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                  padding: '0 35px',
                  height: 54
                }}
              >
                Get API Key
              </Button>
              
              <Button 
                component={Link}
                href="/contact"
                size="lg"
                radius="xl"
                variant="outline"
                color="blue"
                sx={{ 
                  padding: '0 35px',
                  height: 54
                }}
              >
                Contact Sales
              </Button>
            </Group>
          </Card>
        </Container>
      </Box>

      <Footer />
      <CookieConsent />
      <FloatingChatButton />
      <BackToTopButton />
    </div>
  );
}
