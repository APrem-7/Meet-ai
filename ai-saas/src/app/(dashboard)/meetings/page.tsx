import { MeetingsListHeader } from '@/modules/meetings/components/meetings-list-header';
import { MeetingsView } from '@/modules/meetings/ui/views/meetings-view';

const Page = () => {
  return (
    <>
      <MeetingsListHeader />
      <div className="p-4 flex flex-col gap-y-4">
        <MeetingsView />
      </div>
    </>
  );
};

export default Page;
