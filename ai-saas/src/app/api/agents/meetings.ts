import { z } from 'zod';
import { meetingInsertSchema } from '@/modules/meetings/schema';

export const getMeetings = async (page?: number, pageSize?: number) => {
  const url = new URL('http://localhost:8000/meetings');
  if (page) {
    url.searchParams.set('page', page.toString());
  }
  if (pageSize) {
    url.searchParams.set('pageSize', pageSize.toString());
  }

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include', // IMPORTANT: sends cookies for session
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch agents: ${res.status}`);
  }

  const res_data = await res.json();
  return res_data;
};

export const createMeeting = async (
  input: z.infer<typeof meetingInsertSchema>
) => {
  const input_data = meetingInsertSchema.parse(input); // 👈 REAL SECURITY

  const url = new URL('http://localhost:8000/meetings');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // IMPORTANT: sends cookies for session
    body: JSON.stringify(input_data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create meeting: ${res.status}`);
  }

  const res_data = await res.json();
  return res_data;
};

//Update MeetingID needs MeetingId,name(updated),agentId(updated)
export const updateMeeting = async (
  meetingId: string,
  input: z.infer<typeof meetingInsertSchema>
) => {
  const input_data = meetingInsertSchema.parse(input); // 👈 REAL SECURITY

  const url = new URL(`http://localhost:8000/meetings/${meetingId}`);

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // IMPORTANT: sends cookies for session
    body: JSON.stringify(input_data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create meeting: ${res.status}`);
  }

  const res_data = await res.json();
  return res_data;              
};
