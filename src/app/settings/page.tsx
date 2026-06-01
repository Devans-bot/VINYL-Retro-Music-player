'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Check, Sun, Moon } from 'lucide-react';
import { useTheme, ThemeName } from '@/components/ThemeProvider';

export default function Settings() {
  const { activeTheme, setTheme, nightMode, setNightMode } = useTheme();

  const themes: { id: ThemeName; title: string; subtitle: string; color: string }[] = [
    { id: 'CLASSIC', title: 'CLASSIC', subtitle: 'Silver Pod', color: 'bg-[#C0C3C6]' },
    { id: 'GROOVY', title: 'GROOVY', subtitle: '70s Gold', color: 'bg-[#B58C2B]' },
    { id: 'PSYCHEDELIC', title: 'PSYCHEDELIC', subtitle: 'Purple Haze', color: 'bg-[#7447C1]' },
    { id: 'WOODSTOCK', title: 'WOODSTOCK', subtitle: 'Forest Green', color: 'bg-[#386644]' },
    { id: 'HOT_WAX', title: 'HOT WAX', subtitle: 'Red Vinyl', color: 'bg-[#B33539]' },
    { id: 'RETRO_RAINBOW', title: 'RAINBOW', subtitle: '90s Arcade', color: 'bg-[#2BC2B6]' },
  ];

  const specialThemes: { id: ThemeName; title: string; subtitle: string; bodyColor: string; wheelColor: string; wheelGradient?: string; screenColor: string; emoji: string; wheelRadius: string; labelColor: string; subtitleColor: string }[] = [
    {
      id: 'GAMEBOY',
      title: 'GAME BOY',
      subtitle: '★ Limited Edition',
      bodyColor: '#8B9E7A',
      wheelColor: '#2D2D2A',
      screenColor: '#9BBC0F',
      emoji: '🎮',
      wheelRadius: '28%',
      labelColor: '#A8FF78',
      subtitleColor: '#A8FF78',
    },
    {
      id: 'MACINTOSH',
      title: 'MACINTOSH',
      subtitle: '★ Limited Edition',
      bodyColor: '#E8E4D9',
      wheelColor: '#C8C4B8',
      screenColor: '#F5F0E8',
      emoji: '🖥️',
      wheelRadius: '22%',
      labelColor: '#1A1208',
      subtitleColor: '#6B5B3E',
    },
    {
      id: 'KAWAII',
      title: 'KAWAII ♡',
      subtitle: '★ Limited Edition',
      bodyColor: '#FFB7C5',
      wheelColor: '#FF85A1',
      screenColor: '#FDE8F5',
      emoji: '🌸',
      wheelRadius: '50%',
      labelColor: '#fff',
      subtitleColor: '#FFD6E5',
    },
    {
      id: 'TEKKEN',
      title: 'TEKKEN',
      subtitle: '★ Limited Edition',
      bodyColor: '#0D0D1A',
      wheelColor: '#1A1A2E',
      screenColor: '#0A0A1F',
      emoji: '⚡',
      wheelRadius: '12%',
      labelColor: '#FFD700',
      subtitleColor: '#00D4FF',
    },
    {
      id: 'WALKMAN',
      title: 'WALKMAN',
      subtitle: '📼 Sony 1980s',
      bodyColor: '#C0C0C8',
      wheelColor: '#A8A8B0',
      screenColor: '#1A1A2E',
      emoji: '▶',
      wheelRadius: '18%',
      labelColor: '#FF6600',
      subtitleColor: '#FF6600',
    },
    {
      id: 'CRT',
      title: 'CRT TV',
      subtitle: '📺 Static & Scanlines',
      bodyColor: '#3D3D2E',
      wheelColor: '#2E2E20',
      screenColor: '#050F05',
      emoji: '📺',
      wheelRadius: '8%',
      labelColor: '#00FF41',
      subtitleColor: '#00FF41',
    },
    {
      id: 'APPLE_RAINBOW',
      title: 'APPLE',
      subtitle: '🍎 Rainbow 1984',
      bodyColor: '#EDE8DC',
      wheelColor: '#D4CFBF',
      screenColor: '#F0EBE0',
      emoji: '🌈',
      wheelRadius: '24%',
      labelColor: '#1A1A1A',
      subtitleColor: '#4A4035',
    },
    {
      id: 'Y2K',
      title: 'Y2K',
      subtitle: '💿 Winamp Era',
      bodyColor: '#B8C8D8',
      wheelColor: '#8AAABB',
      screenColor: '#F0F8FF',
      emoji: '💿',
      wheelRadius: '30%',
      labelColor: '#003080',
      subtitleColor: '#0055CC',
    },
    {
      id: 'ARCADE',
      title: 'ARCADE DX',
      subtitle: '👾 Insert Coin',
      bodyColor: '#0A0A0A',
      wheelColor: '#1A0000',
      screenColor: '#0A0A0A',
      emoji: '👾',
      wheelRadius: '12%',
      labelColor: '#FFD700',
      subtitleColor: '#FF2200',
    },
    {
      id: 'PS1',
      title: 'PS ONE',
      subtitle: '🕹 △ ○ ✕ □',
      bodyColor: '#BEBEC8',
      wheelColor: '#A8A8B2',
      screenColor: '#E8E8F0',
      emoji: '🎮',
      wheelRadius: '50%',
      labelColor: '#282828',
      subtitleColor: '#003791',
    },
    {
      id: 'NINTENDO_SWITCH',
      title: 'SWITCH',
      subtitle: '🎮 Joy-Con Edition',
      bodyColor: '#2D2D2D',
      wheelColor: '#E4000F',
      wheelGradient: 'linear-gradient(to right, #E4000F 50%, #0AB9E6 50%)',
      screenColor: '#1A1A1A',
      emoji: '🕹',
      wheelRadius: '50%',
      labelColor: '#FFFFFF',
      subtitleColor: '#0AB9E6',
    },
  ];

  return (
    <div className="flex flex-col h-full font-sans px-3 overflow-y-auto no-scrollbar pb-8">
      <div className="absolute top-0 left-0 w-full flex justify-between h-1 z-10">
        <div className="w-1/4 h-full bg-[#E53935]"></div>
        <div className="w-1/4 h-full bg-[#F5A623]"></div>
        <div className="w-1/4 h-full bg-[#4A90E2]"></div>
        <div className="w-1/4 h-full bg-[#50E3C2]"></div>
      </div>
      {/* Header */}
      <Link href="/" className="hover:opacity-70 transition-opacity">
        <ChevronLeft size={24} className="text-screen-border mr-2 mt-2" strokeWidth={2.5} />
      </Link>

      {/* Regular Themes */}
      <div className="mb-5">
        <h2 className="font-pixel text-black text-sm tracking-widest uppercase mb-3">
          RETRO THEMES
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`bg-white rounded-xl p-3 flex items-center shadow-sm transition-all border-2 active:scale-95 active:opacity-80 duration-100 ${isActive ? 'border-retro-red' : 'border-screen-header hover:border-retro-accent'}`}
              >
                <div className={`w-6 h-6 rounded-full ${theme.color} shadow-inner border border-black/10 mr-3 flex-shrink-0`}></div>
                <div className="flex-1 flex flex-col items-start overflow-hidden">
                  <span className="font-pixel text-xs text-screen-border truncate w-full text-left">{theme.title}</span>
                  <span className="text-[10px] text-retro-accent/80 font-medium truncate w-full text-left">{theme.subtitle}</span>
                </div>
                {isActive && (
                  <Check size={16} className="text-retro-red ml-1 flex-shrink-0" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Limited Edition Themes */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-pixel text-black text-sm tracking-widest uppercase">LIMITED EDITION</h2>
          <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-pixel text-[8px] px-2 py-0.5 rounded-full tracking-widest border border-yellow-300 shadow-sm">✦ RARE</span>
        </div>
        <div className="flex flex-col gap-3">
          {specialThemes.map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`relative rounded-2xl overflow-hidden shadow-md transition-all active:scale-95 active:opacity-80 duration-100 border-2 ${isActive ? 'border-yellow-400' : 'border-black/10 hover:border-yellow-300'}`}
              >
                {/* Mini iPod Preview */}
                <div className="flex items-center gap-3 p-3" style={{ background: theme.bodyColor }}>
                  {/* Tiny screen preview */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border-2 border-black/20" style={{ background: theme.screenColor }}>
                    {theme.emoji}
                  </div>
                  {/* Tiny wheel preview */}
                  <div className="w-10 h-10 flex items-center justify-center shadow-md border border-black/20" style={{ background: theme.wheelGradient ?? theme.wheelColor, borderRadius: theme.wheelRadius }}>
                    <div className="w-4 h-4 rounded-full border border-black/20" style={{ background: theme.bodyColor }}></div>
                  </div>
                  {/* Labels */}
                  <div className="flex-1 flex flex-col items-start">
                    <span className="font-pixel text-sm tracking-widest" style={{ color: theme.labelColor }}>{theme.title}</span>
                    <span className="text-[9px] tracking-wider mt-0.5" style={{ color: theme.subtitleColor }}>{theme.subtitle}</span>
                  </div>
                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-sm">
                      <Check size={14} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day / Night Toggle */}
      <div className="mb-5">
        <h2 className="font-pixel text-black text-sm tracking-widest uppercase mb-3">DISPLAY</h2>
        <div className="flex rounded-xl overflow-hidden border-2 border-screen-header shadow-sm">
          <button
            onClick={() => setNightMode(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all duration-300 active:opacity-70 ${
              !nightMode ? 'bg-amber-400 text-white' : 'bg-white text-screen-border/60 hover:bg-amber-50'
            }`}
          >
            <Sun size={16} className={!nightMode ? 'text-white' : 'text-amber-400'} />
            <span className="font-pixel text-xs tracking-widest">DAY</span>
          </button>
          <div className="w-px bg-screen-header"></div>
          <button
            onClick={() => setNightMode(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all duration-300 active:opacity-70 ${
              nightMode ? 'bg-slate-900 text-white' : 'bg-white text-screen-border/60 hover:bg-slate-50'
            }`}
          >
            <Moon size={16} className={nightMode ? 'text-indigo-300' : 'text-slate-400'} />
            <span className="font-pixel text-xs tracking-widest">NIGHT</span>
          </button>
        </div>
      </div>

      {/* Playback Section */}
      <div>
        <h2 className="font-pixel text-screen-header text-sm tracking-widest uppercase mb-3">
          PLAYBACK
        </h2>
        <div className="bg-white rounded-xl border-2 border-screen-header p-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-retro-accent text-white flex items-center justify-center mr-3 shadow-inner">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <span className="font-pixel text-sm text-screen-border">Shuffle Mode</span>
          </div>
          <div className="w-10 h-6 bg-screen-header rounded-full relative cursor-pointer shadow-inner">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
          </div>
        </div>
      </div>

    </div>
  );
}
