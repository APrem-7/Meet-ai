'use client';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { ColumnDef } from '@tanstack/react-table';
import { CornerDownRightIcon, VideoIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Agent = {
  id: string;
  name: string;
  instructions: string;
};

// export type Payment = {
//   id: string;
//   amount: number;
//   status: 'pending' | 'processing' | 'success' | 'failed';
//   email: string;
// };

export const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: 'name',
    header: 'AgentName',
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <GeneratedAvatar seed={row.original.name} variant="bottsNeutral" />
          <span className="font-semibold capitalize">{row.original.name}</span>
        </div>

        <div className="flex items-center gap-x-1.5">
          <CornerDownRightIcon className="size-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
            {row.original.instructions}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'meetingcounts',
    header: 'Meetings',
    cell: ({ row }) => (
      <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4 ">
        <VideoIcon className="text-blue-700" />
        5
      </Badge>
    ),
  },
];
