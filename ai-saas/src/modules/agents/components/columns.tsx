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
        <div className="flex items-center gap-x-2 group">
          <div className="transition-transform duration-200 group-hover:scale-105">
            <GeneratedAvatar seed={row.original.name} variant="bottsNeutral" />
          </div>
          <span className="font-semibold capitalize transition-colors duration-200 group-hover:text-foreground/80">
            {row.original.name}
          </span>
        </div>

        <div className="flex items-center gap-x-1.5 opacity-70 group-hover:opacity-100 smooth-transition">
          <CornerDownRightIcon className="size-3 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
          <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize transition-colors duration-200 group-hover:text-muted-foreground/80">
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
      <Badge
        variant="outline"
        className="flex items-center gap-x-2 [&>svg]:size-4 smooth-transition hover:shadow-sm hover:bg-accent/50 group"
      >
        <VideoIcon className="text-blue-700 transition-transform duration-200 group-hover:scale-110" />
        <span className="transition-colors duration-200 group-hover:text-foreground">
          5 Meetings
        </span>
      </Badge>
    ),
  },
];
