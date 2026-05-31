'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Track } from '@/lib/db';

interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  isPlayerOpen: boolean;
  setIsPlayerOpen: (isOpen: boolean) => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Initialize audio element only on client
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Restore last played track if within 24 hours
    const lastTrackId = localStorage.getItem('lastPlayedTrackId');
    const lastTrackTime = localStorage.getItem('lastPlayedTrackTime');
    
    if (lastTrackId && lastTrackTime) {
      const timeDiff = Date.now() - parseInt(lastTrackTime, 10);
      const ONE_DAY = 24 * 60 * 60 * 1000;
      if (timeDiff <= ONE_DAY) {
        import('@/lib/db').then(({ getTrack }) => {
          getTrack(lastTrackId).then((track) => {
            if (track) {
              setCurrentTrack(track);
            }
          });
        });
      }
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (newQueue) setQueue(newQueue);
    
    const updatedTrack = { ...track, lastPlayedAt: Date.now() };
    setCurrentTrack(updatedTrack);

    // Persist to local storage
    localStorage.setItem('lastPlayedTrackId', track.id);
    localStorage.setItem('lastPlayedTrackTime', Date.now().toString());

    // Save recently played status asynchronously
    import('@/lib/db').then(({ addTrack }) => addTrack(updatedTrack).catch(console.error));

    if (audioRef.current) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const url = URL.createObjectURL(track.audioBlob);
      objectUrlRef.current = url;
      audioRef.current.src = url;
      audioRef.current.play().catch(console.error);
    }
    
    // Automatically open the player popup whenever a song starts playing
    setIsPlayerOpen(true);
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!objectUrlRef.current) {
        const url = URL.createObjectURL(currentTrack.audioBlob);
        objectUrlRef.current = url;
        audioRef.current.src = url;
      }
      audioRef.current.play().catch(console.error);
    }
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      playTrack(queue[currentIndex + 1]);
    } else {
      // Loop or stop
      setIsPlaying(false);
    }
  };

  const prevTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(queue[currentIndex - 1]);
    } else {
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        progress,
        duration,
        isPlayerOpen,
        setIsPlayerOpen,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
