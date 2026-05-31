'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, Search, ListMusic } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'LIBRARY', path: '/library', icon: Library },
    { name: 'SEARCH', path: '/search', icon: Search },
    { name: 'LISTS', path: '/playlists', icon: ListMusic },
  ];

  if (pathname === '/menu') return null;

  return (
    <div className="absolute bottom-0 w-full bg-screen-bg border-t-3 border-screen-header font-pixel text-screen-border flex justify-around items-center px-2 ">
      {navItems.map((item) => {
        const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
        const Icon = item.icon;

        return (
          <Link
            href={item.path}
            key={item.name}
            className={`flex flex-col items-center justify-center pt-1 w-16 transition-colors ${isActive ? 'text-retro-red' : 'hover:opacity-70'}`}
          >
            <Icon size={17} strokeWidth={isActive ? 2.5 : 2} className="mb-0.5" />
            <span className="text-[10px] tracking-widest">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
