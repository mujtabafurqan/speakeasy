'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { usePodcastLibrary } from '@/hooks/usePodcastLibrary';
import { useJobPolling } from '@/hooks/usePolling';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { PodcastListSkeleton } from '@/components/layout/Skeleton';

// Dynamically import heavy components
const UrlInput = lazy(() => import('@/components/podcast/UrlInput').then(module => ({ default: module.UrlInput })));
const PodcastList = lazy(() => import('@/components/podcast/PodcastList').then(module => ({ default: module.PodcastList })));

export default function HomePage() {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { podcasts, isLoading, error, refetch } = usePodcastLibrary();
  const { result: jobResult } = useJobPolling(currentJobId);
  
  // Check if we're currently generating a podcast
  const isGenerating = currentJobId !== null && jobResult?.status !== 'completed' && jobResult?.status !== 'failed';

  const handleUrlSubmit = async (url: string) => {
    try {
      setIsSubmitting(true);
      const response = await api.submitUrl(url);
      
      setCurrentJobId(response.job_id);
      
      if (response.status === 'completed') {
        toast.success('Podcast already exists!');
        refetch();
      } else {
        toast.success('Podcast generation started!');
      }
    } catch (error) {
      console.error('Error submitting URL:', error);
      toast.error('Failed to submit URL. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle job completion
  useEffect(() => {
    if (jobResult?.status === 'completed') {
      toast.success('Podcast generated successfully!');
      refetch();
      setCurrentJobId(null);
    } else if (jobResult?.status === 'failed') {
      toast.error('Podcast generation failed. Please try again.');
      setCurrentJobId(null);
    }
  }, [jobResult, refetch]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-optimized container with proper padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        {/* URL Input Section */}
        <section className="w-full">
          <ErrorBoundary>
            <Suspense fallback={
              <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="h-6 sm:h-8 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 sm:h-4 bg-muted animate-pulse rounded mx-auto w-3/4" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="h-12 sm:h-10 bg-muted animate-pulse rounded" />
                  <div className="h-12 sm:h-10 bg-muted animate-pulse rounded" />
                </div>
              </div>
            }>
              <UrlInput onSubmit={handleUrlSubmit} isLoading={isSubmitting} isGenerating={isGenerating} />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* Library Section */}
        <section className="w-full">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 px-2 sm:px-0">
              Podcast Library
            </h2>
            <ErrorBoundary>
              <Suspense fallback={<PodcastListSkeleton count={3} />}>
                <PodcastList podcasts={podcasts} isLoading={isLoading} error={error} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>
      </div>
    </div>
  );
}