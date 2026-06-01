'use client';

import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePlayer } from '@/context/PlayerContext';

export function PlayerPopup() {
  const { currentTrack, isPlaying, progress, duration, togglePlay, nextTrack, prevTrack, seek, isPlayerOpen, setIsPlayerOpen } = usePlayer();
  const [isClient, setIsClient] = useState(false);
  const [randomGif, setRandomGif] = useState('/gifs/player/club check GIF.gif');

  useEffect(() => {
    if (currentTrack) {
      const gifs = [
        '/gifs/player/Dance Love GIF by Degen Toonz.gif',
        '/gifs/player/Dance Pepe GIF.gif',
        '/gifs/player/Mood Vibing GIF by KETNIPZ.gif',
        '/gifs/player/Moving The Simpsons GIF.gif',
        '/gifs/player/Sonic The Hedgehog Smile GIF by Mashed.gif',
        '/gifs/player/Tired Winter Sun GIF by KETNIPZ.gif',
        '/gifs/player/club check GIF.gif'
      ];
      setRandomGif(gifs[Math.floor(Math.random() * gifs.length)]);
    }
  }, [currentTrack?.id]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  if (!isClient) return null;

  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col font-sans h-full bg-screen-bg overflow-hidden transition-transform duration-300 ease-in-out ${isPlayerOpen ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {/* Top Header */}
      <button
        onClick={() => setIsPlayerOpen(false)}
        className="text-screen-border absolute hover:opacity-70 active:scale-90 active:opacity-50 transition-all duration-100 inline-block mt-10"
      >
        <ChevronLeft size={20} />
      </button>

      {currentTrack ? (
        <div className="flex-1 flex flex-col justify-between px-6 pb-4 pt-1 overflow-hidden">

          {/* Album Art Container - Forced Square */}
          <div className="flex-1 flex items-center justify-center mt-3 ">
            <div className="relative w-[140px] h-[140px] rounded-lg overflow-hidden border-2 border-screen-border/10 bg-black flex items-center justify-center shrink-0">
              {currentTrack.coverArt ? (
                <img src={currentTrack.coverArt} alt="Cover" className="absolute w-full h-full object-cover" />
              ) : (
                <img src={randomGif} alt="Retro Jamming" className={`absolute w-full h-full object-cover ${isPlaying ? '' : 'grayscale'}`} />
              )}
            </div>
          </div>

          {/* Track Info & Controls Container - Fixed height at bottom */}
          <div className="shrink-0 w-full">
            {/* Track Info */}
            <div className="w-full text-center mb-2">
              <h2 className="text-xs text-screen-border truncate px-2 leading-tight">{currentTrack.title}</h2>
            </div>

            {/* Progress */}
            <div className="w-full select-none px-1 pb-2">

              {/* Time row */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-xs tabular-nums" style={{ color: 'var(--color-screen-border)' }}>
                  {formatTime(progress)}
                </span>
                <span className="font-pixel text-xs tabular-nums opacity-40" style={{ color: 'var(--color-screen-border)' }}>
                  {formatTime(duration)}
                </span>
              </div>

              {/* Bar */}
              <div
                className="w-full relative cursor-pointer"
                style={{ height: '14px', background: 'transparent' }}
                onClick={handleProgressClick}
              >
                {/* Track */}
                <div
                  className="absolute inset-0"
                  style={{
                    border: '2px solid var(--color-screen-border)',
                    borderRadius: 0,
                    background: 'rgba(0,0,0,0.06)',
                  }}
                />
                {/* Fill */}
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    width: `${(progress / (duration || 1)) * 100}%`,
                    background: 'var(--color-screen-border)',
                    borderRadius: 0,
                    transition: 'width 0.1s linear',
                  }}
                />
                {/* Playhead notch */}
                <div
                  className="absolute top-0 h-full"
                  style={{
                    width: '3px',
                    left: `calc(${(progress / (duration || 1)) * 100}% - 1px)`,
                    background: 'var(--color-screen-bg)',
                    opacity: progress > 0 ? 1 : 0,
                    transition: 'left 0.1s linear',
                  }}
                />
              </div>
            </div>


            {/* Controls */}
            <div className="flex items-center justify-between w-full px-4">
              <button className="text-screen-border/50 hover:text-screen-border active:scale-90 active:opacity-50 transition-all duration-100">
                <Shuffle size={14} />
              </button>
              <button onClick={prevTrack} className="text-screen-border hover:opacity-70 active:scale-90 active:opacity-50 transition-all duration-100">
                <SkipBack size={18} fill="currentColor" />
              </button>

              <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-screen-border text-screen-bg flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 active:opacity-80 transition-all duration-100 shrink-0">
                {isPlaying ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              <button onClick={nextTrack} className="text-screen-border hover:opacity-70 active:scale-90 active:opacity-50 transition-all duration-100">
                <SkipForward size={18} fill="currentColor" />
              </button>
              <button className="text-screen-border/50 hover:text-screen-border active:scale-90 active:opacity-50 transition-all duration-100">
                <Repeat size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 rounded-full bg-screen-header/30 flex items-center justify-center mb-4 text-screen-border/50">
            <Play size={24} fill="currentColor" className="ml-1" />
          </div>
          <h2 className="font-pixel text-sm font-bold text-screen-border mb-2 tracking-widest">NOTHING PLAYING</h2>
          <button onClick={() => { setIsPlayerOpen(false); /* The router will still handle links in other ways, but for library we might just close it and navigate */ }} className="bg-screen-border text-screen-bg px-6 py-2 rounded-full font-pixel text-xs tracking-wider hover:opacity-80 active:scale-95 active:opacity-50 transition-all duration-100">
            <Link href="/library" className="block w-full h-full">GO TO LIBRARY</Link>
          </button>
        </div>
      )}
    </div>
  );
}
