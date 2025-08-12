import { useState, useEffect, useCallback } from 'react';
import { api, PodcastResponse } from '@/lib/api';

export function usePodcastLibrary() {
  const [podcasts, setPodcasts] = useState<PodcastResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLibrary = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getLibrary();
      setPodcasts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching library:', err);
      setError(err instanceof Error ? err.message : 'Failed to load podcasts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  return {
    podcasts,
    isLoading,
    error,
    refetch: fetchLibrary
  };
}