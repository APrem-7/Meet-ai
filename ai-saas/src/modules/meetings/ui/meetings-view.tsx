'use client';
//so now here for temporarily we are going to add the Data from the backend so that we can show the data

import { getMeetings } from '@/app/api/agents/meetings';
import { useQuery } from '@tanstack/react-query';
import { meetingInsertSchema } from '@/modules/meetings/schema';

import { z } from 'zod';

import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';

export type MeetingInsert = z.infer<typeof meetingInsertSchema>;

export const MeetingView = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['meetings'],
    queryFn: () => getMeetings(),
  });
  return (
    <div>
      {isLoading && (
        <LoadingState
          title="Loading..."
          description="Please wait while we load the data"
        />
      )}
      {error && <ErrorState title="Error" description="Something went wrong" />}
      {data?.data?.map((meeting: MeetingInsert) => (
        <div key={meeting.id}>{meeting.name}</div>
      ))}
    </div>
  );
};
