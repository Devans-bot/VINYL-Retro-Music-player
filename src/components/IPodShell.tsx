'use client';

import React, { useRef } from 'react';
import { SkipBack, SkipForward, Play, FolderBookmark } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

interface IPodShellProps {
  children: React.ReactNode;
}

export function IPodShell({ children }: IPodShellProps) {
  const { togglePlay, nextTrack, prevTrack, setIsPlayerOpen, isPlayerOpen } = usePlayer();
  const router = useRouter();
  const { stickers, wheelRadius } = useTheme();
  const wheelRef = useRef<HTMLDivElement>(null);
  const prevAngleRef = useRef<number | null>(null);
  const lastTapRef = useRef<number>(0);

  const getAngle = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return null;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    prevAngleRef.current = getAngle(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prevAngleRef.current === null) return;
    const newAngle = getAngle(e);
    if (newAngle === null) return;
    let deltaAngle = newAngle - prevAngleRef.current;
    if (deltaAngle > 180) deltaAngle -= 360;
    else if (deltaAngle < -180) deltaAngle += 360;
    if (Math.abs(deltaAngle) > 2) {
      const scrollContainer = document.getElementById('ipod-screen-scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTop += deltaAngle * 1.5;
      }
      prevAngleRef.current = newAngle;
    }
  };

  const handlePointerUp = () => {
    prevAngleRef.current = null;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background stripe */}
      <div className="absolute top-0 left-0 w-full flex justify-between h-2">
        <div className="w-1/4 h-full bg-[#E53935]"></div>
        <div className="w-1/4 h-full bg-[#F5A623]"></div>
        <div className="w-1/4 h-full bg-[#4A90E2]"></div>
        <div className="w-1/4 h-full bg-[#50E3C2]"></div>
      </div>

      {/* Main iPod Body */}
      <div className="relative w-full max-w-sm aspect-[1/2] max-h-[710px] bg-ipod-body rounded-[4rem] py-3 px-3 border-4 border-black/10 flex flex-col items-center transition-colors duration-500">

        {/* Inner bevel */}
        <div className="absolute inset-1 border border-white/60 rounded-[3rem] pointer-events-none"></div>

        {/* Dynamic Stickers */}
        {stickers.map((sticker, i) => (
          <div
            key={i}
            className={`${sticker.position} ${sticker.rotate} ${sticker.shape} font-pixel px-3 py-1 border-2 pixel-shadow text-sm z-30 transition-all duration-500`}
            style={{ background: sticker.bg, color: sticker.text, borderColor: sticker.border }}
          >
            {sticker.label}
          </div>
        ))}

        {/* Smiley sticker — always present, themed */}
        <div
          className="absolute -left-8 top-1/2 rounded-full w-12 h-12 border-2 flex items-center justify-center pixel-shadow z-30 transition-all duration-500"
          style={{ background: stickers[0]?.bg || '#D1A23A', borderColor: stickers[0]?.border || '#000' }}
        >
          <span className="font-bold text-xl rotate-90" style={{ color: stickers[0]?.text || '#000' }}>:-)</span>
        </div>

        {/* Screen */}
        <div className="w-full bg-screen-bg rounded-[2rem] mt-2 border-[6px] border-[#313338] h-[50%] mb-4 overflow-hidden relative shadow-inner transition-colors duration-500 z-20">
          {children}
        </div>

        {/* Click Wheel Area */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <div
            ref={wheelRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-64 h-64 bg-ipod-wheel flex items-center justify-center overflow-hidden relative shadow-[0_8px_20px_rgba(0,0,0,0.2)] border-2 border-white/10 transition-all duration-500 touch-none"
            style={{ borderRadius: wheelRadius }}
          >
            {/* Menu Button */}
            <button
              onClick={() => { setIsPlayerOpen(false); router.push('/menu'); }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-18 flex items-start justify-center pt-6 group active:bg-black/20 transition-colors duration-75 rounded-t-full"
            >
              <span
                className="font-pixel tracking-widest text-lg opacity-80 group-hover:opacity-100 group-active:opacity-40 group-active:scale-90 transition-all duration-100 inline-block"
                style={{ color: 'var(--color-wheel-menu-text)' }}
              >
                MENU
              </span>
            </button>

            {/* Rewind Button */}
            <button
              onClick={() => { setIsPlayerOpen(false); prevTrack(); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-22 flex items-center justify-start pl-6 group active:bg-black/20 transition-colors duration-75 "
            >
              <span
                className="opacity-80 group-hover:opacity-100 group-active:opacity-40 group-active:scale-90 transition-all duration-100 inline-block"
                style={{ color: 'var(--color-wheel-icon)' }}
              >
                <SkipBack fill="currentColor" size={28} />
              </span>
            </button>

            {/* Forward Button */}
            <button
              onClick={() => { setIsPlayerOpen(false); nextTrack(); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-22 flex items-center justify-end pr-6 group active:bg-black/20 transition-colors duration-75 "
            >
              <span
                className="opacity-80 group-hover:opacity-100 group-active:opacity-40 group-active:scale-90 transition-all duration-100 inline-block"
                style={{ color: 'var(--color-wheel-icon)' }}
              >
                <SkipForward fill="currentColor" size={28} />
              </span>
            </button>

            {/* Library Button */}
            <button
              onClick={() => { setIsPlayerOpen(false); router.push('/library'); }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-18 flex items-end justify-center pb-6 group active:bg-black/20 transition-colors duration-75 rounded-b-full"
            >
              <span
                className="opacity-80 group-hover:opacity-100 group-active:opacity-40 group-active:scale-90 transition-all duration-100 inline-block"
                style={{ color: 'var(--color-wheel-icon)' }}
              >
                <FolderBookmark size={28} />
              </span>
            </button>

            {/* Center Play Button */}
            <button
              onClick={() => {
                const now = Date.now();
                if (now - lastTapRef.current < 350) {
                  // Double tap — toggle player
                  setIsPlayerOpen(!isPlayerOpen);
                } else {
                  togglePlay();
                }
                lastTapRef.current = now;
              }}
              className="w-24 h-24 rounded-full bg-ipod-wheel-center shadow-inner border border-gray-400 flex items-center justify-center hover:opacity-90 active:opacity-60 active:scale-95 transition-all duration-100 z-10"
            >
              <Play style={{ color: 'var(--color-wheel-icon)' }} className="opacity-80 ml-1" size={32} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom stripe */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between h-2">
        <div className="w-1/4 h-full bg-[#E53935]"></div>
        <div className="w-1/4 h-full bg-[#F5A623]"></div>
        <div className="w-1/4 h-full bg-[#4A90E2]"></div>
        <div className="w-1/4 h-full bg-[#50E3C2]"></div>
      </div>
    </div>
  );
}
