import { AgentView } from "@/modules/agents/ui/views/agent-view";
import { AgentsListHeader } from "@/modules/agents/components/agent-list-header";

const Page = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <AgentsListHeader />
      <div className="px-4 md:px-8">
        <AgentView />
      </div>
    </div>
  );
};

export default Page;
