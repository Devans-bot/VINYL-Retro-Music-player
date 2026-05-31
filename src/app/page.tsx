'use client';

import React, { useEffect, useState } from 'react';
import { Play, Music, Disc, CassetteTape } from 'lucide-react';
import Link from 'next/link';
import { getAllTracks, getAllPlaylists, Track, Playlist } from '@/lib/db';
import { usePlayer } from '@/context/PlayerContext';
import { PlaylistItem } from '@/components/PlaylistItem';

export default function Home() {
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [randomGif, setRandomGif] = useState('/gifs/4.gif');
  const { currentTrack, isPlaying, togglePlay, playTrack, progress, duration, setIsPlayerOpen } = usePlayer();

  useEffect(() => {
    if (currentTrack) {
      const gifs = ['/gifs/1.gif', '/gifs/2.gif', '/gifs/3.gif', '/gifs/4.gif', '/gifs/5.gif', '/gifs/6.gif', '/gifs/7.gif', '/gifs/8.gif', '/gifs/9.gif', '/gifs/10.gif'];
      setRandomGif(gifs[Math.floor(Math.random() * gifs.length)]);
    }
  }, [currentTrack?.id]);

  useEffect(() => {
    async function loadData() {
      const allTracks = await getAllTracks();
      // Sort by lastPlayedAt, fallback to addedAt
      allTracks.sort((a, b) => (b.lastPlayedAt || b.addedAt) - (a.lastPlayedAt || a.addedAt));
      setRecentTracks(allTracks.slice(0, 5)); // Get 5 recent songs

      const allPlaylists = await getAllPlaylists();
      setPlaylists(allPlaylists);
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col font-sans h-full">
      {/* Now Playing Banner */}
      {currentTrack ? (
        <div className="block relative w-full bg-white/70 overflow-hidden shrink-0 py-4 ">
          <div className="absolute top-0 left-0 w-full flex justify-between h-1 z-10">
            <div className="w-1/4 h-full bg-[#E53935]"></div>
            <div className="w-1/4 h-full bg-[#F5A623]"></div>
            <div className="w-1/4 h-full bg-[#4A90E2]"></div>
            <div className="w-1/4 h-full bg-[#50E3C2]"></div>
          </div>
          <div className="px-1  flex items-center h-full">
            <div className="w-28  h-20 rounded bg-black flex items-center justify-center mr-3 shadow-inner overflow-hidden relative shrink-0">
              {isPlaying ? (
                <img src={randomGif} alt="Retro Jamming" className="w-full h-full object-cover" />
              ) : (
                <div className="text-retro-red font-pixel text-lg tracking-widest">PAUSED !</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <button onClick={() => setIsPlayerOpen(true)} className="block cursor-pointer text-left w-full">
                {/* 80s LCD Display */}
                <div
                  style={{
                    background: '#b8cce0',
                    border: '3px solid #3a5878',
                    boxShadow: 'inset 0 1px 4px rgba(0,0,30,0.25), inset 0 -1px 2px rgba(255,255,255,0.4)',
                    borderRadius: 0,
                    padding: '5px 8px 4px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Pixel dot grid overlay — 80s LCD panel texture */}
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
                    backgroundSize: '3px 3px',
                  }} />
                  {/* Dark green LCD text */}
                  <div className="flex w-max animate-marquee whitespace-nowrap items-center" style={{ position: 'relative', zIndex: 1 }}>
                    {[0,1,2,3].map(i => (
                      <span key={i} className="font-pixel text-sm tracking-widest mr-8" style={{
                        color: '#0a1f3c',
                        letterSpacing: '0.15em',
                        opacity: 0.88,
                      }}>
                        {currentTrack.title}
                      </span>
                    ))}
                  </div>
                </div>
              </button>

              {/* Retro Progress Bar — same style as player popup */}
              <div className="mt-2 pr-2 select-none">
                {/* Time row */}
                <div className="flex justify-between mb-1">
                  <span className="font-pixel text-[9px] tabular-nums" style={{ color: 'var(--color-screen-border)' }}>
                    {(() => { const m = Math.floor(progress/60); const s = Math.floor(progress%60); return `${m}:${s<10?'0':''}${s}`; })()}
                  </span>
                  <span className="font-pixel text-[9px] tabular-nums opacity-40" style={{ color: 'var(--color-screen-border)' }}>
                    {(() => { const m = Math.floor(duration/60); const s = Math.floor(duration%60); return `${m}:${s<10?'0':''}${s}`; })()}
                  </span>
                </div>
                {/* Bar */}
                <div className="w-full relative" style={{ height: '12px' }}>
                  {/* Track */}
                  <div className="absolute inset-0" style={{ border: '2px solid var(--color-screen-border)', borderRadius: 0, background: 'rgba(0,0,0,0.06)' }} />
                  {/* Fill */}
                  <div
                    className="absolute top-0 left-0 h-full"
                    style={{ width: `${duration > 0 ? (progress/duration)*100 : 0}%`, background: 'var(--color-screen-border)', borderRadius: 0, transition: 'width 0.1s linear' }}
                  />
                  {/* Playhead notch */}
                  {progress > 0 && (
                    <div
                      className="absolute top-0 h-full"
                      style={{ width: '3px', left: `calc(${(progress/(duration||1))*100}% - 1px)`, background: 'var(--color-screen-bg)', transition: 'left 0.1s linear' }}
                    />
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="absolute bottom-0 left-0 w-full flex justify-between h-1 z-10">
            <div className="w-1/4 h-full bg-[#E53935]"></div>
            <div className="w-1/4 h-full bg-[#F5A623]"></div>
            <div className="w-1/4 h-full bg-[#4A90E2]"></div>
            <div className="w-1/4 h-full bg-[#50E3C2]"></div>
          </div>
        </div>
      ) : (
        <div className="block relative w-full h-20 bg-screen-header/20 overflow-hidden flex flex-col items-center justify-center shrink-0">
          <div className="text-2xl mb-1 opacity-80">🎧</div>
          <div className="text-screen-border/60 font-pixel text-[10px] tracking-widest uppercase">Silence... Play some tunes!</div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 pb-[70px] overflow-y-auto no-scrollbar ">

        {/* Recently Played */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h2 className="font-pixel text-screen-border text-sm font-bold tracking-widest uppercase">
              Recently Played
            </h2>
          </div>

          <div className="space-y-1">
            {recentTracks.length > 0 ? (
              recentTracks.map((track, i) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, recentTracks)}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/60 border border-black/5 shadow-inner hover:bg-white/80 cursor-pointer transition-colors group"
                >
                  <div className="w-14 h-10 rounded bg-screen-border/10 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                    {track.coverArt ? (
                      <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover" />
                    ) : (
                      <img src="/cassette-tape.png" alt="Cassette" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-screen-border truncate group-hover:text-retro-accent transition-colors">{track.title}</div>
                    <div className="text-[10px] text-screen-border/70 truncate">{track.artist}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center border-2 border-dashed border-screen-border/20 rounded-xl">
                <p className="font-pixel text-[10px] text-screen-border/60">No recent tracks</p>
                <Link href="/library" className="inline-block mt-3 text-[10px] bg-retro-accent text-white px-3 py-1.5 rounded font-pixel tracking-wider hover:opacity-80 active:scale-95 active:opacity-50 transition-all duration-100">
                  IMPORT MUSIC
                </Link>
              </div>
            )}
          </div>
        </section>


      </div>
    </div>
  );
}
