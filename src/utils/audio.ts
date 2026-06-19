// Retro Synthesizer powered by Web Audio API
// Handles browser constraints (resumes AudioContext lazily on user tap)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    // Standard audio context initializer supporting older search web browsers if necessary
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play a quick synth frequency sweep for grid cell X
export function playClickX() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create oscillator and gain node
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1300, now + 0.08);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (error) {
    console.warn("Audio feedback blocked or failed:", error);
  }
}

// Play a deeper bubble-like envelope for grid cell O
export function playClickO() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (error) {
    console.warn("Audio feedback blocked or failed:", error);
  }
}

// Win Fanfare: Fast, energetic neon sci-fi melody
export function playWinMelody(winner: 'X' | 'O') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Choose notes based on who won
    const notes = winner === 'X' 
      ? [523.25, 659.25, 783.99, 1046.50] // C5 -> E5 -> G5 -> C6 (Cyan Fanfare)
      : [440.00, 554.37, 659.25, 880.00]; // A4 -> C#5 -> E5 -> A5 (Hot Pink Fanfare)
      
    notes.forEach((freq, idx) => {
      const toneTime = now + (idx * 0.11);
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = winner === 'X' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, toneTime);
      
      gain.gain.setValueAtTime(0.12, toneTime);
      gain.gain.exponentialRampToValueAtTime(0.005, toneTime + 0.25);
      
      // Simple custom lowpass filter to soften saw waves and sound analog
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, toneTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(toneTime);
      osc.stop(toneTime + 0.25);
    });
  } catch (error) {
    console.warn("Audio win melody failed:", error);
  }
}

// Draw Chord: A mysterious, slightly dissonant futuristic chime
export function playDrawSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const frequencies = [293.66, 349.23, 392.00]; // D4, F4, G4 (Suspended chord feel)
    
    frequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq - 10, now + 0.4);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.5);
    });
  } catch (error) {
    console.warn("Audio draw chord failed:", error);
  }
}

// Reset Sound: Dual futuristic digital ascending sound
export function playResetChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const notes = [329.63, 493.88]; // E4 -> B4
    
    notes.forEach((freq, idx) => {
      const toneTime = now + (idx * 0.08);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, toneTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, toneTime + 0.15);
      
      gain.gain.setValueAtTime(0.15, toneTime);
      gain.gain.exponentialRampToValueAtTime(0.005, toneTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(toneTime);
      osc.stop(toneTime + 0.2);
    });
  } catch (error) {
    console.warn("Audio reset sound failed:", error);
  }
}
