import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
}

export function PodcastItemSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      {/* Source URL */}
      <Skeleton className="h-10 w-full" />

      {/* Audio Player */}
      <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function PodcastListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <PodcastItemSkeleton key={i} />
      ))}
    </div>
  );
}