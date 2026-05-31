'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ListMusic, Plus, X, Check, ImagePlus } from 'lucide-react';
import Link from 'next/link';
import { getAllPlaylists, addPlaylist, Playlist } from '@/lib/db';
import { PlaylistItem } from '@/components/PlaylistItem';

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistImage, setNewPlaylistImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setIsLoading(true);
    const dbPlaylists = await getAllPlaylists();
    setPlaylists(dbPlaylists);
    setIsLoading(false);
  }

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setNewPlaylistImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      setIsCreating(false);
      return;
    }
    const id = crypto.randomUUID();
    const newPlaylist: Playlist = {
      id,
      name: newPlaylistName.trim(),
      trackIds: [],
      createdAt: Date.now(),
      coverImage: newPlaylistImage || undefined,
    };
    // Persist cover image in localStorage keyed by playlist id
    if (newPlaylistImage) {
      localStorage.setItem(`playlist-cover-${id}`, newPlaylistImage);
    }
    await addPlaylist(newPlaylist);
    setNewPlaylistName('');
    setNewPlaylistImage(null);
    setIsCreating(false);
    load();
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setNewPlaylistName('');
    setNewPlaylistImage(null);
  };

  return (
    <div className="flex flex-col font-sans h-full px-2 pt-2">
      <div className="absolute top-0 left-0 w-full flex justify-between h-1 z-10">
        <div className="w-1/4 h-full bg-[#E53935]"></div>
        <div className="w-1/4 h-full bg-[#F5A623]"></div>
        <div className="w-1/4 h-full bg-[#4A90E2]"></div>
        <div className="w-1/4 h-full bg-[#50E3C2]"></div>
      </div>
      <div className="flex items-center justify-between mb-4 ">
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="text-[10px] font-pixel tracking-wider bg-retro-accent text-white px-2 py-1 rounded hover:opacity-80 active:scale-95 active:opacity-50 transition-all duration-100"
          >
            + NEW
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-screen-header/20 p-3 rounded-xl mb-4 border border-screen-border/20 flex flex-col gap-3">
          {/* Image picker */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-xl border-2 border-dashed border-screen-border/30 flex flex-col items-center justify-center bg-white/50 hover:bg-white/80 active:scale-95 transition-all overflow-hidden shrink-0"
            >
              {newPlaylistImage ? (
                <img src={newPlaylistImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <>
                  <ImagePlus size={20} className="text-screen-border/50 mb-1" />
                  <span className="font-pixel text-[7px] text-screen-border/50 text-center leading-tight">SET COVER</span>
                </>
              )}
            </button>
            <input
              type="text"
              autoFocus
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist Name"
              className="flex-1 bg-white/50 border-none outline-none font-bold text-sm text-screen-border p-2 rounded focus:bg-white"
              onKeyDown={(e) => e.key === 'Enter' && handleSavePlaylist()}
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePick}
          />
          <div className="flex justify-end gap-2">
            <button onClick={cancelCreate} className="p-1 text-screen-border/60 hover:text-retro-red active:scale-90 active:opacity-50 transition-all duration-100">
              <X size={16} />
            </button>
            <button onClick={handleSavePlaylist} className="p-1 text-screen-border hover:text-green-600 active:scale-90 active:opacity-50 transition-all duration-100">
              <Check size={16} />
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center font-pixel text-xs text-screen-border/50">
          LOADING...
        </div>
      ) : playlists.length === 0 && !isCreating ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-40 h-40 rounded-full bg-screen-header/30 flex items-center justify-center mb-4 text-screen-border/50 overflow-hidden">
            <img src="/record-player.png" alt="Playlists" className="w-full h-full object-contain p-2" />
          </div>
          <h2 className="font-pixel text-sm font-bold text-screen-border mb-2 tracking-widest">NO PLAYLISTS</h2>
          <p className="text-xs text-screen-border/70 mb-6">You haven't created any playlists yet.</p>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-screen-border text-screen-bg px-4 py-2 rounded-full font-pixel text-xs tracking-wider hover:opacity-80 active:scale-95 active:opacity-50 transition-all duration-100"
          >
            <Plus size={14} />
            CREATE PLAYLIST
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {playlists.map((playlist) => (
            <PlaylistItem key={playlist.id} playlist={playlist} iconSize="large" className="aspect-square" />
          ))}
        </div>
      )}
    </div>
  );
}
