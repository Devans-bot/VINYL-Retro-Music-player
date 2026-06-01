'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PacmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Grid config
    const tileSize = 8;
    // Map: 0 = empty, 1 = wall, 2 = dot
    const map = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1,2,1],
      [1,2,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,2,1,2,1,1,1,1,2,1,2,1,1,1,2,1],
      [1,2,2,2,2,2,1,2,2,1,1,2,2,1,2,2,2,2,2,1],
      [1,1,1,1,1,2,1,1,0,1,1,0,1,1,2,1,1,1,1,1],
      [0,0,0,0,1,2,1,0,0,0,0,0,0,1,2,1,0,0,0,0],
      [1,1,1,1,1,2,1,0,1,1,1,1,0,1,2,1,1,1,1,1],
      [0,0,0,0,0,2,0,0,1,0,0,1,0,0,2,0,0,0,0,0],
      [1,1,1,1,1,2,1,0,1,1,1,1,0,1,2,1,1,1,1,1],
      [0,0,0,0,1,2,1,0,0,0,0,0,0,1,2,1,0,0,0,0],
      [1,1,1,1,1,2,1,2,1,1,1,1,2,1,2,1,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1,2,1],
      [1,2,2,2,1,2,2,2,2,0,0,2,2,2,2,1,2,2,2,1],
      [1,1,1,2,1,2,1,2,1,1,1,1,2,1,2,1,2,1,1,1],
      [1,2,2,2,2,2,1,2,2,1,1,2,2,1,2,2,2,2,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    let grid = map.map(row => [...row]);

    let isGameOver = false;
    let currentScore = 0;
    
    // Player
    let pac = { x: 9.5, y: 16.5, vx: -0.1, vy: 0, nextVx: -0.1, nextVy: 0 };
    
    // Ghosts
    let ghosts = [
      { x: 9.5, y: 8.5, vx: 0.1, vy: 0 },
      { x: 10.5, y: 10.5, vx: -0.1, vy: 0 }
    ];

    let wheelAcc = 0;

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
      grid = map.map(row => [...row]);
      pac = { x: 9.5, y: 16.5, vx: -0.1, vy: 0, nextVx: -0.1, nextVy: 0 };
      ghosts = [
        { x: 9.5, y: 8.5, vx: 0.1, vy: 0 },
        { x: 10.5, y: 10.5, vx: -0.1, vy: 0 }
      ];
    };

    const handleWheel = (e: Event) => {
      if (isGameOver) return;
      const customEvent = e as CustomEvent;
      const delta = customEvent.detail.delta;
      
      wheelAcc += delta;

      // Map wheel direction to relative turning
      if (wheelAcc > 15) { 
        if (pac.vx > 0) { pac.nextVx = 0; pac.nextVy = 0.1; } // Right -> Down
        else if (pac.vy > 0) { pac.nextVx = -0.1; pac.nextVy = 0; } // Down -> Left
        else if (pac.vx < 0) { pac.nextVx = 0; pac.nextVy = -0.1; } // Left -> Up
        else if (pac.vy < 0) { pac.nextVx = 0.1; pac.nextVy = 0; } // Up -> Right
        wheelAcc = 0;
      } else if (wheelAcc < -15) {
        if (pac.vx > 0) { pac.nextVx = 0; pac.nextVy = -0.1; } // Right -> Up
        else if (pac.vy < 0) { pac.nextVx = -0.1; pac.nextVy = 0; } // Up -> Left
        else if (pac.vx < 0) { pac.nextVx = 0; pac.nextVy = 0.1; } // Left -> Down
        else if (pac.vy > 0) { pac.nextVx = 0.1; pac.nextVy = 0; } // Down -> Right
        wheelAcc = 0;
      }
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

    const isWall = (gx: number, gy: number) => {
      if (gy < 0 || gy >= 20 || gx < 0 || gx >= 20) return false;
      return grid[Math.floor(gy)][Math.floor(gx)] === 1;
    };

    const moveEntity = (ent: any, isPac: boolean) => {
      // Try next direction if we are aligned to grid
      if (isPac && (ent.nextVx !== ent.vx || ent.nextVy !== ent.vy)) {
        if (Math.abs(ent.x - Math.round(ent.x)) < 0.05 && Math.abs(ent.y - Math.round(ent.y)) < 0.05) {
          if (!isWall(Math.round(ent.x) + Math.sign(ent.nextVx), Math.round(ent.y) + Math.sign(ent.nextVy))) {
            ent.x = Math.round(ent.x);
            ent.y = Math.round(ent.y);
            ent.vx = ent.nextVx;
            ent.vy = ent.nextVy;
          }
        }
      }

      // Move
      let nx = ent.x + ent.vx;
      let ny = ent.y + ent.vy;

      // Wrap
      if (nx < -0.5) nx = 19.5;
      if (nx > 19.5) nx = -0.5;

      // Wall collision
      if (isWall(Math.round(nx + Math.sign(ent.vx)*0.4), Math.round(ny + Math.sign(ent.vy)*0.4))) {
        // Stop or turn
        if (isPac) {
          ent.vx = 0;
          ent.vy = 0;
        } else {
          // Ghost random turn
          const dirs = [{vx:0.1, vy:0}, {vx:-0.1, vy:0}, {vx:0, vy:0.1}, {vx:0, vy:-0.1}];
          const possible = dirs.filter(d => (d.vx !== -ent.vx || d.vy !== -ent.vy) && !isWall(Math.round(ent.x + Math.sign(d.vx)), Math.round(ent.y + Math.sign(d.vy))));
          if (possible.length > 0) {
            const chosen = possible[Math.floor(Math.random() * possible.length)];
            ent.vx = chosen.vx;
            ent.vy = chosen.vy;
          } else {
            ent.vx *= -1;
            ent.vy *= -1;
          }
        }
      } else {
        ent.x = nx;
        ent.y = ny;
      }
    };

    const update = () => {
      if (isGameOver) return;

      moveEntity(pac, true);
      ghosts.forEach(g => moveEntity(g, false));

      // Eat dot
      const px = Math.round(pac.x);
      const py = Math.round(pac.y);
      if (py >= 0 && py < 20 && px >= 0 && px < 20 && grid[py][px] === 2) {
        grid[py][px] = 0;
        currentScore += 10;
        setScore(currentScore);
      }

      // Check collision
      ghosts.forEach(g => {
        if (Math.abs(pac.x - g.x) < 0.8 && Math.abs(pac.y - g.y) < 0.8) {
          isGameOver = true;
          setGameOver(true);
        }
      });
    };

    const draw = () => {
      if (!ctx) return;
      themeColor = getThemeColor();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = themeColor;

      // Draw map
      for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 20; c++) {
          if (grid[r][c] === 1) {
            ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
          } else if (grid[r][c] === 2) {
            ctx.fillRect(c * tileSize + 3, r * tileSize + 3, 2, 2);
          }
        }
      }

      // Draw Pac
      ctx.beginPath();
      ctx.arc(pac.x * tileSize + 4, pac.y * tileSize + 4, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw ghosts
      ghosts.forEach(g => {
        ctx.strokeRect(g.x * tileSize + 2, g.y * tileSize + 2, 4, 4);
      });
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
            PAC-MAN
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
          height={160}
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
