'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function Downloader() {
  return (
    <div className="flex flex-col h-full font-sans bg-screen-bg relative">
      <div className="absolute top-0 left-0 w-full flex justify-between h-1 z-20 pointer-events-none">
        <div className="w-1/4 h-full bg-[#E53935]"></div>
        <div className="w-1/4 h-full bg-[#F5A623]"></div>
        <div className="w-1/4 h-full bg-[#4A90E2]"></div>
        <div className="w-1/4 h-full bg-[#50E3C2]"></div>
      </div>

      {/* Header */}
      <div className="px-3 pt-2 pb-2 flex items-center shrink-0 z-10 border-b border-screen-header/30">
        <Link href="/menu" className="hover:opacity-70 transition-opacity p-1 -ml-1">
          <ChevronLeft size={24} className="text-screen-border" strokeWidth={2.5} />
        </Link>
        <h1 className="font-pixel text-screen-border text-sm ml-2 tracking-widest mt-0.5">
          DOWNLOADER
        </h1>
      </div>

      {/* iFrame Content */}
      <div className="flex-1 w-full relative bg-white">
        <iframe
          src="https://v20.www-y2mate.com/"
          className="absolute inset-0 w-full h-full border-none"
          title="Song Downloader"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
