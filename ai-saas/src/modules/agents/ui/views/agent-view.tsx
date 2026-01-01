'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchAgents } from '@/app/api/agents/agents';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';

interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  top_p: number;
  presence_penalty: number;
  frequency_penalty: number;
}

export const AgentView = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      console.log('🌐 CLIENT fetching agents in useSuspenseQuery');
      return fetchAgents();
    },
    staleTime: 30_000,
  });

  console.log('🔍 AgentView render - agents data: received');

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
    <pre>
      {JSON.stringify(
        data.map((agent: Agent) => agent.name),
        null,
        2
      )}
    </pre>
  );
};
