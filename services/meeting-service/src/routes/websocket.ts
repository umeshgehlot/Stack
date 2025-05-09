import { FastifyInstance } from 'fastify';
import { WebRtcHandler } from '../handlers/webrtc.handler';

export default async function websocketRoutes(fastify: FastifyInstance) {
  const webRtcHandler = new WebRtcHandler(fastify);
  
  // Register WebSocket routes for meeting rooms
  fastify.get('/meeting/:roomId', { websocket: true }, (connection, request) => {
    webRtcHandler.handleConnection(connection, request);
  });
  
  // WebSocket route for waiting room notifications
  fastify.get('/waiting-room/:meetingId', { 
    websocket: true,
    onRequest: [fastify.authenticate] 
  }, async (connection, request: any) => {
    const { meetingId } = request.params;
    const socket = connection.socket;
    
    // Check if user is the host of the meeting
    const meeting = await fastify.db.collection('meetings').findOne({
      id: meetingId,
      hostId: request.user.id
    });
    
    if (!meeting) {
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Meeting not found or you are not the host'
      }));
      socket.close();
      return;
    }
    
    // Subscribe to waiting room events
    const subscriber = fastify.redis.duplicate();
    await subscriber.subscribe('meeting:waiting-room:join');
    
    subscriber.on('message', (channel, message) => {
      try {
        const data = JSON.parse(message);
        
        // Only forward messages for this meeting
        if (data.meetingId === meetingId) {
          socket.send(message);
        }
      } catch (error) {
        fastify.log.error('Error handling Redis message:', error);
      }
    });
    
    // Handle WebSocket messages from the host
    socket.on('message', async (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'approve-participant') {
          const { participantId, approved } = data;
          
          // Update participant status in the database
          await fastify.db.collection('meetings').updateOne(
            { id: meetingId, 'participants.id': participantId },
            { 
              $set: { 
                'participants.$.status': approved ? 'approved' : 'rejected',
                'participants.$.updatedAt': new Date().toISOString()
              } 
            }
          );
          
          // Publish approval/rejection event
          await fastify.redis.publish('meeting:waiting-room:response', JSON.stringify({
            meetingId,
            participantId,
            approved,
            hostId: request.user.id
          }));
          
          socket.send(JSON.stringify({
            type: 'participant-response',
            participantId,
            approved
          }));
        } else if (data.type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (error) {
        fastify.log.error('Error handling WebSocket message:', error);
      }
    });
    
    // Handle WebSocket close
    socket.on('close', () => {
      subscriber.unsubscribe('meeting:waiting-room:join');
      subscriber.quit();
    });
  });
  
  // WebSocket route for meeting notifications
  fastify.get('/notifications/:userId', { 
    websocket: true,
    onRequest: [fastify.authenticate] 
  }, async (connection, request: any) => {
    const { userId } = request.params;
    const socket = connection.socket;
    
    // Verify user ID matches the authenticated user
    if (userId !== request.user.id) {
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Unauthorized access'
      }));
      socket.close();
      return;
    }
    
    // Subscribe to meeting notification events
    const subscriber = fastify.redis.duplicate();
    await subscriber.subscribe([
      'meeting:created',
      'meeting:updated',
      'meeting:cancelled',
      'meeting:started',
      'meeting:ended',
      'meeting:participant:joined',
      'meeting:participant:left',
      'meeting:recording:started',
      'meeting:recording:stopped',
      'meeting:recording:completed',
      'meeting:transcription:completed'
    ]);
    
    subscriber.on('message', (channel, message) => {
      try {
        const data = JSON.parse(message);
        
        // Only forward notifications relevant to this user
        if (
          data.hostId === userId || 
          data.userId === userId || 
          (data.participants && data.participants.some((p: any) => p.userId === userId))
        ) {
          socket.send(message);
        }
      } catch (error) {
        fastify.log.error('Error handling Redis message:', error);
      }
    });
    
    // Handle WebSocket messages
    socket.on('message', (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (error) {
        fastify.log.error('Error handling WebSocket message:', error);
      }
    });
    
    // Handle WebSocket close
    socket.on('close', () => {
      subscriber.unsubscribe();
      subscriber.quit();
    });
  });
}
