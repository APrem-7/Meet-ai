"use client";

import { Button } from "@/components/ui/button";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { AgentView } from "@/modules/agents/ui/views/agent-view";
import { LoadingState } from "@/components/loading-state";

export const HomeView = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (!session) {
    return (
      <LoadingState
        title="Loading Profile"
        description="Please wait while we fetch the session"
      />
    );
  }
  return (
    <div className="p-4 flex flex-col gap-y-4">
      <p>Logged in as {session.user.name} </p>
    </div>
  );
};
