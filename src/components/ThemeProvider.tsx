'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName =
  | 'CLASSIC' | 'GROOVY' | 'PSYCHEDELIC' | 'WOODSTOCK' | 'HOT_WAX' | 'RETRO_RAINBOW'
  | 'GAMEBOY' | 'MACINTOSH' | 'KAWAII' | 'TEKKEN'
  | 'WALKMAN' | 'CRT' | 'APPLE_RAINBOW' | 'Y2K' | 'ARCADE' | 'PS1'
  | 'NINTENDO_SWITCH';

interface Sticker {
  label: string;
  bg: string;
  text: string;
  border: string;
  position: string; // tailwind position classes
  rotate: string;
  shape: string; // rounded-md, rounded-full, etc.
  emoji?: string;
}

interface CustomLabels {
  menu?: string;
  prev?: string;
  next?: string;
  lib?: string;
  center?: string;
}

interface CustomLabelColors {
  menu?: string;
  prev?: string;
  next?: string;
  lib?: string;
  center?: string;
}

interface ThemeConfig {
  '--color-ipod-body': string;
  '--color-ipod-wheel': string;
  '--color-ipod-wheel-center': string;
  '--color-ipod-body-border': string;
  '--color-wheel-icon': string;
  '--color-wheel-menu-text': string;
  '--color-screen-bg': string;
  '--color-screen-header': string;
  '--color-screen-border': string;
  '--color-retro-accent': string;
  '--wheel-border-radius': string;
  stickers: Sticker[];
  customLabels?: CustomLabels;
  customLabelColors?: CustomLabelColors;
  wheelGradient?: string;
  screenEffect?: 'crt' | 'rainbow' | 'y2k' | 'none';
  accentStripe?: string[];
}

const defaultStickers: Sticker[] = [
  { label: 'AC/DC', bg: '#D93844', text: '#fff', border: '#000', position: 'absolute -left-6 top-1/4', rotate: '-rotate-12', shape: 'rounded-md', emoji: '' },
  { label: 'STONES', bg: '#D93844', text: '#fff', border: '#fff', position: 'absolute -right-4 top-1/5', rotate: 'rotate-6', shape: 'rounded-md', emoji: '' },
  { label: 'ROCK*', bg: '#D97D3A', text: '#000', border: '#000', position: 'absolute -right-6 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-md', emoji: '' },
  { label: 'MTV', bg: '#D97D3A', text: '#000', border: '#000', position: 'absolute -left-6 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-md', emoji: '' },
  { label: '★ VINYL', bg: '#69429E', text: '#fff', border: '#fff', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-md', emoji: '' },
];

const themes: Record<ThemeName, ThemeConfig> = {
  CLASSIC: {
    '--color-ipod-body': '#D2D2D2',
    '--color-ipod-wheel': '#D5D5D5',
    '--color-ipod-wheel-center': '#C0C3C6',
    '--color-ipod-body-border': 'rgba(0,0,0,0.1)',
    '--color-wheel-icon': '#ffffff',
    '--color-wheel-menu-text': '#ffffff',
    '--color-screen-bg': '#D9EAF0',
    '--color-screen-header': '#B3CFD9',
    '--color-screen-border': '#192131',
    '--color-retro-accent': '#296073',
    '--wheel-border-radius': '50%',
    stickers: defaultStickers,
  },
  GROOVY: {
    '--color-ipod-body': '#C89F3C',
    '--color-ipod-wheel': '#C49830',
    '--color-ipod-wheel-center': '#9F7920',
    '--color-ipod-body-border': 'rgba(0,0,0,0.15)',
    '--color-wheel-icon': '#fff8e0',
    '--color-wheel-menu-text': '#fff8e0',
    '--color-screen-bg': '#EAD7A1',
    '--color-screen-header': '#D4C08A',
    '--color-screen-border': '#3B2800',
    '--color-retro-accent': '#8B6914',
    '--wheel-border-radius': '50%',
    stickers: defaultStickers,
  },
  PSYCHEDELIC: {
    '--color-ipod-body': '#8558D3',
    '--color-ipod-wheel': '#8553D6',
    '--color-ipod-wheel-center': '#6337B0',
    '--color-ipod-body-border': 'rgba(0,0,0,0.1)',
    '--color-wheel-icon': '#f0e6ff',
    '--color-wheel-menu-text': '#f0e6ff',
    '--color-screen-bg': '#E5D9F2',
    '--color-screen-header': '#CEBFE0',
    '--color-screen-border': '#3B1A6E',
    '--color-retro-accent': '#6337B0',
    '--wheel-border-radius': '50%',
    stickers: defaultStickers,
  },
  WOODSTOCK: {
    '--color-ipod-body': '#467B54',
    '--color-ipod-wheel': '#498555',
    '--color-ipod-wheel-center': '#2B5235',
    '--color-ipod-body-border': 'rgba(0,0,0,0.15)',
    '--color-wheel-icon': '#e8f5e9',
    '--color-wheel-menu-text': '#e8f5e9',
    '--color-screen-bg': '#D4E2D6',
    '--color-screen-header': '#BDCDBD',
    '--color-screen-border': '#1B3A22',
    '--color-retro-accent': '#2B5235',
    '--wheel-border-radius': '50%',
    stickers: defaultStickers,
  },
  HOT_WAX: {
    '--color-ipod-body': '#AC3939',
    '--color-ipod-wheel': '#B03838',
    '--color-ipod-wheel-center': '#761A1A',
    '--color-ipod-body-border': 'rgba(0,0,0,0.15)',
    '--color-wheel-icon': '#ffe8e8',
    '--color-wheel-menu-text': '#ffe8e8',
    '--color-screen-bg': '#F2D3D4',
    '--color-screen-header': '#E0BEBF',
    '--color-screen-border': '#4A0A0A',
    '--color-retro-accent': '#761A1A',
    '--wheel-border-radius': '50%',
    stickers: defaultStickers,
  },
  RETRO_RAINBOW: {
    '--color-ipod-body': '#2BC2B6',
    '--color-ipod-wheel': '#23A499',
    '--color-ipod-wheel-center': '#1A7B72',
    '--color-ipod-body-border': 'rgba(0,0,0,0.1)',
    '--color-wheel-icon': '#e0fffe',
    '--color-wheel-menu-text': '#e0fffe',
    '--color-screen-bg': '#FFF175',
    '--color-screen-header': '#E5D765',
    '--color-screen-border': '#1A3A38',
    '--color-retro-accent': '#1A7B72',
    '--wheel-border-radius': '50%',
    stickers: defaultStickers,
  },

  // ──── LIMITED EDITION ────
  GAMEBOY: {
    '--color-ipod-body': '#8B9E7A',
    '--color-ipod-wheel': '#2D2D2A',
    '--color-ipod-wheel-center': '#1A1A17',
    '--color-ipod-body-border': 'rgba(0,0,0,0.35)',
    '--color-wheel-icon': '#A8FF78',
    '--color-wheel-menu-text': '#A8FF78',
    '--color-screen-bg': '#9BBC0F',
    '--color-screen-header': '#8BAC0F',
    '--color-screen-border': '#0F380F',
    '--color-retro-accent': '#306230',
    '--wheel-border-radius': '28%',   // squircle d-pad feel
    stickers: [
      { label: 'START', bg: '#0F380F', text: '#A8FF78', border: '#A8FF78', position: 'absolute -left-6 top-1/4', rotate: '-rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: 'SELECT', bg: '#306230', text: '#9BBC0F', border: '#9BBC0F', position: 'absolute -right-6 top-1/5', rotate: 'rotate-6', shape: 'rounded-sm', emoji: '' },
      { label: 'GAME OVER', bg: '#0F380F', text: '#A8FF78', border: '#000', position: 'absolute -right-8 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-none', emoji: '' },
      { label: '8-BIT', bg: '#8BAC0F', text: '#0F380F', border: '#000', position: 'absolute -left-6 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-none', emoji: '' },
      { label: '★ RETRO', bg: '#306230', text: '#A8FF78', border: '#A8FF78', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-sm', emoji: '' },
    ],
  },
  MACINTOSH: {
    '--color-ipod-body': '#E8E4D9',
    '--color-ipod-wheel': '#C8C4B8',
    '--color-ipod-wheel-center': '#A09C90',
    '--color-ipod-body-border': 'rgba(100,90,70,0.3)',
    '--color-wheel-icon': '#1A1A1A',
    '--color-wheel-menu-text': '#1A1A1A',
    '--color-screen-bg': '#F5F0E8',
    '--color-screen-header': '#D0C8BC',
    '--color-screen-border': '#1A1208',
    '--color-retro-accent': '#555040',
    '--wheel-border-radius': '22%',   // classic Mac rounded-rectangle
    stickers: [
      { label: 'THINK', bg: '#1A1208', text: '#E8E4D9', border: '#555040', position: 'absolute -left-6 top-1/4', rotate: '-rotate-12', shape: 'rounded-md', emoji: '' },
      { label: 'DIFFERENT', bg: '#555040', text: '#F5F0E8', border: '#1A1208', position: 'absolute -right-8 top-1/5', rotate: 'rotate-6', shape: 'rounded-md', emoji: '' },
      { label: '1984', bg: '#1A1208', text: '#E8E4D9', border: '#555040', position: 'absolute -right-6 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: 'MAC OS', bg: '#D0C8BC', text: '#1A1208', border: '#1A1208', position: 'absolute -left-6 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-sm', emoji: '' },
      { label: '⌘ CMD', bg: '#555040', text: '#F5F0E8', border: '#1A1208', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-md', emoji: '' },
    ],
  },
  KAWAII: {
    '--color-ipod-body': '#FFB7C5',       // cherry blossom pink
    '--color-ipod-wheel': '#FF85A1',      // hot pink wheel
    '--color-ipod-wheel-center': '#FF4D80', // deep pink center
    '--color-ipod-body-border': 'rgba(255,100,150,0.25)',
    '--color-wheel-icon': '#fff0f5',      // petal white icon
    '--color-wheel-menu-text': '#fff0f5',
    '--color-screen-bg': '#FDE8F5',       // cotton candy lavender
    '--color-screen-header': '#F5C9E8',   // soft pink header
    '--color-screen-border': '#8B1A4A',   // deep rose text
    '--color-retro-accent': '#E0528A',    // hot pink accent
    '--wheel-border-radius': '50%',       // stays circular but heavily stylized
    stickers: [
      { label: '♡ CUTE', bg: '#FF4D80', text: '#fff', border: '#FFB7C5', position: 'absolute -left-6 top-1/4', rotate: '-rotate-12', shape: 'rounded-full', emoji: '' },
      { label: 'UwU', bg: '#fff0f5', text: '#FF4D80', border: '#FF85A1', position: 'absolute -right-6 top-1/5', rotate: 'rotate-6', shape: 'rounded-full', emoji: '' },
      { label: '✿ YUME', bg: '#E0528A', text: '#fff', border: '#FFB7C5', position: 'absolute -right-8 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-full', emoji: '' },
      { label: 'KAWAII', bg: '#FFB7C5', text: '#8B1A4A', border: '#FF4D80', position: 'absolute -left-6 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-full', emoji: '' },
      { label: '★ IDOL', bg: '#FF85A1', text: '#fff', border: '#fff', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-full', emoji: '' },
    ],
  },
  TEKKEN: {
    '--color-ipod-body': '#0D0D1A',       // deep night black
    '--color-ipod-wheel': '#1A1A2E',      // dark indigo wheel
    '--color-ipod-wheel-center': '#16213E', // midnight blue center
    '--color-ipod-body-border': 'rgba(0,180,255,0.3)',
    '--color-wheel-icon': '#00D4FF',      // electric cyan icon
    '--color-wheel-menu-text': '#FFD700', // gold MENU text
    '--color-screen-bg': '#0A0A1F',       // ultra dark blue-black screen
    '--color-screen-header': '#111130',   // slightly lighter header
    '--color-screen-border': '#00D4FF',   // cyan text
    '--color-retro-accent': '#FFD700',    // gold accent
    '--wheel-border-radius': '12%',       // square/rectangular fighting pad feel
    stickers: [
      { label: 'TEKKEN', bg: '#FFD700', text: '#0D0D1A', border: '#FF4500', position: 'absolute -left-6 top-1/4', rotate: '-rotate-12', shape: 'rounded-none', emoji: '' },
      { label: 'MISHIMA', bg: '#FF4500', text: '#FFD700', border: '#FFD700', position: 'absolute -right-8 top-1/5', rotate: 'rotate-6', shape: 'rounded-none', emoji: '' },
      { label: 'K.O!', bg: '#00D4FF', text: '#0D0D1A', border: '#FFD700', position: 'absolute -right-6 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: '⚡ COMBO', bg: '#FFD700', text: '#0D0D1A', border: '#FF4500', position: 'absolute -left-7 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-none', emoji: '' },
      { label: 'IRON FIST', bg: '#FF4500', text: '#FFD700', border: '#00D4FF', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-sm', emoji: '' },
    ],
  },

  // ──── NEW EDITION THEMES ────
  WALKMAN: {
    '--color-ipod-body': '#C0C0C8',
    '--color-ipod-wheel': '#A8A8B0',
    '--color-ipod-wheel-center': '#303050',
    '--color-ipod-body-border': 'rgba(0,0,0,0.2)',
    '--color-wheel-icon': '#FF6600',
    '--color-wheel-menu-text': '#FF6600',
    '--color-screen-bg': '#1A1A2E',
    '--color-screen-header': '#0F0F1A',
    '--color-screen-border': '#FF6600',
    '--color-retro-accent': '#FF6600',
    '--wheel-border-radius': '18%',
    customLabels: { menu: 'STOP', prev: 'REW', next: 'FF', lib: 'MENU', center: 'PLAY' },
    screenEffect: 'none',
    stickers: [
      { label: 'WALKMAN', bg: '#FF6600', text: '#fff', border: '#000', position: 'absolute -left-8 top-1/4', rotate: '-rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: 'STEREO', bg: '#1A1A2E', text: '#FF6600', border: '#FF6600', position: 'absolute -right-6 top-1/5', rotate: 'rotate-6', shape: 'rounded-sm', emoji: '' },
      { label: '◼ TAPE', bg: '#303050', text: '#fff', border: '#FF6600', position: 'absolute -right-8 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: 'DOLBY B', bg: '#C0C0C8', text: '#303050', border: '#303050', position: 'absolute -left-6 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-sm', emoji: '' },
      { label: '▶ PLAY', bg: '#FF6600', text: '#fff', border: '#000', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-sm', emoji: '' },
    ],
  },
  CRT: {
    '--color-ipod-body': '#3D3D2E',
    '--color-ipod-wheel': '#2E2E20',
    '--color-ipod-wheel-center': '#1A1A10',
    '--color-ipod-body-border': 'rgba(0,0,0,0.4)',
    '--color-wheel-icon': '#00FF41',
    '--color-wheel-menu-text': '#00FF41',
    '--color-screen-bg': '#050F05',
    '--color-screen-header': '#0A1A0A',
    '--color-screen-border': '#00FF41',
    '--color-retro-accent': '#00FF41',
    '--wheel-border-radius': '8%',
    screenEffect: 'crt',
    stickers: [
      { label: 'CH 01', bg: '#00FF41', text: '#050F05', border: '#050F05', position: 'absolute -left-7 top-1/4', rotate: '-rotate-12', shape: 'rounded-none', emoji: '' },
      { label: 'UHF', bg: '#050F05', text: '#00FF41', border: '#00FF41', position: 'absolute -right-5 top-1/5', rotate: 'rotate-6', shape: 'rounded-none', emoji: '' },
      { label: 'STATIC', bg: '#3D3D2E', text: '#00FF41', border: '#00FF41', position: 'absolute -right-8 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-none', emoji: '' },
      { label: 'NO SIGNAL', bg: '#1A1A10', text: '#00FF41', border: '#00FF41', position: 'absolute -left-8 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-none', emoji: '' },
      { label: '📺 ON AIR', bg: '#00FF41', text: '#050F05', border: '#050F05', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-none', emoji: '' },
    ],
  },
  APPLE_RAINBOW: {
    '--color-ipod-body': '#EDE8DC',
    '--color-ipod-wheel': '#D4CFBF',
    '--color-ipod-wheel-center': '#B0AA99',
    '--color-ipod-body-border': 'rgba(100,80,50,0.25)',
    '--color-wheel-icon': '#1A1A1A',
    '--color-wheel-menu-text': '#1A1A1A',
    '--color-screen-bg': '#F0EBE0',
    '--color-screen-header': '#DDD8CA',
    '--color-screen-border': '#1A1A1A',
    '--color-retro-accent': '#4A4035',
    '--wheel-border-radius': '24%',
    screenEffect: 'rainbow',
    accentStripe: ['#FC0D1B','#FF8000','#FFED00','#51B749','#1A6FC4','#9B26AF'],
    stickers: [
      { label: '⌘ THINK', bg: '#1A1A1A', text: '#EDE8DC', border: '#4A4035', position: 'absolute -left-6 top-1/4', rotate: '-rotate-12', shape: 'rounded-md', emoji: '' },
      { label: 'DIFFERENT', bg: '#4A4035', text: '#EDE8DC', border: '#1A1A1A', position: 'absolute -right-8 top-1/5', rotate: 'rotate-6', shape: 'rounded-md', emoji: '' },
      { label: '1984', bg: '#1A1A1A', text: '#EDE8DC', border: '#4A4035', position: 'absolute -right-6 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: 'APPLE II', bg: '#DDD8CA', text: '#1A1A1A', border: '#1A1A1A', position: 'absolute -left-6 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-sm', emoji: '' },
      { label: '🍎 BYTE', bg: '#4A4035', text: '#EDE8DC', border: '#1A1A1A', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-md', emoji: '' },
    ],
  },
  Y2K: {
    '--color-ipod-body': '#B8C8D8',
    '--color-ipod-wheel': '#8AAABB',
    '--color-ipod-wheel-center': '#1A3A5A',
    '--color-ipod-body-border': 'rgba(0,80,160,0.2)',
    '--color-wheel-icon': '#00AAFF',
    '--color-wheel-menu-text': '#00AAFF',
    '--color-screen-bg': '#F0F8FF',
    '--color-screen-header': '#D0E8FF',
    '--color-screen-border': '#003080',
    '--color-retro-accent': '#0055CC',
    '--wheel-border-radius': '30%',
    screenEffect: 'y2k',
    stickers: [
      { label: 'WINAMP', bg: '#1A3A5A', text: '#00AAFF', border: '#00AAFF', position: 'absolute -left-7 top-1/4', rotate: '-rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: 'MP3', bg: '#00AAFF', text: '#fff', border: '#1A3A5A', position: 'absolute -right-5 top-1/5', rotate: 'rotate-6', shape: 'rounded-sm', emoji: '' },
      { label: 'Y2K ✓', bg: '#B8C8D8', text: '#1A3A5A', border: '#1A3A5A', position: 'absolute -right-8 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: '128kbps', bg: '#1A3A5A', text: '#00AAFF', border: '#00AAFF', position: 'absolute -left-8 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-sm', emoji: '' },
      { label: '💿 BURN', bg: '#00AAFF', text: '#fff', border: '#1A3A5A', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-sm', emoji: '' },
    ],
  },
  ARCADE: {
    '--color-ipod-body': '#0A0A0A',
    '--color-ipod-wheel': '#1A0000',
    '--color-ipod-wheel-center': '#CC0000',
    '--color-ipod-body-border': 'rgba(255,0,0,0.3)',
    '--color-wheel-icon': '#FFD700',
    '--color-wheel-menu-text': '#FFD700',
    '--color-screen-bg': '#0A0A0A',
    '--color-screen-header': '#150000',
    '--color-screen-border': '#FFD700',
    '--color-retro-accent': '#FF2200',
    '--wheel-border-radius': '12%',
    customLabels: { menu: 'START', prev: '◀◀', next: '▶▶', lib: 'SELECT', center: '●' },
    screenEffect: 'none',
    stickers: [
      { label: 'INSERT COIN', bg: '#FFD700', text: '#0A0A0A', border: '#FF2200', position: 'absolute -left-8 top-1/4', rotate: '-rotate-12', shape: 'rounded-none', emoji: '' },
      { label: 'PRESS START', bg: '#FF2200', text: '#FFD700', border: '#FFD700', position: 'absolute -right-9 top-1/5', rotate: 'rotate-6', shape: 'rounded-none', emoji: '' },
      { label: 'PLAYER 1', bg: '#0A0A0A', text: '#FFD700', border: '#FFD700', position: 'absolute -right-7 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-none', emoji: '' },
      { label: 'HI-SCORE', bg: '#FFD700', text: '#0A0A0A', border: '#FF2200', position: 'absolute -left-7 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-none', emoji: '' },
      { label: '👾 GAME', bg: '#FF2200', text: '#FFD700', border: '#0A0A0A', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-none', emoji: '' },
    ],
  },
  PS1: {
    '--color-ipod-body': '#BEBEC8',
    '--color-ipod-wheel': '#A8A8B2',
    '--color-ipod-wheel-center': '#282828',
    '--color-ipod-body-border': 'rgba(0,0,0,0.2)',
    '--color-wheel-icon': '#F0F0F0',
    '--color-wheel-menu-text': '#F0F0F0',
    '--color-screen-bg': '#E8E8F0',
    '--color-screen-header': '#C8C8D8',
    '--color-screen-border': '#282828',
    '--color-retro-accent': '#003791',
    '--wheel-border-radius': '50%',
    customLabels: { menu: '△', prev: '□', next: '○', lib: '✕', center: '▶' },
    screenEffect: 'none',
    stickers: [
      { label: '△ ○ ✕ □', bg: '#282828', text: '#F0F0F0', border: '#003791', position: 'absolute -left-8 top-1/4', rotate: '-rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: 'PS ONE', bg: '#003791', text: '#fff', border: '#282828', position: 'absolute -right-7 top-1/5', rotate: 'rotate-6', shape: 'rounded-sm', emoji: '' },
      { label: 'MEMORY', bg: '#BEBEC8', text: '#282828', border: '#282828', position: 'absolute -right-8 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: 'DUALSHOCK', bg: '#282828', text: '#F0F0F0', border: '#003791', position: 'absolute -left-8 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-sm', emoji: '' },
      { label: '🎮 1998', bg: '#003791', text: '#fff', border: '#282828', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-sm', emoji: '' },
    ],
  },

  // ──── NINTENDO SWITCH ────
  NINTENDO_SWITCH: {
    '--color-ipod-body': '#2D2D2D',          // Switch dark gray chassis
    '--color-ipod-wheel': '#E4000F',          // fallback (overridden by gradient)
    '--color-ipod-wheel-center': '#1A1A1A',   // Home button dark
    '--color-ipod-body-border': 'rgba(0,0,0,0.4)',
    '--color-wheel-icon': '#FFFFFF',
    '--color-wheel-menu-text': '#FFFFFF',
    '--color-screen-bg': '#1A1A1A',           // Switch OLED dark
    '--color-screen-header': '#111111',
    '--color-screen-border': '#E4000F',       // red accent from left Joy-Con
    '--color-retro-accent': '#0AB9E6',        // blue from right Joy-Con
    '--wheel-border-radius': '50%',
    // Split left=red (Joy-Con L) / right=blue (Joy-Con R)
    wheelGradient: 'linear-gradient(to right, #E4000F 50%, #0AB9E6 50%)',
    // Face buttons: Y=green(left), X=blue(top), A=red(right), B=yellow(bottom)
    customLabels: { menu: 'X', prev: 'Y', next: 'A', lib: 'B', center: '⌂' },
    customLabelColors: {
      menu: '#40C4FF',   // X — blue
      prev: '#69B035',   // Y — green
      next: '#FF3D3D',   // A — red
      lib: '#F8C300',    // B — yellow
      center: '#ffffff',
    },
    screenEffect: 'none',
    stickers: [
      { label: 'NINTENDO', bg: '#E4000F', text: '#fff', border: '#000', position: 'absolute -left-8 top-1/4', rotate: '-rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: 'SWITCH', bg: '#0AB9E6', text: '#fff', border: '#000', position: 'absolute -right-7 top-1/5', rotate: 'rotate-6', shape: 'rounded-sm', emoji: '' },
      { label: 'JOY-CON', bg: '#1A1A1A', text: '#fff', border: '#E4000F', position: 'absolute -right-8 bottom-1/3', rotate: 'rotate-12', shape: 'rounded-sm', emoji: '' },
      { label: '+  −', bg: '#2D2D2D', text: '#fff', border: '#888', position: 'absolute -left-6 bottom-1/4', rotate: '-rotate-6', shape: 'rounded-full', emoji: '' },
      { label: '★ DOCK', bg: '#0AB9E6', text: '#fff', border: '#000', position: 'absolute -right-10 top-1/2', rotate: 'rotate-3', shape: 'rounded-sm', emoji: '' },
    ],
  },
};

export interface ThemeContextType {
  activeTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  stickers: Sticker[];
  wheelRadius: string;
  nightMode: boolean;
  setNightMode: (val: boolean) => void;
  customLabels?: { menu?: string; prev?: string; next?: string; lib?: string; center?: string };
  customLabelColors?: { menu?: string; prev?: string; next?: string; lib?: string; center?: string };
  wheelGradient?: string;
  screenEffect?: string;
  accentStripe?: string[];
}

export type { Sticker };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ThemeName>('CLASSIC');
  const [nightMode, setNightModeState] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('retro-player-theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setActiveTheme(savedTheme);
    }
    const savedNight = localStorage.getItem('retro-night-mode');
    const isNight = savedNight === 'true';
    if (isNight) {
      setNightModeState(true);
      document.documentElement.style.setProperty('--color-retro-bg', '#0a0a0a');
    }
  }, []);

  const handleSetTheme = (theme: ThemeName) => {
    setActiveTheme(theme);
    localStorage.setItem('retro-player-theme', theme);
  };

  const handleSetNightMode = (val: boolean) => {
    setNightModeState(val);
    localStorage.setItem('retro-night-mode', String(val));
    // Apply directly to :root so body background picks it up
    if (val) {
      document.documentElement.style.setProperty('--color-retro-bg', '#0a0a0a');
    } else {
      document.documentElement.style.removeProperty('--color-retro-bg');
    }
  };

  const currentConfig = themes[activeTheme];
  const { stickers, '--wheel-border-radius': wheelRadius, customLabels, customLabelColors, wheelGradient, screenEffect, accentStripe, ...cssVars } = currentConfig;

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme: handleSetTheme, stickers, wheelRadius, nightMode, setNightMode: handleSetNightMode, customLabels, customLabelColors, wheelGradient, screenEffect, accentStripe }}>
      <div
        className="h-full w-full transition-colors duration-500"
        style={cssVars as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
