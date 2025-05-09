import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, Title, Text, Paper, Group, Button, LoadingOverlay, Avatar, Tooltip, ActionIcon, Divider } from '@mantine/core';
import { IconArrowLeft, IconUser, IconUsers, IconClock, IconFileText } from '@tabler/icons-react';
import axios from 'axios';

interface Document {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  collaborators: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export default function DocumentPage() {
  const router = useRouter();
  const { id } = router.query;
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/documents/${id}`);
      setDocument(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load document. Please try again.');
      setLoading(false);
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

  if (error) {
    return (
      <Container size="lg" py={40}>
        <Paper shadow="sm" p="xl" withBorder>
          <Text color="red" align="center" mb="md">{error}</Text>
          <Button leftIcon={<IconArrowLeft size={18} />} fullWidth mt="md" onClick={() => router.push('/documents')}>
            Back to Documents
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <div>
      <Head>
        <title>{document?.title || 'Document'} | Real-Time Collaboration Platform</title>
        <meta name="description" content="Collaborate on documents in real-time" />
      </Head>

      <Container size="lg" py={40}>
        <Group position="apart" mb={30}>
          <Group>
            <ActionIcon variant="light" size="lg" onClick={() => router.push('/documents')}>
              <IconArrowLeft size={22} />
            </ActionIcon>
            <Title order={2} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconFileText size={32} style={{ marginRight: 8 }} />
              {document?.title || 'Loading...'}
            </Title>
          </Group>
        </Group>

        <Paper shadow="sm" p="xl" withBorder pos="relative" radius="md">
          <LoadingOverlay visible={loading} />
          {document && (
            <>
              <Group position="apart" mb="md">
                <Group spacing={8}>
                  <IconUser size={18} />
                  <Text size="sm" color="dimmed">
                    Created by: {document.createdBy}
                  </Text>
                </Group>
                <Group spacing={8}>
                  <IconClock size={18} />
                  <Text size="sm" color="dimmed">
                    Last updated: {formatDate(document.updatedAt)}
                  </Text>
                </Group>
              </Group>
              <Divider my="sm" />
              <Text size="md" style={{ minHeight: 80, marginBottom: 24 }}>
                {document.content || <Text color="dimmed">No content yet.</Text>}
              </Text>
              <Divider my="sm" />
              <Group spacing={8} mt="md">
                <IconUsers size={20} />
                <Text size="sm" color="dimmed">
                  {document.collaborators.length} {document.collaborators.length === 1 ? 'collaborator' : 'collaborators'}
                </Text>
                <Group spacing={4} ml={8}>
                  {document.collaborators.map((collab) => (
                    <Tooltip label={collab.name + ' (' + collab.email + ')'} key={collab.id}>
                      <Avatar size={28} radius="xl" color="blue">
                        {collab.name[0].toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Group>
              </Group>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
} 