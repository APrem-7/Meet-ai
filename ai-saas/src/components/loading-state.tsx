import { Loader2Icon } from 'lucide-react';

interface Props {
  title: string;
  description: string;
}

export const LoadingState = ({ title, description }: Props) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 animate-fade-in">
      <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm border animate-scale-in smooth-transition">
        <div className="relative">
          <Loader2Icon className="size-8 animate-spin text-primary" />
          <div className="absolute inset-0 size-8 animate-ping bg-primary/20 rounded-full"></div>
        </div>
        <div className="flex flex-col gap-y-2 text-center">
          <h6 className="text-lg font-semibold text-foreground animate-slide-up">
            {title}
          </h6>
          <p
            className="text-sm text-muted-foreground animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            {description}
          </p>
        </div>

        {/* Skeleton loading indicators */}
        <div
          className="w-full max-w-sm space-y-3 animate-slide-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="h-2 bg-muted rounded-full animate-pulse"></div>
          <div
            className="h-2 bg-muted rounded-full animate-pulse"
            style={{ animationDelay: '200ms' }}
          ></div>
          <div
            className="h-2 bg-muted rounded-full w-3/4 animate-pulse"
            style={{ animationDelay: '400ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
};
