import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { MeetingController } from '../controllers/meeting.controller';

// Define request/response schemas for validation
const meetingCreateSchema = Type.Object({
  title: Type.String(),
  description: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  isRecordingEnabled: Type.Optional(Type.Boolean()),
  isTranscriptionEnabled: Type.Optional(Type.Boolean()),
  isWaitingRoomEnabled: Type.Optional(Type.Boolean()),
  maxParticipants: Type.Optional(Type.Number()),
  startTime: Type.Optional(Type.String({ format: 'date-time' })),
  scheduledEndTime: Type.Optional(Type.String({ format: 'date-time' })),
  settings: Type.Optional(Type.Object({
    videoQuality: Type.Optional(Type.Enum({ low: 'low', medium: 'medium', high: 'high', hd: 'hd' })),
    audioQuality: Type.Optional(Type.Enum({ low: 'low', medium: 'medium', high: 'high' })),
    allowChat: Type.Optional(Type.Boolean()),
    allowScreenSharing: Type.Optional(Type.Boolean()),
    allowRecording: Type.Optional(Type.Boolean()),
    allowTranscription: Type.Optional(Type.Boolean()),
    muteParticipantsOnEntry: Type.Optional(Type.Boolean()),
    disableParticipantVideo: Type.Optional(Type.Boolean()),
    allowParticipantsToUnmute: Type.Optional(Type.Boolean()),
    allowParticipantsToToggleVideo: Type.Optional(Type.Boolean()),
    allowVirtualBackgrounds: Type.Optional(Type.Boolean()),
    allowNoiseReduction: Type.Optional(Type.Boolean()),
    allowParticipantsList: Type.Optional(Type.Boolean()),
    allowReactions: Type.Optional(Type.Boolean()),
    allowPolls: Type.Optional(Type.Boolean()),
    allowBreakoutRooms: Type.Optional(Type.Boolean()),
    allowWhiteboard: Type.Optional(Type.Boolean()),
    allowRaiseHand: Type.Optional(Type.Boolean()),
    recordAutomatically: Type.Optional(Type.Boolean()),
    transcribeAutomatically: Type.Optional(Type.Boolean()),
    endWhenHostLeaves: Type.Optional(Type.Boolean()),
    showJoinLeaveNotifications: Type.Optional(Type.Boolean())
  }))
});

const meetingUpdateSchema = Type.Object({
  title: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  isRecordingEnabled: Type.Optional(Type.Boolean()),
  isTranscriptionEnabled: Type.Optional(Type.Boolean()),
  isWaitingRoomEnabled: Type.Optional(Type.Boolean()),
  maxParticipants: Type.Optional(Type.Number()),
  startTime: Type.Optional(Type.String({ format: 'date-time' })),
  scheduledEndTime: Type.Optional(Type.String({ format: 'date-time' })),
  settings: Type.Optional(Type.Object({
    videoQuality: Type.Optional(Type.Enum({ low: 'low', medium: 'medium', high: 'high', hd: 'hd' })),
    audioQuality: Type.Optional(Type.Enum({ low: 'low', medium: 'medium', high: 'high' })),
    allowChat: Type.Optional(Type.Boolean()),
    allowScreenSharing: Type.Optional(Type.Boolean()),
    allowRecording: Type.Optional(Type.Boolean()),
    allowTranscription: Type.Optional(Type.Boolean()),
    muteParticipantsOnEntry: Type.Optional(Type.Boolean()),
    disableParticipantVideo: Type.Optional(Type.Boolean()),
    allowParticipantsToUnmute: Type.Optional(Type.Boolean()),
    allowParticipantsToToggleVideo: Type.Optional(Type.Boolean()),
    allowVirtualBackgrounds: Type.Optional(Type.Boolean()),
    allowNoiseReduction: Type.Optional(Type.Boolean()),
    allowParticipantsList: Type.Optional(Type.Boolean()),
    allowReactions: Type.Optional(Type.Boolean()),
    allowPolls: Type.Optional(Type.Boolean()),
    allowBreakoutRooms: Type.Optional(Type.Boolean()),
    allowWhiteboard: Type.Optional(Type.Boolean()),
    allowRaiseHand: Type.Optional(Type.Boolean()),
    recordAutomatically: Type.Optional(Type.Boolean()),
    transcribeAutomatically: Type.Optional(Type.Boolean()),
    endWhenHostLeaves: Type.Optional(Type.Boolean()),
    showJoinLeaveNotifications: Type.Optional(Type.Boolean())
  }))
});

const joinMeetingSchema = Type.Object({
  meetingId: Type.String(),
  name: Type.String(),
  password: Type.Optional(Type.String())
});

const meetingParamsSchema = Type.Object({
  id: Type.String()
});

const meetingQuerySchema = Type.Object({
  hostId: Type.Optional(Type.String()),
  status: Type.Optional(Type.Enum({ scheduled: 'scheduled', active: 'active', ended: 'ended', cancelled: 'cancelled' })),
  search: Type.Optional(Type.String()),
  from: Type.Optional(Type.String({ format: 'date-time' })),
  to: Type.Optional(Type.String({ format: 'date-time' })),
  limit: Type.Optional(Type.Number()),
  page: Type.Optional(Type.Number())
});

// Meeting response schemas
const meetingSettingsSchema = Type.Object({
  videoQuality: Type.String(),
  audioQuality: Type.String(),
  allowChat: Type.Boolean(),
  allowScreenSharing: Type.Boolean(),
  allowRecording: Type.Boolean(),
  allowTranscription: Type.Boolean(),
  muteParticipantsOnEntry: Type.Boolean(),
  disableParticipantVideo: Type.Boolean(),
  allowParticipantsToUnmute: Type.Boolean(),
  allowParticipantsToToggleVideo: Type.Boolean(),
  allowVirtualBackgrounds: Type.Boolean(),
  allowNoiseReduction: Type.Boolean(),
  allowParticipantsList: Type.Boolean(),
  allowReactions: Type.Boolean(),
  allowPolls: Type.Boolean(),
  allowBreakoutRooms: Type.Boolean(),
  allowWhiteboard: Type.Boolean(),
  allowRaiseHand: Type.Boolean(),
  recordAutomatically: Type.Boolean(),
  transcribeAutomatically: Type.Boolean(),
  endWhenHostLeaves: Type.Boolean(),
  showJoinLeaveNotifications: Type.Boolean()
});

const participantSchema = Type.Object({
  id: Type.String(),
  userId: Type.Optional(Type.String()),
  name: Type.String(),
  avatar: Type.Optional(Type.String()),
  role: Type.String(),
  joinTime: Type.String({ format: 'date-time' }),
  leaveTime: Type.Optional(Type.String({ format: 'date-time' })),
  isAudioEnabled: Type.Boolean(),
  isVideoEnabled: Type.Boolean(),
  isScreenSharing: Type.Boolean(),
  isHandRaised: Type.Boolean(),
  connectionInfo: Type.Object({
    ip: Type.Optional(Type.String()),
    userAgent: Type.Optional(Type.String()),
    browser: Type.Optional(Type.String()),
    os: Type.Optional(Type.String()),
    device: Type.Optional(Type.String())
  })
});

const meetingResponseSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  hostId: Type.String(),
  hostName: Type.String(),
  hostAvatar: Type.Optional(Type.String()),
  roomId: Type.String(),
  isPasswordProtected: Type.Boolean(),
  isRecordingEnabled: Type.Boolean(),
  isTranscriptionEnabled: Type.Boolean(),
  isWaitingRoomEnabled: Type.Boolean(),
  maxParticipants: Type.Number(),
  startTime: Type.String({ format: 'date-time' }),
  scheduledEndTime: Type.Optional(Type.String({ format: 'date-time' })),
  actualEndTime: Type.Optional(Type.String({ format: 'date-time' })),
  status: Type.String(),
  participantCount: Type.Number(),
  settings: meetingSettingsSchema,
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

const meetingsResponseSchema = Type.Object({
  meetings: Type.Array(meetingResponseSchema),
  total: Type.Number(),
  page: Type.Number(),
  limit: Type.Number(),
  totalPages: Type.Number()
});

const joinMeetingResponseSchema = Type.Object({
  meetingId: Type.String(),
  roomId: Type.String(),
  participant: participantSchema,
  settings: meetingSettingsSchema
});

// Define route handler
export default async function meetingRoutes(fastify: FastifyInstance) {
  const meetingController = new MeetingController(fastify);

  // Get all meetings with filtering and pagination
  fastify.get('/', {
    onRequest: [fastify.authenticate],
    schema: {
      querystring: meetingQuerySchema,
      response: {
        200: meetingsResponseSchema
      }
    }
  }, (request, reply) => meetingController.getMeetings(request, reply));

  // Get meeting by ID
  fastify.get('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: meetingParamsSchema,
      response: {
        200: meetingResponseSchema
      }
    }
  }, (request, reply) => meetingController.getMeetingById(request, reply));

  // Create a new meeting
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: meetingCreateSchema,
      response: {
        201: meetingResponseSchema
      }
    }
  }, (request, reply) => meetingController.createMeeting(request, reply));

  // Update a meeting
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      params: meetingParamsSchema,
      body: meetingUpdateSchema,
      response: {
        200: meetingResponseSchema
      }
    }
  }, (request, reply) => meetingController.updateMeeting(request, reply));

  // Cancel a meeting
  fastify.delete('/:id/cancel', {
    onRequest: [fastify.authenticate],
    schema: {
      params: meetingParamsSchema,
      response: {
        200: Type.Object({
          message: Type.String()
        })
      }
    }
  }, (request, reply) => meetingController.cancelMeeting(request, reply));

  // Join a meeting
  fastify.post('/join', {
    schema: {
      body: joinMeetingSchema,
      response: {
        200: joinMeetingResponseSchema
      }
    }
  }, (request, reply) => meetingController.joinMeeting(request, reply));

  // Leave a meeting
  fastify.post('/:id/leave', {
    onRequest: [fastify.authenticate],
    schema: {
      params: meetingParamsSchema,
      response: {
        200: Type.Object({
          message: Type.String()
        })
      }
    }
  }, (request, reply) => meetingController.leaveMeeting(request, reply));

  // End a meeting
  fastify.post('/:id/end', {
    onRequest: [fastify.authenticate],
    schema: {
      params: meetingParamsSchema,
      response: {
        200: Type.Object({
          message: Type.String()
        })
      }
    }
  }, (request, reply) => meetingController.endMeeting(request, reply));
}
