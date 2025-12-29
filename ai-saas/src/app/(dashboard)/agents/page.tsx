import { AgentView } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient } from "@/utils/query-client";
import { LoadingState } from "@/components/loading-state";
import { Suspense } from "react";


import { AgentsListHeader } from "@/modules/agents/components/agent-list-header";

const Page = async () => {
  const queryClient = getQueryClient();

  
  

  return (
    <>
     
      <AgentsListHeader />
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
      </>
  );
};

export default Page;
