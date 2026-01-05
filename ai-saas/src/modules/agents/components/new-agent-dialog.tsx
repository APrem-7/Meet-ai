import { ResponsiveDialog } from '@/components/responsive-dialog';
import { AgentForm } from '../ui/components/agent-form';

interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewAgentDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="py-4">
        <AgentForm
          onSubmit={() => {
            onOpenChange(false);
          }}
          onCancel={() => {
            onOpenChange(false);
          }}
          initialValues={undefined}
        />
      </div>
    </ResponsiveDialog>
  );
};
