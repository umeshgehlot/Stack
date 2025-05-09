import { FastifyInstance, FastifyRequest } from 'fastify';
import { SocketStream } from '@fastify/websocket';
import { v4 as uuidv4 } from 'uuid';
import * as mediasoup from 'mediasoup';

// Define types for WebRTC communication
interface WebRtcRoom {
  id: string;
  meetingId: string;
  router: mediasoup.types.Router;
  producers: Map<string, mediasoup.types.Producer>;
  consumers: Map<string, mediasoup.types.Consumer>;
  peers: Map<string, WebRtcPeer>;
  createdAt: string;
}

interface WebRtcPeer {
  id: string;
  userId: string;
  name: string;
  socket: WebSocket;
  transports: Map<string, mediasoup.types.WebRtcTransport>;
  producers: Map<string, mediasoup.types.Producer>;
  consumers: Map<string, mediasoup.types.Consumer>;
  joinedAt: string;
}

// MediaSoup worker and router options
const workerOptions: mediasoup.types.WorkerOptions = {
  logLevel: 'warn',
  rtcMinPort: 10000,
  rtcMaxPort: 59999
};

const routerOptions: mediasoup.types.RouterOptions = {
  mediaCodecs: [
    {
      kind: 'audio',
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2
    },
    {
      kind: 'video',
      mimeType: 'video/VP8',
      clockRate: 90000,
      parameters: {
        'x-google-start-bitrate': 1000
      }
    },
    {
      kind: 'video',
      mimeType: 'video/VP9',
      clockRate: 90000,
      parameters: {
        'profile-id': 2,
        'x-google-start-bitrate': 1000
      }
    },
    {
      kind: 'video',
      mimeType: 'video/h264',
      clockRate: 90000,
      parameters: {
        'packetization-mode': 1,
        'profile-level-id': '4d0032',
        'level-asymmetry-allowed': 1,
        'x-google-start-bitrate': 1000
      }
    }
  ]
};

// WebRTC transport options
const webRtcTransportOptions: mediasoup.types.WebRtcTransportOptions = {
  listenIps: [
    {
      ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
      announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '127.0.0.1'
    }
  ],
  initialAvailableOutgoingBitrate: 1000000,
  minimumAvailableOutgoingBitrate: 600000,
  maxSctpMessageSize: 262144,
  enableUdp: true,
  enableTcp: true,
  preferUdp: true
};

export class WebRtcHandler {
  private fastify: FastifyInstance;
  private worker: mediasoup.types.Worker | null = null;
  private rooms: Map<string, WebRtcRoom> = new Map();

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.initializeMediaSoup();
  }

  /**
   * Initialize MediaSoup worker
   */
  private async initializeMediaSoup(): Promise<void> {
    try {
      this.worker = await mediasoup.createWorker(workerOptions);
      
      this.worker.on('died', () => {
        this.fastify.log.error('MediaSoup worker died, exiting in 2 seconds...');
        setTimeout(() => process.exit(1), 2000);
      });
      
      this.fastify.log.info('MediaSoup worker initialized');
    } catch (error) {
      this.fastify.log.error('Failed to initialize MediaSoup worker:', error);
      throw error;
    }
  }

  /**
   * Handle WebSocket connection for a meeting room
   */
  async handleConnection(connection: SocketStream, request: FastifyRequest<{
    Params: { roomId: string }
  }>): Promise<void> {
    const { roomId } = request.params;
    const socket = connection.socket;
    
    // Get user info from JWT token
    let user: any;
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (token) {
        user = this.fastify.jwt.verify(token);
      } else {
        // For guests, create a temporary user
        user = {
          id: `guest-${uuidv4()}`,
          name: 'Guest',
          isGuest: true
        };
      }
    } catch (error) {
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Invalid authentication token'
      }));
      socket.close();
      return;
    }
    
    // Check if the room exists in the database
    const meeting = await this.fastify.db.collection('meetings').findOne({
      roomId,
      status: 'active'
    });
    
    if (!meeting) {
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Meeting not found or not active'
      }));
      socket.close();
      return;
    }
    
    // Check if the meeting has a waiting room and the user is not the host
    if (meeting.isWaitingRoomEnabled && meeting.hostId !== user.id) {
      // Check if the user is already approved
      const participant = meeting.participants.find((p: any) => p.userId === user.id);
      
      if (!participant || participant.status !== 'approved') {
        socket.send(JSON.stringify({
          type: 'waiting-room',
          meetingId: meeting.id,
          message: 'You have been placed in the waiting room'
        }));
        
        // Notify the host about the waiting participant
        await this.fastify.redis.publish('meeting:waiting-room:join', JSON.stringify({
          meetingId: meeting.id,
          roomId,
          participant: {
            id: uuidv4(),
            userId: user.id,
            name: user.name,
            avatar: user.avatar,
            joinTime: new Date().toISOString()
          }
        }));
        
        // Keep the connection open but don't add to the room yet
        socket.on('message', async (message: any) => {
          try {
            const data = JSON.parse(message.toString());
            
            if (data.type === 'ping') {
              socket.send(JSON.stringify({ type: 'pong' }));
            }
          } catch (error) {
            this.fastify.log.error('Error handling waiting room message:', error);
          }
        });
        
        return;
      }
    }
    
    // Create or get the WebRTC room
    let room = this.rooms.get(roomId);
    
    if (!room) {
      if (!this.worker) {
        socket.send(JSON.stringify({
          type: 'error',
          error: 'MediaSoup worker not initialized'
        }));
        socket.close();
        return;
      }
      
      try {
        const router = await this.worker.createRouter(routerOptions);
        
        room = {
          id: roomId,
          meetingId: meeting.id,
          router,
          producers: new Map(),
          consumers: new Map(),
          peers: new Map(),
          createdAt: new Date().toISOString()
        };
        
        this.rooms.set(roomId, room);
        
        this.fastify.log.info(`Created WebRTC room for meeting ${meeting.id}`);
      } catch (error) {
        this.fastify.log.error('Failed to create WebRTC room:', error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to create WebRTC room'
        }));
        socket.close();
        return;
      }
    }
    
    // Create a peer for the user
    const peerId = uuidv4();
    const peer: WebRtcPeer = {
      id: peerId,
      userId: user.id,
      name: user.name,
      socket,
      transports: new Map(),
      producers: new Map(),
      consumers: new Map(),
      joinedAt: new Date().toISOString()
    };
    
    room.peers.set(peerId, peer);
    
    // Update participant status in the database
    await this.fastify.db.collection('meetings').updateOne(
      { id: meeting.id, 'participants.userId': user.id },
      { 
        $set: { 
          'participants.$.status': 'connected',
          'participants.$.connectionInfo.lastJoined': new Date().toISOString()
        } 
      }
    );
    
    // Notify other peers about the new participant
    this.broadcastToPeers(room, peerId, {
      type: 'peer-joined',
      peerId,
      userId: user.id,
      name: user.name,
      isHost: meeting.hostId === user.id
    });
    
    // Send room info to the new peer
    socket.send(JSON.stringify({
      type: 'room-info',
      roomId,
      peerId,
      peers: Array.from(room.peers.entries()).map(([id, p]) => ({
        id,
        userId: p.userId,
        name: p.name,
        isHost: meeting.hostId === p.userId
      })),
      routerRtpCapabilities: room.router.rtpCapabilities
    }));
    
    // Handle WebSocket messages
    socket.on('message', async (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'get-router-capabilities':
            socket.send(JSON.stringify({
              type: 'router-capabilities',
              routerRtpCapabilities: room.router.rtpCapabilities
            }));
            break;
            
          case 'create-transport':
            await this.handleCreateTransport(room, peer, data, socket);
            break;
            
          case 'connect-transport':
            await this.handleConnectTransport(peer, data, socket);
            break;
            
          case 'produce':
            await this.handleProduce(room, peer, data, socket);
            break;
            
          case 'consume':
            await this.handleConsume(room, peer, data, socket);
            break;
            
          case 'close-producer':
            await this.handleCloseProducer(room, peer, data);
            break;
            
          case 'mute-producer':
            await this.handleMuteProducer(room, peer, data);
            break;
            
          case 'restart-ice':
            await this.handleRestartIce(peer, data, socket);
            break;
            
          case 'ping':
            socket.send(JSON.stringify({ type: 'pong' }));
            break;
            
          default:
            this.fastify.log.warn(`Unknown message type: ${data.type}`);
        }
      } catch (error) {
        this.fastify.log.error('Error handling WebSocket message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message'
        }));
      }
    });
    
    // Handle WebSocket close
    socket.on('close', async () => {
      if (!room) return;
      
      // Close all transports
      for (const transport of peer.transports.values()) {
        transport.close();
      }
      
      // Remove peer from room
      room.peers.delete(peerId);
      
      // Notify other peers
      this.broadcastToPeers(room, peerId, {
        type: 'peer-left',
        peerId,
        userId: user.id,
        name: user.name
      });
      
      // Update participant status in the database
      await this.fastify.db.collection('meetings').updateOne(
        { id: meeting.id, 'participants.userId': user.id },
        { 
          $set: { 
            'participants.$.status': 'disconnected',
            'participants.$.connectionInfo.lastLeft': new Date().toISOString()
          } 
        }
      );
      
      // If room is empty, close it
      if (room.peers.size === 0) {
        this.closeRoom(roomId);
      }
    });
  }

  /**
   * Handle create transport request
   */
  private async handleCreateTransport(
    room: WebRtcRoom,
    peer: WebRtcPeer,
    data: any,
    socket: WebSocket
  ): Promise<void> {
    try {
      const { direction } = data;
      
      const transport = await room.router.createWebRtcTransport(webRtcTransportOptions);
      
      transport.on('dtlsstatechange', (dtlsState) => {
        if (dtlsState === 'closed') {
          transport.close();
        }
      });
      
      transport.on('close', () => {
        peer.transports.delete(transport.id);
      });
      
      peer.transports.set(transport.id, transport);
      
      socket.send(JSON.stringify({
        type: 'transport-created',
        direction,
        transportId: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters
      }));
    } catch (error) {
      this.fastify.log.error('Error creating WebRTC transport:', error);
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Failed to create transport'
      }));
    }
  }

  /**
   * Handle connect transport request
   */
  private async handleConnectTransport(
    peer: WebRtcPeer,
    data: any,
    socket: WebSocket
  ): Promise<void> {
    try {
      const { transportId, dtlsParameters } = data;
      const transport = peer.transports.get(transportId);
      
      if (!transport) {
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Transport not found'
        }));
        return;
      }
      
      await transport.connect({ dtlsParameters });
      
      socket.send(JSON.stringify({
        type: 'transport-connected',
        transportId
      }));
    } catch (error) {
      this.fastify.log.error('Error connecting transport:', error);
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Failed to connect transport'
      }));
    }
  }

  /**
   * Handle produce request
   */
  private async handleProduce(
    room: WebRtcRoom,
    peer: WebRtcPeer,
    data: any,
    socket: WebSocket
  ): Promise<void> {
    try {
      const { transportId, kind, rtpParameters, appData } = data;
      const transport = peer.transports.get(transportId);
      
      if (!transport) {
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Transport not found'
        }));
        return;
      }
      
      const producer = await transport.produce({
        kind,
        rtpParameters,
        appData: { ...appData, peerId: peer.id, userId: peer.userId }
      });
      
      producer.on('transportclose', () => {
        producer.close();
      });
      
      producer.on('close', () => {
        peer.producers.delete(producer.id);
        room.producers.delete(producer.id);
        
        // Notify other peers
        this.broadcastToPeers(room, peer.id, {
          type: 'producer-closed',
          producerId: producer.id,
          peerId: peer.id
        });
      });
      
      peer.producers.set(producer.id, producer);
      room.producers.set(producer.id, producer);
      
      // Notify the producer
      socket.send(JSON.stringify({
        type: 'producer-created',
        producerId: producer.id,
        kind
      }));
      
      // Notify other peers about the new producer
      this.broadcastToPeers(room, peer.id, {
        type: 'new-producer',
        producerId: producer.id,
        peerId: peer.id,
        kind,
        appData
      });
    } catch (error) {
      this.fastify.log.error('Error producing:', error);
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Failed to produce'
      }));
    }
  }

  /**
   * Handle consume request
   */
  private async handleConsume(
    room: WebRtcRoom,
    peer: WebRtcPeer,
    data: any,
    socket: WebSocket
  ): Promise<void> {
    try {
      const { transportId, producerId, rtpCapabilities } = data;
      const transport = peer.transports.get(transportId);
      
      if (!transport) {
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Transport not found'
        }));
        return;
      }
      
      // Check if the client can consume the producer
      if (!room.router.canConsume({
        producerId,
        rtpCapabilities
      })) {
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Cannot consume producer'
        }));
        return;
      }
      
      const consumer = await transport.consume({
        producerId,
        rtpCapabilities,
        paused: true
      });
      
      consumer.on('transportclose', () => {
        consumer.close();
      });
      
      consumer.on('producerclose', () => {
        consumer.close();
        peer.consumers.delete(consumer.id);
        room.consumers.delete(consumer.id);
        
        socket.send(JSON.stringify({
          type: 'consumer-closed',
          consumerId: consumer.id
        }));
      });
      
      consumer.on('close', () => {
        peer.consumers.delete(consumer.id);
        room.consumers.delete(consumer.id);
      });
      
      peer.consumers.set(consumer.id, consumer);
      room.consumers.set(consumer.id, consumer);
      
      // Get the producer's owner information
      const producer = room.producers.get(producerId);
      const producerPeerId = producer?.appData.peerId;
      const producerPeer = producerPeerId ? room.peers.get(producerPeerId) : null;
      
      socket.send(JSON.stringify({
        type: 'consumer-created',
        consumerId: consumer.id,
        producerId,
        peerId: producerPeerId,
        userId: producerPeer?.userId,
        name: producerPeer?.name,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        appData: producer?.appData,
        producerPaused: consumer.producerPaused
      }));
      
      // Resume the consumer
      await consumer.resume();
    } catch (error) {
      this.fastify.log.error('Error consuming:', error);
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Failed to consume'
      }));
    }
  }

  /**
   * Handle close producer request
   */
  private async handleCloseProducer(
    room: WebRtcRoom,
    peer: WebRtcPeer,
    data: any
  ): Promise<void> {
    try {
      const { producerId } = data;
      const producer = peer.producers.get(producerId);
      
      if (!producer) {
        return;
      }
      
      producer.close();
    } catch (error) {
      this.fastify.log.error('Error closing producer:', error);
    }
  }

  /**
   * Handle mute producer request
   */
  private async handleMuteProducer(
    room: WebRtcRoom,
    peer: WebRtcPeer,
    data: any
  ): Promise<void> {
    try {
      const { producerId, mute } = data;
      const producer = peer.producers.get(producerId);
      
      if (!producer) {
        return;
      }
      
      if (mute) {
        producer.pause();
      } else {
        producer.resume();
      }
      
      // Notify all peers about the mute/unmute
      this.broadcastToAllPeers(room, {
        type: 'producer-muted',
        producerId,
        peerId: peer.id,
        muted: mute
      });
    } catch (error) {
      this.fastify.log.error('Error muting producer:', error);
    }
  }

  /**
   * Handle restart ICE request
   */
  private async handleRestartIce(
    peer: WebRtcPeer,
    data: any,
    socket: WebSocket
  ): Promise<void> {
    try {
      const { transportId } = data;
      const transport = peer.transports.get(transportId);
      
      if (!transport) {
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Transport not found'
        }));
        return;
      }
      
      const iceParameters = await transport.restartIce();
      
      socket.send(JSON.stringify({
        type: 'ice-restarted',
        transportId,
        iceParameters
      }));
    } catch (error) {
      this.fastify.log.error('Error restarting ICE:', error);
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Failed to restart ICE'
      }));
    }
  }

  /**
   * Broadcast a message to all peers in a room except the sender
   */
  private broadcastToPeers(room: WebRtcRoom, excludePeerId: string, message: any): void {
    for (const [peerId, peer] of room.peers.entries()) {
      if (peerId !== excludePeerId) {
        peer.socket.send(JSON.stringify(message));
      }
    }
  }

  /**
   * Broadcast a message to all peers in a room
   */
  private broadcastToAllPeers(room: WebRtcRoom, message: any): void {
    for (const peer of room.peers.values()) {
      peer.socket.send(JSON.stringify(message));
    }
  }

  /**
   * Close a room and clean up resources
   */
  private closeRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return;
    }
    
    // Close all producers and consumers
    for (const producer of room.producers.values()) {
      producer.close();
    }
    
    for (const consumer of room.consumers.values()) {
      consumer.close();
    }
    
    // Close the router
    room.router.close();
    
    // Remove the room
    this.rooms.delete(roomId);
    
    this.fastify.log.info(`Closed WebRTC room ${roomId}`);
  }

  /**
   * Register WebSocket routes
   */
  registerWebSocketRoutes(fastify: FastifyInstance): void {
    fastify.get('/ws/meeting/:roomId', { websocket: true }, (connection, request) => {
      this.handleConnection(connection, request);
    });
  }
}
