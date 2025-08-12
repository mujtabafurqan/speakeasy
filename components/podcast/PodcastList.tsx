import { PodcastItem } from './PodcastItem';
import { PodcastResponse } from '@/lib/api';
import { PodcastListSkeleton } from '@/components/layout/Skeleton';
import { VirtualizedList } from '@/components/ui/VirtualizedList';
import { useMemo } from 'react';

interface PodcastListProps {
  podcasts: PodcastResponse[];
  isLoading: boolean;
  error?: string | null;
}

export function PodcastList({ podcasts, isLoading, error }: PodcastListProps) {
  const VIRTUAL_THRESHOLD = 10;
  const ITEM_HEIGHT = 280; // Approximate height of PodcastItem
  const CONTAINER_HEIGHT = 800; // Max visible height before scrolling

  const shouldVirtualize = podcasts.length > VIRTUAL_THRESHOLD;

  const renderPodcastItem = useMemo(() => 
    function RenderPodcastItem(podcast: PodcastResponse) {
      return (
        <div key={podcast.id} className="mb-4">
          <PodcastItem podcast={podcast} />
        </div>
      );
    }, []
  );

  if (isLoading) {
    return <PodcastListSkeleton count={3} />;
  }

  if (error) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="text-destructive">
          <p className="text-base sm:text-lg mb-2">Failed to load podcasts</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="text-muted-foreground">
          <p className="text-base sm:text-lg mb-2">No podcasts yet</p>
          <p className="text-sm">Submit a URL above to generate your first podcast</p>
        </div>
      </div>
    );
  }

  if (shouldVirtualize) {
    return (
      <VirtualizedList
        items={podcasts}
        itemHeight={ITEM_HEIGHT}
        containerHeight={CONTAINER_HEIGHT}
        renderItem={renderPodcastItem}
        className="border border-border rounded-lg mx-2 sm:mx-0"
        overscan={3}
      />
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
      {podcasts.map((podcast) => (
        <PodcastItem key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
}