import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchAgents, SearchAgents } from '@/app/api/agents/agents';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { useQueryState, parseAsString } from 'nuqs';
import { useRouter } from 'next/navigation';
import { DialogTitle } from '@radix-ui/react-dialog';

interface Agent {
  id: string;
  name: string;
  instructions: string;
}

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  const { data: agentsData, isLoading } = useQuery({
    queryKey: ['agents', search],
    queryFn: () => SearchAgents(search || ''),
    enabled: open,
    staleTime: 2 * 60 * 1000,
  });

  const agents = agentsData?.data || [];

  console.log('Debug - agentsData:', agentsData);
  console.log('Debug - agents array:', agents);
  console.log('Debug - agents length:', agents.length);
  console.log('Debug - search term:', search);

  const handleAgentSelect = (agent: Agent) => {
    console.log('Selected agent:', agent);
    router.push(`/agents/${agent.id}`);
    setOpen(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-0">
        <DialogTitle></DialogTitle>
        <Command
          className="rounded-lg border shadow-md"
          // Disable built-in filtering
          filter={() => true}
        >
          <CommandInput
            placeholder="Find a meeting or agent..."
            value={search ?? ''}
            onValueChange={setSearch}
            className="border-0 focus:ring-0"
          />
          <CommandList className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                {agents.length > 0 ? (
                  <CommandGroup heading="Agents">
                    {agents.map((agent: Agent) => (
                      <CommandItem
                        key={agent.id}
                        onSelect={() => handleAgentSelect(agent)}
                        className="cursor-pointer p-3 hover:bg-accent rounded-md flex items-center"
                        // Force the item to always be visible
                        value={agent.name}
                      >
                        <GeneratedAvatar
                          seed={agent.name}
                          variant="bottsNeutral"
                          className="mr-3 h-6 w-6 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium text-sm">
                            {agent.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {agent.instructions}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                    {search ? 'No agents found.' : 'Type to search agents...'}
                  </CommandEmpty>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
