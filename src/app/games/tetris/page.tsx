'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function TetrisGame() {
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

    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 7;
    const offsetX = (canvas.width - (COLS * BLOCK_SIZE)) / 2;
    const offsetY = 2;

    // Board
    let board: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    // Tetrominoes
    const SHAPES = [
      [[1,1,1,1]], // I
      [[1,1],[1,1]], // O
      [[0,1,0],[1,1,1]], // T
      [[1,0,0],[1,1,1]], // L
      [[0,0,1],[1,1,1]], // J
      [[0,1,1],[1,1,0]], // S
      [[1,1,0],[0,1,1]]  // Z
    ];

    let piece = {
      matrix: [[0]],
      x: 0,
      y: 0
    };

    const spawn = () => {
      const idx = Math.floor(Math.random() * SHAPES.length);
      piece.matrix = SHAPES[idx];
      piece.x = Math.floor(COLS / 2) - Math.floor(piece.matrix[0].length / 2);
      piece.y = 0;
      
      if (collide()) {
        isGameOver = true;
        setGameOver(true);
      }
    };

    const collide = () => {
      const m = piece.matrix;
      for (let r = 0; r < m.length; ++r) {
        for (let c = 0; c < m[r].length; ++c) {
          if (m[r][c] !== 0) {
            const y = piece.y + r;
            const x = piece.x + c;
            if (y >= ROWS || x < 0 || x >= COLS || (y >= 0 && board[y][x] !== 0)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    const merge = () => {
      piece.matrix.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val !== 0) {
            board[piece.y + r][piece.x + c] = 1;
          }
        });
      });
    };

    const clearLines = () => {
      outer: for (let r = ROWS - 1; r >= 0; --r) {
        for (let c = 0; c < COLS; ++c) {
          if (board[r][c] === 0) continue outer;
        }
        const row = board.splice(r, 1)[0].fill(0);
        board.unshift(row);
        ++r;
        currentScore += 100;
        setScore(currentScore);
      }
    };

    const drop = () => {
      piece.y++;
      if (collide()) {
        piece.y--;
        merge();
        clearLines();
        spawn();
      }
    };

    const rotate = () => {
      const m = piece.matrix;
      const t = m[0].map((_, index) => m.map(row => row[index]).reverse());
      const old = piece.matrix;
      piece.matrix = t;
      if (collide()) {
        piece.matrix = old; // revert
      }
    };

    spawn();

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
      board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      spawn();
    };

    const handleWheel = (e: Event) => {
      if (isGameOver) return;
      const customEvent = e as CustomEvent;
      const delta = customEvent.detail.delta;
      
      wheelAcc += delta;
      if (Math.abs(wheelAcc) > 15) {
        rotate();
        wheelAcc = 0;
      }
    };

    const handleBtn = (e: Event) => {
      const customEvent = e as CustomEvent;
      const btn = customEvent.detail.btn;
      if (btn === 'center') {
        if (isGameOver) restart();
        else {
          while (!collide()) {
            piece.y++;
          }
          piece.y--;
          merge();
          clearLines();
          spawn();
        }
      } else if (btn === 'prev' && !isGameOver) {
        piece.x--;
        if (collide()) piece.x++;
      } else if (btn === 'next' && !isGameOver) {
        piece.x++;
        if (collide()) piece.x--;
      } else if (btn === 'lib' && !isGameOver) {
        drop();
      }
    };

    window.addEventListener('ipod-wheel', handleWheel);
    window.addEventListener('ipod-btn', handleBtn);

    let animationId: number;
    let lastTime = 0;
    const dropInterval = 500;

    const draw = () => {
      if (!ctx) return;
      themeColor = getThemeColor();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = themeColor;
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1;

      // Draw border
      ctx.strokeRect(offsetX - 1, offsetY - 1, COLS * BLOCK_SIZE + 2, ROWS * BLOCK_SIZE + 2);

      // Draw board
      board.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val !== 0) {
            ctx.fillRect(offsetX + c * BLOCK_SIZE, offsetY + r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        });
      });

      // Draw piece
      piece.matrix.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val !== 0) {
            ctx.fillRect(offsetX + (piece.x + c) * BLOCK_SIZE, offsetY + (piece.y + r) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        });
      });
    };

    const loop = (timestamp: number) => {
      if (timestamp - lastTime > dropInterval) {
        if (!isGameOver) drop();
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
            TETRIS
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
