'use client';

interface AgentSkeletonProps {
  count?: number;
}

export const AgentSkeleton = ({ count = 5 }: AgentSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-lg bg-background border shadow-sm animate-fade-in">
      <div className="space-y-0">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border-b border-border/50 animate-slide-up hover:bg-muted/10 smooth-transition"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Agent info skeleton */}
            <div className="flex items-center gap-x-3 flex-1">
              {/* Avatar skeleton with shimmer */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/50 to-transparent animate-shimmer" />
                </div>
              </div>

              {/* Text content skeleton */}
              <div className="flex flex-col gap-y-2 flex-1">
                {/* Name skeleton */}
                <div className="relative h-4 w-32 bg-muted rounded animate-pulse overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/50 to-transparent animate-shimmer" />
                </div>
                {/* Instructions skeleton */}
                <div className="relative h-3 w-48 bg-muted/70 rounded animate-pulse overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Meetings badge skeleton */}
            <div className="flex items-center gap-x-2 px-3 py-1.5 border rounded-md bg-muted/20 animate-pulse">
              <div className="relative w-4 h-4 bg-muted rounded">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/50 to-transparent animate-shimmer" />
              </div>
              <div className="relative h-3 w-4 bg-muted rounded">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/50 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
