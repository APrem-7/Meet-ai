
import {MeetingView} from "@/modules/meetings/ui/meetings-view";
import {MeetingsListHeader} from "@/modules/meetings/components/meeting-list-header";

const Page = () => {
  return (
    <>
      <MeetingsListHeader />
      <div className="p-4 flex flex-col gap-y-4">
        <MeetingView />
      </div>
    </>
  );
};

export default Page;
