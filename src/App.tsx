import React, { useState, useEffect } from 'react';
import { BoardState, Player, Scores, GameStatus, WinInfo } from './types';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { AdsterraAd } from './components/AdsterraAd';
import { 
  playClickX, 
  playClickO, 
  playWinMelody, 
  playDrawSound, 
  playResetChime 
} from './utils/audio';
import { RotateCcw, Volume2, Gamepad2, Sparkles, AlertCircle } from 'lucide-react';

const INITIAL_BOARD: BoardState = Array(9).fill(null);

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function App() {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winningPattern, setWinningPattern] = useState<number[] | null>(null);

  // Scores tracked inside localStorage or default
  const [scores, setScores] = useState<Scores>(() => {
    try {
      const saved = localStorage.getItem('ttt-neon-3d-scores');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not read scores from localStorage", e);
    }
    return { xWins: 0, oWins: 0, draws: 0 };
  });

  // Keep scores updated in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ttt-neon-3d-scores', JSON.stringify(scores));
    } catch (e) {
      console.warn("Could not write scores to localStorage", e);
    }
  }, [scores]);

  // Check for win states
  const checkWinner = (currentBoard: BoardState): WinInfo | null => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return {
          indices: combo,
          winner: currentBoard[a] as Player
        };
      }
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameStatus !== 'playing') return;

    // 1. Play satisfactory modern audio click notes
    if (currentPlayer === 'X') {
      playClickX();
    } else {
      playClickO();
    }

    // 2. Compute next board state
    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);

    const winInfo = checkWinner(nextBoard);

    if (winInfo) {
      // We have a winner!
      setWinningPattern(winInfo.indices);
      setGameStatus(winInfo.winner === 'X' ? 'win_X' : 'win_O');
      
      // Update score tracker
      setScores(prev => ({
        ...prev,
        xWins: winInfo.winner === 'X' ? prev.xWins + 1 : prev.xWins,
        oWins: winInfo.winner === 'O' ? prev.oWins + 1 : prev.oWins
      }));

      // Play joyful cyber notes
      playWinMelody(winInfo.winner);
    } else if (nextBoard.every(cell => cell !== null)) {
      // Draw match!
      setGameStatus('draw');
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));

      // Play drawing chime
      playDrawSound();
    } else {
      // Toggle offline players
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    playResetChime();
    setBoard(INITIAL_BOARD);
    setGameStatus('playing');
    setWinningPattern(null);
  };

  const clearScores = () => {
    try {
      playResetChime();
      const freshScores = { xWins: 0, oWins: 0, draws: 0 };
      setScores(freshScores);
      localStorage.setItem('ttt-neon-3d-scores', JSON.stringify(freshScores));
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-[#0f0f1a] text-neutral-100 p-4 relative overflow-x-hidden font-sans pb-10">
      
      {/* Dynamic ambient cyber neon gradients */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-pink-500/5 blur-[150px] pointer-events-none translate-y-1/3" />

      {/* HEADER BAR */}
      <header className="w-full max-w-4xl flex justify-between items-center py-4 border-b border-indigo-950/20 mb-4 select-none">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-600 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Gamepad2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase font-display bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
              Tic-Tac-Toe 3D
            </h1>
            <p className="text-[10px] text-neutral-400 font-medium">Local 2-Player Pass & Play</p>
          </div>
        </div>

        {/* Audio feedback notifier bubble */}
        <div className="flex items-center gap-1.5 bg-neutral-900/50 border border-neutral-800/40 rounded-full px-3 py-1 text-xs text-neutral-400">
          <Volume2 size={12} className="text-indigo-400 animate-pulse" />
          <span className="font-mono text-[9px]">Web Audio ON</span>
        </div>
      </header>

      {/* MAIN CONTAINER WITH SIDEBAR FOR DESKTOP ADSTERRA BANNER */}
      <main className="w-full max-w-5xl flex-1 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 xl:gap-14 my-auto px-2 py-4">
        
        {/* PLAYABLE AREA */}
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* SCOREBOARD COMPONENT */}
          <ScoreBoard 
            scores={scores} 
            currentPlayer={currentPlayer} 
            gameStatus={gameStatus} 
            onClearScores={clearScores} 
          />

          {/* INTERACTIVE 3D GAME BOARD */}
          <GameBoard 
            board={board} 
            onCellClick={handleCellClick} 
            currentPlayer={currentPlayer}
            winningPattern={winningPattern}
            gameStatus={gameStatus}
          />

          {/* WIN/LOSE DISPLAY & GAME SUMMARY */}
          <div className="min-h-[44px] flex flex-col items-center justify-center text-center mt-3 mb-6 select-none">
            {gameStatus === 'win_X' && (
              <div className="animate-bounce flex items-center gap-2 bg-[#00ffff]/10 border border-[#00ffff]/30 rounded-full px-6 py-2 shadow-[0_0_15px_rgba(0,255,255,0.15)] text-sm font-bold text-[#00ffff] font-display">
                <Sparkles size={16} />
                Cyan Player X Dominates the Match!
              </div>
            )}
            {gameStatus === 'win_O' && (
              <div className="animate-bounce flex items-center gap-2 bg-[#ff2a85]/10 border border-[#ff2a85]/30 rounded-full px-6 py-2 shadow-[0_0_15px_rgba(255,42,133,0.15)] text-sm font-bold text-[#ff2a85] font-display">
                <Sparkles size={16} />
                Hot Pink Player O Dominates the Match!
              </div>
            )}
            {gameStatus === 'draw' && (
              <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-700/50 rounded-full px-6 py-2 text-sm font-bold text-neutral-200">
                <AlertCircle size={16} className="text-indigo-400" />
                Strategic Tie! Both Players Matched Perfectly.
              </div>
            )}
            {gameStatus === 'playing' && (
              <p className="text-xs text-neutral-400 tracking-wide font-medium italic">
                Move cursor or swipe screen to rotate grid in 3D perspective
              </p>
            )}
          </div>

          {/* PERMANENT PLAY AGAIN BUTTON */}
          <div className="w-full max-w-sm flex justify-center pb-2">
            <button
              id="play-again-btn"
              onClick={resetGame}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(109,40,217,0.35)] hover:shadow-[0_8px_25px_rgba(109,40,217,0.45)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer font-display tracking-wide"
            >
              <RotateCcw size={16} className="animate-[spin_4s_linear_infinite]" />
              PLAY AGAIN
            </button>
          </div>
        </div>

        {/* ADSTERRA BANNER COLUMN */}
        <div className="flex flex-col items-center justify-center xl:pt-14 shrink-0">
          <AdsterraAd />
        </div>

      </main>

      {/* FOOTER BAR */}
      <footer className="w-full max-w-md mx-auto pt-6 text-center select-none text-[10px] text-neutral-500 flex flex-col items-center gap-1 opacity-80">
        <p>No Bots or Single-Player modes. Standard Pass & Play only.</p>
        <p className="font-mono text-[9px] mt-0.5 max-w-xs text-neutral-600">
          Dynamic 3D neon layout with real-time Web Audio synthesizer sounds.
        </p>
      </footer>
    </div>
  );
}
