import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { 
  Meeting, 
  CreateMeetingDto, 
  UpdateMeetingDto, 
  MeetingStatus,
  Participant,
  ParticipantRole,
  MeetingSettings,
  JoinMeetingDto,
  MeetingRoom
} from '../models/meeting.model';

export class MeetingController {
  private fastify: FastifyInstance;
  private rooms: Map<string, MeetingRoom> = new Map();

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * Get all meetings with filtering and pagination
   */
  async getMeetings(request: FastifyRequest<{
    Querystring: {
      hostId?: string;
      status?: MeetingStatus;
      search?: string;
      from?: string;
      to?: string;
      limit?: number;
      page?: number;
    }
  }>, reply: FastifyReply) {
    try {
      const { 
        hostId, 
        status, 
        search,
        from,
        to,
        limit = 20, 
        page = 1 
      } = request.query;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      const skip = (page - 1) * limit;
      
      // Build query
      const query: any = {
        $or: [
          { hostId: user.id },
          { 'participants.userId': user.id }
        ]
      };
      
      if (hostId) query.hostId = hostId;
      if (status) query.status = status;
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (from || to) {
        query.startTime = {};
        if (from) query.startTime.$gte = from;
        if (to) query.startTime.$lte = to;
      }
      
      // Get total count
      const total = await this.fastify.db.collection('meetings').countDocuments(query);
      
      // Get meetings
      const meetings = await this.fastify.db.collection('meetings')
        .find(query)
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      // Format response
      const formattedMeetings = meetings.map(meeting => ({
        id: meeting.id,
        title: meeting.title,
        description: meeting.description,
        hostId: meeting.hostId,
        hostName: meeting.hostName,
        hostAvatar: meeting.hostAvatar,
        roomId: meeting.roomId,
        isPasswordProtected: !!meeting.password,
        isRecordingEnabled: meeting.isRecordingEnabled,
        isTranscriptionEnabled: meeting.isTranscriptionEnabled,
        isWaitingRoomEnabled: meeting.isWaitingRoomEnabled,
        maxParticipants: meeting.maxParticipants,
        startTime: meeting.startTime,
        scheduledEndTime: meeting.scheduledEndTime,
        actualEndTime: meeting.actualEndTime,
        status: meeting.status,
        participantCount: meeting.participants ? meeting.participants.length : 0,
        settings: meeting.settings,
        createdAt: meeting.createdAt,
        updatedAt: meeting.updatedAt
      }));
      
      // Calculate total pages
      const totalPages = Math.ceil(total / limit);
      
      return reply.code(200).send({
        meetings: formattedMeetings,
        total,
        page,
        limit,
        totalPages
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve meetings' });
    }
  }

  /**
   * Get a meeting by ID
   */
  async getMeetingById(request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      const meeting = await this.fastify.db.collection('meetings').findOne({
        id,
        $or: [
          { hostId: user.id },
          { 'participants.userId': user.id }
        ]
      });
      
      if (!meeting) {
        return reply.code(404).send({ error: 'Meeting not found or you do not have access' });
      }
      
      // Format response
      const formattedMeeting = {
        id: meeting.id,
        title: meeting.title,
        description: meeting.description,
        hostId: meeting.hostId,
        hostName: meeting.hostName,
        hostAvatar: meeting.hostAvatar,
        roomId: meeting.roomId,
        isPasswordProtected: !!meeting.password,
        isRecordingEnabled: meeting.isRecordingEnabled,
        isTranscriptionEnabled: meeting.isTranscriptionEnabled,
        isWaitingRoomEnabled: meeting.isWaitingRoomEnabled,
        maxParticipants: meeting.maxParticipants,
        startTime: meeting.startTime,
        scheduledEndTime: meeting.scheduledEndTime,
        actualEndTime: meeting.actualEndTime,
        status: meeting.status,
        participants: meeting.participants,
        participantCount: meeting.participants ? meeting.participants.length : 0,
        settings: meeting.settings,
        createdAt: meeting.createdAt,
        updatedAt: meeting.updatedAt
      };
      
      return reply.code(200).send(formattedMeeting);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to retrieve meeting' });
    }
  }

  /**
   * Create a new meeting
   */
  async createMeeting(request: FastifyRequest<{
    Body: CreateMeetingDto;
  }>, reply: FastifyReply) {
    try {
      const { 
        title, 
        description, 
        password,
        isRecordingEnabled = false,
        isTranscriptionEnabled = false,
        isWaitingRoomEnabled = false,
        maxParticipants = 100,
        startTime = new Date().toISOString(),
        scheduledEndTime,
        settings
      } = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      const now = new Date().toISOString();
      
      // Default meeting settings
      const defaultSettings: MeetingSettings = {
        videoQuality: 'high',
        audioQuality: 'high',
        allowChat: true,
        allowScreenSharing: true,
        allowRecording: isRecordingEnabled,
        allowTranscription: isTranscriptionEnabled,
        muteParticipantsOnEntry: true,
        disableParticipantVideo: false,
        allowParticipantsToUnmute: true,
        allowParticipantsToToggleVideo: true,
        allowVirtualBackgrounds: true,
        allowNoiseReduction: true,
        allowParticipantsList: true,
        allowReactions: true,
        allowPolls: false,
        allowBreakoutRooms: false,
        allowWhiteboard: false,
        allowRaiseHand: true,
        recordAutomatically: false,
        transcribeAutomatically: false,
        endWhenHostLeaves: true,
        showJoinLeaveNotifications: true
      };
      
      const roomId = uuidv4();
      
      const meeting: Meeting = {
        id: uuidv4(),
        title,
        description,
        hostId: user.id,
        hostName: user.name,
        hostAvatar: user.avatar,
        roomId,
        password,
        isPasswordProtected: !!password,
        isRecordingEnabled,
        isTranscriptionEnabled,
        isWaitingRoomEnabled,
        maxParticipants,
        startTime,
        scheduledEndTime,
        status: new Date(startTime) <= new Date() ? 'active' : 'scheduled',
        participants: [],
        recordings: [],
        transcriptions: [],
        settings: {
          ...defaultSettings,
          ...settings
        },
        createdAt: now,
        updatedAt: now
      };
      
      await this.fastify.db.collection('meetings').insertOne(meeting);
      
      // Create a room for the meeting
      this.rooms.set(roomId, {
        id: roomId,
        meetingId: meeting.id,
        audioProducers: new Map(),
        videoProducers: new Map(),
        screenProducers: new Map(),
        consumers: new Map(),
        createdAt: now
      });
      
      // Publish event for meeting creation
      await this.fastify.redis.publish('meeting:created', JSON.stringify({
        meetingId: meeting.id,
        hostId: user.id,
        startTime
      }));
      
      // Format response
      const formattedMeeting = {
        id: meeting.id,
        title: meeting.title,
        description: meeting.description,
        hostId: meeting.hostId,
        hostName: meeting.hostName,
        hostAvatar: meeting.hostAvatar,
        roomId: meeting.roomId,
        isPasswordProtected: meeting.isPasswordProtected,
        isRecordingEnabled: meeting.isRecordingEnabled,
        isTranscriptionEnabled: meeting.isTranscriptionEnabled,
        isWaitingRoomEnabled: meeting.isWaitingRoomEnabled,
        maxParticipants: meeting.maxParticipants,
        startTime: meeting.startTime,
        scheduledEndTime: meeting.scheduledEndTime,
        status: meeting.status,
        participantCount: 0,
        settings: meeting.settings,
        createdAt: meeting.createdAt,
        updatedAt: meeting.updatedAt
      };
      
      return reply.code(201).send(formattedMeeting);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to create meeting' });
    }
  }

  /**
   * Update a meeting
   */
  async updateMeeting(request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateMeetingDto;
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const updateData = request.body;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if meeting exists and user is the host
      const meeting = await this.fastify.db.collection('meetings').findOne({
        id,
        hostId: user.id
      });
      
      if (!meeting) {
        return reply.code(404).send({ error: 'Meeting not found or you are not the host' });
      }
      
      // If meeting has already ended, don't allow updates
      if (meeting.status === 'ended' || meeting.status === 'cancelled') {
        return reply.code(400).send({ error: 'Cannot update a meeting that has ended or been cancelled' });
      }
      
      // Update meeting
      const now = new Date().toISOString();
      
      // Prepare update data
      const updateFields: any = {
        updatedAt: now
      };
      
      if (updateData.title !== undefined) updateFields.title = updateData.title;
      if (updateData.description !== undefined) updateFields.description = updateData.description;
      if (updateData.password !== undefined) {
        updateFields.password = updateData.password;
        updateFields.isPasswordProtected = !!updateData.password;
      }
      if (updateData.isRecordingEnabled !== undefined) updateFields.isRecordingEnabled = updateData.isRecordingEnabled;
      if (updateData.isTranscriptionEnabled !== undefined) updateFields.isTranscriptionEnabled = updateData.isTranscriptionEnabled;
      if (updateData.isWaitingRoomEnabled !== undefined) updateFields.isWaitingRoomEnabled = updateData.isWaitingRoomEnabled;
      if (updateData.maxParticipants !== undefined) updateFields.maxParticipants = updateData.maxParticipants;
      if (updateData.startTime !== undefined) updateFields.startTime = updateData.startTime;
      if (updateData.scheduledEndTime !== undefined) updateFields.scheduledEndTime = updateData.scheduledEndTime;
      
      // Update settings if provided
      if (updateData.settings) {
        updateFields.settings = {
          ...meeting.settings,
          ...updateData.settings
        };
      }
      
      const result = await this.fastify.db.collection('meetings').findOneAndUpdate(
        { id },
        { $set: updateFields },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return reply.code(404).send({ error: 'Meeting not found' });
      }
      
      // Publish event for meeting update
      await this.fastify.redis.publish('meeting:updated', JSON.stringify({
        meetingId: id,
        hostId: user.id
      }));
      
      // Format response
      const formattedMeeting = {
        id: result.id,
        title: result.title,
        description: result.description,
        hostId: result.hostId,
        hostName: result.hostName,
        hostAvatar: result.hostAvatar,
        roomId: result.roomId,
        isPasswordProtected: !!result.password,
        isRecordingEnabled: result.isRecordingEnabled,
        isTranscriptionEnabled: result.isTranscriptionEnabled,
        isWaitingRoomEnabled: result.isWaitingRoomEnabled,
        maxParticipants: result.maxParticipants,
        startTime: result.startTime,
        scheduledEndTime: result.scheduledEndTime,
        actualEndTime: result.actualEndTime,
        status: result.status,
        participantCount: result.participants ? result.participants.length : 0,
        settings: result.settings,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      };
      
      return reply.code(200).send(formattedMeeting);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to update meeting' });
    }
  }

  /**
   * Cancel a meeting
   */
  async cancelMeeting(request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if meeting exists and user is the host
      const meeting = await this.fastify.db.collection('meetings').findOne({
        id,
        hostId: user.id
      });
      
      if (!meeting) {
        return reply.code(404).send({ error: 'Meeting not found or you are not the host' });
      }
      
      // If meeting has already ended or been cancelled, don't allow cancellation
      if (meeting.status === 'ended' || meeting.status === 'cancelled') {
        return reply.code(400).send({ error: 'Meeting has already ended or been cancelled' });
      }
      
      const now = new Date().toISOString();
      
      // Update meeting status to cancelled
      await this.fastify.db.collection('meetings').updateOne(
        { id },
        { 
          $set: { 
            status: 'cancelled',
            updatedAt: now
          } 
        }
      );
      
      // Clean up room if it exists
      if (this.rooms.has(meeting.roomId)) {
        this.rooms.delete(meeting.roomId);
      }
      
      // Publish event for meeting cancellation
      await this.fastify.redis.publish('meeting:cancelled', JSON.stringify({
        meetingId: id,
        hostId: user.id
      }));
      
      return reply.code(200).send({ message: 'Meeting cancelled successfully' });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to cancel meeting' });
    }
  }

  /**
   * Join a meeting
   */
  async joinMeeting(request: FastifyRequest<{
    Body: JoinMeetingDto;
  }>, reply: FastifyReply) {
    try {
      const { meetingId, name, password } = request.body;
      
      // Get user info from JWT token if available
      const user = request.user as any;
      
      // Check if meeting exists
      const meeting = await this.fastify.db.collection('meetings').findOne({ id: meetingId });
      
      if (!meeting) {
        return reply.code(404).send({ error: 'Meeting not found' });
      }
      
      // Check if meeting has started or is scheduled
      if (meeting.status === 'ended' || meeting.status === 'cancelled') {
        return reply.code(400).send({ error: 'Meeting has ended or been cancelled' });
      }
      
      // Check if meeting is password protected
      if (meeting.isPasswordProtected && meeting.password !== password) {
        return reply.code(401).send({ error: 'Invalid meeting password' });
      }
      
      // Check if meeting has reached maximum participants
      if (meeting.participants.length >= meeting.maxParticipants) {
        return reply.code(400).send({ error: 'Meeting has reached maximum participants' });
      }
      
      const now = new Date().toISOString();
      
      // Create participant object
      const participant: Participant = {
        id: uuidv4(),
        userId: user?.id,
        name: user?.name || name,
        avatar: user?.avatar,
        role: meeting.hostId === user?.id ? 'host' : 'participant',
        joinTime: now,
        isAudioEnabled: !meeting.settings.muteParticipantsOnEntry,
        isVideoEnabled: !meeting.settings.disableParticipantVideo,
        isScreenSharing: false,
        isHandRaised: false,
        connectionInfo: {
          ip: request.ip,
          userAgent: request.headers['user-agent'],
          // Additional browser/OS detection can be added here
        }
      };
      
      // Add participant to meeting
      await this.fastify.db.collection('meetings').updateOne(
        { id: meetingId },
        { 
          $push: { participants: participant },
          $set: { 
            status: 'active',
            updatedAt: now
          }
        }
      );
      
      // If meeting was scheduled and this is the first join, update status to active
      if (meeting.status === 'scheduled') {
        await this.fastify.db.collection('meetings').updateOne(
          { id: meetingId },
          { $set: { status: 'active' } }
        );
      }
      
      // Publish event for participant joining
      await this.fastify.redis.publish('meeting:participant:joined', JSON.stringify({
        meetingId,
        participantId: participant.id,
        userId: participant.userId,
        name: participant.name,
        role: participant.role
      }));
      
      // Create room if it doesn't exist
      if (!this.rooms.has(meeting.roomId)) {
        this.rooms.set(meeting.roomId, {
          id: meeting.roomId,
          meetingId: meeting.id,
          audioProducers: new Map(),
          videoProducers: new Map(),
          screenProducers: new Map(),
          consumers: new Map(),
          createdAt: now
        });
      }
      
      return reply.code(200).send({
        meetingId,
        roomId: meeting.roomId,
        participant,
        settings: meeting.settings
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to join meeting' });
    }
  }

  /**
   * Leave a meeting
   */
  async leaveMeeting(request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if meeting exists
      const meeting = await this.fastify.db.collection('meetings').findOne({ id });
      
      if (!meeting) {
        return reply.code(404).send({ error: 'Meeting not found' });
      }
      
      const now = new Date().toISOString();
      
      // Find participant
      const participant = meeting.participants.find((p: Participant) => 
        p.userId === user.id && !p.leaveTime
      );
      
      if (!participant) {
        return reply.code(404).send({ error: 'You are not an active participant in this meeting' });
      }
      
      // Update participant leave time
      await this.fastify.db.collection('meetings').updateOne(
        { id, 'participants.id': participant.id },
        { 
          $set: { 
            'participants.$.leaveTime': now,
            updatedAt: now
          } 
        }
      );
      
      // If user is the host and endWhenHostLeaves is enabled, end the meeting
      if (meeting.hostId === user.id && meeting.settings.endWhenHostLeaves) {
        await this.endMeeting(request, reply);
        return;
      }
      
      // Publish event for participant leaving
      await this.fastify.redis.publish('meeting:participant:left', JSON.stringify({
        meetingId: id,
        participantId: participant.id,
        userId: participant.userId,
        name: participant.name
      }));
      
      return reply.code(200).send({ message: 'Left meeting successfully' });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to leave meeting' });
    }
  }

  /**
   * End a meeting
   */
  async endMeeting(request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if meeting exists and user is the host
      const meeting = await this.fastify.db.collection('meetings').findOne({
        id,
        hostId: user.id
      });
      
      if (!meeting) {
        return reply.code(404).send({ error: 'Meeting not found or you are not the host' });
      }
      
      // If meeting has already ended or been cancelled, don't allow ending
      if (meeting.status === 'ended' || meeting.status === 'cancelled') {
        return reply.code(400).send({ error: 'Meeting has already ended or been cancelled' });
      }
      
      const now = new Date().toISOString();
      
      // Update meeting status to ended
      await this.fastify.db.collection('meetings').updateOne(
        { id },
        { 
          $set: { 
            status: 'ended',
            actualEndTime: now,
            updatedAt: now
          } 
        }
      );
      
      // Set leave time for all active participants
      await this.fastify.db.collection('meetings').updateMany(
        { id, 'participants.leaveTime': { $exists: false } },
        { $set: { 'participants.$[elem].leaveTime': now } },
        { arrayFilters: [{ 'elem.leaveTime': { $exists: false } }] }
      );
      
      // Clean up room if it exists
      if (this.rooms.has(meeting.roomId)) {
        this.rooms.delete(meeting.roomId);
      }
      
      // Publish event for meeting end
      await this.fastify.redis.publish('meeting:ended', JSON.stringify({
        meetingId: id,
        hostId: user.id,
        endTime: now
      }));
      
      return reply.code(200).send({ message: 'Meeting ended successfully' });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to end meeting' });
    }
  }
}
