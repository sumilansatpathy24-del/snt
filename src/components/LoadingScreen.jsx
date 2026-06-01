import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShouldRender(false);
            if (onComplete) onComplete();
          }, 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617] text-white"
          exit={{ 
            y: '-100vh',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Futuristic grid overlay background */}
          <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

          {/* Glowing Orange Background Accent */}
          <div className="absolute w-[300px] h-[300px] bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
            {/* Animated Logo Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-8"
            >
              <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-brand-navy border border-brand-orange/30 shadow-glow-orange pulse-glow overflow-hidden">
                <img src="/images/logo.png" alt="Shree Nathji Transport Logo" className="w-20 h-20 object-contain" />
              </div>
            </motion.div>
 
            {/* Title Text Reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl md:text-3xl font-extrabold tracking-wider text-white"
            >
              SHREE NATHJI <span className="text-brand-orange">TRANSPORT</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-sm uppercase tracking-widest text-slate-400 font-medium"
            >
              Connecting Cargo, Delivering Trust
            </motion.p>

            {/* Custom Progress Bar */}
            <div className="w-64 h-1.5 bg-slate-900 rounded-full mt-10 overflow-hidden border border-white/5 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-orange to-brand-orangeLight shadow-[0_0_10px_rgba(249,93,2,0.5)]"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Percentage Text */}
            <motion.span 
              className="mt-3 text-sm font-semibold font-outfit text-brand-orange tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Math.min(progress, 100)}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
