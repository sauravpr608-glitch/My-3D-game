import React from 'react';
import { Player, Scores } from '../types';

interface ScoreBoardProps {
  scores: Scores;
  currentPlayer: Player;
  gameStatus: string;
  onClearScores: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  currentPlayer,
  gameStatus,
  onClearScores,
}) => {
  const isPlaying = gameStatus === 'playing';

  return (
    <div className="w-full max-w-md mx-auto mb-6 select-none font-sans">
      {/* Current Turn Pointer/Banner */}
      <div className="flex justify-center mb-6">
        <div className="relative inline-flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 rounded-full px-6 py-2 shadow-lg">
          <span className="text-xs tracking-wider uppercase text-neutral-400 font-medium">Turn</span>
          
          {/* Indicator Light */}
          <div className="flex items-center gap-2">
            <span
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                currentPlayer === 'X'
                  ? 'bg-[#00ffff] shadow-[0_0_8px_#00ffff,0_0_15px_#00ffff]'
                  : 'bg-[#ff2a85] shadow-[0_0_8px_#ff2a85,0_0_15px_#ff2a85]'
              }`}
            />
            <span
              className={`font-display text-lg font-bold uppercase transition-colors duration-300 ${
                currentPlayer === 'X' ? 'text-[#00ffff]' : 'text-[#ff2a85]'
              }`}
            >
              Player {currentPlayer}
            </span>
          </div>

          {/* Action description */}
          <span className="text-xs text-neutral-400 italic font-mono">
            {isPlaying ? "Pass & Play" : "Match Over"}
          </span>
        </div>
      </div>

      {/* Grid displays for Stats */}
      <div className="grid grid-cols-3 gap-3">
        {/* PLAYER X STAT CARD */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-950/60 border border-[#00ffff]/10 p-3 flex flex-col items-center justify-center transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400/30 via-[#00ffff]/10 to-transparent" />
          <span className="text-xs font-semibold text-neutral-400 tracking-wide uppercase font-display">Player X</span>
          <span className="text-2xl font-extrabold text-[#00ffff] font-mono mt-1 mt-1 [text-shadow:0_0_6px_rgba(0,255,255,0.4)]">
            {scores.xWins}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono mt-1">Cyan Cyber</span>
        </div>

        {/* DRAWS STAT CARD */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-950/60 border border-neutral-850 p-3 flex flex-col items-center justify-center transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <span className="text-xs font-semibold text-neutral-400 tracking-wide uppercase font-display">Ties</span>
          <span className="text-2xl font-extrabold text-neutral-200 font-mono mt-1">
            {scores.draws}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono mt-1">Draw Matches</span>
        </div>

        {/* PLAYER O STAT CARD */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-950/60 border border-[#ff2a85]/10 p-3 flex flex-col items-center justify-center transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-pink-400/30 via-[#ff2a85]/10 to-transparent" />
          <span className="text-xs font-semibold text-neutral-400 tracking-wide uppercase font-display">Player O</span>
          <span className="text-2xl font-extrabold text-[#ff2a85] font-mono mt-1 [text-shadow:0_0_6px_rgba(255,42,133,0.4)]">
            {scores.oWins}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono mt-1">Hot Pink</span>
        </div>
      </div>

      {/* Helper to reset storage scores */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearScores}
          className="text-[10px] font-mono text-neutral-500 hover:text-neutral-300 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800/60 rounded px-2.5 py-1 transition-colors pointer-events-auto"
        >
          Reset All Scores
        </button>
      </div>
    </div>
  );
};
