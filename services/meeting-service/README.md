# Meeting Service

The Meeting Service is a core component of the Stack platform that provides video conferencing capabilities. It enables users to create, join, and manage meetings with features like screen sharing, recording, transcription, and more.

## Features

- **Meeting Management**: Create, update, cancel, and end meetings
- **Participant Management**: Join/leave meetings, manage waiting rooms
- **Real-time Communication**: WebRTC-based audio/video streaming using MediaSoup
- **Recording**: Record meetings for later playback
- **Transcription**: Automatically transcribe meeting content
- **Meeting Settings**: Configure various meeting options (quality, permissions, etc.)
- **WebSocket Integration**: Real-time updates and notifications

## Tech Stack

- **Node.js** with TypeScript
- **Fastify** as the web framework
- **MongoDB** for data persistence
- **Redis** for pub/sub and caching
- **MediaSoup** for WebRTC capabilities
- **JWT** for authentication
- **WebSockets** for real-time communication

## Prerequisites

- Node.js (v14+)
- MongoDB
- Redis
- MediaSoup dependencies (see [MediaSoup installation](https://mediasoup.org/documentation/v3/mediasoup/installation/))

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=3003
HOST=0.0.0.0
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/stack
REDIS_URI=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key

# MediaSoup
MEDIASOUP_LISTEN_IP=0.0.0.0
MEDIASOUP_ANNOUNCED_IP=127.0.0.1  # Your server's public IP in production
```

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the service
npm start

# For development with hot-reload
npm run dev
```

## API Endpoints

### Meetings

- `GET /api/meetings` - Get all meetings with filtering and pagination
- `GET /api/meetings/:id` - Get meeting by ID
- `POST /api/meetings` - Create a new meeting
- `PUT /api/meetings/:id` - Update a meeting
- `DELETE /api/meetings/:id/cancel` - Cancel a meeting
- `POST /api/meetings/join` - Join a meeting
- `POST /api/meetings/:id/leave` - Leave a meeting
- `POST /api/meetings/:id/end` - End a meeting

### Recordings

- `POST /api/meetings/:id/start` - Start recording a meeting
- `POST /api/meetings/:id/recordings/:recordingId/stop` - Stop recording
- `GET /api/meetings/:id/recordings` - Get recordings for a meeting
- `DELETE /api/meetings/:id/recordings/:recordingId` - Delete a recording
- `GET /api/meetings/:id/transcriptions` - Get transcriptions for a meeting

### WebSocket Endpoints

- `WS /ws/meeting/:roomId` - WebSocket connection for real-time communication

## Architecture

The Meeting Service follows a modular architecture:

- **Controllers**: Handle HTTP requests and business logic
- **Routes**: Define API endpoints and validation
- **Models**: Define data structures
- **Handlers**: Manage WebRTC and WebSocket connections
- **Middleware**: Handle authentication, error handling, etc.

## Integration with Other Services

The Meeting Service integrates with other Stack platform services:

- **Auth Service**: For user authentication and authorization
- **User Service**: For user profile information
- **Calendar Service**: For scheduling meetings
- **Notification Service**: For meeting notifications and reminders

## WebRTC Flow

1. Client connects to WebSocket endpoint
2. Server creates/joins a MediaSoup room
3. Client and server exchange SDP offers/answers
4. WebRTC connection is established
5. Audio/video streams are transmitted

## Development

```bash
# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Production Considerations

- Use a production-ready MongoDB and Redis setup
- Set up proper HTTPS for secure WebRTC connections
- Configure proper network settings for MediaSoup
- Set up monitoring and logging
- Consider scaling strategies for high-traffic deployments

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
