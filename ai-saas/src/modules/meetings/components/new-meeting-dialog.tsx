import { ResponsiveDialog } from '@/components/responsive-dialog';
import { MeetingForm } from './meeting-form';
interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
  open,
  onOpenChange,
}: NewMeetingDialogProps) => {
  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new meeting"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="py-4">
        <MeetingForm
          onSuccess={() => onOpenChange(false)}
          onError={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </div>
    </ResponsiveDialog>
  );
};
