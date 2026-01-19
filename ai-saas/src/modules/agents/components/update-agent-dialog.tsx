import { ResponsiveDialog } from '@/components/responsive-dialog';
import { AgentForm } from './agent-form';
import { useQuery } from '@tanstack/react-query';
import { getOneAgent } from '@/app/api/agents/agents';
import { ErrorState } from '@/components/error-state';

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
    isError,
    error,
  } = useQuery({
    queryKey: ['agents', agentId],
    queryFn: () => getOneAgent(agentId),
  });

  if(isError){
    return <ErrorState title="Error loading agent" description={error.message || 'Please try again'} />
  }

  if(!agent){
    return <ErrorState title="Agent not found" description="Please try again" />
  }
  
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
