import { z } from 'zod';
import {
  meetingInsertSchema,
  meetingUpdateSchema,
} from '@/modules/meetings/schema';

export const getMeetings = async (
  page?: number,
  pageSize?: number,
  search?: string,
  status?: string,
  agentId?: string
) => {
  const url = new URL('http://localhost:8000/meetings');
  if (page) {
    url.searchParams.set('page', page.toString());
  }
  if (pageSize) {
    url.searchParams.set('pageSize', pageSize.toString());
  }
  if (search) {
    url.searchParams.set('search', search);
  }
  if (status) {
    url.searchParams.set('status', status);
  }
  if (agentId) {
    url.searchParams.set('agentId', agentId);
  }
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include', // IMPORTANT: sends cookies for session
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch meetings: ${res.status}`);
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
  input: z.infer<typeof meetingUpdateSchema>
) => {
  const input_data = meetingUpdateSchema.parse(input); // 👈 REAL SECURITY

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
    throw new Error(`Failed to update meeting: ${res.status}`);
  }

  const res_data = await res.json();
  return res_data;
};

export const getOneMeeting = async (meetingId: string) => {
  const url = new URL(`http://localhost:8000/meetings/${meetingId}`);

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include', // IMPORTANT: sends cookies for session
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to get meeting: ${res.status}`);
  }

  const res_data = await res.json();
  return res_data;
};

export const connectAgent = async (meetingId: string) => {
  const url = new URL(
    `http://localhost:8000/meetings/${meetingId}/agent/auto-connect`
  );

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to connect agent to meeting: ${res.status}`);
  }

  const res_data = await res.json();
  return res_data;
};


export const disconnectAgent = async (meetingId: string) => {
  const url = new URL(
    `http://localhost:8000/meetings/${meetingId}/agent/disconnect`
  );

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to disconnect agent from meeting: ${res.status}`);
  }

  const res_data = await res.json();
  return res_data;
};

export const getAgentStatus = async (meetingId: string) => {
  const url = new URL(
    `http://localhost:8000/meetings/${meetingId}/agent/status`
  );

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to get agent status: ${res.status}`);
  }

  const res_data = await res.json();
  return res_data;
};
