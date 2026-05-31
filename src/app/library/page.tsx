'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Music, Play, Plus, X, CassetteTape } from 'lucide-react';
import { addTrack, getAllTracks, Track, getAllPlaylists, Playlist, addPlaylist } from '@/lib/db';
import { usePlayer } from '@/context/PlayerContext';

const jsmediatags = typeof window !== 'undefined' ? require('jsmediatags') : null;

export default function Library() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playTrack } = usePlayer();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const storedTracks = await getAllTracks();
    setTracks(storedTracks);
    const storedPlaylists = await getAllPlaylists();
    setPlaylists(storedPlaylists);
    setIsLoading(false);
  };

  const handleImportClick = () => {
    // no-op — iOS requires direct label click, not programmatic .click()
    // kept for any non-iOS path that still uses it
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const readTags = (file: File): Promise<any> => {
    return new Promise((resolve) => {
      if (!jsmediatags) {
        resolve({});
        return;
      }
      jsmediatags.read(file, {
        onSuccess: function (tag: any) {
          resolve(tag.tags);
        },
        onError: function (error: any) {
          resolve({});
        }
      });
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsImporting(true);
    const files = Array.from(e.target.files);

    for (const file of files) {
      if (!file.type.startsWith('audio/')) continue;

      const tags = await readTags(file);

      let coverArt = '';
      if (tags.picture) {
        const { data, format } = tags.picture;
        let base64String = '';
        for (let i = 0; i < data.length; i++) {
          base64String += String.fromCharCode(data[i]);
        }
        coverArt = `data:${format};base64,${window.btoa(base64String)}`;
      }

      const track: Track = {
        id: crypto.randomUUID(),
        title: tags.title || file.name.replace(/\.[^/.]+$/, ""),
        artist: tags.artist || 'Unknown Artist',
        album: tags.album || 'Unknown Album',
        audioBlob: file,
        coverArt,
        addedAt: Date.now()
      };

      await addTrack(track);
    }

    await loadData();
    setIsImporting(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddToPlaylist = async (playlist: Playlist, track: Track, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playlist.trackIds.includes(track.id)) {
      const updatedPlaylist = {
        ...playlist,
        trackIds: [...playlist.trackIds, track.id]
      };
      await addPlaylist(updatedPlaylist);
      // alert added
      await loadData();
    }
    setActiveMenuTrackId(null);
  };

  return (
    <div className="flex flex-col h-full font-sans px-1 pt-2 relative">
      <div className="absolute top-0 left-0 w-full flex justify-between h-1 z-10">
        <div className="w-1/4 h-full bg-[#E53935]"></div>
        <div className="w-1/4 h-full bg-[#F5A623]"></div>
        <div className="w-1/4 h-full bg-[#4A90E2]"></div>
        <div className="w-1/4 h-full bg-[#50E3C2]"></div>
      </div>
      <div className="flex items-center justify-between mb-2 ">

        {/* iOS-safe file picker: label wrap = direct user interaction, works on Safari/iOS */}
        <label
          className={`text-[10px] font-pixel tracking-wider bg-retro-accent text-white px-2 py-1 rounded cursor-pointer select-none
            hover:opacity-80 active:scale-95 active:opacity-50 transition-all duration-100
            ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}
          style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
        >
          {isImporting ? 'IMPORTING...' : '+ IMPORT'}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".mp3,.m4a,.aac,.ogg,.wav,.flac,.opus,audio/mpeg,audio/mp4,audio/aac,audio/ogg,audio/wav,audio/flac,audio/opus,audio/*"
            multiple
            className="hidden"
          />
        </label>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-screen-header font-pixel text-xs">
          LOADING...
        </div>
      ) : tracks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-full bg-screen-header/30 flex items-center justify-center mb-4 text-screen-border/50">
            <Music size={24} />
          </div>
          <h2 className="font-pixel text-sm font-bold text-screen-border mb-2 tracking-widest">LIBRARY EMPTY</h2>
          <p className="text-xs text-screen-border/70 mb-6">Import some audio files from your device to start playing.</p>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 bg-screen-border text-screen-bg px-4 py-2 rounded-full font-pixel text-xs tracking-wider hover:opacity-80 active:scale-95 active:opacity-50 transition-all duration-100"
          >
            <Upload size={14} />
            IMPORT MUSIC
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-4 space-y-1 -mx-2 px-2 relative">
          {tracks.map((track) => (
            <div key={track.id} className="relative">
              <div
                onClick={() => playTrack(track, tracks)}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/60 border border-black/5 shadow-inner hover:bg-white/80 cursor-pointer transition-colors group"
              >
                <div className="w-14 h-10 rounded bg-screen-border/10 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                  {track.coverArt ? (
                    <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <img src="/cassette-icon.jpg" alt="Cassette" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-screen-border truncate">{track.title}</div>
                  <div className="text-[10px] text-screen-border/70 truncate">{track.artist}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
