import React, { useState } from 'react';
import Head from 'next/head';
import {
  Container, Title, Text, Card, Grid, Group, Button, Table,
  ActionIcon, Menu, Badge, Tabs, TextInput, Modal, Select,
  Checkbox, Progress, Tooltip, Box, Paper, Divider
} from '@mantine/core';
import {
  IconFile, IconFileText, IconFileSpreadsheet, IconFileAnalytics,
  IconFilePdf, IconFileZip, IconFileUpload, IconFolderPlus,
  IconDotsVertical, IconDownload, IconShare, IconTrash,
  IconPencil, IconStar, IconStarOff, IconSearch, IconFilter,
  IconSortAscending, IconSortDescending, IconEye
} from '@tabler/icons-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// Sample data for documents
const documents = [
  {
    id: 1,
    name: 'Q2 Marketing Strategy.docx',
    type: 'document',
    size: '2.4 MB',
    owner: 'Alex Johnson',
    lastModified: '2025-05-07T10:30:00',
    shared: true,
    starred: true,
    tags: ['marketing', 'strategy']
  },
  {
    id: 2,
    name: 'Financial Report 2025.xlsx',
    type: 'spreadsheet',
    size: '4.8 MB',
    owner: 'Sarah Miller',
    lastModified: '2025-05-06T14:15:00',
    shared: true,
    starred: false,
    tags: ['finance', 'report']
  },
  {
    id: 3,
    name: 'Product Roadmap.pptx',
    type: 'presentation',
    size: '8.2 MB',
    owner: 'David Chen',
    lastModified: '2025-05-05T09:45:00',
    shared: true,
    starred: true,
    tags: ['product', 'roadmap']
  },
  {
    id: 4,
    name: 'User Research Results.pdf',
    type: 'pdf',
    size: '3.7 MB',
    owner: 'Emma Wilson',
    lastModified: '2025-05-04T16:20:00',
    shared: false,
    starred: false,
    tags: ['research', 'users']
  },
  {
    id: 5,
    name: 'Brand Guidelines.pdf',
    type: 'pdf',
    size: '5.1 MB',
    owner: 'Alex Johnson',
    lastModified: '2025-04-28T11:10:00',
    shared: true,
    starred: false,
    tags: ['brand', 'design']
  },
  {
    id: 6,
    name: 'Project Timeline.xlsx',
    type: 'spreadsheet',
    size: '1.9 MB',
    owner: 'Jennifer Lee',
    lastModified: '2025-05-02T13:30:00',
    shared: false,
    starred: true,
    tags: ['project', 'timeline']
  },
  {
    id: 7,
    name: 'API Documentation.md',
    type: 'document',
    size: '0.8 MB',
    owner: 'Robert Garcia',
    lastModified: '2025-05-01T15:45:00',
    shared: true,
    starred: false,
    tags: ['api', 'documentation']
  },
  {
    id: 8,
    name: 'Design Assets.zip',
    type: 'archive',
    size: '24.5 MB',
    owner: 'Lisa Wang',
    lastModified: '2025-04-25T10:15:00',
    shared: true,
    starred: false,
    tags: ['design', 'assets']
  }
];

// Sample data for folders
const folders = [
  {
    id: 1,
    name: 'Marketing',
    items: 12,
    owner: 'Alex Johnson',
    lastModified: '2025-05-07T10:30:00',
    shared: true
  },
  {
    id: 2,
    name: 'Finance',
    items: 8,
    owner: 'Sarah Miller',
    lastModified: '2025-05-06T14:15:00',
    shared: true
  },
  {
    id: 3,
    name: 'Product Development',
    items: 15,
    owner: 'David Chen',
    lastModified: '2025-05-05T09:45:00',
    shared: true
  },
  {
    id: 4,
    name: 'Design Assets',
    items: 24,
    owner: 'Lisa Wang',
    lastModified: '2025-04-25T10:15:00',
    shared: false
  }
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<number[]>([]);

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => {
      // Filter by search query
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by tab
      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'shared' && doc.shared) ||
        (activeTab === 'starred' && doc.starred) ||
        (activeTab === doc.type);
      
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'modified') {
        return sortDirection === 'asc'
          ? new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
          : new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      } else if (sortBy === 'size') {
        const sizeA = parseFloat(a.size.split(' ')[0]);
        const sizeB = parseFloat(b.size.split(' ')[0]);
        return sortDirection === 'asc' ? sizeA - sizeB : sizeB - sizeA;
      }
      return 0;
    });

  // Filter and sort folders
  const filteredFolders = folders
    .filter((folder) => {
      // Filter by search query
      const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by tab
      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'shared' && folder.shared);
      
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'modified') {
        return sortDirection === 'asc'
          ? new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
          : new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
      return 0;
    });

  // Toggle selection of a document
  const toggleSelectDocument = (id: number) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  // Toggle selection of a folder
  const toggleSelectFolder = (id: number) => {
    setSelectedFolders(prev => 
      prev.includes(id) 
        ? prev.filter(folderId => folderId !== id)
        : [...prev, id]
    );
  };

  // Handle new folder creation
  const handleCreateFolder = () => {
    // In a real app, this would send an API request to create a new folder
    console.log('Creating folder:', newFolderName);
    
    // Reset form and close modal
    setNewFolderName('');
    setNewFolderModalOpen(false);
  };

  // Get icon for document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <IconFileText size={20} />;
      case 'spreadsheet':
        return <IconFileSpreadsheet size={20} />;
      case 'presentation':
        return <IconFileAnalytics size={20} />;
      case 'pdf':
        return <IconFilePdf size={20} />;
      case 'archive':
        return <IconFileZip size={20} />;
      default:
        return <IconFile size={20} />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Documents | Stack</title>
        <meta name="description" content="Manage your documents and files" />
      </Head>

      <Container fluid px="md" py="xl">
        {/* Header */}
        <Grid mb={30}>
          <Grid.Col span={12}>
            <Card p="lg" radius="md" withBorder>
              <Group position="apart">
                <div>
                  <Title order={2} mb={5}>Documents</Title>
                  <Text color="dimmed">Manage your files and folders</Text>
                </div>
                <Group>
                  <Button
                    variant="outline"
                    leftIcon={<IconFolderPlus size={16} />}
                    onClick={() => setNewFolderModalOpen(true)}
                  >
                    New Folder
                  </Button>
                  <Button
                    leftIcon={<IconFileUpload size={16} />}
                    onClick={() => setUploadModalOpen(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #4158D0, #C850C0)',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Upload Files
                  </Button>
                </Group>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Storage Overview */}
        <Card p="lg" radius="md" withBorder mb={30}>
          <Group position="apart" mb={15}>
            <Title order={4}>Storage</Title>
            <Badge size="lg">75% Used</Badge>
          </Group>
          
          <Progress 
            value={75} 
            size="xl" 
            radius="xl" 
            mb={10}
            sections={[
              { value: 30, color: 'blue' },  // Documents
              { value: 25, color: 'violet' }, // Images
              { value: 15, color: 'orange' }, // Videos
              { value: 5, color: 'teal' },   // Other
            ]}
          />
          
          <Group position="apart">
            <Text size="sm">15 GB used of 20 GB</Text>
            <Button variant="subtle" compact>Upgrade Storage</Button>
          </Group>
        </Card>

        {/* Documents List */}
        <Card p="lg" radius="md" withBorder>
          <Group position="apart" mb={20}>
            <Tabs value={activeTab} onTabChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Tab value="all">All Files</Tabs.Tab>
                <Tabs.Tab value="shared">Shared</Tabs.Tab>
                <Tabs.Tab value="starred">Starred</Tabs.Tab>
                <Tabs.Tab value="document">Documents</Tabs.Tab>
                <Tabs.Tab value="spreadsheet">Spreadsheets</Tabs.Tab>
                <Tabs.Tab value="presentation">Presentations</Tabs.Tab>
                <Tabs.Tab value="pdf">PDFs</Tabs.Tab>
              </Tabs.List>
            </Tabs>
            
            <Group spacing={10}>
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <Button variant="light" leftIcon={<IconFilter size={16} />} compact>
                    Sort
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Sort By</Menu.Label>
                  <Menu.Item 
                    icon={<IconSortAscending size={14} />}
                    onClick={() => {
                      setSortBy('name');
                      setSortDirection('asc');
                    }}
                  >
                    Name (A-Z)
                  </Menu.Item>
                  <Menu.Item 
                    icon={<IconSortDescending size={14} />}
                    onClick={() => {
                      setSortBy('name');
                      setSortDirection('desc');
                    }}
                  >
                    Name (Z-A)
                  </Menu.Item>
                  <Menu.Item 
                    icon={<IconSortDescending size={14} />}
                    onClick={() => {
                      setSortBy('modified');
                      setSortDirection('desc');
                    }}
                  >
                    Last Modified
                  </Menu.Item>
                  <Menu.Item 
                    icon={<IconSortDescending size={14} />}
                    onClick={() => {
                      setSortBy('size');
                      setSortDirection('desc');
                    }}
                  >
                    Size
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>

          <TextInput
            placeholder="Search files and folders"
            icon={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            mb={20}
          />

          {selectedFiles.length > 0 || selectedFolders.length > 0 ? (
            <Group position="apart" mb={15}>
              <Text>
                {selectedFiles.length + selectedFolders.length} item{selectedFiles.length + selectedFolders.length > 1 ? 's' : ''} selected
              </Text>
              <Group spacing={8}>
                <Button variant="light" size="xs" leftIcon={<IconDownload size={14} />}>
                  Download
                </Button>
                <Button variant="light" size="xs" leftIcon={<IconShare size={14} />}>
                  Share
                </Button>
                <Button variant="light" size="xs" color="red" leftIcon={<IconTrash size={14} />}>
                  Delete
                </Button>
              </Group>
            </Group>
          ) : null}

          {/* Folders */}
          {filteredFolders.length > 0 && (
            <>
              <Title order={5} mb={10}>Folders</Title>
              <Grid mb={20}>
                {filteredFolders.map((folder) => (
                  <Grid.Col key={folder.id} md={3} sm={6} xs={12}>
                    <Paper 
                      p="md" 
                      radius="md" 
                      withBorder 
                      sx={(theme) => ({
                        backgroundColor: selectedFolders.includes(folder.id) 
                          ? theme.colors.blue[0] 
                          : theme.white,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: theme.colors.gray[0],
                        },
                      })}
                      onClick={() => toggleSelectFolder(folder.id)}
                    >
                      <Group position="apart" mb={5} noWrap>
                        <Group noWrap>
                          <Checkbox
                            checked={selectedFolders.includes(folder.id)}
                            onChange={() => toggleSelectFolder(folder.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Text weight={500} truncate>{folder.name}</Text>
                        </Group>
                        <Menu position="bottom-end" shadow="md">
                          <Menu.Target>
                            <ActionIcon onClick={(e) => e.stopPropagation()}>
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item icon={<IconEye size={14} />}>Open</Menu.Item>
                            <Menu.Item icon={<IconShare size={14} />}>Share</Menu.Item>
                            <Menu.Item icon={<IconPencil size={14} />}>Rename</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item icon={<IconTrash size={14} />} color="red">Delete</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                      <Text size="xs" color="dimmed">
                        {folder.items} item{folder.items !== 1 ? 's' : ''}
                      </Text>
                      <Text size="xs" color="dimmed">
                        Modified {formatDate(folder.lastModified)}
                      </Text>
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>
              <Divider my={20} />
            </>
          )}

          {/* Files */}
          <Title order={5} mb={10}>Files</Title>
          {filteredDocuments.length === 0 ? (
            <Text align="center" color="dimmed" py={30}>
              No documents match your search criteria
            </Text>
          ) : (
            <Table highlightOnHover>
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Last Modified</th>
                  <th>Size</th>
                  <th style={{ width: 120 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <Checkbox
                        checked={selectedFiles.includes(doc.id)}
                        onChange={() => toggleSelectDocument(doc.id)}
                      />
                    </td>
                    <td>
                      <Group spacing={10} noWrap>
                        {getDocumentIcon(doc.type)}
                        <div>
                          <Text size="sm">{doc.name}</Text>
                          <Group spacing={5} mt={3}>
                            {doc.tags.map((tag) => (
                              <Badge key={tag} size="xs" variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </Group>
                        </div>
                      </Group>
                    </td>
                    <td>{doc.owner}</td>
                    <td>{formatDate(doc.lastModified)}</td>
                    <td>{doc.size}</td>
                    <td>
                      <Group spacing={5} position="right">
                        <Tooltip label={doc.starred ? "Unstar" : "Star"}>
                          <ActionIcon color={doc.starred ? "yellow" : "gray"}>
                            {doc.starred ? <IconStar size={16} /> : <IconStarOff size={16} />}
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Download">
                          <ActionIcon>
                            <IconDownload size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Menu position="bottom-end" shadow="md">
                          <Menu.Target>
                            <ActionIcon>
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item icon={<IconEye size={14} />}>Preview</Menu.Item>
                            <Menu.Item icon={<IconDownload size={14} />}>Download</Menu.Item>
                            <Menu.Item icon={<IconShare size={14} />}>Share</Menu.Item>
                            <Menu.Item icon={<IconPencil size={14} />}>Rename</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item icon={<IconTrash size={14} />} color="red">Delete</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        {/* Upload Modal */}
        <Modal
          opened={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          title="Upload Files"
          size="md"
        >
          <Box
            sx={{
              border: '2px dashed #ced4da',
              borderRadius: 8,
              padding: 30,
              textAlign: 'center',
              marginBottom: 20
            }}
          >
            <IconFileUpload size={32} color="#4158D0" style={{ marginBottom: 10 }} />
            <Text size="lg" weight={500} mb={5}>
              Drag and drop files here
            </Text>
            <Text size="sm" color="dimmed" mb={15}>
              or click to browse files
            </Text>
            <Button variant="outline">
              Browse Files
            </Button>
          </Box>
          
          <Select
            label="Upload to folder"
            placeholder="Select a folder"
            data={folders.map(folder => ({ value: folder.id.toString(), label: folder.name }))}
            mb={20}
          />
          
          <Group position="right">
            <Button variant="subtle" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => setUploadModalOpen(false)}
              sx={{
                background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              }}
            >
              Upload
            </Button>
          </Group>
        </Modal>

        {/* New Folder Modal */}
        <Modal
          opened={newFolderModalOpen}
          onClose={() => setNewFolderModalOpen(false)}
          title="Create New Folder"
          size="sm"
        >
          <TextInput
            label="Folder Name"
            placeholder="Enter folder name"
            required
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            mb={20}
          />
          
          <Group position="right">
            <Button variant="subtle" onClick={() => setNewFolderModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFolder}
              disabled={!newFolderName}
              sx={{
                background: 'linear-gradient(135deg, #4158D0, #C850C0)',
              }}
            >
              Create Folder
            </Button>
          </Group>
        </Modal>
      </Container>
    </DashboardLayout>
  );
}
