import React, { useEffect, useRef, useState } from 'react';
import { Shield } from 'lucide-react';

interface WindowWithAtOptions extends Window {
  atOptions?: any;
}

export const AdsterraAd: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    // Clear any previous children during re-renders or hot-reloads
    container.innerHTML = '';

    try {
      // 1. Set global atOptions on window object as required by Adsterra
      const customWindow = window as WindowWithAtOptions;
      customWindow.atOptions = {
        key: '67fe304b7c11c63f08089f943c5e36d3',
        format: 'iframe',
        height: 300,
        width: 160,
        params: {},
      };

      // 2. Create the ad invocation script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.highperformanceformat.com/67fe304b7c11c63f08089f943c5e36d3/invoke.js';
      script.async = true;

      script.onerror = () => {
        console.warn('[Adsterra] Script load errored or was blocked by an ad-blocker.');
        setLoadError(true);
      };

      // 3. Append to our scoped container
      container.appendChild(script);
    } catch (err) {
      console.error('[Adsterra] Error creating Adsterra script elements:', err);
      setLoadError(true);
    }

    return () => {
      // Clean up the container contents on unmount
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center select-none animate-fade-in">
      {/* Small Cyber Label */}
      <div className="flex items-center gap-1 mb-1.5 text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
        <Shield size={10} className="text-violet-500" />
        <span>SPONSORED LINK</span>
      </div>

      {/* Main 160x300 Visual Ad Box container */}
      <div className="relative w-[164px] h-[304px] rounded-2xl bg-neutral-950/80 border border-violet-950/40 p-[2px] flex items-center justify-center overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        {/* Neon corner lines to blend with the TTT 3D style */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400/40 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-pink-500/40 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-pink-500/40 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400/40 rounded-br-lg" />

        {/* Dynamic target container for Adsterra script */}
        <div 
          ref={adContainerRef} 
          className="w-[160px] h-[300px] flex items-center justify-center rounded-xl bg-slate-950/50"
        >
          {/* Default/Placeholder overlay that will get pushed or replaced when script fires */}
          {loadError ? (
            <div className="p-3 text-center flex flex-col items-center justify-center gap-1.5 text-neutral-500 font-mono text-[10px]">
              <span className="text-xl">📡</span>
              <p className="text-neutral-400">Ad Blocked</p>
              <p className="text-[8px] leading-tight text-neutral-600">Please disable your adblocker to support us.</p>
            </div>
          ) : (
            <div className="p-4 text-center flex flex-col items-center justify-center gap-2 text-neutral-500 font-mono text-[10px]">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-400/20 to-pink-500/20 flex items-center justify-center animate-spin text-cyan-400/70 text-xs">
                ♦
              </div>
              <p className="text-neutral-400 animate-pulse text-[9px] tracking-wide">CONNECTING AD...</p>
              <p className="text-[8px] leading-normal text-neutral-600">160x300 Adsterra Banner</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
