import { ResponsiveDialog } from '@/components/responsive-dialog';
import { AgentForm } from './agent-form';
import { useQuery } from '@tanstack/react-query';
import { getOneAgent } from '@/app/api/agents/agents';

interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  agentId,
}: UpdateAgentDialogProps) => {
  const {
    data: agent,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['agents', agentId],
    queryFn: () => getOneAgent(agentId),
  });
  return (
    <ResponsiveDialog
      title="Update Agent"
      description="Update agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="py-4">
        <AgentForm
          onSuccess={() => {
            onOpenChange(false);
          }}
          onCancel={() => {
            onOpenChange(false);
          }}
          initialValues={
            agent
              ? {
                  name: agent.name,
                  instruction: agent.instructions,
                }
              : { name: '', instruction: '' }
          }
          isUpdate={true}
          agentId={agentId}
        />
      </div>
    </ResponsiveDialog>
  );
};
