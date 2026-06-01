'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function RacerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isGameOver = false;
    let currentScore = 0;
    let speed = 2;
    let frames = 0;

    // Car (player)
    const car = {
      x: canvas.width / 2 - 8,
      y: canvas.height - 30,
      w: 16,
      h: 24,
    };

    // Enemies
    let enemies: { x: number; y: number; w: number; h: number }[] = [];

    // Road lines
    let roadLines: number[] = [0, 40, 80, 120];

    const getThemeColor = () => {
      const el = document.documentElement;
      return getComputedStyle(el).getPropertyValue('--color-screen-border').trim() || '#000';
    };

    let themeColor = getThemeColor();

    const restart = () => {
      isGameOver = false;
      setGameOver(false);
      currentScore = 0;
      setScore(0);
      speed = 2;
      car.x = canvas.width / 2 - 8;
      enemies = [];
      roadLines = [0, 40, 80, 120];
    };

    const handleWheel = (e: Event) => {
      if (isGameOver) return;
      const customEvent = e as CustomEvent;
      const delta = customEvent.detail.delta;
      
      // Move car left/right based on wheel delta
      car.x += delta * 1.5;
      
      // Bounds
      if (car.x < 10) car.x = 10;
      if (car.x > canvas.width - 10 - car.w) car.x = canvas.width - 10 - car.w;
    };

    const handleBtn = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.btn === 'center' && isGameOver) {
        restart();
      }
    };

    window.addEventListener('ipod-wheel', handleWheel);
    window.addEventListener('ipod-btn', handleBtn);

    let animationId: number;

    const drawCar = (x: number, y: number, w: number, h: number, isEnemy: boolean) => {
      if (!ctx) return;
      ctx.fillStyle = themeColor;
      
      // Body
      if (isEnemy) {
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
      } else {
        ctx.fillRect(x, y, w, h);
        ctx.clearRect(x + 4, y + 4, w - 8, h - 8);
        ctx.fillRect(x + 6, y + 6, w - 12, h - 12);
      }
      
      // Wheels
      ctx.fillRect(x - 2, y + 2, 2, 6);
      ctx.fillRect(x + w, y + 2, 2, 6);
      ctx.fillRect(x - 2, y + h - 8, 2, 6);
      ctx.fillRect(x + w, y + h - 8, 2, 6);
    };

    const draw = () => {
      if (!ctx) return;
      themeColor = getThemeColor();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = themeColor;
      
      // Draw road borders
      ctx.fillRect(5, 0, 2, canvas.height);
      ctx.fillRect(canvas.width - 7, 0, 2, canvas.height);

      // Draw road dashed lines
      for (let i = 0; i < roadLines.length; i++) {
        ctx.fillRect(canvas.width / 2 - 1, roadLines[i], 2, 20);
      }

      // Draw Enemies
      enemies.forEach(en => {
        drawCar(en.x, en.y, en.w, en.h, true);
      });

      // Draw Player
      drawCar(car.x, car.y, car.w, car.h, false);
    };

    const update = () => {
      if (isGameOver) return;
      frames++;

      // Move road lines
      for (let i = 0; i < roadLines.length; i++) {
        roadLines[i] += speed;
        if (roadLines[i] > canvas.height) roadLines[i] = -20;
      }

      // Spawn enemies
      if (frames % Math.max(30, Math.floor(100 - speed * 10)) === 0) {
        const lane = Math.floor(Math.random() * 3); // 3 lanes
        const ew = 16;
        const eh = 24;
        let ex = 20; // left lane
        if (lane === 1) ex = canvas.width / 2 - ew / 2; // mid lane
        if (lane === 2) ex = canvas.width - 20 - ew; // right lane

        enemies.push({ x: ex, y: -30, w: ew, h: eh });
      }

      // Move enemies & collision
      for (let i = 0; i < enemies.length; i++) {
        let en = enemies[i];
        en.y += speed;

        if (
          car.x < en.x + en.w &&
          car.x + car.w > en.x &&
          car.y < en.y + en.h &&
          car.y + car.h > en.y
        ) {
          isGameOver = true;
          setGameOver(true);
        }
      }

      // Score and cleanup
      if (enemies.length > 0 && enemies[0].y > canvas.height) {
        enemies.shift();
        currentScore += 10;
        setScore(currentScore);
        if (currentScore % 100 === 0) {
          speed += 0.5;
        }
      }
    };

    const loop = () => {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('ipod-wheel', handleWheel);
      window.removeEventListener('ipod-btn', handleBtn);
    };
  }, []);

  return (
    <div className="flex flex-col h-full font-sans bg-screen-bg relative">
      <div className="absolute top-0 left-0 w-full flex justify-between h-1 z-20 pointer-events-none">
        <div className="w-1/4 h-full bg-[#E53935]"></div>
        <div className="w-1/4 h-full bg-[#F5A623]"></div>
        <div className="w-1/4 h-full bg-[#4A90E2]"></div>
        <div className="w-1/4 h-full bg-[#50E3C2]"></div>
      </div>

      <div className="px-3 pt-2 pb-2 flex items-center justify-between shrink-0 z-10 border-b border-screen-header/30">
        <div className="flex items-center">
          <Link href="/games" className="hover:opacity-70 transition-opacity p-1 -ml-1">
            <ChevronLeft size={24} className="text-screen-border" strokeWidth={2.5} />
          </Link>
          <h1 className="font-pixel text-screen-border text-sm ml-2 tracking-widest mt-0.5">
            RACER
          </h1>
        </div>
        <div className="font-pixel text-screen-border text-xs mt-0.5 tabular-nums">
          {score.toString().padStart(5, '0')}
        </div>
      </div>

      <div className="flex-1 w-full relative bg-screen-bg flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={160}
          height={144}
          className="w-full h-full object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-screen-bg/80 flex flex-col items-center justify-center z-10">
            <span className="font-pixel text-screen-border text-lg mb-2">CRASH!</span>
            <span className="font-pixel text-screen-border text-[10px] opacity-70">Press CENTER to restart</span>
          </div>
        )}
      </div>
    </div>
  );
}
