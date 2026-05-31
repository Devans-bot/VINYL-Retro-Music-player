'use client';

import React from 'react';
import Link from 'next/link';
import { Library, ListMusic, Home, Settings } from 'lucide-react';

export default function Menu() {
  const menuItems = [
    { name: 'HOME', path: '/', icon: Home, color: 'text-[#E53935]' },
    { name: 'LIBRARY', path: '/library', icon: Library, color: 'text-[#F5A623]' },
    { name: 'PLAYLISTS', path: '/playlists', icon: ListMusic, color: 'text-[#4A90E2]' },
    { name: 'SETTINGS', path: '/settings', icon: Settings, color: 'text-[#50E3C2]' },
  ];

  return (
    <div className="flex flex-col h-full font-sans justify-center bg-screen-bg">
      <div className="absolute top-0 left-0 w-full flex justify-between h-1 z-10">
        <div className="w-1/4 h-full bg-[#E53935]"></div>
        <div className="w-1/4 h-full bg-[#F5A623]"></div>
        <div className="w-1/4 h-full bg-[#4A90E2]"></div>
        <div className="w-1/4 h-full bg-[#50E3C2]"></div>
      </div>
      <div className="grid grid-cols-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className="bg-screen-header/90 rounded-2xl border border-screen-border/20 p-4 flex flex-col items-center justify-center gap-3 hover:bg-screen-header/50 hover:border-retro-accent active:scale-95 active:opacity-80 transition-all duration-100 group"
            >
              <div className={`w-15 h-15 rounded-full bg-white/80 flex items-center justify-center ${item.color} group-hover:bg-white transition-colors shadow-inner`}>
                <Icon size={26} strokeWidth={2.5} />
              </div>
              <span className={`font-pixel text-md font-bold tracking-widest text-screen-border group-hover:${item.color} text-center`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
