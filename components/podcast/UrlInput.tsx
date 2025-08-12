import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  isGenerating?: boolean;
}

export function UrlInput({ onSubmit, isLoading, isGenerating = false }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    onSubmit(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
          Enter any URL to create a podcast conversation
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            className="text-center h-12 sm:h-10 text-base sm:text-sm touch-manipulation"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 px-2 text-center sm:text-left">
              {error}
            </p>
          )}
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || isGenerating || !url} 
          className="w-full h-12 sm:h-10 text-base sm:text-sm touch-manipulation"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Creating Podcast...</span>
              <span className="sm:hidden">Creating...</span>
            </>
          ) : isGenerating ? (
            <>
              <LoadingSpinner className="mr-2 h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Generating Podcast...</span>
              <span className="sm:hidden">Generating...</span>
            </>
          ) : (
            'Generate Podcast'
          )}
        </Button>
      </form>
    </div>
  );
}