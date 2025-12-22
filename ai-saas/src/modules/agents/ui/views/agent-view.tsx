"use client"

import { fetchAgents } from "@/app/api/agents/agents";
import { useQuery } from "@tanstack/react-query";

export const AgentView = () => {
  const { data: agents, isLoading, error } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  if (isLoading) {
    return <div>Loading agents...</div>;
  }

  if (error) {
    return <div>Something broke 💥</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(agents?.map(agent => agent.name), null, 2)}</pre>
    </div>
  );
}