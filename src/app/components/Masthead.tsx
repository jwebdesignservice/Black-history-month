'use client';

import { motion } from 'framer-motion';

export default function Masthead() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.header 
      className="newspaper-section p-4 md:p-6 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top decorative bar */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b-[3px] border-[var(--ink-black)]">
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm typewriter">VOL. CXXVI</span>
          <span className="text-[var(--accent-gold)]">◆</span>
          <span className="text-xs md:text-sm typewriter">BLACK HISTORY MONTH EDITION</span>
        </div>
        <div className="text-xs md:text-sm typewriter hidden sm:block">
          PRICE: FREE KNOWLEDGE
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center py-4 md:py-6">
        <motion.div
          className="flex justify-center items-center gap-4 mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="hidden md:block w-16 h-[3px] bg-[var(--ink-black)]"></div>
          <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4"/>
            <path d="M30 50 L50 30 L70 50 L50 70 Z" fill="var(--accent-gold)" stroke="currentColor" strokeWidth="3"/>
          </svg>
          <div className="hidden md:block w-16 h-[3px] bg-[var(--ink-black)]"></div>
        </motion.div>

        <h1 className="headline text-3xl md:text-5xl lg:text-7xl tracking-wider mb-2">
          THE BLACK HISTORY
        </h1>
        <h1 className="headline text-4xl md:text-6xl lg:text-8xl tracking-wide mb-4 relative">
          <span className="relative">
            CHRONICLE
            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
              <path d="M0,6 Q50,0 100,6 T200,6" stroke="var(--accent-red)" strokeWidth="3" fill="none"/>
            </svg>
          </span>
        </h1>
        
        <p className="subheadline text-lg md:text-xl lg:text-2xl text-[var(--ink-faded)] mt-4">
          &ldquo;Celebrating Our Heritage, Educating Our Future&rdquo;
        </p>
      </div>

      {/* Bottom info bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t-[3px] border-double border-[var(--ink-black)]">
        <div className="flex items-center gap-2 text-sm md:text-base mb-2 sm:mb-0">
          <span className="bg-[var(--accent-red)] text-white px-2 py-0.5 font-bold text-xs uppercase">
            Live
          </span>
          <span className="typewriter">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-4 text-xs md:text-sm">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-pulse"></span>
            AI-Powered Edition
          </span>
          <span className="text-[var(--accent-gold)]">★</span>
          <span className="hidden sm:inline">Interactive Experience</span>
        </div>
      </div>
    </motion.header>
  );
}
