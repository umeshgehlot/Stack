import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { 
  Recording, 
  RecordingStatus,
  Transcription,
  TranscriptionStatus,
  TranscriptionSegment
} from '../models/meeting.model';

export class RecordingController {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * Start recording a meeting
   */
  async startRecording(request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if meeting exists and user is the host or co-host
      const meeting = await this.fastify.db.collection('meetings').findOne({
        id,
        $or: [
          { hostId: user.id },
          { 'participants': { $elemMatch: { userId: user.id, role: 'co-host' } } }
        ]
      });
      
      if (!meeting) {
        return reply.code(404).send({ error: 'Meeting not found or you do not have permission' });
      }
      
      // Check if meeting is active
      if (meeting.status !== 'active') {
        return reply.code(400).send({ error: 'Cannot record a meeting that is not active' });
      }
      
      // Check if recording is enabled for the meeting
      if (!meeting.isRecordingEnabled) {
        return reply.code(400).send({ error: 'Recording is not enabled for this meeting' });
      }
      
      // Check if there's already an active recording
      const activeRecording = meeting.recordings.find((r: Recording) => 
        r.status === 'recording' || r.status === 'processing'
      );
      
      if (activeRecording) {
        return reply.code(400).send({ error: 'There is already an active recording for this meeting' });
      }
      
      const now = new Date().toISOString();
      
      // Create recording
      const recording: Recording = {
        id: uuidv4(),
        meetingId: id,
        startTime: now,
        format: 'mp4',
        status: 'recording',
        createdBy: user.id,
        createdAt: now,
        updatedAt: now
      };
      
      // Add recording to meeting
      await this.fastify.db.collection('meetings').updateOne(
        { id },
        { 
          $push: { recordings: recording },
          $set: { updatedAt: now }
        }
      );
      
      // Start transcription if enabled
      if (meeting.isTranscriptionEnabled) {
        await this.startTranscription(id, recording.id, user.id);
      }
      
      // Publish event for recording start
      await this.fastify.redis.publish('meeting:recording:started', JSON.stringify({
        meetingId: id,
        recordingId: recording.id,
        startedBy: user.id
      }));
      
      return reply.code(200).send({
        recordingId: recording.id,
        meetingId: id,
        startTime: recording.startTime,
        status: recording.status
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to start recording' });
    }
  }

  /**
   * Stop recording a meeting
   */
  async stopRecording(request: FastifyRequest<{
    Params: { id: string; recordingId: string }
  }>, reply: FastifyReply) {
    try {
      const { id, recordingId } = request.params;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if meeting exists and user is the host or co-host
      const meeting = await this.fastify.db.collection('meetings').findOne({
        id,
        $or: [
          { hostId: user.id },
          { 'participants': { $elemMatch: { userId: user.id, role: 'co-host' } } }
        ]
      });
      
      if (!meeting) {
        return reply.code(404).send({ error: 'Meeting not found or you do not have permission' });
      }
      
      // Check if recording exists and is active
      const recording = meeting.recordings.find((r: Recording) => 
        r.id === recordingId && r.status === 'recording'
      );
      
      if (!recording) {
        return reply.code(404).send({ error: 'Recording not found or not active' });
      }
      
      const now = new Date().toISOString();
      const duration = Math.round((new Date(now).getTime() - new Date(recording.startTime).getTime()) / 1000);
      
      // Update recording
      await this.fastify.db.collection('meetings').updateOne(
        { id, 'recordings.id': recordingId },
        { 
          $set: { 
            'recordings.$.endTime': now,
            'recordings.$.duration': duration,
            'recordings.$.status': 'processing',
            'recordings.$.updatedAt': now,
            updatedAt: now
          } 
        }
      );
      
      // Stop transcription if exists
      const transcription = meeting.transcriptions?.find((t: Transcription) => 
        t.recordingId === recordingId && t.status === 'in-progress'
      );
      
      if (transcription) {
        await this.stopTranscription(id, transcription.id);
      }
      
      // Publish event for recording stop
      await this.fastify.redis.publish('meeting:recording:stopped', JSON.stringify({
        meetingId: id,
        recordingId,
        stoppedBy: user.id,
        duration
      }));
      
      // Simulate processing the recording (in a real implementation, this would be handled by a background job)
      setTimeout(async () => {
        try {
          // Update recording status to completed
          await this.fastify.db.collection('meetings').updateOne(
            { id, 'recordings.id': recordingId },
            { 
              $set: { 
                'recordings.$.status': 'completed',
                'recordings.$.url': `https://storage.example.com/recordings/${id}/${recordingId}.mp4`,
                'recordings.$.size': Math.round(duration * 1024 * 1024 * 0.5), // Rough estimate: 0.5 MB per second
                'recordings.$.updatedAt': new Date().toISOString()
              } 
            }
          );
          
          // Publish event for recording completed
          await this.fastify.redis.publish('meeting:recording:completed', JSON.stringify({
            meetingId: id,
            recordingId,
            url: `https://storage.example.com/recordings/${id}/${recordingId}.mp4`
          }));
        } catch (err) {
          this.fastify.log.error(err);
        }
      }, 5000); // Simulate 5 seconds of processing time
      
      return reply.code(200).send({
        recordingId,
        meetingId: id,
        endTime: now,
        duration,
        status: 'processing'
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to stop recording' });
    }
  }

  /**
   * Get recordings for a meeting
   */
  async getRecordings(request: FastifyRequest<{
    Params: { id: string };
    Querystring: {
      limit?: number;
      page?: number;
    }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { limit = 20, page = 1 } = request.query;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if meeting exists and user has access
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
      
      // Get recordings
      const recordings = meeting.recordings || [];
      
      // Sort by start time (newest first)
      recordings.sort((a: Recording, b: Recording) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      
      // Paginate
      const skip = (page - 1) * limit;
      const paginatedRecordings = recordings.slice(skip, skip + limit);
      
      // Calculate total pages
      const total = recordings.length;
      const totalPages = Math.ceil(total / limit);
      
      return reply.code(200).send({
        recordings: paginatedRecordings,
        total,
        page,
        limit,
        totalPages
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to get recordings' });
    }
  }

  /**
   * Delete a recording
   */
  async deleteRecording(request: FastifyRequest<{
    Params: { id: string; recordingId: string }
  }>, reply: FastifyReply) {
    try {
      const { id, recordingId } = request.params;
      
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
      
      // Check if recording exists
      const recording = meeting.recordings.find((r: Recording) => r.id === recordingId);
      
      if (!recording) {
        return reply.code(404).send({ error: 'Recording not found' });
      }
      
      // Remove recording
      await this.fastify.db.collection('meetings').updateOne(
        { id },
        { 
          $pull: { recordings: { id: recordingId } },
          $set: { updatedAt: new Date().toISOString() }
        }
      );
      
      // Also remove any transcriptions associated with this recording
      await this.fastify.db.collection('meetings').updateOne(
        { id },
        { $pull: { transcriptions: { recordingId } } }
      );
      
      // Publish event for recording deletion
      await this.fastify.redis.publish('meeting:recording:deleted', JSON.stringify({
        meetingId: id,
        recordingId,
        deletedBy: user.id
      }));
      
      return reply.code(200).send({ message: 'Recording deleted successfully' });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete recording' });
    }
  }

  /**
   * Start transcription for a meeting
   */
  private async startTranscription(meetingId: string, recordingId: string, userId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      // Create transcription
      const transcription: Transcription = {
        id: uuidv4(),
        meetingId,
        recordingId,
        startTime: now,
        language: 'en-US',
        segments: [],
        status: 'in-progress',
        createdAt: now,
        updatedAt: now
      };
      
      // Add transcription to meeting
      await this.fastify.db.collection('meetings').updateOne(
        { id: meetingId },
        { 
          $push: { transcriptions: transcription },
          $set: { updatedAt: now }
        }
      );
      
      // Publish event for transcription start
      await this.fastify.redis.publish('meeting:transcription:started', JSON.stringify({
        meetingId,
        transcriptionId: transcription.id,
        recordingId,
        startedBy: userId
      }));
      
      // Simulate adding transcription segments (in a real implementation, this would be done by a speech-to-text service)
      const addSegment = async (text: string, speakerId: string, speakerName: string, startTime: number, endTime: number) => {
        const segment: TranscriptionSegment = {
          id: uuidv4(),
          speakerId,
          speakerName,
          startTime,
          endTime,
          text,
          confidence: 0.95
        };
        
        await this.fastify.db.collection('meetings').updateOne(
          { id: meetingId, 'transcriptions.id': transcription.id },
          { 
            $push: { 'transcriptions.$.segments': segment },
            $set: { 'transcriptions.$.updatedAt': new Date().toISOString() }
          }
        );
      };
      
      // This is just a simulation - in a real implementation, this would be handled by a speech-to-text service
      setTimeout(() => addSegment("Hello everyone, welcome to the meeting.", userId, "Host", 0, 3), 3000);
      setTimeout(() => addSegment("Today we'll be discussing the new project timeline.", userId, "Host", 4, 8), 8000);
      setTimeout(() => addSegment("Let's start with a quick overview of what we've accomplished so far.", userId, "Host", 9, 14), 14000);
    } catch (error) {
      this.fastify.log.error(error);
    }
  }

  /**
   * Stop transcription for a meeting
   */
  private async stopTranscription(meetingId: string, transcriptionId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      // Get the transcription
      const meeting = await this.fastify.db.collection('meetings').findOne({ id: meetingId });
      const transcription = meeting.transcriptions.find((t: Transcription) => t.id === transcriptionId);
      
      if (!transcription) {
        return;
      }
      
      // Combine all segments into content
      const content = transcription.segments
        .sort((a: TranscriptionSegment, b: TranscriptionSegment) => a.startTime - b.startTime)
        .map((s: TranscriptionSegment) => `[${s.speakerName}]: ${s.text}`)
        .join('\n');
      
      // Update transcription
      await this.fastify.db.collection('meetings').updateOne(
        { id: meetingId, 'transcriptions.id': transcriptionId },
        { 
          $set: { 
            'transcriptions.$.endTime': now,
            'transcriptions.$.content': content,
            'transcriptions.$.status': 'completed',
            'transcriptions.$.updatedAt': now
          } 
        }
      );
      
      // Publish event for transcription completion
      await this.fastify.redis.publish('meeting:transcription:completed', JSON.stringify({
        meetingId,
        transcriptionId,
        content
      }));
    } catch (error) {
      this.fastify.log.error(error);
    }
  }

  /**
   * Get transcriptions for a meeting
   */
  async getTranscriptions(request: FastifyRequest<{
    Params: { id: string };
    Querystring: {
      limit?: number;
      page?: number;
    }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const { limit = 20, page = 1 } = request.query;
      
      // Get user info from JWT token
      const user = request.user as any;
      
      // Check if meeting exists and user has access
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
      
      // Get transcriptions
      const transcriptions = meeting.transcriptions || [];
      
      // Sort by start time (newest first)
      transcriptions.sort((a: Transcription, b: Transcription) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      
      // Paginate
      const skip = (page - 1) * limit;
      const paginatedTranscriptions = transcriptions.slice(skip, skip + limit);
      
      // Calculate total pages
      const total = transcriptions.length;
      const totalPages = Math.ceil(total / limit);
      
      return reply.code(200).send({
        transcriptions: paginatedTranscriptions,
        total,
        page,
        limit,
        totalPages
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to get transcriptions' });
    }
  }
}
