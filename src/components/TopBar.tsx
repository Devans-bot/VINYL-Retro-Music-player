'use client';

import React from 'react';
import Link from 'next/link';
import { BatteryMedium, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function TopBar() {
  const [time, setTime] = React.useState('');
  const pathname = usePathname();

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  const getPageTitle = (path: string) => {
    if (path === '/') return 'HOME';
    if (path === '/menu') return 'MENU';
    if (path.startsWith('/library')) return 'LIBRARY';
    if (path.startsWith('/playlists')) return 'PLAYLISTS';
    if (path.startsWith('/settings')) return 'SETTINGS';
    if (path.startsWith('/player')) return 'PLAYER';
    if (path.startsWith('/search')) return 'SEARCH';
    return 'IPOD';
  };

  return (
    <div className="w-full font-pixel text-screen-border transition-colors duration-500 relative z-50">
      <div className="flex justify-between items-center px-4 py-1 bg-screen-bg border-b-2 border-screen-header">
        <div className="tracking-widest text-sm">
          {getPageTitle(pathname)}
        </div>
        <div className="text-sm tracking-widest absolute left-1/2 -translate-x-1/2">{time}</div>
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className={`hover:opacity-70 transition-opacity ${pathname === '/settings' ? 'text-retro-red' : ''}`}
          >
            <Settings size={15} strokeWidth={2} />
          </Link>
          <BatteryMedium size={20} className="opacity-80" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
