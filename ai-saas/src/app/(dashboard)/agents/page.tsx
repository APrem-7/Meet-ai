import { AgentView } from '@/modules/agents/ui/views/agent-view';
import { fetchAgents } from '@/app/api/agents/agents';
import { getQueryClient } from '@/utils/query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { LoadingState } from '@/components/loading-state';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorState } from '@/components/error-state';

const Page = async () => {
  return (
    <div className="p-4 flex flex-col gap-y-4">
      <AgentView />
    </div>
  );
};

export default Page;
