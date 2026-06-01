'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function DinoRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game state
    let isGameOver = false;
    let currentScore = 0;
    let frames = 0;
    let gameSpeed = 3;

    // Physics & Objects
    const gravity = 0.6;
    const dino = {
      x: 20,
      y: 100,
      w: 12,
      h: 12,
      dy: 0,
      jumpForce: -8,
      isGrounded: true,
    };

    let obstacles: { x: number; y: number; w: number; h: number }[] = [];

    // Colors
    const getThemeColor = () => {
      const el = document.documentElement;
      const color = getComputedStyle(el).getPropertyValue('--color-screen-border').trim();
      return color || '#000';
    };

    let themeColor = getThemeColor();

    const jump = () => {
      if (isGameOver) {
        // Restart
        isGameOver = false;
        setGameOver(false);
        currentScore = 0;
        setScore(0);
        obstacles = [];
        dino.y = 100;
        dino.dy = 0;
        gameSpeed = 3;
      } else if (dino.isGrounded) {
        dino.dy = dino.jumpForce;
        dino.isGrounded = false;
      }
    };

    const handleInput = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.btn === 'center') {
        jump();
      }
    };

    window.addEventListener('ipod-btn', handleInput);

    let animationId: number;

    const draw = () => {
      if (!ctx) return;
      themeColor = getThemeColor();

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floor
      ctx.fillStyle = themeColor;
      ctx.fillRect(0, 112, canvas.width, 1);

      // Dino
      ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
      // Eye
      ctx.clearRect(dino.x + 8, dino.y + 2, 2, 2);

      // Obstacles
      obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      });
    };

    const update = () => {
      if (isGameOver) return;
      frames++;

      // Physics
      dino.dy += gravity;
      dino.y += dino.dy;

      // Ground collision
      if (dino.y + dino.h >= 112) {
        dino.y = 112 - dino.h;
        dino.dy = 0;
        dino.isGrounded = true;
      }

      // Spawn obstacles
      if (frames % Math.max(30, Math.floor(100 - gameSpeed * 5)) === 0) {
        const h = Math.random() > 0.5 ? 12 : 20; // Some tall, some short
        obstacles.push({
          x: canvas.width,
          y: 112 - h,
          w: 8,
          h: h
        });
      }

      // Move and check collisions
      for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;

        // Collision box
        if (
          dino.x < obs.x + obs.w &&
          dino.x + dino.w > obs.x &&
          dino.y < obs.y + obs.h &&
          dino.y + dino.h > obs.y
        ) {
          isGameOver = true;
          setGameOver(true);
        }
      }

      // Remove off-screen obstacles
      if (obstacles.length > 0 && obstacles[0].x < -20) {
        obstacles.shift();
        currentScore += 10;
        setScore(currentScore);
        if (currentScore % 100 === 0) {
          gameSpeed += 0.5; // Speed up over time
        }
      }
    };

    const loop = () => {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('ipod-btn', handleInput);
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
            DINO
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
          height={144} // Classic gameboy res
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
