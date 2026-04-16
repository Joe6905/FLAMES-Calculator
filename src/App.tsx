/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RefreshCcw, User, Users, Share2 } from 'lucide-react';

type FlamesResult = 'Friendship' | 'Love' | 'Affection' | 'Marriage' | 'Enmity' | 'Sister';

const FLAMES_MAP: Record<string, { label: FlamesResult; icon: string; description: string; color: string }> = {
  F: { label: 'Friendship', icon: '🤝', description: 'A bond that lasts forever.', color: 'text-blue-400' },
  L: { label: 'Love', icon: '❤️', description: 'True love is in the air!', color: 'text-pink-500' },
  A: { label: 'Affection', icon: '😊', description: 'Deep fondness and care.', color: 'text-yellow-400' },
  M: { label: 'Marriage', icon: '💍', description: 'A lifetime of togetherness.', color: 'text-purple-400' },
  E: { label: 'Enmity', icon: '⚔️', description: 'A bit of friction here...', color: 'text-red-500' },
  S: { label: 'Sister', icon: '👫', description: 'A pure, sibling-like bond.', color: 'text-green-400' },
};

const SOUNDS = {
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  MAGIC: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
};

export default function App() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.volume = 0.4;
    audio.play().catch(() => {
      // Ignore errors if browser blocks autoplay
    });
  };

  const validateInputs = () => {
    if (!name1.trim() || !name2.trim()) {
      setError('Both names are required');
      return false;
    }
    
    const alphaRegex = /^[a-zA-Z\s]+$/;
    if (!alphaRegex.test(name1) || !alphaRegex.test(name2)) {
      setError('Names must contain only letters');
      return false;
    }

    setError(null);
    return true;
  };

  const calculateFlames = () => {
    if (!validateInputs()) return;

    playSound(SOUNDS.CLICK);
    setIsCalculating(true);
    setResult(null);
    
    // Play magic sound during calculation
    playSound(SOUNDS.MAGIC);

    // Simulate calculation delay for effect
    setTimeout(() => {
      const n1 = name1.toLowerCase().replace(/\s/g, '').split('');
      const n2 = name2.toLowerCase().replace(/\s/g, '').split('');

      const n1Copy = [...n1];
      const n2Copy = [...n2];

      n1.forEach((char) => {
        const index = n2Copy.indexOf(char);
        if (index !== -1) {
          n2Copy.splice(index, 1);
          const n1Index = n1Copy.indexOf(char);
          if (n1Index !== -1) n1Copy.splice(n1Index, 1);
        }
      });

      const count = n1Copy.length + n2Copy.length;
      if (count === 0) {
        setResult('F');
        playSound(SOUNDS.SUCCESS);
        setIsCalculating(false);
        return;
      }

      let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
      let index = 0;

      while (flames.length > 1) {
        index = (index + count - 1) % flames.length;
        flames.splice(index, 1);
      }

      setResult(flames[0]);
      playSound(SOUNDS.SUCCESS);
      setIsCalculating(false);
    }, 2000);
  };

  const reset = () => {
    playSound(SOUNDS.CLICK);
    setName1('');
    setName2('');
    setError(null);
    setResult(null);
  };

  const handleShare = async () => {
    playSound(SOUNDS.CLICK);
    const shareData = {
      title: 'FLAMES Calculator',
      text: `I just checked our destiny! ${name1} + ${name2} = ${resultData?.label}. Check yours here!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Result copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const resultData = useMemo(() => (result ? FLAMES_MAP[result] : null), [result]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Mesh Background */}
      <div className="mesh-bg" />
      
      {/* Glow Orbs */}
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-neon-purple/20 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-neon-pink/20 blur-[100px] rounded-full -z-10" />

      {/* Floating Hearts */}
      <div className="absolute top-[15%] right-[20%] text-neon-pink/20 text-5xl -z-10 animate-float">♥</div>
      <div className="absolute bottom-[15%] left-[15%] text-neon-pink/20 text-5xl -z-10 animate-float" style={{ animationDelay: '1s' }}>♥</div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-[500px]"
      >
        <div className="glass-card p-10 text-center relative">
          <header className="mb-10">
            <h1 className="text-[3.5rem] font-black tracking-[12px] text-gradient mb-2 leading-tight">
              FLAMES
            </h1>
            <p className="text-white/60 text-sm uppercase tracking-[2px]">
              Neon Fate Compatibility Engine
            </p>
          </header>

          <AnimatePresence mode="wait">
            {!result && !isCalculating ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="block text-[0.75rem] uppercase tracking-[1px] font-bold text-neon-pink">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name1}
                      onChange={(e) => {
                        setName1(e.target.value);
                        if (error) setError(null);
                      }}
                      className={`neon-input ${error && !name1.trim() ? 'border-red-500/50' : ''}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[0.75rem] uppercase tracking-[1px] font-bold text-neon-pink">
                      Crush Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter crush name"
                      value={name2}
                      onChange={(e) => {
                        setName2(e.target.value);
                        if (error) setError(null);
                      }}
                      className={`neon-input ${error && !name2.trim() ? 'border-red-500/50' : ''}`}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-xs font-medium uppercase tracking-wider"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  onClick={calculateFlames}
                  className="calculate-btn mt-5"
                >
                  Find Our Destiny
                </button>
              </motion.div>
            ) : isCalculating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative w-20 h-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-neon-purple border-t-transparent rounded-full"
                  />
                  <Heart className="absolute inset-0 m-auto w-8 h-8 text-neon-pink animate-pulse" />
                </div>
                <p className="text-neon-purple font-medium tracking-[2px] uppercase animate-pulse">
                  Consulting the stars...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="space-y-8"
              >
                <div className="flex justify-between pt-8 border-t border-white/10">
                  {['F', 'L', 'A', 'M', 'E', 'S'].map((letter) => (
                    <div 
                      key={letter} 
                      className={`letter-box ${result === letter ? 'active' : ''}`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>

                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="py-4"
                >
                  <span className="text-7xl block mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    {resultData?.icon}
                  </span>
                  <h2 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${resultData?.color} drop-shadow-[0_0_10px_currentColor]`}>
                    {resultData?.label}
                  </h2>
                  <p className="text-white/70 italic">
                    "{resultData?.description}"
                  </p>
                </motion.div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleShare}
                    className="w-full bg-neon-purple/20 hover:bg-neon-purple/30 text-white font-semibold py-4 rounded-full border border-neon-purple/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Result
                  </button>
                  <button
                    onClick={reset}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-4 rounded-full border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    Try Another Pair
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {result && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-neon-pink italic text-sm opacity-80">
              Destiny suggests: {resultData?.label} is in your stars.
            </div>
          )}
        </div>

        <footer className="mt-16 text-center">
          <p className="text-white/20 text-[10px] tracking-[3px] uppercase">
            Neon Fate Compatibility Engine v2.0
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
