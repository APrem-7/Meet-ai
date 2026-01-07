'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchAgents } from '@/app/api/agents/agents';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';

interface Agent {
  id: string;
  name: string;
  instructions: string;
}

export const AgentView = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: () => {
      console.log('🌐 CLIENT fetching agents in useQuery');
      return fetchAgents();
    },
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes - data is fresh
    gcTime: 10 * 60 * 1000, // ✅ 10 minutes - keep in memory
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
    <div>
      {Array.isArray(data) &&
        data.map((agent: Agent) => (
          <div key={agent.id}>
            <h2>{agent.name}</h2>
            <p>{agent.instructions}</p>
          </div>
        ))}
    </div>
  );
};
