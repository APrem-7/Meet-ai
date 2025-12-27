"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/app/api/agents/agents";

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
  const { data } = useSuspenseQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      console.log("🌐 CLIENT fetching agents in useSuspenseQuery");
      return fetchAgents();
    },
    useErrorBoundary: true,
    staleTime: 30_000,
  });

  console.log("🔍 AgentView render - agents data: received");

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
