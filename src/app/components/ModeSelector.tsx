'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Volume2, 
  Sun, 
  Flame, 
  Heart, 
  Scissors, 
  Type,
  ChevronDown
} from 'lucide-react';

export type ChatMode = 
  | 'historian' 
  | 'morgan' 
  | 'jamaican' 
  | 'unfiltered' 
  | 'grandma' 
  | 'barbershop';

interface ModeSelectorProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

interface ModeInfo {
  id: ChatMode;
  name: string;
  shortName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const voiceModes: ModeInfo[] = [
  {
    id: 'morgan',
    name: 'Morgan Freeman Voice',
    shortName: 'Morgan Freeman',
    description: 'Voice style - Calm, wise storytelling',
    icon: <Volume2 size={18} />,
    color: 'var(--accent-gold)'
  }
];

const textModes: ModeInfo[] = [
  {
    id: 'historian',
    name: 'Historian Narrator',
    shortName: 'Historian',
    description: 'Documentary-style wisdom',
    icon: <BookOpen size={18} />,
    color: 'var(--accent-red)'
  },
  {
    id: 'jamaican',
    name: 'Jamaican Vibes',
    shortName: 'Jamaica',
    description: 'Caribbean patois energy',
    icon: <Sun size={18} />,
    color: 'var(--accent-green)'
  },
  {
    id: 'unfiltered',
    name: 'Unfiltered Real Talk',
    shortName: 'Real Talk',
    description: 'No filter, all facts',
    icon: <Flame size={18} />,
    color: '#8B4513'
  },
  {
    id: 'grandma',
    name: 'Southern Grandma',
    shortName: 'Grandma',
    description: 'Warm wisdom & love',
    icon: <Heart size={18} />,
    color: '#D4A574'
  },
  {
    id: 'barbershop',
    name: 'Barbershop Mode',
    shortName: 'Barbershop',
    description: 'Debate & discussion',
    icon: <Scissors size={18} />,
    color: '#4A90A4'
  }
];

const allModes = [...voiceModes, ...textModes];

export default function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const currentTextMode = textModes.find(m => m.id === currentMode);
  const isTextModeSelected = !!currentTextMode;

  const handleTextModeSelect = (modeId: ChatMode) => {
    onModeChange(modeId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Desktop Layout: Side by side */}
      <div className="hidden md:flex gap-6">
        {/* Voice Style - Left */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Volume2 size={14} />
            <span className="typewriter opacity-75">SELECT VOICE:</span>
          </div>
          <div className="flex gap-2">
            {voiceModes.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-2 px-4 py-2 border-2 transition-all
                  ${currentMode === mode.id 
                    ? 'border-white text-white' 
                    : 'border-[var(--ink-faded)] text-[var(--ink-faded)] hover:border-white hover:text-white'
                  }
                `}
                style={{
                  backgroundColor: currentMode === mode.id ? mode.color : 'transparent',
                  boxShadow: currentMode === mode.id ? '2px 2px 0px rgba(255,255,255,0.3)' : 'none'
                }}
              >
                {mode.icon}
                <span className="font-bold text-sm">{mode.shortName}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-[var(--ink-faded)] opacity-50"></div>

        {/* Text Styles - Right */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Type size={14} />
            <span className="typewriter opacity-75">TEXT STYLES:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {textModes.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-2 px-3 py-2 border-2 transition-all
                  ${currentMode === mode.id 
                    ? 'border-white text-white' 
                    : 'border-[var(--ink-faded)] text-[var(--ink-faded)] hover:border-white hover:text-white'
                  }
                `}
                style={{
                  backgroundColor: currentMode === mode.id ? mode.color : 'transparent',
                  boxShadow: currentMode === mode.id ? '2px 2px 0px rgba(255,255,255,0.3)' : 'none'
                }}
              >
                {mode.icon}
                <span className="font-bold text-sm">{mode.shortName}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout: Stacked with Dropdown */}
      <div className="md:hidden space-y-4">
        {/* Voice Style */}
        <div>
          <div className="flex items-center gap-2 text-sm mb-2">
            <Volume2 size={14} />
            <span className="typewriter opacity-75">SELECT VOICE:</span>
          </div>
          <div className="flex gap-2">
            {voiceModes.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 border-2 transition-all whitespace-nowrap
                  ${currentMode === mode.id 
                    ? 'border-white text-white' 
                    : 'border-[var(--ink-faded)] text-[var(--ink-faded)]'
                  }
                `}
                style={{
                  backgroundColor: currentMode === mode.id ? mode.color : 'transparent'
                }}
              >
                {mode.icon}
                <span className="text-xs font-bold">{mode.shortName}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Text Styles - Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Type size={14} />
            <span className="typewriter opacity-75">TEXT STYLES:</span>
          </div>
          
          {/* Dropdown Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`
              w-full flex items-center justify-between gap-2 px-4 py-2.5 border-2 transition-all
              ${isTextModeSelected 
                ? 'border-white text-white' 
                : 'border-[var(--ink-faded)] text-[var(--ink-faded)]'
              }
            `}
            style={{
              backgroundColor: isTextModeSelected ? currentTextMode?.color : 'transparent'
            }}
          >
            <div className="flex items-center gap-2">
              {isTextModeSelected ? (
                <>
                  {currentTextMode?.icon}
                  <span className="text-sm font-bold">{currentTextMode?.shortName}</span>
                </>
              ) : (
                <>
                  <Type size={18} />
                  <span className="text-sm font-bold">Select a text style...</span>
                </>
              )}
            </div>
            <ChevronDown 
              size={18} 
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-[var(--ink-black)] border-2 border-[var(--ink-faded)] shadow-lg"
                style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}
              >
                {textModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleTextModeSelect(mode.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 transition-all text-left
                      ${currentMode === mode.id 
                        ? 'text-white' 
                        : 'text-[var(--ink-faded)] hover:text-white hover:bg-[var(--ink-faded)]'
                      }
                    `}
                    style={{
                      backgroundColor: currentMode === mode.id ? mode.color : 'transparent'
                    }}
                  >
                    {mode.icon}
                    <div className="flex-1">
                      <span className="text-sm font-bold block">{mode.shortName}</span>
                      <span className="text-xs opacity-75">{mode.description}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Current mode description */}
      <motion.div
        key={currentMode}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs typewriter opacity-75"
      >
        ★ {allModes.find(m => m.id === currentMode)?.description}
      </motion.div>
    </div>
  );
}
