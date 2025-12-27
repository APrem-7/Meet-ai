import { AgentView } from "@/modules/agents/ui/views/agent-view";
import { fetchAgents } from "@/app/api/agents/agents";
import { getQueryClient } from "@/utils/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { Suspense } from "react";

const Page = async () => {
  const queryClient = getQueryClient();

  // Prefetch the data
  await queryClient.prefetchQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      console.log("🖥️ SERVER prefetching agents");
      return await fetchAgents();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="Loading agents"
            description="Please wait while we fetch the agents"
          />
        }
      >
        <div className="p-4 flex flex-col gap-y-4">
          <AgentView />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
