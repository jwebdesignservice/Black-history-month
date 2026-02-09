'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  Sun, 
  Heart, 
  ChevronDown,
  Mic2,
  Crown,
  Landmark,
  Music2,
  Sparkles,
  Globe,
  BookOpen,
  Users,
  Flame
} from 'lucide-react';

// Voice types for TTS
export type VoiceType = 'morgan' | 'hood' | 'caribbean' | 'auntie' | null;

// Topic types for learning
export type TopicType = 
  | 'civil_rights'
  | 'african_empires'
  | 'slavery_resistance'
  | 'harlem_renaissance'
  | 'black_inventors'
  | 'modern_icons'
  | 'hip_hop_culture'
  | 'caribbean_history'
  | 'other';

// Combined mode for the chat system
export type ChatMode = `${VoiceType}_${TopicType}`;

interface ModeSelectorProps {
  currentVoice: VoiceType;
  currentTopic: TopicType;
  onVoiceChange: (voice: Exclude<VoiceType, null>) => void;
  onTopicChange: (topic: TopicType) => void;
}

interface VoiceInfo {
  id: Exclude<VoiceType, null>;
  name: string;
  shortName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface TopicInfo {
  id: TopicType;
  name: string;
  shortName: string;
  description: string;
  years?: string;
  icon: React.ReactNode;
  color: string;
}

const voices: VoiceInfo[] = [
  {
    id: 'morgan',
    name: 'Morgan Freeman',
    shortName: 'Morgan Freeman',
    description: 'Calm, wise storytelling voice',
    icon: <Volume2 size={18} />,
    color: 'var(--accent-gold)'
  },
  {
    id: 'hood',
    name: 'Hood',
    shortName: 'Hood',
    description: 'Raw, authentic street energy',
    icon: <Mic2 size={18} />,
    color: '#1a1a1a'
  },
  {
    id: 'caribbean',
    name: 'Caribbean',
    shortName: 'Caribbean',
    description: 'Island vibes & culture',
    icon: <Sun size={18} />,
    color: '#00CED1'
  },
  {
    id: 'auntie',
    name: 'Auntie',
    shortName: 'Auntie',
    description: 'Loving but no-nonsense',
    icon: <Heart size={18} />,
    color: '#E91E63'
  }
];

const topics: TopicInfo[] = [
  {
    id: 'civil_rights',
    name: 'Civil Rights Movement',
    shortName: 'Civil Rights',
    description: 'MLK, Rosa Parks, Freedom Riders & the fight for equality',
    years: '1954 - 1968',
    icon: <Users size={18} />,
    color: 'var(--accent-red)'
  },
  {
    id: 'african_empires',
    name: 'Ancient African Empires',
    shortName: 'African Empires',
    description: 'Mali, Songhai, Kush, Egypt & great African civilizations',
    years: '3000 BCE - 1600s',
    icon: <Crown size={18} />,
    color: 'var(--accent-gold)'
  },
  {
    id: 'slavery_resistance',
    name: 'Slavery & Resistance',
    shortName: 'Resistance',
    description: 'Harriet Tubman, Nat Turner, Underground Railroad & rebellion',
    years: '1619 - 1865',
    icon: <Flame size={18} />,
    color: '#DC2626'
  },
  {
    id: 'harlem_renaissance',
    name: 'Harlem Renaissance',
    shortName: 'Harlem',
    description: 'Jazz, literature, art & the cultural explosion',
    years: '1920s - 1930s',
    icon: <Sparkles size={18} />,
    color: '#8B5CF6'
  },
  {
    id: 'black_inventors',
    name: 'Black Inventors & Scientists',
    shortName: 'Inventors',
    description: 'Garrett Morgan, Mae Jemison, George Washington Carver & more',
    years: '1800s - Present',
    icon: <Landmark size={18} />,
    color: '#059669'
  },
  {
    id: 'modern_icons',
    name: 'Modern Black Icons',
    shortName: 'Modern Icons',
    description: 'Obama, Oprah, LeBron, Beyoncé & contemporary excellence',
    years: '1990s - Present',
    icon: <Globe size={18} />,
    color: '#0EA5E9'
  },
  {
    id: 'hip_hop_culture',
    name: 'Hip-Hop & Culture',
    shortName: 'Hip-Hop',
    description: 'From the Bronx to global phenomenon - the culture that changed the world',
    years: '1970s - Present',
    icon: <Music2 size={18} />,
    color: '#9333ea'
  },
  {
    id: 'caribbean_history',
    name: 'Caribbean History',
    shortName: 'Caribbean',
    description: 'Toussaint Louverture, Marcus Garvey & island independence',
    years: '1600s - Present',
    icon: <Sun size={18} />,
    color: 'var(--accent-green)'
  },
  {
    id: 'other',
    name: 'General Questions',
    shortName: 'Other',
    description: 'Ask anything about Black history & culture',
    icon: <BookOpen size={18} />,
    color: '#6B7280'
  }
];

export { voices, topics };

export default function ModeSelector({ currentVoice, currentTopic, onVoiceChange, onTopicChange }: ModeSelectorProps) {
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

  const currentTopicInfo = topics.find(t => t.id === currentTopic);
  const currentVoiceInfo = voices.find(v => v.id === currentVoice);

  return (
    <div className="space-y-4">
      {/* Desktop Layout: Side by side */}
      <div className="hidden md:flex gap-6">
        {/* Voice Selection - Left */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Volume2 size={14} />
            <span className={`typewriter ${currentVoice ? 'opacity-75' : 'text-yellow-400 font-bold'}`}>
              1. SELECT VOICE:{!currentVoice && ' ⚠️ Required'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {voices.map((voice) => (
              <motion.button
                key={voice.id}
                onClick={() => onVoiceChange(voice.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-2 px-3 py-2 border-2 transition-all
                  ${currentVoice === voice.id 
                    ? 'border-white text-white' 
                    : 'border-[var(--ink-faded)] text-[var(--ink-faded)] hover:border-white hover:text-white'
                  }
                `}
                style={{
                  backgroundColor: currentVoice === voice.id ? voice.color : 'transparent',
                  boxShadow: currentVoice === voice.id ? '2px 2px 0px rgba(255,255,255,0.3)' : 'none'
                }}
              >
                {voice.icon}
                <span className="font-bold text-sm">{voice.shortName}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-[var(--ink-faded)] opacity-50"></div>

        {/* Topics - Right */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm mb-2">
            <BookOpen size={14} />
            <span className="typewriter opacity-75">2. SELECT TOPIC:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <motion.button
                key={topic.id}
                onClick={() => onTopicChange(topic.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-2 px-3 py-2 border-2 transition-all
                  ${currentTopic === topic.id 
                    ? 'border-white text-white' 
                    : 'border-[var(--ink-faded)] text-[var(--ink-faded)] hover:border-white hover:text-white'
                  }
                `}
                style={{
                  backgroundColor: currentTopic === topic.id ? topic.color : 'transparent',
                  boxShadow: currentTopic === topic.id ? '2px 2px 0px rgba(255,255,255,0.3)' : 'none'
                }}
                title={topic.description}
              >
                {topic.icon}
                <span className="font-bold text-sm">{topic.shortName}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout: Stacked with Dropdowns */}
      <div className="md:hidden space-y-4">
        {/* Voice Selection */}
        <div>
          <div className="flex items-center gap-2 text-sm mb-2">
            <Volume2 size={14} />
            <span className={`typewriter ${currentVoice ? 'opacity-75' : 'text-yellow-400 font-bold'}`}>
              1. SELECT VOICE:{!currentVoice && ' ⚠️ Required'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {voices.map((voice) => (
              <motion.button
                key={voice.id}
                onClick={() => onVoiceChange(voice.id)}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 border-2 transition-all whitespace-nowrap
                  ${currentVoice === voice.id 
                    ? 'border-white text-white' 
                    : 'border-[var(--ink-faded)] text-[var(--ink-faded)]'
                  }
                `}
                style={{
                  backgroundColor: currentVoice === voice.id ? voice.color : 'transparent'
                }}
              >
                {voice.icon}
                <span className="text-xs font-bold">{voice.shortName}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Topics - Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 text-sm mb-2">
            <BookOpen size={14} />
            <span className="typewriter opacity-75">2. SELECT TOPIC:</span>
          </div>
          
          {/* Dropdown Button */}
          <button
            onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 border-2 transition-all border-white text-white"
            style={{
              backgroundColor: currentTopicInfo?.color || 'transparent'
            }}
          >
            <div className="flex items-center gap-2">
              {currentTopicInfo?.icon}
              <div className="text-left">
                <span className="text-sm font-bold block">{currentTopicInfo?.shortName}</span>
                {currentTopicInfo?.years && (
                  <span className="text-xs opacity-75">{currentTopicInfo.years}</span>
                )}
              </div>
            </div>
            <ChevronDown 
              size={18} 
              className={`transition-transform ${isTopicDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isTopicDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-[var(--ink-black)] border-2 border-[var(--ink-faded)] shadow-lg max-h-64 overflow-y-auto"
                style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}
              >
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      onTopicChange(topic.id);
                      setIsTopicDropdownOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 transition-all text-left
                      ${currentTopic === topic.id 
                        ? 'text-white' 
                        : 'text-[var(--ink-faded)] hover:text-white hover:bg-[var(--ink-faded)]'
                      }
                    `}
                    style={{
                      backgroundColor: currentTopic === topic.id ? topic.color : 'transparent'
                    }}
                  >
                    {topic.icon}
                    <div className="flex-1">
                      <span className="text-sm font-bold block">{topic.shortName}</span>
                      <span className="text-xs opacity-75">{topic.description}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Current selection description */}
      <motion.div
        key={`${currentVoice}-${currentTopic}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs typewriter opacity-75 space-y-1"
      >
        <div className={!currentVoice ? 'text-yellow-400' : ''}>
          🎙️ Voice: {currentVoiceInfo?.description || 'Please select a voice to continue'}
        </div>
        <div>📚 Topic: {currentTopicInfo?.description}</div>
      </motion.div>
    </div>
  );
}
