import { z } from 'zod';

export const meetingInsertSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  agentId: z.string().min(1, { message: 'Agent ID is required' }),
});

export const meetingResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  agentId: z.string(),
  agentName: z.string(),
  status: z.enum([
    'upcoming',
    'active',
    'completed',
    'processing',
    'cancelled',
  ]),
  startedAt: z.string().nullable(),
  endedAt: z.string().nullable(),
  transcriptUrl: z.string().nullable(),
  recordingUrl: z.string().nullable(),
  summary: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  duration: z.number().nullable(),
});

export const meetingUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  agentId: z.string().min(1, { message: 'Agent ID is required' }),
});

export type MeetingResponse = z.infer<typeof meetingResponseSchema>;
