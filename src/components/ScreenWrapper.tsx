'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function ScreenWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMenu = pathname === '/menu';

  return (
    <div 
      id="ipod-screen-scroll-container" 
      className={`flex-1 overflow-y-auto no-scrollbar relative ${isMenu ? '' : 'pb-[60px]'}`}
    >
      {children}
    </div>
  );
}
