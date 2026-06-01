'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Gamepad2, Ghost } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GamesMenu() {
  const router = useRouter();
  const rotationAccumulator = useRef(0);
  const resetTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleWheel = (e: Event) => {
      const customEvent = e as CustomEvent;
      const delta = customEvent.detail.delta;

      // Only accumulate clockwise movement
      if (delta > 0) {
        rotationAccumulator.current += delta;
      } else {
        rotationAccumulator.current = 0; // Reset if they spin backwards
      }

      // Check if they've spun 3 full times (3 * 360 = 1080)
      if (rotationAccumulator.current >= 1080) {
        rotationAccumulator.current = 0;
        router.push('/games/pacman');
      }

      // Reset accumulation if they stop spinning for 1 second
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
      resetTimeout.current = setTimeout(() => {
        rotationAccumulator.current = 0;
      }, 1000);
    };

    window.addEventListener('ipod-wheel', handleWheel);
    return () => {
      window.removeEventListener('ipod-wheel', handleWheel);
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
    };
  }, [router]);

  const gamesList = [
    { name: 'Dino Runner', path: '/games/dino', emoji: '🦖', color: 'text-green-500' },
    { name: 'Snake', path: '/games/snake', emoji: '🐍', color: 'text-green-600' },
    { name: 'Retro Racer', path: '/games/racer', emoji: '🚗', color: 'text-red-500' },
    { name: 'Space Invaders', path: '/games/space-invaders', emoji: '👾', color: 'text-blue-500' },
    { name: 'Brick Breaker', path: '/games/brick-breaker', emoji: '🧱', color: 'text-orange-500' },
    { name: 'Tetris', path: '/games/tetris', emoji: '🧩', color: 'text-purple-500' },
  ];

  return (
    <div className="flex flex-col h-full font-sans bg-screen-bg relative">
      <div className="absolute top-0 left-0 w-full flex justify-between h-1 z-20 pointer-events-none">
        <div className="w-1/4 h-full bg-[#E53935]"></div>
        <div className="w-1/4 h-full bg-[#F5A623]"></div>
        <div className="w-1/4 h-full bg-[#4A90E2]"></div>
        <div className="w-1/4 h-full bg-[#50E3C2]"></div>
      </div>

      <div className="px-3 pt-2 pb-2 flex items-center shrink-0 z-10 border-b border-screen-header/30">
        <Link href="/menu" className="hover:opacity-70 transition-opacity p-1 -ml-1">
          <ChevronLeft size={24} className="text-screen-border" strokeWidth={2.5} />
        </Link>
        <h1 className="font-pixel text-screen-border text-sm ml-2 tracking-widest mt-0.5">
          GAMES
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        <div className="grid grid-cols-2 gap-2 pb-8">
          {gamesList.map((game) => (
            <Link
              key={game.name}
              href={game.path}
              className="bg-screen-header/40 rounded-xl border border-screen-border/20 p-3 flex flex-col items-center justify-center gap-2 hover:bg-screen-header/80 active:scale-95 transition-all duration-100 group"
            >
              <div className="text-3xl filter grayscale contrast-200 brightness-50 sepia-0 opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all">
                {game.emoji}
              </div>
              <span className="font-pixel text-[9px] font-bold tracking-widest text-screen-border text-center">
                {game.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
