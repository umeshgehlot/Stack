import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container, Title, Text, Button, Group, SimpleGrid, Card, Badge, TextInput, Modal } from '@mantine/core';
import axios from 'axios';

interface Document {
  id: string;
  title: string;
  updatedAt: string;
  createdBy: string;
  collaborators: number;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to your document service
      // For demo purposes, we'll simulate an API response
      
      // Simulated API call
      // const response = await axios.get(`${process.env.API_URL}/api/documents`);
      // const data = response.data;
      
      // Simulated response
      setTimeout(() => {
        const mockDocuments = [
          {
            id: 'doc-1',
            title: 'Project Roadmap',
            updatedAt: new Date().toISOString(),
            createdBy: 'User 1',
            collaborators: 3,
          },
          {
            id: 'doc-2',
            title: 'Meeting Notes',
            updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            createdBy: 'User 2',
            collaborators: 5,
          },
          {
            id: 'doc-3',
            title: 'Product Requirements',
            updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            createdBy: 'User 1',
            collaborators: 2,
          },
        ];
        
        setDocuments(mockDocuments);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    if (!newDocumentTitle.trim()) return;
    
    try {
      setCreating(true);
      
      // In a real app, this would be an API call to your document service
      // For demo purposes, we'll simulate an API response
      
      // Simulated API call
      // const response = await axios.post(`${process.env.API_URL}/api/documents`, {
      //   title: newDocumentTitle,
      //   content: '',
      // });
      // const newDocument = response.data;
      
      // Simulated response
      setTimeout(() => {
        const newDocument = {
          id: `doc-${Date.now()}`,
          title: newDocumentTitle,
          updatedAt: new Date().toISOString(),
          createdBy: 'Demo User',
          collaborators: 1,
        };
        
        setDocuments([newDocument, ...documents]);
        setCreateModalOpen(false);
        setNewDocumentTitle('');
        setCreating(false);
        
        // Navigate to the new document
        router.push(`/documents/${newDocument.id}`);
      }, 1000);
    } catch (err) {
      console.error('Error creating document:', err);
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <Head>
        <title>Documents | Real-Time Collaboration Platform</title>
        <meta name="description" content="Collaborate on documents in real-time" />
      </Head>

      <Container size="lg" py={40}>
        <Group position="apart" mb={30}>
          <Title order={2}>Your Documents</Title>
          <Button onClick={() => setCreateModalOpen(true)}>Create New Document</Button>
        </Group>

        {loading ? (
          <Text align="center" mt={50}>Loading documents...</Text>
        ) : documents.length === 0 ? (
          <Card shadow="sm" p="xl" withBorder>
            <Text align="center">You don't have any documents yet. Create your first document to get started.</Text>
            <Button fullWidth mt="md" onClick={() => setCreateModalOpen(true)}>
              Create Your First Document
            </Button>
          </Card>
        ) : (
          <SimpleGrid cols={3} spacing="lg" breakpoints={[
            { maxWidth: 980, cols: 2, spacing: 'md' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}>
            {documents.map((doc) => (
              <Card key={doc.id} shadow="sm" p="lg" radius="md" withBorder
                onClick={() => router.push(`/documents/${doc.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <Text weight={500} size="lg" mb={5}>{doc.title}</Text>
                <Text size="xs" color="dimmed" mb={10}>Last updated: {formatDate(doc.updatedAt)}</Text>
                <Group position="apart" mt="auto">
                  <Text size="sm">Created by: {doc.createdBy}</Text>
                  <Badge color="blue">{doc.collaborators} {doc.collaborators === 1 ? 'collaborator' : 'collaborators'}</Badge>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>

      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Document"
      >
        <TextInput
          label="Document Title"
          placeholder="Enter document title"
          value={newDocumentTitle}
          onChange={(e) => setNewDocumentTitle(e.target.value)}
          mb="md"
          required
        />
        <Group position="right">
          <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateDocument} loading={creating}>Create</Button>
        </Group>
      </Modal>
    </div>
  );
}