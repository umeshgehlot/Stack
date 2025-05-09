import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { RecordingController } from '../controllers/recording.controller';

// Define request/response schemas for validation
const meetingParamsSchema = Type.Object({
  id: Type.String()
});

const recordingParamsSchema = Type.Object({
  id: Type.String(),
  recordingId: Type.String()
});

const recordingQuerySchema = Type.Object({
  limit: Type.Optional(Type.Number()),
  page: Type.Optional(Type.Number())
});

// Recording response schemas
const recordingSchema = Type.Object({
  id: Type.String(),
  meetingId: Type.String(),
  startTime: Type.String({ format: 'date-time' }),
  endTime: Type.Optional(Type.String({ format: 'date-time' })),
  duration: Type.Optional(Type.Number()),
  size: Type.Optional(Type.Number()),
  format: Type.String(),
  url: Type.Optional(Type.String()),
  status: Type.String(),
  createdBy: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

const recordingsResponseSchema = Type.Object({
  recordings: Type.Array(recordingSchema),
  total: Type.Number(),
  page: Type.Number(),
  limit: Type.Number(),
  totalPages: Type.Number()
});

const startRecordingResponseSchema = Type.Object({
  recordingId: Type.String(),
  meetingId: Type.String(),
  startTime: Type.String({ format: 'date-time' }),
  status: Type.String()
});

const stopRecordingResponseSchema = Type.Object({
  recordingId: Type.String(),
  meetingId: Type.String(),
  endTime: Type.String({ format: 'date-time' }),
  duration: Type.Number(),
  status: Type.String()
});

// Transcription response schemas
const transcriptionSegmentSchema = Type.Object({
  id: Type.String(),
  speakerId: Type.String(),
  speakerName: Type.String(),
  startTime: Type.Number(),
  endTime: Type.Number(),
  text: Type.String(),
  confidence: Type.Number()
});

const transcriptionSchema = Type.Object({
  id: Type.String(),
  meetingId: Type.String(),
  recordingId: Type.Optional(Type.String()),
  startTime: Type.String({ format: 'date-time' }),
  endTime: Type.Optional(Type.String({ format: 'date-time' })),
  language: Type.String(),
  content: Type.Optional(Type.String()),
  segments: Type.Array(transcriptionSegmentSchema),
  status: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

const transcriptionsResponseSchema = Type.Object({
  transcriptions: Type.Array(transcriptionSchema),
  total: Type.Number(),
  page: Type.Number(),
  limit: Type.Number(),
  totalPages: Type.Number()
});

// Define route handler
export default async function recordingRoutes(fastify: FastifyInstance) {
  const recordingController = new RecordingController(fastify);

  // Start recording a meeting
  fastify.post('/:id/start', {
    onRequest: [fastify.authenticate],
    schema: {
      params: meetingParamsSchema,
      response: {
        200: startRecordingResponseSchema
      }
    }
  }, (request, reply) => recordingController.startRecording(request, reply));

  // Stop recording a meeting
  fastify.post('/:id/recordings/:recordingId/stop', {
    onRequest: [fastify.authenticate],
    schema: {
      params: recordingParamsSchema,
      response: {
        200: stopRecordingResponseSchema
      }
    }
  }, (request, reply) => recordingController.stopRecording(request, reply));

  // Get recordings for a meeting
  fastify.get('/:id/recordings', {
    onRequest: [fastify.authenticate],
    schema: {
      params: meetingParamsSchema,
      querystring: recordingQuerySchema,
      response: {
        200: recordingsResponseSchema
      }
    }
  }, (request, reply) => recordingController.getRecordings(request, reply));

  // Delete a recording
  fastify.delete('/:id/recordings/:recordingId', {
    onRequest: [fastify.authenticate],
    schema: {
      params: recordingParamsSchema,
      response: {
        200: Type.Object({
          message: Type.String()
        })
      }
    }
  }, (request, reply) => recordingController.deleteRecording(request, reply));

  // Get transcriptions for a meeting
  fastify.get('/:id/transcriptions', {
    onRequest: [fastify.authenticate],
    schema: {
      params: meetingParamsSchema,
      querystring: recordingQuerySchema,
      response: {
        200: transcriptionsResponseSchema
      }
    }
  }, (request, reply) => recordingController.getTranscriptions(request, reply));
}
