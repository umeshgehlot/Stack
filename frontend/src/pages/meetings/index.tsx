import { useState } from 'react';
import Head from 'next/head';
import { Container, Title, Text, Card, Group, Button, SimpleGrid, Modal, TextInput, Badge, ActionIcon } from '@mantine/core';
import { IconVideo, IconCalendarPlus, IconUsers, IconClock } from '@tabler/icons-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: number;
  status: 'upcoming' | 'completed';
}

const mockMeetings: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Weekly Standup',
    date: '2024-05-10',
    time: '10:00 AM',
    participants: 5,
    status: 'upcoming',
  },
  {
    id: 'meet-2',
    title: 'Product Demo',
    date: '2024-05-12',
    time: '2:00 PM',
    participants: 8,
    status: 'upcoming',
  },
  {
    id: 'meet-3',
    title: 'Retrospective',
    date: '2024-05-05',
    time: '4:00 PM',
    participants: 4,
    status: 'completed',
  },
];

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleCreateMeeting = () => {
    if (!newTitle || !newDate || !newTime) return;
    const newMeeting: Meeting = {
      id: `meet-${Date.now()}`,
      title: newTitle,
      date: newDate,
      time: newTime,
      participants: 1,
      status: 'upcoming',
    };
    setMeetings([newMeeting, ...meetings]);
    setModalOpen(false);
    setNewTitle('');
    setNewDate('');
    setNewTime('');
  };

  return (
    <div>
      <Head>
        <title>Meetings | Real-Time Collaboration Platform</title>
        <meta name="description" content="Schedule and join meetings in real-time" />
      </Head>
      <Container size="lg" py={40}>
        <Group position="apart" mb={30}>
          <Group>
            <IconVideo size={36} color="#228be6" />
            <Title order={2} style={{ marginLeft: 8 }}>Meetings</Title>
          </Group>
          <Button leftIcon={<IconCalendarPlus size={20} />} onClick={() => setModalOpen(true)}>
            Schedule Meeting
          </Button>
        </Group>
        {meetings.length === 0 ? (
          <Card shadow="sm" p="xl" withBorder>
            <Text align="center">No meetings scheduled. Click "Schedule Meeting" to create one.</Text>
          </Card>
        ) : (
          <SimpleGrid cols={3} spacing="lg" breakpoints={[
            { maxWidth: 980, cols: 2, spacing: 'md' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}>
            {meetings.map((meeting) => (
              <Card key={meeting.id} shadow="sm" p="lg" radius="md" withBorder>
                <Group position="apart" mb={8}>
                  <Text weight={500} size="lg">{meeting.title}</Text>
                  <Badge color={meeting.status === 'upcoming' ? 'green' : 'gray'}>{meeting.status}</Badge>
                </Group>
                <Group spacing={8} mb={6}>
                  <IconClock size={16} />
                  <Text size="sm" color="dimmed">{meeting.date} at {meeting.time}</Text>
                </Group>
                <Group spacing={8}>
                  <IconUsers size={16} />
                  <Text size="sm" color="dimmed">{meeting.participants} participant{meeting.participants !== 1 ? 's' : ''}</Text>
                </Group>
                <Button mt="md" fullWidth variant="light" leftIcon={<IconVideo size={18} />}>
                  Join Meeting
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        )}
        <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Schedule New Meeting" centered>
          <TextInput
            label="Meeting Title"
            placeholder="Enter meeting title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            mb="md"
            required
          />
          <TextInput
            label="Date"
            placeholder="YYYY-MM-DD"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            mb="md"
            required
          />
          <TextInput
            label="Time"
            placeholder="e.g. 10:00 AM"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            mb="md"
            required
          />
          <Group position="right">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateMeeting}>Create</Button>
          </Group>
        </Modal>
      </Container>
    </div>
  );
} 