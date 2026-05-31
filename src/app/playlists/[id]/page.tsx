'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Play, Music, Trash2, X, Plus, Check } from 'lucide-react';
import { getPlaylist, getAllTracks, Track, Playlist, deletePlaylist, addPlaylist } from '@/lib/db';
import { usePlayer } from '@/context/PlayerContext';

export default function PlaylistView() {
  const params = useParams();
  const router = useRouter();
  const { playTrack } = usePlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    load();
  }, [params.id]);

  async function load() {
    const pl = await getPlaylist(params.id as string);
    if (!pl) {
      router.push('/playlists');
      return;
    }
    setPlaylist(pl);

    const all = await getAllTracks();
    setAllTracks(all);

    const plTracks = pl.trackIds
      .map(id => all.find(t => t.id === id))
      .filter((t): t is Track => !!t);

    setTracks(plTracks);
    setIsLoading(false);
  }

  const handlePlayAll = () => {
    if (tracks.length > 0) playTrack(tracks[0], tracks);
  };

  const handleRemoveTrack = async (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playlist) return;
    const newTrackIds = playlist.trackIds.filter(id => id !== trackId);
    const updated = { ...playlist, trackIds: newTrackIds };
    await addPlaylist(updated);
    setPlaylist(updated);
    setTracks(tracks.filter(t => t.id !== trackId));
  };

  const handleDeletePlaylist = async () => {
    if (!playlist) return;
    if (confirm('Delete this playlist?')) {
      await deletePlaylist(playlist.id);
      router.push('/playlists');
    }
  };

  // Tracks not yet in playlist
  const availableTracks = allTracks.filter(t => !playlist?.trackIds.includes(t.id));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddSelected = async () => {
    if (!playlist || selectedIds.size === 0) {
      setShowAddSheet(false);
      return;
    }
    const newTrackIds = [...playlist.trackIds, ...Array.from(selectedIds)];
    const updated = { ...playlist, trackIds: newTrackIds };
    await addPlaylist(updated);
    setSelectedIds(new Set());
    setShowAddSheet(false);
    load();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full font-pixel text-xs text-screen-border/50">LOADING...</div>;
  }

  if (!playlist) return null;

  return (
    <div className="flex flex-col h-full font-sans bg-screen-bg relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-screen-header/30 shrink-0">
        <button onClick={() => router.back()} className="text-screen-border hover:opacity-70 active:scale-90 active:opacity-50 transition-all duration-100">
          <ChevronLeft size={20} />
        </button>
        <div className="font-pixel text-[10px] tracking-widest text-screen-border font-bold uppercase truncate max-w-[150px]">
          {playlist.name}
        </div>
        <button onClick={handleDeletePlaylist} className="text-screen-border/50 hover:text-retro-red active:scale-90 active:opacity-50 transition-all duration-100">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Add Songs Button */}
      <div className="px-4 py-2 shrink-0">
        <button
          onClick={() => { setShowAddSheet(true); setSelectedIds(new Set()); }}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-screen-border/30 rounded-xl py-2 text-[10px] font-pixel tracking-widest text-screen-border/60 hover:border-retro-accent hover:text-retro-accent active:scale-95 active:opacity-50 transition-all duration-100"
        >
          <Plus size={14} /> ADD SONGS
        </button>
      </div>

      {/* Track List */}
      {tracks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 rounded-full bg-screen-header/30 flex items-center justify-center mb-4 text-screen-border/50">
            <Music size={24} />
          </div>
          <h2 className="font-pixel text-sm font-bold text-screen-border mb-2 tracking-widest">EMPTY PLAYLIST</h2>
          <p className="text-xs text-screen-border/70">Tap ADD SONGS above to fill this playlist.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar p-2 pb-[80px]">
          <div className="flex justify-center mb-4 mt-2">
            <button
              onClick={handlePlayAll}
              className="bg-retro-accent text-white px-8 py-2 rounded-full font-pixel tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 active:opacity-80 transition-all duration-100"
            >
              <Play size={14} fill="currentColor" /> PLAY ALL
            </button>
          </div>

          <div className="space-y-1">
            {tracks.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track, tracks)}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/60 border border-black/5 shadow-inner hover:bg-white/80 cursor-pointer transition-colors group"
              >
                <div className="w-14 h-10 rounded bg-screen-border/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {track.coverArt ? (
                    <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <img src="/cassette-icon.jpg" alt="Cassette" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-screen-border truncate">{track.title}</div>
                  <div className="text-[10px] text-screen-border/70 truncate">{track.artist}</div>
                </div>
                <button
                  onClick={(e) => handleRemoveTrack(track.id, e)}
                  className="p-2 opacity-0 group-hover:opacity-100 text-screen-border/40 hover:text-retro-red active:scale-90 active:opacity-50 transition-all duration-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Songs Bottom Sheet */}
      {showAddSheet && (
        <div className="absolute inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <div className="flex-1 bg-black/40" onClick={() => setShowAddSheet(false)} />

          {/* Sheet */}
          <div className="bg-screen-bg rounded-t-2xl border-t border-screen-border/20 flex flex-col max-h-[75%] animate-slide-up">
            {/* Sheet Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-screen-border/10 shrink-0">
              <div className="font-pixel text-[10px] tracking-widest text-screen-border font-bold">ADD SONGS</div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-pixel text-screen-border/60">{selectedIds.size} SELECTED</span>
                <button
                  onClick={handleAddSelected}
                  disabled={selectedIds.size === 0}
                  className="bg-retro-accent disabled:opacity-40 text-white px-3 py-1 rounded-full font-pixel text-[9px] tracking-widest flex items-center gap-1 active:scale-95 active:opacity-80 transition-all duration-100"
                >
                  <Check size={12} /> ADD
                </button>
                <button onClick={() => setShowAddSheet(false)} className="text-screen-border/50 active:scale-90 active:opacity-50 transition-all duration-100">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Track Picker */}
            <div className="overflow-y-auto no-scrollbar p-3 space-y-1">
              {availableTracks.length === 0 ? (
                <div className="py-8 text-center font-pixel text-[10px] text-screen-border/50">
                  ALL LIBRARY SONGS ALREADY IN PLAYLIST
                </div>
              ) : (
                availableTracks.map(track => {
                  const selected = selectedIds.has(track.id);
                  return (
                    <div
                      key={track.id}
                      onClick={() => toggleSelect(track.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                        selected
                          ? 'bg-retro-accent/10 border-retro-accent/40'
                          : 'bg-white/60 border-black/5 hover:bg-white/80'
                      }`}
                    >
                      <div className="w-12 h-9 rounded bg-screen-border/10 flex-shrink-0 overflow-hidden">
                        {track.coverArt ? (
                          <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover" />
                        ) : (
                          <img src="/cassette-icon.jpg" alt="Cassette" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-screen-border truncate">{track.title}</div>
                        <div className="text-[10px] text-screen-border/70 truncate">{track.artist}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        selected ? 'bg-retro-accent border-retro-accent' : 'border-screen-border/30'
                      }`}>
                        {selected && <Check size={10} className="text-white" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
