import React, { useState, useRef, useEffect } from 'react';
import { BoardState, CellValue, Player } from '../types';
import { playClickX, playClickO } from '../utils/audio';

interface GameBoardProps {
  board: BoardState;
  onCellClick: (index: number) => void;
  currentPlayer: Player;
  winningPattern: number[] | null;
  gameStatus: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  currentPlayer,
  winningPattern,
  gameStatus,
}) => {
  const [rotate, setRotate] = useState({ x: 12, y: -12 }); // Start with a nice natural 3D tilt
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Mouse rotation physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    
    // Position of cursor relative to board center
    const boardWidth = rect.width;
    const boardHeight = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const dx = (mouseX / boardWidth) - 0.5;  // -0.5 to 0.5
    const dy = (mouseY / boardHeight) - 0.5; // -0.5 to 0.5
    
    // Tilt angle calculation (max 28 degrees)
    const maxTilt = 28;
    const rotX = -dy * maxTilt;
    const rotY = dx * maxTilt;
    
    setRotate({ x: rotX, y: rotY });
  };

  // Reset tilt on mouse leave with a smooth spring back
  const handleMouseLeave = () => {
    // Spring back to a slight elegant default showcase angle
    setRotate({ x: 12, y: -12 });
    setPressedIndex(null);
  };

  // Touch rotation mapping for mobile devices
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!boardRef.current || e.touches.length === 0) return;
    const rect = boardRef.current.getBoundingClientRect();
    
    const boardWidth = rect.width;
    const boardHeight = rect.height;
    
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;
    
    // Guard against coordinates completely outside bounds
    if (touchX < 0 || touchX > boardWidth || touchY < 0 || touchY > boardHeight) {
      return;
    }
    
    const dx = (touchX / boardWidth) - 0.5;
    const dy = (touchY / boardHeight) - 0.5;
    
    const maxTilt = 24;
    setRotate({ x: -dy * maxTilt, y: dx * maxTilt });
  };

  const handleCellDown = (index: number) => {
    if (board[index] || gameStatus !== 'playing') return;
    setPressedIndex(index);
  };

  const handleCellUp = (index: number) => {
    if (pressedIndex === index) {
      onCellClick(index);
      setPressedIndex(null);
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-6 perspective-1000">
      <div
        id="ttt-3d-board-wrapper"
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setRotate({ x: 12, y: -12 })}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: pressedIndex === null ? 'transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none',
        }}
        className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] aspect-square rounded-3xl bg-neutral-900/65 border border-violet-950/40 p-6 md:p-8 backdrop-blur-2xl board-shadow preserve-3d select-none cursor-grab active:cursor-grabbing"
      >
        {/* Glow backlight behind the board */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18)_0%,transparent_70%)] blur-2xl pointer-events-none" />

        {/* 3D Grid container */}
        <div className="grid grid-cols-3 grid-rows-3 gap-4 sm:gap-6 w-full h-full preserve-3d">
          {board.map((cell, index) => {
            const isWinning = winningPattern?.includes(index);
            const isPressed = pressedIndex === index;
            const hasValue = cell !== null;

            // Define neon coloring based on value
            let shadowClass = '';
            let textClass = 'text-neutral-500';
            let bgGlow = '';

            if (cell === 'X') {
              textClass = 'text-[#00ffff] [text-shadow:0_0_10px_rgba(0,255,255,0.8),0_0_20px_rgba(0,255,255,0.4)]';
              shadowClass = isWinning ? 'animate-pulse-cyan' : 'group-hover:border-[#00ffff]/40';
              bgGlow = 'rgba(0,255,255,0.03)';
            } else if (cell === 'O') {
              textClass = 'text-[#ff2a85] [text-shadow:0_0_10px_rgba(255,42,133,0.8),0_0_20px_rgba(255,42,133,0.4)]';
              shadowClass = isWinning ? 'animate-pulse-pink' : 'group-hover:border-[#ff2a85]/40';
              bgGlow = 'rgba(255,42,133,0.03)';
            }

            return (
              <button
                key={index}
                id={`cell-${index}`}
                onMouseDown={() => handleCellDown(index)}
                onMouseUp={() => handleCellUp(index)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleCellDown(index);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleCellUp(index);
                }}
                disabled={hasValue || gameStatus !== 'playing'}
                className={`relative group select-none aspect-square focus:outline-none preserve-3d ${
                  isPressed ? 'cell-pressed' : ''
                }`}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* 3D Back bevel layer */}
                <div className="absolute inset-0 rounded-2xl bg-neutral-950 border border-violet-950/20 cell-layer-back shadow-[0_4px_12px_rgba(0,0,0,0.5)]" />

                {/* 3D Front touchplate */}
                <div
                  style={{
                    backgroundColor: hasValue ? bgGlow || 'rgba(16,16,28,0.85)' : 'rgba(23,23,43,0.75)',
                    borderColor: isWinning 
                      ? (cell === 'X' ? 'rgba(0,255,255,0.9)' : 'rgba(255,42,133,0.9)')
                      : hasValue ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.1)',
                  }}
                  className={`absolute inset-0 rounded-2xl border flex items-center justify-center cell-layer-front overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:bg-neutral-800/40 transition-all duration-200 ${shadowClass}`}
                >
                  {/* Grid cell accent glass effect */}
                  <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                  {/* Character visual */}
                  {cell && (
                    <span 
                      style={{
                        transform: 'translateZ(15px)',
                      }}
                      className={`font-display text-4xl xs:text-5xl font-extrabold select-none transition-transform duration-300 pointer-events-none ${textClass}`}
                    >
                      {cell}
                    </span>
                  )}

                  {/* Hover indicator for dynamic UI hints */}
                  {!hasValue && gameStatus === 'playing' && (
                    <span className="opacity-0 group-hover:opacity-40 transition-opacity duration-200 text-neutral-600 font-display text-2xl font-bold select-none pointer-events-none">
                      {currentPlayer}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
