import { ResponsiveDialog } from "@/components/responsive-dialog";

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
        <p>New agent form or content goes here.</p>
      </div>
    </ResponsiveDialog>
  );
};
