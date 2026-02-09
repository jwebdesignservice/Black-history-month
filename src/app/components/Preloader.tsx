'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentHeadline, setCurrentHeadline] = useState(0);

  const headlines = [
    "LOADING THE ARCHIVES...",
    "GATHERING HISTORICAL RECORDS...",
    "PREPARING YOUR JOURNEY...",
    "INKING THE PAGES...",
    "READY TO PRINT..."
  ];

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Cycle through headlines
    const headlineInterval = setInterval(() => {
      setCurrentHeadline(prev => (prev + 1) % headlines.length);
    }, 800);

    // Complete loading after progress reaches 100
    const checkComplete = setInterval(() => {
      if (loadingProgress >= 100) {
        setTimeout(() => setIsLoading(false), 500);
        clearInterval(checkComplete);
      }
    }, 100);

    return () => {
      clearInterval(progressInterval);
      clearInterval(headlineInterval);
      clearInterval(checkComplete);
    };
  }, [loadingProgress, headlines.length]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: 'var(--paper-cream)' }}
        >
          {/* Paper texture background */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: "url('/white-paper-texture-background.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          {/* Ink splatter decorations */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-10 left-10 text-6xl opacity-10"
          >
            ✦
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-10 right-10 text-6xl opacity-10"
          >
            ◆
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute top-1/4 right-20 text-4xl opacity-10"
          >
            ★
          </motion.div>

          {/* Main content container */}
          <div className="relative z-10 text-center px-6 max-w-2xl">
            
            {/* Newspaper masthead animation */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8"
            >
              {/* Top decorative line */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-1 bg-[var(--ink-black)] mb-2"
              />
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="h-[3px] bg-[var(--ink-black)] mb-4"
              />

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, letterSpacing: '0.1em' }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="headline text-3xl md:text-5xl lg:text-6xl mb-2"
                style={{ color: 'var(--ink-black)' }}
              >
                THE BLACK HISTORY
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, letterSpacing: '0.15em' }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="headline text-4xl md:text-6xl lg:text-7xl"
                style={{ color: 'var(--ink-black)' }}
              >
                CHRONICLE
              </motion.h1>

              {/* Bottom decorative lines */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="h-[3px] bg-[var(--ink-black)] mt-4"
              />
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="h-1 bg-[var(--ink-black)] mt-2"
              />
            </motion.div>

            {/* Pan-African colors bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="flex justify-center gap-3 mb-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                className="w-8 h-8 bg-[var(--accent-red)]"
                style={{ boxShadow: '2px 2px 0px var(--ink-black)' }}
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-8 h-8 bg-[var(--accent-gold)]"
                style={{ boxShadow: '2px 2px 0px var(--ink-black)' }}
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-8 h-8 bg-[var(--accent-green)]"
                style={{ boxShadow: '2px 2px 0px var(--ink-black)' }}
              />
            </motion.div>

            {/* Loading headline ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mb-6"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentHeadline}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="typewriter text-sm md:text-base tracking-widest"
                  style={{ color: 'var(--ink-faded)' }}
                >
                  {headlines[currentHeadline]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Progress bar - newspaper style */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="relative mx-auto max-w-md"
            >
              {/* Progress bar container */}
              <div 
                className="h-6 border-4 border-[var(--ink-black)] bg-white relative overflow-hidden"
                style={{ boxShadow: '4px 4px 0px var(--ink-black)' }}
              >
                {/* Progress fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[var(--ink-black)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(loadingProgress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Halftone overlay effect */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '4px 4px'
                  }}
                />
              </div>

              {/* Percentage text */}
              <motion.p
                className="mt-3 typewriter text-lg font-bold"
                style={{ color: 'var(--ink-black)' }}
              >
                {Math.min(Math.round(loadingProgress), 100)}%
              </motion.p>
            </motion.div>

            {/* Edition date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-8"
            >
              <p 
                className="typewriter text-xs tracking-wider"
                style={{ color: 'var(--ink-faded)' }}
              >
                ★ SPECIAL EDITION ★ BLACK HISTORY MONTH {new Date().getFullYear()} ★
              </p>
            </motion.div>

            {/* Printing press animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="mt-6 flex justify-center items-center gap-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-6 bg-[var(--ink-black)]"
                  animate={{
                    scaleY: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Newspaper fold lines decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute top-1/2 left-0 right-0 h-px bg-[var(--ink-black)]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="absolute top-0 bottom-0 left-1/2 w-px bg-[var(--ink-black)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
