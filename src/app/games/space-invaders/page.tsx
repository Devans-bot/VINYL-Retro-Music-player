'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function SpaceInvadersGame() {
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

    // Player
    const player = {
      x: canvas.width / 2 - 8,
      y: canvas.height - 20,
      w: 16,
      h: 8,
    };

    // Projectiles
    let bullets: { x: number; y: number; w: number; h: number }[] = [];

    // Enemies
    let enemies: { x: number; y: number; w: number; h: number; alive: boolean }[] = [];
    let enemyDir = 1;
    let enemySpeed = 0.5;
    let enemyDownStep = 0;

    const initEnemies = () => {
      enemies = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 6; col++) {
          enemies.push({
            x: 10 + col * 20,
            y: 20 + row * 16,
            w: 12,
            h: 8,
            alive: true,
          });
        }
      }
    };
    initEnemies();

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
      player.x = canvas.width / 2 - 8;
      bullets = [];
      enemyDir = 1;
      enemySpeed = 0.5;
      initEnemies();
    };

    const handleWheel = (e: Event) => {
      if (isGameOver) return;
      const customEvent = e as CustomEvent;
      const delta = customEvent.detail.delta;
      
      player.x += delta * 1.5;
      
      if (player.x < 0) player.x = 0;
      if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;
    };

    const handleBtn = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.btn === 'center') {
        if (isGameOver) {
          restart();
        } else {
          // Shoot
          if (bullets.length < 3) {
            bullets.push({ x: player.x + player.w / 2 - 1, y: player.y, w: 2, h: 6 });
          }
        }
      }
    };

    window.addEventListener('ipod-wheel', handleWheel);
    window.addEventListener('ipod-btn', handleBtn);

    let animationId: number;

    const draw = () => {
      if (!ctx) return;
      themeColor = getThemeColor();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = themeColor;

      // Player
      ctx.fillRect(player.x, player.y + 4, player.w, 4);
      ctx.fillRect(player.x + 6, player.y, 4, 4);

      // Bullets
      bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

      // Enemies
      const frame = Math.floor(Date.now() / 500) % 2 === 0;
      enemies.forEach(en => {
        if (!en.alive) return;
        ctx.fillRect(en.x, en.y, en.w, en.h);
        ctx.clearRect(en.x + 2, en.y + 2, 2, 2);
        ctx.clearRect(en.x + 8, en.y + 2, 2, 2);
        if (frame) {
          ctx.clearRect(en.x, en.y + en.h - 2, 2, 2);
          ctx.clearRect(en.x + en.w - 2, en.y + en.h - 2, 2, 2);
        }
      });
    };

    const update = () => {
      if (isGameOver) return;

      // Move bullets
      bullets.forEach(b => b.y -= 4);
      bullets = bullets.filter(b => b.y > 0);

      // Move enemies
      let hitWall = false;
      let allDead = true;

      enemies.forEach(en => {
        if (!en.alive) return;
        allDead = false;
        en.x += enemySpeed * enemyDir;
        if (en.x <= 0 || en.x + en.w >= canvas.width) {
          hitWall = true;
        }

        // Collision with bullets
        bullets.forEach((b, i) => {
          if (
            b.x < en.x + en.w &&
            b.x + b.w > en.x &&
            b.y < en.y + en.h &&
            b.y + b.h > en.y
          ) {
            en.alive = false;
            bullets.splice(i, 1);
            currentScore += 10;
            setScore(currentScore);
            enemySpeed += 0.05;
          }
        });

        // Collision with player
        if (
          en.y + en.h >= player.y &&
          en.x < player.x + player.w &&
          en.x + en.w > player.x
        ) {
          isGameOver = true;
          setGameOver(true);
        }
      });

      if (hitWall) {
        enemyDir *= -1;
        enemies.forEach(en => {
          if (en.alive) en.y += 8;
        });
      }

      if (allDead) {
        initEnemies();
        enemySpeed += 0.2;
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
            INVADERS
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
            <span className="font-pixel text-screen-border text-lg mb-2">GAME OVER</span>
            <span className="font-pixel text-screen-border text-[10px] opacity-70">Press CENTER to restart</span>
          </div>
        )}
      </div>
    </div>
  );
}
