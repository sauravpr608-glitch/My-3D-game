import React, { useState, useEffect } from 'react';
import { Gift, Timer, Lock, CheckCircle2, Award, Zap, Sparkles } from 'lucide-react';

interface RewardState {
  clicks: number;
  lastClickTime: number; // ms timestamp
  banStartTime: number;  // ms timestamp for 24h ban
}

const STORAGE_KEY = 'ttt-neon-reward-state';
const SMART_LINK = 'https://www.effectivecpmnetwork.com/nb3asd3g?key=acf924b05f8d186f2da4d466e30e7851';

export const RewardClaim: React.FC = () => {
  const [rewardState, setRewardState] = useState<RewardState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure standard fields exist
        return {
          clicks: parsed.clicks || 0,
          lastClickTime: parsed.lastClickTime || 0,
          banStartTime: parsed.banStartTime || 0,
        };
      }
    } catch (e) {
      console.warn('Could not read reward state from localStorage', e);
    }
    return { clicks: 0, lastClickTime: 0, banStartTime: 0 };
  });

  const [timeRemaining, setTimeRemaining] = useState<number>(0); // remaining seconds for 10-minute lock
  const [banRemaining, setBanRemaining] = useState<number>(0);  // remaining seconds for 24h lock

  // Persistence write-back
  const saveState = (newState: RewardState) => {
    setRewardState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('Could not save reward state to localStorage', e);
    }
  };

  useEffect(() => {
    const updateTimers = () => {
      const now = Date.now();
      const tenMinutesMs = 10 * 60 * 1000;
      const twentyFourHoursMs = 24 * 60 * 60 * 1000;

      // 1. Check if 24-hour daily limit ban is active (user completed 3 clicks)
      if (rewardState.clicks >= 3) {
        const elapsedSinceBan = now - rewardState.banStartTime;
        if (elapsedSinceBan >= twentyFourHoursMs) {
          // 24 hours have elapsed, reset the cycle!
          const resetState = { clicks: 0, lastClickTime: 0, banStartTime: 0 };
          saveState(resetState);
          setBanRemaining(0);
          setTimeRemaining(0);
        } else {
          setBanRemaining(Math.ceil((twentyFourHoursMs - elapsedSinceBan) / 1000));
          setTimeRemaining(0);
        }
      } else {
        setBanRemaining(0);
        // 2. Check if 10-minute cooldown is active from last click
        if (rewardState.lastClickTime > 0) {
          const elapsedSinceClick = now - rewardState.lastClickTime;
          if (elapsedSinceClick < tenMinutesMs) {
            setTimeRemaining(Math.ceil((tenMinutesMs - elapsedSinceClick) / 1000));
          } else {
            setTimeRemaining(0);
          }
        } else {
          setTimeRemaining(0);
        }
      }
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [rewardState]);

  const handleRewardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent interaction if locked
    if (banRemaining > 0 || timeRemaining > 0) {
      e.preventDefault();
      return;
    }

    const now = Date.now();
    const nextClicks = rewardState.clicks + 1;
    let nextBanStartTime = rewardState.banStartTime;

    if (nextClicks >= 3) {
      // Completed the 3rd click, engage 24 hour ban starting now
      nextBanStartTime = now;
    }

    const updatedState = {
      clicks: nextClicks,
      lastClickTime: now,
      banStartTime: nextBanStartTime,
    };

    saveState(updatedState);
  };

  // Format countdown text helper
  const formatCountdown = (totalSeconds: number) => {
    const mm = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const ss = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Determine dynamic visual classes & content based on current cooldown state
  const is24hLocked = banRemaining > 0;
  const is10mLocked = timeRemaining > 0;
  const isLocked = is24hLocked || is10mLocked;

  // Render indicator dots representing clicks left today [● ● ●]
  const renderIndicatorSlots = () => {
    const slots = [];
    for (let i = 1; i <= 3; i++) {
      const active = rewardState.clicks >= i;
      slots.push(
        <span 
          key={i} 
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            active 
              ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' 
              : 'bg-neutral-800 border border-neutral-700'
          }`}
          title={active ? `Reward ${i} claimed` : `Reward ${i} available`}
        />
      );
    }
    return slots;
  };

  return (
    <div id="reward-vault-widget" className="w-full max-w-sm rounded-2xl bg-neutral-950/90 border border-emerald-950/40 p-5 flex flex-col items-center justify-center select-none shadow-[0_8px_32px_0_rgba(4,120,87,0.1)] relative overflow-hidden transition-all duration-300 hover:border-emerald-500/25">
      {/* Background cyber grid accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-emerald-500/30 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-emerald-500/30 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-emerald-500/30 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-emerald-500/30 rounded-br-lg" />

      {/* Title & Energy Multiplier */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-neutral-900">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-emerald-400 animate-pulse" />
          <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-300 font-display">
            REWARD VAULT
          </h2>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-950/30 border border-emerald-900/30 rounded-full px-2 py-0.5 text-[9px] text-emerald-400 font-mono">
          <Zap size={10} className="fill-emerald-400" />
          <span>2X SCORE MULTIPLIER</span>
        </div>
      </div>

      {/* Visual Lootbox / Graphic */}
      <div className="relative w-16 h-16 rounded-2xl bg-emerald-950/15 border border-emerald-800/20 flex items-center justify-center mb-3">
        <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl blur-md" />
        <Gift 
          size={32} 
          className={`transition-transform duration-500 ${
            isLocked ? 'text-neutral-600' : 'text-emerald-400 animate-bounce'
          }`} 
        />
      </div>

      {/* Headline status info */}
      <div className="text-center mb-4">
        {is24hLocked ? (
          <p className="text-xs font-semibold text-neutral-400">
            Energy Expelled
          </p>
        ) : is10mLocked ? (
          <p className="text-xs font-semibold text-neutral-400 flex items-center justify-center gap-1">
            <Timer size={12} className="text-amber-500 animate-spin" />
            Cooldown Recharge
          </p>
        ) : (
          <p className="text-xs font-bold text-emerald-400 animate-pulse flex items-center justify-center gap-1">
            <Sparkles size={12} className="text-emerald-400" />
            Neon Loot Box Ready!
          </p>
        )}
        <p className="text-[10px] text-neutral-500 mt-1 max-w-[240px] leading-relaxed">
          {is24hLocked 
            ? 'Your energy grid needs deep charging. Refreshes automatically in 24 hours.' 
            : is10mLocked 
              ? 'Loading security protocol bypass for the next claim link.'
              : 'Claim a victory credit instantly. Generates dynamic multipliers!'}
        </p>
      </div>

      {/* Claim Indicator Nodes */}
      <div className="flex items-center gap-2.5 mb-5 bg-neutral-900/30 border border-neutral-900 px-4 py-2 rounded-full">
        <span className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase font-mono mr-1">
          Daily Claims:
        </span>
        <div className="flex items-center gap-2">
          {renderIndicatorSlots()}
        </div>
        <span className="text-[10px] font-bold text-neutral-400 ml-1 font-mono">
          ({rewardState.clicks}/3)
        </span>
      </div>

      {/* ATTRACIVE CLAIM BUTTON / ANCHOR SMART LINK */}
      <a
        id="claim-reward-btn"
        href={isLocked ? undefined : SMART_LINK}
        target={isLocked ? undefined : '_blank'}
        rel={isLocked ? undefined : 'noopener noreferrer'}
        onClick={handleRewardClick}
        className={`w-full py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-display font-bold text-sm tracking-wide transition-all duration-300 select-none ${
          is24hLocked 
            ? 'bg-neutral-900 border border-neutral-800 text-neutral-600 cursor-not-allowed'
            : is10mLocked
              ? 'bg-amber-950/20 border border-amber-900/30 text-amber-500/80 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
        }`}
      >
        {is24hLocked ? (
          <>
            <Lock size={15} />
            <span>Daily Limit Reached! Come Back Tomorrow</span>
          </>
        ) : is10mLocked ? (
          <>
            <Timer size={15} className="animate-pulse" />
            <span>Wait: {formatCountdown(timeRemaining)}</span>
          </>
        ) : (
          <>
            <Gift size={15} className="animate-pulse" />
            <span>Claim 2X Reward</span>
          </>
        )}
      </a>
    </div>
  );
};
