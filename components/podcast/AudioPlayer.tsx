import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [buffered, setBuffered] = useState<TimeRanges | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsLoading(false);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const seekTime = (value[0] / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const preloadAudio = async () => {
    const audio = audioRef.current;
    if (!audio || isPreloading) return;

    
    try {
      setIsPreloading(true);
      audio.load();
      await new Promise((resolve, reject) => {
        const handleCanPlay = () => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          resolve(void 0);
        };
        const handleError = (error: Event) => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          reject(error);
        };
        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('error', handleError);
      });
    } catch (error) {
      console.warn('Audio preload failed:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;


    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleProgress = () => setBuffered(audio.buffered);
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  
  // Calculate buffered percentage
  const bufferedPercentage = useMemo(() => {
    if (!buffered || !duration || buffered.length === 0) return 0;
    let maxBuffered = 0;
    for (let i = 0; i < buffered.length; i++) {
      const end = buffered.end(i);
      if (end > maxBuffered) maxBuffered = end;
    }
    return (maxBuffered / duration) * 100;
  }, [buffered, duration]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <audio ref={audioRef} src={src} preload="auto" />
      
      {/* Play/Pause Button - Larger on mobile */}
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        disabled={isLoading}
        className="flex-shrink-0 h-12 w-12 sm:h-8 sm:w-8 touch-manipulation"
      >
        {isLoading ? (
          <div className="animate-spin h-6 w-6 sm:h-4 sm:w-4 border-2 border-primary border-t-transparent rounded-full" />
        ) : isPlaying ? (
          <Pause className="h-6 w-6 sm:h-4 sm:w-4" />
        ) : (
          <Play className="h-6 w-6 sm:h-4 sm:w-4" />
        )}
      </Button>

      {/* Progress Section */}
      <div className="flex-1 space-y-3">
        <div className="relative">
          {/* Buffered progress bar */}
          <div 
            className="absolute top-0 left-0 h-full bg-muted-foreground/20 rounded-full z-0"
            style={{ width: `${bufferedPercentage}%` }}
          />
          
          {/* Mobile-optimized seek bar with larger touch area */}
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="cursor-pointer relative z-10 touch-manipulation 
                       [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 
                       sm:[&_[role=slider]]:h-3 sm:[&_[role=slider]]:w-3
                       [&_.slider-track]:h-2 sm:[&_.slider-track]:h-1"
            onMouseEnter={preloadAudio}
            onTouchStart={preloadAudio}
          />
        </div>
        
        <div className="flex justify-between text-sm sm:text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control - Hidden on mobile to save space */}
      <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
        <Volume2 className="h-4 w-4" />
        <Slider
          value={[volume * 100]}
          onValueChange={(value) => {
            const newVolume = value[0] / 100;
            setVolume(newVolume);
            if (audioRef.current) audioRef.current.volume = newVolume;
          }}
          max={100}
          className="w-16 touch-manipulation"
        />
      </div>
    </div>
  );
}