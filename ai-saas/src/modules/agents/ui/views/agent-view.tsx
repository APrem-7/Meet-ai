'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchAgents } from '@/app/api/agents/agents';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import { DataTable } from '../../components/data-table';
import { columns } from '../../components/columns';
import { EmptyState } from '@/components/empty-state';
import { useRouter } from 'next/navigation';

import { useQueryState, parseAsInteger } from 'nuqs';

import { DataPagination } from '@/modules/agents/ui/components/data-pagination';

interface Agent {
  id: string;
  name: string;
  instructions: string;
}

export const AgentView = () => {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pageSize', parseAsInteger.withDefault(7));

  const { data, isLoading, error } = useQuery({
    queryKey: ['agents', page, pageSize],
    queryFn: () => {
      console.log('🌐 CLIENT fetching agents in useQuery');
      return fetchAgents(page, pageSize);
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
        data={data?.data || []}
        columns={columns}
        onRowClick={(row) => {
          router.push(`/agents/${row.id}`);
        }}
      />
      {data?.data && data.data.length === 0 && (
        <div className="animate-slide-up">
          <EmptyState
            title="No agents found"
            description="Please create an agent to get started"
          />
        </div>
      )}
      <DataPagination
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
};
