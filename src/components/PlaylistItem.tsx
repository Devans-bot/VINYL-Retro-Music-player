'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Playlist } from '@/lib/db';

interface PlaylistItemProps {
  playlist: Playlist;
  className?: string;
  iconSize?: 'small' | 'medium' | 'large';
}

export function PlaylistItem({ playlist, className = '', iconSize = 'large' }: PlaylistItemProps) {
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    // Priority: coverImage stored in the playlist object itself, then localStorage fallback
    if (playlist.coverImage) {
      setCoverImage(playlist.coverImage);
    } else {
      const stored = localStorage.getItem(`playlist-cover-${playlist.id}`);
      if (stored) setCoverImage(stored);
    }
  }, [playlist]);

  const iconClasses = iconSize === 'large'
    ? 'w-32 h-32 mb-3'
    : iconSize === 'medium'
    ? 'w-16 h-16 mb-2'
    : 'w-12 h-12 mb-2';

  return (
    <Link
      href={`/playlists/${playlist.id}`}
      className={`bg-white/60 p-3 rounded-xl border border-screen-border/10 flex flex-col items-center justify-center shadow-sm hover:bg-white/80 cursor-pointer active:scale-95 active:opacity-80 transition-all duration-100 group ${className}`}
    >
      <div className={`${iconClasses} bg-white/50 rounded-full flex items-center justify-center text-screen-border/50 group-hover:scale-105 transition-transform overflow-hidden shadow-inner shrink-0`}>
        <img
          src={coverImage || '/record-player.png'}
          alt="Playlist"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="font-bold text-sm text-center text-screen-border w-full truncate mb-1">
        {playlist.name}
      </div>
      <div className="text-[10px] font-pixel tracking-widest text-screen-border/60">
        {playlist.trackIds.length} TRACKS
      </div>
    </Link>
  );
}
