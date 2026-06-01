'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function SnakeGame() {
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
    const cols = canvas.width / tileSize;
    const rows = canvas.height / tileSize;

    // Game state
    let isGameOver = false;
    let currentScore = 0;
    
    // Snake
    let snake = [
      { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
      { x: Math.floor(cols / 2) - 1, y: Math.floor(rows / 2) },
      { x: Math.floor(cols / 2) - 2, y: Math.floor(rows / 2) }
    ];
    let dir = { x: 1, y: 0 }; // Moving right
    let nextDir = { x: 1, y: 0 };
    
    // Food
    let food = { x: 0, y: 0 };
    
    const placeFood = () => {
      let valid = false;
      while (!valid) {
        food.x = Math.floor(Math.random() * cols);
        food.y = Math.floor(Math.random() * rows);
        valid = true;
        for (let s of snake) {
          if (s.x === food.x && s.y === food.y) valid = false;
        }
      }
    };
    placeFood();

    // Wheel accumulator for smooth turns
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
      snake = [
        { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
        { x: Math.floor(cols / 2) - 1, y: Math.floor(rows / 2) }
      ];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      placeFood();
    };

    const handleWheel = (e: Event) => {
      if (isGameOver) return;
      const customEvent = e as CustomEvent;
      const delta = customEvent.detail.delta;
      
      wheelAcc += delta;

      // Turn right (clockwise)
      if (wheelAcc > 15) { // Sensitivity threshold
        if (dir.x === 1) nextDir = { x: 0, y: 1 };
        else if (dir.y === 1) nextDir = { x: -1, y: 0 };
        else if (dir.x === -1) nextDir = { x: 0, y: -1 };
        else if (dir.y === -1) nextDir = { x: 1, y: 0 };
        wheelAcc = 0;
      }
      // Turn left (counter-clockwise)
      else if (wheelAcc < -15) {
        if (dir.x === 1) nextDir = { x: 0, y: -1 };
        else if (dir.y === -1) nextDir = { x: -1, y: 0 };
        else if (dir.x === -1) nextDir = { x: 0, y: 1 };
        else if (dir.y === 1) nextDir = { x: 1, y: 0 };
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

    let lastTime = 0;
    let animationId: number;
    const speed = 120; // ms per frame

    const draw = () => {
      if (!ctx) return;
      themeColor = getThemeColor();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = themeColor;
      
      // Draw Food (blinking)
      if (Math.floor(Date.now() / 200) % 2 === 0) {
        ctx.fillRect(food.x * tileSize + 1, food.y * tileSize + 1, tileSize - 2, tileSize - 2);
      }

      // Draw Snake
      snake.forEach((part, index) => {
        if (index === 0) {
          ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
        } else {
          ctx.fillRect(part.x * tileSize + 1, part.y * tileSize + 1, tileSize - 2, tileSize - 2);
        }
      });
    };

    const update = () => {
      if (isGameOver) return;
      
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        isGameOver = true;
        setGameOver(true);
        return;
      }

      // Self collision
      for (let s of snake) {
        if (s.x === head.x && s.y === head.y) {
          isGameOver = true;
          setGameOver(true);
          return;
        }
      }

      snake.unshift(head);

      // Food eating
      if (head.x === food.x && head.y === food.y) {
        currentScore += 10;
        setScore(currentScore);
        placeFood();
      } else {
        snake.pop();
      }
    };

    const loop = (timestamp: number) => {
      if (timestamp - lastTime > speed) {
        update();
        lastTime = timestamp;
      }
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
            SNAKE
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
