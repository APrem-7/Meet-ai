import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { SearchAgents } from '@/app/api/agents/agents';
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
    if (!open) setSearch('');
  }, [open, setSearch]);

  const { data: agentsData, isLoading } = useQuery({
    queryKey: ['agents', search],
    queryFn: () => SearchAgents(search || ''),
    enabled: open,
    staleTime: 2 * 60 * 1000,
  });

  const agents: Agent[] = agentsData?.data || [];

  const handleAgentSelect = (agent: Agent) => {
    router.push(`/agents/${agent.id}`);
    setOpen(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogContent
        className="
          !w-[1000px]
          !max-w-[95vw]
          !p-0
        "
      >
        <Command className="rounded-lg border shadow-md" filter={() => true}>
          <CommandInput
            placeholder="Find a meeting or agent..."
            value={search ?? ''}
            onValueChange={setSearch}
            className="border-0 focus:ring-0"
          />

          <CommandList className="max-h-[450px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : agents.length > 0 ? (
              <CommandGroup heading="Agents">
                {agents.map((agent) => (
                  <CommandItem
                    key={agent.id}
                    value={agent.name}
                    onSelect={() => handleAgentSelect(agent)}
                    className="flex items-center gap-3 p-3 cursor-pointer rounded-md hover:bg-accent"
                  >
                    <GeneratedAvatar
                      seed={agent.name}
                      variant="bottsNeutral"
                      className="h-7 w-7 flex-shrink-0"
                    />

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {agent.instructions}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
                {search ? 'No agents found.' : 'Type to search agents...'}
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
