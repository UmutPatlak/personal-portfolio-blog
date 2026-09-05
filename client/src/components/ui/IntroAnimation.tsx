import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'progress' | 'done'>('typing');

  const fullText = '>_ umut.dev';

  const handleComplete = useCallback(() => {
    sessionStorage.setItem('intro-seen', 'true');
    onComplete();
  }, [onComplete]);

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'typing') return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      setDisplayText(fullText.slice(0, currentIndex));
      if (currentIndex >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('progress'), 200);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [phase]);

  // Progress bar
  useEffect(() => {
    if (phase !== 'progress') return;

    const start = performance.now();
    const duration = 800;

    const animate = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);

      if (pct < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setPhase('done'), 300);
      }
    };

    requestAnimationFrame(animate);
  }, [phase]);

  // Trigger complete after done phase
  useEffect(() => {
    if (phase === 'done') {
      const timer = setTimeout(handleComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [phase, handleComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'var(--color-bg-primary)' }}
        >
          {/* Background ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
              style={{
                background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Terminal text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Terminal window frame */}
              <div
                className="rounded-2xl border p-6 sm:p-8 min-w-[300px] sm:min-w-[400px]"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-surface)',
                  boxShadow: 'var(--shadow-glow-lg)',
                }}
              >
                {/* Terminal dots */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>

                {/* Typed text */}
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span style={{ color: 'var(--color-text-tertiary)' }}>
                    {displayText.slice(0, 3)}
                  </span>
                  <span className="gradient-text">
                    {displayText.slice(3)}
                  </span>
                  {phase === 'typing' && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                      className="inline-block w-[3px] h-[1.2em] ml-1 align-middle"
                      style={{ background: 'var(--color-accent)' }}
                    />
                  )}
                </div>

                {/* Progress bar */}
                {phase === 'progress' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5"
                  >
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--color-bg-secondary)' }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-secondary), var(--color-accent-cyan))',
                        }}
                      />
                    </div>
                    <p
                      className="text-xs mt-2 tracking-wider"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      {progress >= 100 ? 'Ready.' : 'Initializing...'}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
