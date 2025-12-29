"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/app/api/agents/agents";

interface Agent {
  id: string;
  name: string;
  instructions: string;
}

export const AgentView = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
    staleTime: 30_000,
  });

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
