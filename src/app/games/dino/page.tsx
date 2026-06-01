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

    // Load Background
    const bgImg = new Image();
    bgImg.src = '/dino-bg.png';

    // Game state
    let isGameOver = false;
    let currentScore = 0;
    let frames = 0;
    let gameSpeed = 2; // Slower start
    let bgX = 0;

    // Physics & Objects
    const gravity = 0.5;
    const floorY = 120; // Adjusted floor to fit 144px height nicely
    const dino = {
      x: 20,
      y: 100,
      w: 12,
      h: 14,
      dy: 0,
      jumpForce: -7,
      isGrounded: true,
    };

    let obstacles: { x: number; y: number; w: number; h: number; emoji: string; isFlying: boolean }[] = [];

    const GROUND_OBSTACLES = ['🌴', '🪾', '🌲'];
    const FLYING_OBSTACLES = ['🦅', '🚁'];

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
        dino.y = floorY - dino.h;
        dino.dy = 0;
        gameSpeed = 2;
        bgX = 0;
        frames = 0;
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

      // Draw Scrolling Background
      if (bgImg.complete) {
        ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);
      } else {
        // Fallback color
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-screen-bg').trim() || '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw Floor line (optional, adds contrast)
      ctx.fillStyle = themeColor;
      ctx.fillRect(0, floorY, canvas.width, 1);

      // Setup emoji font
      ctx.font = '16px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"';
      ctx.textBaseline = 'top';

      // Draw Dino (inverted to face right)
      ctx.save();
      ctx.scale(-1, 1);
      // Because we scaled by -1 on X axis, we draw at -x - width
      // adding a tiny offset for visual centering
      ctx.fillText('🦖', -dino.x - dino.w - 2, dino.y - 2); 
      ctx.restore();

      // Draw Obstacles
      obstacles.forEach(obs => {
        // Flip the eagle and chopper so they face left towards the dino
        if (obs.isFlying) {
           ctx.save();
           ctx.scale(-1, 1);
           ctx.fillText(obs.emoji, -obs.x - obs.w - 2, obs.y - 2);
           ctx.restore();
        } else {
           ctx.fillText(obs.emoji, obs.x - 2, obs.y - 2);
        }
      });
    };

    const update = () => {
      if (isGameOver) return;
      frames++;

      // Parallax background
      bgX -= gameSpeed * 0.3;
      if (bgX <= -canvas.width) {
        bgX = 0;
      }

      // Physics
      dino.dy += gravity;
      dino.y += dino.dy;

      // Ground collision
      if (dino.y + dino.h >= floorY) {
        dino.y = floorY - dino.h;
        dino.dy = 0;
        dino.isGrounded = true;
      }

      // Spawn obstacles
      // Spawn rate depends on speed
      const spawnRate = Math.max(40, Math.floor(120 - gameSpeed * 10));
      if (frames % spawnRate === 0) {
        const isFlying = Math.random() > 0.6;
        
        if (isFlying) {
          // Flying objects spawn either low (must jump) or high (must run under)
          const spawnHigh = Math.random() > 0.5;
          const y = spawnHigh ? floorY - 35 : floorY - 14; 
          obstacles.push({
            x: canvas.width,
            y: y,
            w: 12,
            h: 12,
            emoji: FLYING_OBSTACLES[Math.floor(Math.random() * FLYING_OBSTACLES.length)],
            isFlying: true
          });
        } else {
          // Trees
          obstacles.push({
            x: canvas.width,
            y: floorY - 14,
            w: 12,
            h: 14,
            emoji: GROUND_OBSTACLES[Math.floor(Math.random() * GROUND_OBSTACLES.length)],
            isFlying: false
          });
        }
      }

      // Move and check collisions
      for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        // Flying objects might move slightly faster
        obs.x -= gameSpeed * (obs.isFlying ? 1.2 : 1);

        // A slightly forgiving hitbox
        const hitboxPadding = 3;
        if (
          dino.x + hitboxPadding < obs.x + obs.w - hitboxPadding &&
          dino.x + dino.w - hitboxPadding > obs.x + hitboxPadding &&
          dino.y + hitboxPadding < obs.y + obs.h - hitboxPadding &&
          dino.y + dino.h - hitboxPadding > obs.y + hitboxPadding
        ) {
          isGameOver = true;
          setGameOver(true);
        }
      }

      // Remove off-screen obstacles and score
      if (obstacles.length > 0 && obstacles[0].x < -20) {
        obstacles.shift();
        currentScore += 10;
        setScore(currentScore);
        
        // Increase speed slightly after every 100 points
        if (currentScore % 100 === 0) {
          gameSpeed += 0.2; 
        }
      }
    };

    const loop = () => {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    // Make sure font is loaded before first draw
    document.fonts.ready.then(() => {
      if (!isGameOver) {
        cancelAnimationFrame(animationId);
        loop();
      }
    });

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
          height={144}
          className="w-full h-full object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
            <span className="font-pixel text-white text-lg mb-2 drop-shadow-md">GAME OVER</span>
            <span className="font-pixel text-white text-[10px] drop-shadow-md opacity-90">Press CENTER to restart</span>
          </div>
        )}
      </div>
    </div>
  );
}
