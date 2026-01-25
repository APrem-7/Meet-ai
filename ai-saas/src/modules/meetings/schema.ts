import { z } from 'zod';

export const meetingInsertSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  agentId: z.string().min(1, { message: 'Agent ID is required' }),
});

export const meetingResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  agentId: z.string(),
});

export const meetingUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  agentId: z.string().min(1, { message: 'Agent ID is required' }),
});

export type MeetingResponse = z.infer<typeof meetingResponseSchema>;
