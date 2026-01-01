import { AgentView } from '@/modules/agents/ui/views/agent-view';
import { AgentsListHeader } from '@/modules/agents/components/agent-list-header';

const Page = async () => {
  return (
    <>
      <AgentsListHeader />
      <div className="p-4 flex flex-col gap-y-4">
        <AgentView />
      </div>
    </>
  );
};

export default Page;
