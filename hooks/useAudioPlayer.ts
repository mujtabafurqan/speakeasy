import { useState, useRef, useCallback } from 'react';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const togglePlay = useCallback(async () => {
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
  }, [isPlaying]);

  const handleSeek = useCallback((value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const seekTime = (value[0] / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  }, [duration]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    togglePlay,
    handleSeek,
    handleVolumeChange,
    setCurrentTime,
    setDuration,
    setIsPlaying
  };
}