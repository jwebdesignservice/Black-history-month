'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Volume2, VolumeX, Trash2 } from 'lucide-react';
import ModeSelector, { ChatMode } from './ModeSelector';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode: ChatMode;
}

type ChatHistory = Record<ChatMode, Message[]>;

const STORAGE_KEY = 'blackHistoryChronicle_chatHistory';

export default function ChatBot() {
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    historian: [],
    morgan: [],
    jamaican: [],
    unfiltered: [],
    grandma: [],
    barbershop: [],
    poetic: []
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<ChatMode>('historian');
  const [isMuted, setIsMuted] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get current messages for the active mode
  const messages = chatHistory[currentMode];

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChatHistory(parsed);
      } catch (e) {
        console.error('Failed to parse saved chat history:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    }
  }, [chatHistory, isHydrated]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure content is rendered before scrolling
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  // Switch mode without clearing - just load that mode's history
  const handleModeChange = (newMode: ChatMode) => {
    setCurrentMode(newMode);
    setInput('');
    setIsLoading(false);
  };

  // Clear chat for current mode only
  const handleClearChat = () => {
    setChatHistory(prev => ({
      ...prev,
      [currentMode]: []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      mode: currentMode
    };

    // Add user message to current mode's history
    setChatHistory(prev => ({
      ...prev,
      [currentMode]: [...prev[currentMode], userMessage]
    }));
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          mode: currentMode,
          history: chatHistory[currentMode].slice(-10) // Send last 10 messages for context
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        mode: currentMode
      };

      setChatHistory(prev => ({
        ...prev,
        [currentMode]: [...prev[currentMode], assistantMessage]
      }));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "My apologies, I'm having trouble connecting right now. Please try again in a moment.",
        mode: currentMode
      };
      setChatHistory(prev => ({
        ...prev,
        [currentMode]: [...prev[currentMode], errorMessage]
      }));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const getModeColor = (mode: ChatMode) => {
    const colors: Record<ChatMode, string> = {
      historian: 'var(--accent-red)',
      morgan: 'var(--accent-gold)',
      jamaican: 'var(--accent-green)',
      unfiltered: '#8B4513',
      grandma: '#D4A574',
      barbershop: '#4A90A4'
    };
    return colors[mode];
  };

  const getWelcomeMessage = () => {
    const welcomes: Record<ChatMode, string> = {
      historian: "Greetings, seeker of knowledge. I am your guide through the rich tapestry of Black history. What would you like to explore today?",
      morgan: "Well now... *settles into chair* ...I've been waiting for you. There's a story to tell, and every story has a beginning. What shall we discuss?",
      jamaican: "Wagwan mi friend! Bless up and welcome! Mi ready fi reason wit yuh bout anyting. What a gwaan pon yuh mind today?",
      unfiltered: "Aight, what's good? I'm here to keep it 100 with you, no filter, no sugarcoating. What you wanna talk about?",
      grandma: "Oh baby, come on in and sit down! Let me get you something... Now, what's on your heart today, child?",
      barbershop: "Aye, what's up! Pull up a chair, we debating everything today. Facts only though. What's the topic?"
    };
    return welcomes[currentMode];
  };

  // Don't render until hydrated to avoid mismatch
  if (!isHydrated) {
    return (
      <div className="newspaper-section p-0 overflow-hidden">
        <div className="bg-[var(--ink-black)] text-[var(--paper-cream)] p-4 h-[200px] flex items-center justify-center">
          <Loader2 className="animate-spin" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="newspaper-section p-0 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[var(--ink-black)] text-[var(--paper-cream)] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: getModeColor(currentMode) }}
            ></div>
            <span className="headline text-lg md:text-xl">LIVE CONVERSATION</span>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="p-2 hover:bg-[var(--ink-faded)] rounded transition-colors"
                aria-label="Clear chat"
                title="Clear this conversation"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-[var(--ink-faded)] rounded transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mode Selector */}
        <ModeSelector currentMode={currentMode} onModeChange={handleModeChange} />
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-6 bg-[var(--paper-aged)]">
        {messages.length === 0 && (
          <motion.div
            key={currentMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="speech-bubble p-4 max-w-[85%] md:max-w-[75%]">
              <p className="body-text">{getWelcomeMessage()}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              {message.role === 'user' ? (
                <div 
                  className="p-4 max-w-[85%] md:max-w-[75%] border-[3px] border-[var(--ink-black)]"
                  style={{ backgroundColor: 'var(--paper-cream)' }}
                >
                  <span className="text-xs text-[var(--ink-faded)] mb-2 block typewriter">— You</span>
                  <p className="body-text">{message.content}</p>
                </div>
              ) : (
                <div className="speech-bubble p-4 max-w-[85%] md:max-w-[75%]">
                  <div 
                    className="w-full h-1 mb-3 rounded"
                    style={{ backgroundColor: getModeColor(message.mode) }}
                  ></div>
                  <p className="body-text whitespace-pre-wrap">{message.content}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="speech-bubble p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span className="typewriter text-sm">Composing response...</span>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-[var(--paper-cream)] border-t-[3px] border-[var(--ink-black)]">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 md:p-4 border-[3px] border-[var(--ink-black)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] body-text text-base md:text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 md:px-6 py-3 bg-[var(--ink-black)] text-[var(--paper-cream)] border-[3px] border-[var(--ink-black)] hover:bg-[var(--accent-red)] hover:border-[var(--accent-red)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: 'var(--shadow-subtle)' }}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-[var(--ink-faded)] mt-2 typewriter text-center">
          Press Enter to send
        </p>
      </form>
    </div>
  );
}
