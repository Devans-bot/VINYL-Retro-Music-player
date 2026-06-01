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
  const { activeTheme, stickers, wheelRadius, customLabels, customLabelColors, wheelGradient, screenEffect, accentStripe } = useTheme();
  
  const isLargeIconTheme = activeTheme === 'ARCADE' || activeTheme === 'PS1' || activeTheme === 'NINTENDO_SWITCH';
  const menuTextSize = isLargeIconTheme ? 'text-2xl' : 'text-lg';
  const sideTextSize = isLargeIconTheme ? 'text-xl' : 'text-sm';
  const centerTextSize = isLargeIconTheme ? 'text-3xl' : 'text-xl';
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

  // Determine screen classes based on effect
  const screenClasses = `w-full bg-screen-bg rounded-[2rem] mt-2 border-[6px] border-[#313338] h-[50%] mb-4 overflow-hidden relative shadow-inner transition-colors duration-500 z-20${
    screenEffect === 'crt' ? ' crt-screen' : ''
  }${screenEffect === 'y2k' ? ' y2k-screen' : ''}`;

  // Accent stripe bottom bar
  const stripeColors = accentStripe ?? ['#E53935', '#F5A623', '#4A90E2', '#50E3C2'];
  const isCustomStripe = !!accentStripe;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background stripe top */}
      <div className="absolute top-0 left-0 w-full flex justify-between h-2">
        {stripeColors.map((c, i) => (
          <div key={i} className="flex-1 h-full" style={{ background: c }} />
        ))}
      </div>

      {/* Main iPod Body */}
      <div className="relative w-full max-w-sm aspect-[1/2] max-h-[710px] bg-ipod-body rounded-[4rem] py-3 px-3 border-4 border-black/10 flex flex-col items-center transition-colors duration-500">

        {/* Inner bevel */}
        <div className="absolute inset-1 border border-white/60 rounded-[3rem] pointer-events-none"></div>

        {/* Apple Rainbow vertical stripe on body edge */}
        {screenEffect === 'rainbow' && isCustomStripe && (
          <div className="absolute right-0 top-[15%] bottom-[15%] w-2 flex flex-col overflow-hidden rounded-r-sm z-10">
            {stripeColors.map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>
        )}

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
        <div className={screenClasses}>
          {/* CRT scanline overlay */}
          {screenEffect === 'crt' && (
            <>
              <div className="crt-scanlines absolute inset-0 pointer-events-none z-10" />
              <div className="crt-curve absolute inset-0 pointer-events-none z-10 rounded-[2rem]" />
              <div className="crt-flicker absolute inset-0 pointer-events-none z-10" />
            </>
          )}
          {/* Y2K chrome shine */}
          {screenEffect === 'y2k' && (
            <div className="y2k-shine absolute inset-0 pointer-events-none z-10" />
          )}
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
            style={{ borderRadius: wheelRadius, ...(wheelGradient ? { background: wheelGradient } : {}) }}
          >
            {/* Menu / Top Button */}
            <button
              onClick={() => { setIsPlayerOpen(false); router.push('/menu'); }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-18 flex items-start justify-center pt-6 group active:bg-black/20 transition-colors duration-75 rounded-t-full"
            >
              <span
                className={`font-pixel tracking-widest ${menuTextSize} opacity-90 group-hover:opacity-100 group-active:opacity-40 group-active:scale-90 transition-all duration-100 inline-block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}
                style={{ color: customLabelColors?.menu ?? 'var(--color-wheel-menu-text)' }}
              >
                {customLabels?.menu ?? 'MENU'}
              </span>
            </button>

            {/* Prev / Left Button */}
            <button
              onClick={() => { setIsPlayerOpen(false); prevTrack(); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-22 flex items-center justify-start pl-4 group active:bg-black/20 transition-colors duration-75"
            >
              {customLabels?.prev ? (
                <span
                  className={`font-pixel ${sideTextSize} font-bold opacity-90 group-hover:opacity-100 group-active:opacity-40 transition-all duration-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}
                  style={{ color: customLabelColors?.prev ?? 'var(--color-wheel-icon)' }}
                >
                  {customLabels.prev}
                </span>
              ) : (
                <span
                  className="opacity-80 group-hover:opacity-100 group-active:opacity-40 group-active:scale-90 transition-all duration-100 inline-block"
                  style={{ color: 'var(--color-wheel-icon)' }}
                >
                  <SkipBack fill="currentColor" size={28} />
                </span>
              )}
            </button>

            {/* Next / Right Button */}
            <button
              onClick={() => { setIsPlayerOpen(false); nextTrack(); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-22 flex items-center justify-end pr-4 group active:bg-black/20 transition-colors duration-75"
            >
              {customLabels?.next ? (
                <span
                  className={`font-pixel ${sideTextSize} font-bold opacity-90 group-hover:opacity-100 group-active:opacity-40 transition-all duration-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}
                  style={{ color: customLabelColors?.next ?? 'var(--color-wheel-icon)' }}
                >
                  {customLabels.next}
                </span>
              ) : (
                <span
                  className="opacity-80 group-hover:opacity-100 group-active:opacity-40 group-active:scale-90 transition-all duration-100 inline-block"
                  style={{ color: 'var(--color-wheel-icon)' }}
                >
                  <SkipForward fill="currentColor" size={28} />
                </span>
              )}
            </button>

            {/* Library / Bottom Button */}
            <button
              onClick={() => { setIsPlayerOpen(false); router.push('/library'); }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-18 flex items-end justify-center pb-6 group active:bg-black/20 transition-colors duration-75 rounded-b-full"
            >
              {customLabels?.lib ? (
                <span
                  className={`font-pixel ${sideTextSize} font-bold opacity-90 group-hover:opacity-100 group-active:opacity-40 transition-all duration-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}
                  style={{ color: customLabelColors?.lib ?? 'var(--color-wheel-icon)' }}
                >
                  {customLabels.lib}
                </span>
              ) : (
                <span
                  className="opacity-80 group-hover:opacity-100 group-active:opacity-40 group-active:scale-90 transition-all duration-100 inline-block"
                  style={{ color: 'var(--color-wheel-icon)' }}
                >
                  <FolderBookmark size={28} />
                </span>
              )}
            </button>

            {/* Center Button */}
            <button
              onClick={() => {
                const now = Date.now();
                if (now - lastTapRef.current < 350) {
                  setIsPlayerOpen(!isPlayerOpen);
                } else {
                  togglePlay();
                }
                lastTapRef.current = now;
              }}
              className="w-24 h-24 rounded-full bg-ipod-wheel-center shadow-inner border border-gray-400 flex items-center justify-center hover:opacity-90 active:opacity-60 active:scale-95 transition-all duration-100 z-10"
            >
              {customLabels?.center ? (
                <span
                  className={`font-pixel ${centerTextSize} font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]`}
                  style={{ color: customLabelColors?.center ?? 'var(--color-wheel-icon)' }}
                >
                  {customLabels.center}
                </span>
              ) : (
                <Play style={{ color: 'var(--color-wheel-icon)' }} className="opacity-80 ml-1" size={32} fill="currentColor" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom stripe */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between h-2">
        {stripeColors.map((c, i) => (
          <div key={i} className="flex-1 h-full" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}
