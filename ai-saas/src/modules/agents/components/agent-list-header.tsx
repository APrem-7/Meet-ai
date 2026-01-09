'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NewAgentDialog } from './new-agent-dialog';
import { useState } from 'react';

export const AgentsListHeader = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <NewAgentDialog open={open} onOpenChange={setOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4 ">
        <div className="flex items-center justify-between">   
          <div className="flex flex-col gap-y-1">
            <h5 className="font-semibold text-2xl tracking-tight text-foreground animate-slide-in">My Agents</h5>
            <p className="text-sm text-muted-foreground animate-slide-in" style={{ animationDelay: '100ms' }}>
              Manage and configure your AI agents
            </p>
          </div>
          <Button 
            onClick={() => setOpen(true)}
            className="smooth-transition hover:shadow-md hover:scale-105 animate-slide-in"
            style={{ animationDelay: '10ms' }}
          >
            <PlusIcon className="transition-transform" />
            New Agent
          </Button>
        </div>
      </div>
    </>
  );
};
