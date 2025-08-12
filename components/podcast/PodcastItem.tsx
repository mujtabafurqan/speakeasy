import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AudioPlayer } from './AudioPlayer';
import { Calendar, Clock, ExternalLink } from 'lucide-react';
import { PodcastResponse } from '@/lib/api';

interface PodcastItemProps {
  podcast: PodcastResponse;
}

export function PodcastItem({ podcast }: PodcastItemProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-2 text-base sm:text-lg">
                {podcast.title}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{formatDate(podcast.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                  {formatDuration(podcast.duration)}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="self-start sm:ml-2 w-fit">
              {podcast.status}
            </Badge>
          </div>

          {/* Source URL */}
          <div className="flex items-center space-x-2 p-2 sm:p-3 bg-muted rounded-md">
            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <a 
              href={podcast.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary truncate min-w-0 flex-1 touch-manipulation"
            >
              {podcast.url}
            </a>
          </div>

          {/* Audio Player */}
          {podcast.status === 'completed' && podcast.audio_url && (
            <AudioPlayer 
              src={podcast.audio_url.startsWith('http') 
                ? podcast.audio_url 
                : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001'}${podcast.audio_url}`
              }
              title={podcast.title} 
            />
          )}

          {/* Loading State */}
          {(['queued', 'processing'].includes(podcast.status)) && (
            <div className="flex flex-col sm:flex-row items-center justify-center p-6 sm:p-8 text-muted-foreground gap-3 sm:gap-0">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full sm:mr-3" />
              <span className="text-sm sm:text-base text-center">
                {podcast.status === 'queued' ? 'Queued for processing...' : 'Generating podcast...'}
              </span>
            </div>
          )}

          {/* Error State */}
          {podcast.status === 'failed' && (
            <div className="p-3 sm:p-4 border border-red-200 bg-red-50 rounded-md">
              <p className="text-red-700 text-sm text-center sm:text-left">
                Failed to generate podcast. Please try again.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}