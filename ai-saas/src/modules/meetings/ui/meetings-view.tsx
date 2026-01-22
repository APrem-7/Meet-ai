'use client';
//so now here for temporarily we are going to add the Data from the backend so that we can show the data

import { getMeetings } from '@/app/api/agents/meetings';
import { useQuery } from '@tanstack/react-query';
import { meetingInsertSchema } from '@/modules/meetings/schema';

import { z } from 'zod';

export type MeetingInsert = z.infer<typeof meetingInsertSchema>;

export const MeetingView = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['meetings'],
    queryFn: () => getMeetings(),
  });
  return (
    <div>
      {data?.data?.map((meeting: MeetingInsert) => (
        <div key={meeting.agentId}>{meeting.name}</div>
      ))}
    </div>
  );
};
