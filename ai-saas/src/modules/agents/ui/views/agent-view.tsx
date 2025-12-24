"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/app/api/agents/agents";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const AgentView = () => {
  const {
    data: agents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agents"],
    throwOnError: true,
    queryFn: async () => {
      console.log("Client fetching agents");
      return await fetchAgents();
    },
  });

  if (isLoading) {
    return (
      <LoadingState
        title="Loading agents"
        description="Please wait while we fetch the agents"
      />
    );
  }

  return (
    <div>
      <pre>
        {JSON.stringify(
          agents?.map((agent) => agent.name),
          null,
          2
        )}
      </pre>
    </div>
  );
};
