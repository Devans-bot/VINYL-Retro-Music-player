'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function BrickBreakerGame() {
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

    // Paddle
    const paddle = {
      x: canvas.width / 2 - 12,
      y: canvas.height - 10,
      w: 24,
      h: 4,
    };

    // Ball
    const ball = {
      x: canvas.width / 2,
      y: canvas.height - 20,
      r: 2,
      dx: 1.5,
      dy: -1.5,
    };

    // Bricks
    let bricks: { x: number; y: number; w: number; h: number; alive: boolean }[] = [];
    const initBricks = () => {
      bricks = [];
      const rows = 4;
      const cols = 6;
      const bw = 22;
      const bh = 8;
      const padding = 2;
      const offsetX = (canvas.width - (cols * (bw + padding))) / 2;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          bricks.push({
            x: offsetX + c * (bw + padding),
            y: 20 + r * (bh + padding),
            w: bw,
            h: bh,
            alive: true,
          });
        }
      }
    };
    initBricks();

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
      paddle.x = canvas.width / 2 - 12;
      ball.x = canvas.width / 2;
      ball.y = canvas.height - 20;
      ball.dx = 1.5;
      ball.dy = -1.5;
      initBricks();
    };

    const handleWheel = (e: Event) => {
      if (isGameOver) return;
      const customEvent = e as CustomEvent;
      const delta = customEvent.detail.delta;
      
      paddle.x += delta * 1.5;
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x > canvas.width - paddle.w) paddle.x = canvas.width - paddle.w;
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

    const draw = () => {
      if (!ctx) return;
      themeColor = getThemeColor();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = themeColor;

      // Paddle
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      // Bricks
      bricks.forEach(b => {
        if (b.alive) {
          ctx.fillRect(b.x, b.y, b.w, b.h);
        }
      });
    };

    const update = () => {
      if (isGameOver) return;

      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collision
      if (ball.x + ball.r > canvas.width || ball.x - ball.r < 0) ball.dx *= -1;
      if (ball.y - ball.r < 0) ball.dy *= -1;

      // Floor collision
      if (ball.y + ball.r > canvas.height) {
        isGameOver = true;
        setGameOver(true);
      }

      // Paddle collision
      if (
        ball.y + ball.r > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.w
      ) {
        ball.dy = -Math.abs(ball.dy);
        // Add a little english depending on where it hit
        let hitPoint = ball.x - (paddle.x + paddle.w / 2);
        ball.dx = hitPoint * 0.15;
      }

      // Brick collision
      let activeBricks = 0;
      bricks.forEach(b => {
        if (b.alive) {
          activeBricks++;
          if (
            ball.x + ball.r > b.x &&
            ball.x - ball.r < b.x + b.w &&
            ball.y + ball.r > b.y &&
            ball.y - ball.r < b.y + b.h
          ) {
            b.alive = false;
            ball.dy *= -1;
            currentScore += 10;
            setScore(currentScore);
          }
        }
      });

      if (activeBricks === 0) {
        // Level up
        initBricks();
        ball.dx *= 1.2;
        ball.dy *= 1.2;
        ball.y = canvas.height / 2;
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
            BREAKER
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
