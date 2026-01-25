'use client';

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
import { SearchAgents } from '@/app/api/agents/agents';
import { useQuery } from '@tanstack/react-query';

import { Loader2 } from 'lucide-react';
import { ChevronsUpDownIcon } from 'lucide-react';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  name: string;
  instructions: string;
}

interface AgentSearchProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onAgentSelect: (agent: Agent) => void;
  selectedAgentId?: string;
}

export const AgentSearch = ({
  open,
  setOpen,
  onAgentSelect,
  selectedAgentId,
}: AgentSearchProps) => {
  const [search, setSearch] = useState('');

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

  const handleAgentSelect = (agent: Agent) => {
    onAgentSelect(agent);
    setOpen(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg w-full p-0 rounded-xl shadow-2xl border">
        <Command
          className="rounded-xl border-0 shadow-none"
          shouldFilter={false}
        >
          <CommandInput
            placeholder="Search agents by name..."
            value={search}
            onValueChange={setSearch}
            className="border-0 focus:ring-0 px-4 py-4 text-base"
          />
          <CommandList className="max-h-[420px] overflow-y-auto px-2 py-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <>
                {agents.length > 0 ? (
                  <CommandGroup heading="Agents" className="px-2">
                    {agents.map((agent: Agent) => (
                      <CommandItem
                        key={agent.id}
                        onSelect={() => handleAgentSelect(agent)}
                        className={cn(
                          'cursor-pointer px-3 py-2.5 hover:bg-accent/50 rounded-lg flex items-center transition-colors mx-1',
                          selectedAgentId === agent.id && 'bg-accent/50'
                        )}
                        value={agent.name}
                      >
                        <GeneratedAvatar
                          seed={agent.name}
                          variant="bottsNeutral"
                          className="mr-3 h-7 w-7 flex-shrink-0"
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
                  <CommandEmpty className="py-8 text-center text-sm text-muted-foreground px-4">
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

interface AgentSearchButtonProps {
  selectedAgent?: Agent | null;
  onSelect: (agent: Agent) => void;
  className?: string;
}

export const AgentSearchButton = ({
  selectedAgent,
  onSelect,
  className,
}: AgentSearchButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AgentSearch
        open={open}
        setOpen={setOpen}
        onAgentSelect={onSelect}
        selectedAgentId={selectedAgent?.id}
      />
      <Button
        type="button"
        variant="outline"
        className={cn(
          'w-full justify-between font-normal text-muted-foreground hover:text-muted-foreground h-10 hover:bg-accent/80',
          !selectedAgent && 'text-muted-foreground',
          className
        )}
        onClick={() => setOpen(true)}
      >
        {selectedAgent ? (
          <div className="flex items-center gap-x-2 flex-1">
            <GeneratedAvatar
              seed={selectedAgent.name}
              variant="bottsNeutral"
              className="border size-5"
            />
            <span className="truncate">{selectedAgent.name}</span>
          </div>
        ) : (
          'Search and select agent...'
        )}
        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50 " />
      </Button>
    </>
  );
};
