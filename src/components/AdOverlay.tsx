import React, { useState, useEffect } from 'react';
import { Play, ShieldAlert, X } from 'lucide-react';

interface AdOverlayProps {
  onClose: () => void;
}

export const AdOverlay: React.FC<AdOverlayProps> = ({ onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Ad countdown tick
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-neutral-900 border border-violet-800/40 p-6 shadow-2xl flex flex-col justify-between text-neutral-200">
        
        {/* Header / Brand info */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
              AL
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide font-display">AppLovin network</h4>
              <p className="text-[10px] text-neutral-500 font-mono">Mobile Web Interstitial Ad</p>
            </div>
          </div>

          {/* Countdown & Skip Button */}
          {canSkip ? (
            <button
              onClick={onClose}
              className="group flex items-center gap-1.5 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-full px-3.5 py-1 text-xs text-white font-medium hover:text-pink-400 transition-all transform hover:scale-105"
            >
              Skip Ad
              <X size={14} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>
          ) : (
            <div className="bg-neutral-850 border border-neutral-800/80 rounded-full px-3 py-1 text-xs text-neutral-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              Ad plays in {countdown}s
            </div>
          )}
        </div>

        {/* Ad Showcase Body (A highly polished visual for a mock retro-future styled space game) */}
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          
          {/* Main graphic */}
          <div className="relative w-[180px] h-[110px] rounded-2xl bg-gradient-to-b from-indigo-950 to-neutral-950 border border-violet-500/20 shadow-xl overflow-hidden mb-6 flex flex-col items-center justify-center group cursor-pointer">
            {/* Absolute radial details */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25)_0%,transparent_75%)] pointer-events-none" />
            
            {/* Animated lasers */}
            <div className="absolute left-[30%] top-1/4 w-[1px] h-[30px] bg-cyan-400/80 rotate-45 animate-pulse" />
            <div className="absolute right-[33%] bottom-1/4 w-[1px] h-[40px] bg-pink-500/80 -rotate-45 animate-pulse" />
            
            <div className="z-10 flex flex-col items-center">
              <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,42,133,0.5)]">🛸</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono mt-1 mt-1 animate-bounce">NEON STRIKER</span>
            </div>
          </div>

          <span className="text-[9px] font-mono uppercase tracking-wider text-pink-500 font-bold mb-1">
            Now Trending
          </span>
          <h3 className="text-lg font-extrabold text-white font-display uppercase tracking-wide">
            NEON STRIKER 3D: SPACE EVOLUTION
          </h3>
          <p className="text-xs text-neutral-400 max-w-[280px] mt-2 mb-6">
            Pilot customized cyberpunk ship modules through gravity rifts and solar loops. No downloads required to start!
          </p>

          {/* CTA Button */}
          <a
            href="https://www.applovin.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full max-w-[240px] shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all transform hover:-translate-y-0.5 hover:scale-102 cursor-pointer"
          >
            Play Offline Free
            <Play size={14} fill="currentColor" />
          </a>
        </div>

        {/* Footer info/Disclaimer */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-center gap-1.5 text-[9px] text-neutral-500">
          <ShieldAlert size={10} />
          <span>Real AppLovin Web SDK initialized on head. Trigger fired 1.2s post match.</span>
        </div>
      </div>
    </div>
  );
};
