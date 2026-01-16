'use client';
import { useQuery } from '@tanstack/react-query';
import { getOneAgent } from '@/app/api/agents/agents';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import { getQueryClient } from '@/utils/query-client';
import { AgentIdHeaderView } from '@/modules/agents/ui/components/agent-id-header-view';

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  console.log(agentId);
  const queryClient = getQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['agents', agentId],
    queryFn: () => getOneAgent(agentId),
  });
  if (isLoading) {
    return (
      <LoadingState
        title="Loading agents"
        description="Please wait while we fetch the agents"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading agents"
        description={error.message || 'Please try again'}
      />
    );
  }

  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdHeaderView
        agentId={agentId}
        agentName={data.name}
        onEdit={() => {}}
        onCancel={() => {}}
      />
    </div>
  );
};
