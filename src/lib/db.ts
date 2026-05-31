import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration?: string;
  audioBlob: Blob;
  coverArt?: string; // base64 data URL
  addedAt: number;
  lastPlayedAt?: number;
}

export interface Playlist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
  coverImage?: string; // base64 data URL or empty (use default)
}

interface VinylDB extends DBSchema {
  tracks: {
    key: string;
    value: Track;
    indexes: { 'by-added': number };
  };
  playlists: {
    key: string;
    value: Playlist;
    indexes: { 'by-created': number };
  };
}

let dbPromise: Promise<IDBPDatabase<VinylDB>> | null = null;

export function getDB() {
  if (typeof window === 'undefined') return null;
  
  if (!dbPromise) {
    dbPromise = openDB<VinylDB>('vinyl-retro-player', 1, {
      upgrade(db) {
        const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
        trackStore.createIndex('by-added', 'addedAt');

        const playlistStore = db.createObjectStore('playlists', { keyPath: 'id' });
        playlistStore.createIndex('by-created', 'createdAt');
      },
    });
  }
  return dbPromise;
}

export async function addTrack(track: Track) {
  const db = await getDB();
  if (!db) return;
  await db.put('tracks', track);
}

export async function getAllTracks(): Promise<Track[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('tracks', 'by-added');
}

export async function getTrack(id: string): Promise<Track | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('tracks', id);
}

export async function deleteTrack(id: string) {
  const db = await getDB();
  if (!db) return;
  await db.delete('tracks', id);
}

export async function addPlaylist(playlist: Playlist) {
  const db = await getDB();
  if (!db) return;
  await db.put('playlists', playlist);
}

export async function getAllPlaylists(): Promise<Playlist[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex('playlists', 'by-created');
}

export async function getPlaylist(id: string): Promise<Playlist | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return db.get('playlists', id);
}

export async function deletePlaylist(id: string) {
  const db = await getDB();
  if (!db) return;
  await db.delete('playlists', id);
}
