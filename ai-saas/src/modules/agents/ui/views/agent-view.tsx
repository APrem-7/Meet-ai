'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchAgents } from '@/app/api/agents/agents';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import { DataTable } from '../../components/data-table';
import { columns } from '../../components/columns';
import { EmptyState } from '@/components/empty-state';

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
    <div className="animate-fade-smooth">
      <DataTable
        data={data || []}
        columns={columns}
        onRowClick={(row) => {
          console.log(row);
        }}
      />
      {data && data.length === 0 && (
        <div className="animate-slide-up">
          <EmptyState
            title="No agents found"
            description="Please create an agent to get started"
          />
        </div>
      )}
    </div>
  );
};
