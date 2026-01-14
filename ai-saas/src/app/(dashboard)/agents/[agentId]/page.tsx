import { AgentIdView } from '@/modules/agents/ui/views/agentId-view';
import { getOneAgent } from '@/app/api/agents/agents';
import { getQueryClient } from '@/utils/query-client';
import { dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';

interface Props {
  params: { agentId: string };
}

const Page = async ({ params }: Props) => {
  const { agentId } = params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['agents', agentId],
    queryFn: () => getOneAgent(agentId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AgentIdView agentId={agentId} />
    </HydrationBoundary>
  );
};

export default Page;
