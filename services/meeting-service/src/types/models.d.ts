import { Meeting, Participant, Recording, Transcription } from '../models/meeting.model';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      HOST?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      MONGODB_URI?: string;
      REDIS_URI?: string;
      JWT_SECRET?: string;
      CORS_ORIGIN?: string;
      MEDIASOUP_LISTEN_IP?: string;
      MEDIASOUP_ANNOUNCED_IP?: string;
      MEDIASOUP_MIN_PORT?: string;
      MEDIASOUP_MAX_PORT?: string;
      LOG_LEVEL?: string;
    }
  }
}

declare module 'mongodb' {
  interface Collection<TSchema = any> {
    findMeetings(query: any): Promise<Meeting[]>;
    findMeetingById(id: string): Promise<Meeting | null>;
    findParticipant(meetingId: string, userId: string): Promise<Participant | null>;
    findRecording(meetingId: string, recordingId: string): Promise<Recording | null>;
    findTranscription(meetingId: string, transcriptionId: string): Promise<Transcription | null>;
  }
}
