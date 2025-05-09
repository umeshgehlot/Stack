/**
 * Meeting model interfaces for the meeting service
 */

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  roomId: string;
  password?: string;
  isPasswordProtected: boolean;
  isRecordingEnabled: boolean;
  isTranscriptionEnabled: boolean;
  isWaitingRoomEnabled: boolean;
  maxParticipants: number;
  startTime: string;
  scheduledEndTime?: string;
  actualEndTime?: string;
  status: MeetingStatus;
  participants: Participant[];
  recordings: Recording[];
  transcriptions: Transcription[];
  settings: MeetingSettings;
  createdAt: string;
  updatedAt: string;
}

export type MeetingStatus = 'scheduled' | 'active' | 'ended' | 'cancelled';

export interface Participant {
  id: string;
  userId?: string;
  name: string;
  avatar?: string;
  role: ParticipantRole;
  joinTime: string;
  leaveTime?: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  connectionInfo: {
    ip?: string;
    userAgent?: string;
    browser?: string;
    os?: string;
    device?: string;
  };
}

export type ParticipantRole = 'host' | 'co-host' | 'participant' | 'guest';

export interface Recording {
  id: string;
  meetingId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
  size?: number; // in bytes
  format: string;
  url?: string;
  status: RecordingStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type RecordingStatus = 'recording' | 'processing' | 'completed' | 'failed';

export interface Transcription {
  id: string;
  meetingId: string;
  recordingId?: string;
  startTime: string;
  endTime?: string;
  language: string;
  content?: string;
  segments: TranscriptionSegment[];
  status: TranscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptionSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  startTime: number; // in seconds from meeting start
  endTime: number; // in seconds from meeting start
  text: string;
  confidence: number; // 0-1
}

export type TranscriptionStatus = 'in-progress' | 'completed' | 'failed';

export interface MeetingSettings {
  videoQuality: VideoQuality;
  audioQuality: AudioQuality;
  allowChat: boolean;
  allowScreenSharing: boolean;
  allowRecording: boolean;
  allowTranscription: boolean;
  muteParticipantsOnEntry: boolean;
  disableParticipantVideo: boolean;
  allowParticipantsToUnmute: boolean;
  allowParticipantsToToggleVideo: boolean;
  allowVirtualBackgrounds: boolean;
  allowNoiseReduction: boolean;
  allowParticipantsList: boolean;
  allowReactions: boolean;
  allowPolls: boolean;
  allowBreakoutRooms: boolean;
  allowWhiteboard: boolean;
  allowRaiseHand: boolean;
  recordAutomatically: boolean;
  transcribeAutomatically: boolean;
  endWhenHostLeaves: boolean;
  showJoinLeaveNotifications: boolean;
}

export type VideoQuality = 'low' | 'medium' | 'high' | 'hd';
export type AudioQuality = 'low' | 'medium' | 'high';

export interface MeetingRoom {
  id: string;
  meetingId: string;
  router?: any; // mediasoup router
  audioProducers: Map<string, any>; // userId -> mediasoup producer
  videoProducers: Map<string, any>; // userId -> mediasoup producer
  screenProducers: Map<string, any>; // userId -> mediasoup producer
  consumers: Map<string, any[]>; // userId -> mediasoup consumers
  activeSpeaker?: string; // userId of active speaker
  createdAt: string;
}

export interface WebRTCTransport {
  id: string;
  userId: string;
  meetingId: string;
  transport?: any; // mediasoup transport
  direction: 'send' | 'receive';
  createdAt: string;
}

// DTOs for creating and updating meetings
export interface CreateMeetingDto {
  title: string;
  description?: string;
  password?: string;
  isRecordingEnabled?: boolean;
  isTranscriptionEnabled?: boolean;
  isWaitingRoomEnabled?: boolean;
  maxParticipants?: number;
  startTime?: string;
  scheduledEndTime?: string;
  settings?: Partial<MeetingSettings>;
}

export interface UpdateMeetingDto {
  title?: string;
  description?: string;
  password?: string;
  isRecordingEnabled?: boolean;
  isTranscriptionEnabled?: boolean;
  isWaitingRoomEnabled?: boolean;
  maxParticipants?: number;
  startTime?: string;
  scheduledEndTime?: string;
  settings?: Partial<MeetingSettings>;
}

export interface JoinMeetingDto {
  meetingId: string;
  name: string;
  password?: string;
}

export interface MeetingResponse {
  id: string;
  title: string;
  description?: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  roomId: string;
  isPasswordProtected: boolean;
  isRecordingEnabled: boolean;
  isTranscriptionEnabled: boolean;
  isWaitingRoomEnabled: boolean;
  maxParticipants: number;
  startTime: string;
  scheduledEndTime?: string;
  actualEndTime?: string;
  status: MeetingStatus;
  participantCount: number;
  settings: MeetingSettings;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingsResponse {
  meetings: MeetingResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RecordingsResponse {
  recordings: Recording[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TranscriptionsResponse {
  transcriptions: Transcription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
