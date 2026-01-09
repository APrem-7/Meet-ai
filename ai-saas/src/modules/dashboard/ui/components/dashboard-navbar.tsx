'use client';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from 'lucide-react';
import { DashboardCommand } from './dashboard-command';
import { useEffect, useState } from 'react';

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 ">
        <Button
          className="size-9 smooth-transition hover:shadow-sm"
          variant="outline"
          onClick={toggleSidebar}
        >
          {state === 'collapsed' || isMobile ? (
            <PanelLeftIcon className="transition-transform duration-200" />
          ) : (
            <PanelLeftCloseIcon className="size-4 transition-transform duration-200" />
          )}
        </Button>
        <Button
          className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground smooth-transition hover:shadow-sm hover:bg-accent/80"
          variant="outline"
          size="sm"
          onClick={() => {
            setCommandOpen((open) => !open);
          }}
        >
          <SearchIcon className="transition-transform duration-200 group-hover:scale-110" />
          Search
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground/70 transition-colors duration-200 group-hover:text-muted-foreground">
            <span className="text-xs">&#8984;K</span>
          </kbd>
        </Button>
      </nav>
    </>
  );
};
