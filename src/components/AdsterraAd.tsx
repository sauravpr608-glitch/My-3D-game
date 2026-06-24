import React, { useEffect, useRef, useState } from 'react';
import { Shield, Sparkles, ShieldCheck } from 'lucide-react';

interface WindowWithAtOptions extends Window {
  atOptions?: any;
}

export const AdsterraAd: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const [isSecured, setIsSecured] = useState(false);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    // Clear any previous children during re-renders or hot-reloads
    container.innerHTML = '';

    // Safety Interceptor Layer: Save original window context functions to prevent bypasses
    const originalOpen = window.open;
    const originalAlert = window.alert;

    // Intercept/block forced redirection triggers originating from script loads
    (window as any).open = function (url?: string | URL, target?: string, features?: string) {
      console.warn('[Security Guard] Blocked unauthorized popup/window.open to:', url);
      return null;
    };
    (window as any).alert = function (message?: any) {
      console.warn('[Security Guard] Suppressed ad popup alert dialog:', message);
    };

    try {
      // 1. Set global atOptions on window object as required by Adsterra (300x250 format)
      const customWindow = window as WindowWithAtOptions;
      customWindow.atOptions = {
        key: '33ac7f03ded40cafe304173896dcc2db',
        format: 'iframe',
        height: 250,
        width: 300,
        params: {},
      };

      // 2. Create the ad invocation script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.highperformanceformat.com/33ac7f03ded40cafe304173896dcc2db/invoke.js';
      script.async = true;

      script.onerror = () => {
        console.warn('[Adsterra] Ad blocker detected or script failed to load.');
        setLoadError(true);
      };

      // 3. Setup a MutationObserver to watch for dynamic iframe elements and inject the client-side sandbox safety wrapper
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLIFrameElement) {
              const iframe = node as HTMLIFrameElement;
              console.log('[Security Guard] Intercepted new Adsterra iframe injection.');
              
              // Enforce rigid sandbox parameters:
              // - allow-scripts: Enables ads to load script assets.
              // - allow-same-origin: Enables local layout rendering.
              // - Omit allow-top-navigation & allow-popups to completely intercept forced redirects and blank popups!
              iframe.setAttribute(
                'sandbox',
                'allow-scripts allow-same-origin allow-forms'
              );
              
              setIsSecured(true);
              console.log('[Security Guard] Applied Sandbox security policy successfully to ad iframe.');
            }
          });
        });
      });

      // Observe child list additions inside our ad container
      observer.observe(container, { childList: true, subtree: true });

      // 4. Append to our scoped container
      container.appendChild(script);

      return () => {
        observer.disconnect();
        // Restore window handlers
        (window as any).open = originalOpen;
        (window as any).alert = originalAlert;
      };
    } catch (err) {
      console.error('[Adsterra] Error creating Adsterra script elements:', err);
      setLoadError(true);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
      (window as any).open = originalOpen;
      (window as any).alert = originalAlert;
    };
  }, []);

  return (
    <div className="flex flex-col items-center select-none animate-fade-in my-2">
      {/* Visual Header displaying protection state */}
      <div className="flex items-center justify-between w-[304px] px-2 mb-2">
        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-semibold text-neutral-500">
          <Shield size={11} className="text-pink-500" />
          <span>SPONSORED AD</span>
        </div>
        <div className="flex items-center gap-1 text-[8px] font-mono text-cyan-400/80 bg-cyan-950/30 border border-cyan-800/30 rounded-full px-2 py-0.5">
          <ShieldCheck size={9} className="text-[#00ffff] animate-pulse" />
          <span>RED_SECURE_ACTIVE</span>
        </div>
      </div>

      {/* Main 300x250 Visual Ad Box container */}
      <div className="relative w-[304px] h-[254px] rounded-2xl bg-neutral-950/90 border border-violet-950/60 p-[2px] flex items-center justify-center overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        {/* Neon corner lines to blend with the TTT 3D style */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/40 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-pink-500/40 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-pink-500/40 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/40 rounded-br-lg" />

        {/* Dynamic target container for Adsterra script */}
        <div 
          ref={adContainerRef} 
          className="w-[300px] h-[250px] flex items-center justify-center rounded-xl bg-slate-950/60"
        >
          {/* Default/Placeholder overlay that will get pushed or replaced when script fires */}
          {loadError ? (
            <div className="p-4 text-center flex flex-col items-center justify-center gap-2 text-neutral-500 font-mono text-xs">
              <span className="text-3xl animate-pulse">📡</span>
              <p className="text-neutral-400 font-display font-semibold tracking-wide text-sm">Ad Blocked Safely</p>
              <p className="text-[10px] leading-relaxed text-neutral-600 max-w-[220px]">
                To support 3D Neon Tic-Tac-Toe developments, consider whitelisting our secure app domain!
              </p>
            </div>
          ) : (
            <div className="p-4 text-center flex flex-col items-center justify-center gap-3 text-neutral-500 font-mono text-xs">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400/20 to-pink-500/20 flex items-center justify-center animate-spin text-cyan-400 text-sm font-bold">
                ♦
              </div>
              <div>
                <p className="text-neutral-400 animate-pulse text-[10px] tracking-wider font-semibold uppercase">CONNECTING SAFE AD...</p>
                <p className="text-[9px] leading-normal text-neutral-600 mt-1">300x250 Sandbox Protected Space</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
