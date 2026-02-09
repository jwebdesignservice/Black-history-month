'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Volume2, VolumeX, Trash2, RefreshCw } from 'lucide-react';
import ModeSelector, { VoiceType, TopicType, topics } from './ModeSelector';

interface VoiceData {
  status: 'idle' | 'generating' | 'ready' | 'playing' | 'error';
  audioUrl?: string;
  error?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  voice: VoiceType;
  topic: TopicType;
  voiceData?: VoiceData;
}

// Use a simple key for chat history based on topic
type ChatHistoryByTopic = Record<TopicType, Message[]>;

const STORAGE_KEY = 'blackHistoryChronicle_chatHistory_v2';

// Default empty history for all topics
const getDefaultHistory = (): ChatHistoryByTopic => ({
  civil_rights: [],
  african_empires: [],
  slavery_resistance: [],
  harlem_renaissance: [],
  black_inventors: [],
  modern_icons: [],
  hip_hop_culture: [],
  caribbean_history: [],
  other: []
});

// Voice ID mapping
const getVoiceId = (voice: VoiceType): string | undefined => {
  switch (voice) {
    case 'hood':
      return 'Ybqj6CIlqb6M85s9Bl4n';
    case 'caribbean':
      return 'eRcsJdPMOM0mtGC03ul7';
    case 'auntie':
      return 'mrDMz4sYNCz18XYFpmyV';
    case 'morgan':
    default:
      return undefined; // Uses default Morgan Freeman voice
  }
};

// Get topic color
const getTopicColor = (topic: TopicType): string => {
  const topicInfo = topics.find(t => t.id === topic);
  return topicInfo?.color || 'var(--accent-red)';
};

export default function ChatBot() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryByTopic>(getDefaultHistory());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<VoiceType>(null);
  const [currentTopic, setCurrentTopic] = useState<TopicType>('civil_rights');
  const [isMuted, setIsMuted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [showVoiceWarning, setShowVoiceWarning] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get current messages for the active topic
  const messages = chatHistory[currentTopic] || [];

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const defaultHistory = getDefaultHistory();
        const mergedHistory: ChatHistoryByTopic = {
          ...defaultHistory,
          ...parsed
        };
        // Ensure each topic has an array
        for (const topic of Object.keys(defaultHistory) as TopicType[]) {
          if (!Array.isArray(mergedHistory[topic])) {
            mergedHistory[topic] = [];
          }
        }
        setChatHistory(mergedHistory);
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
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  // Clear chat for current topic only
  const handleClearChat = () => {
    setChatHistory(prev => ({
      ...prev,
      [currentTopic]: []
    }));
  };

  // Generate voice for a message
  const generateVoice = async (messageId: string, textContent: string, voice: VoiceType) => {
    const historyKey = currentTopic;
    
    setChatHistory(prev => ({
      ...prev,
      [historyKey]: prev[historyKey].map(msg => 
        msg.id === messageId 
          ? { ...msg, voiceData: { status: 'generating' as const } }
          : msg
      )
    }));

    try {
      const voiceId = getVoiceId(voice);
      
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textContent, voiceId })
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const data = await response.json();
      const audioUrl = data.output?.[0] || data.audio_url || data.output;
      
      if (audioUrl) {
        setChatHistory(prev => ({
          ...prev,
          [historyKey]: prev[historyKey].map(msg => 
            msg.id === messageId 
              ? { ...msg, voiceData: { status: 'ready' as const, audioUrl } }
              : msg
          )
        }));

        // Auto-play if not muted
        if (!isMuted) {
          playAudio(messageId, audioUrl, historyKey);
        }
      } else {
        throw new Error('No audio URL in response');
      }
    } catch (error) {
      console.error('Voice generation error:', error);
      setChatHistory(prev => ({
        ...prev,
        [historyKey]: prev[historyKey].map(msg => 
          msg.id === messageId 
            ? { ...msg, voiceData: { status: 'error' as const, error: error instanceof Error ? error.message : 'Failed to generate voice' } }
            : msg
        )
      }));
    }
  };

  // Play audio helper
  const playAudio = (messageId: string, audioUrl: string, historyKey: TopicType) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setCurrentlyPlayingId(messageId);
    
    setChatHistory(prev => ({
      ...prev,
      [historyKey]: prev[historyKey].map(msg => 
        msg.id === messageId && msg.voiceData
          ? { ...msg, voiceData: { ...msg.voiceData, status: 'playing' as const } }
          : msg
      )
    }));

    audio.onended = () => {
      setCurrentlyPlayingId(null);
      setChatHistory(prev => ({
        ...prev,
        [historyKey]: prev[historyKey].map(msg => 
          msg.id === messageId && msg.voiceData
            ? { ...msg, voiceData: { ...msg.voiceData, status: 'ready' as const } }
            : msg
        )
      }));
    };

    audio.onerror = () => {
      setCurrentlyPlayingId(null);
      setChatHistory(prev => ({
        ...prev,
        [historyKey]: prev[historyKey].map(msg => 
          msg.id === messageId && msg.voiceData
            ? { ...msg, voiceData: { ...msg.voiceData, status: 'error' as const, error: 'Failed to play audio' } }
            : msg
        )
      }));
    };

    audio.play().catch((error) => {
      console.error('Audio play error:', error);
      setCurrentlyPlayingId(null);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Require voice selection
    if (!currentVoice) {
      setShowVoiceWarning(true);
      setTimeout(() => setShowVoiceWarning(false), 3000);
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: input.trim(),
      voice: currentVoice,
      topic: currentTopic
    };

    // Add user message to current topic's history
    setChatHistory(prev => ({
      ...prev,
      [currentTopic]: [...prev[currentTopic], userMessage]
    }));
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          voice: currentVoice,
          topic: currentTopic,
          history: chatHistory[currentTopic].slice(-10)
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const messageId = `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Generate voice for the response (all voices have TTS)
      {
        try {
          const voiceId = getVoiceId(currentVoice);
          
          const voiceResponse = await fetch('/api/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: data.response, voiceId })
          });

          if (voiceResponse.ok) {
            const voiceData = await voiceResponse.json();
            const audioUrl = voiceData.output?.[0] || voiceData.audio_url;
            
            if (audioUrl) {
              const audio = new Audio(audioUrl);
              audioRef.current = audio;
              
              const assistantMessage: Message = {
                id: messageId,
                role: 'assistant',
                content: data.response,
                voice: currentVoice,
                topic: currentTopic,
                voiceData: { status: 'playing' as const, audioUrl }
              };

              setChatHistory(prev => ({
                ...prev,
                [currentTopic]: [...prev[currentTopic], assistantMessage]
              }));

              if (!isMuted) {
                setCurrentlyPlayingId(messageId);
                
                audio.onended = () => {
                  setCurrentlyPlayingId(null);
                  setChatHistory(prev => ({
                    ...prev,
                    [currentTopic]: prev[currentTopic].map(msg => 
                      msg.id === messageId && msg.voiceData
                        ? { ...msg, voiceData: { ...msg.voiceData, status: 'ready' as const } }
                        : msg
                    )
                  }));
                };

                audio.play().catch(console.error);
              }
              
              setIsLoading(false);
              inputRef.current?.focus();
              return;
            }
          }
        } catch (voiceError) {
          console.error('Voice generation failed:', voiceError);
        }
      }

      // Fallback: show message without voice
      const assistantMessage: Message = {
        id: messageId,
        role: 'assistant',
        content: data.response,
        voice: currentVoice,
        topic: currentTopic
      };

      setChatHistory(prev => ({
        ...prev,
        [currentTopic]: [...prev[currentTopic], assistantMessage]
      }));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: "My apologies, I'm having trouble connecting right now. Please try again in a moment.",
        voice: currentVoice,
        topic: currentTopic
      };
      setChatHistory(prev => ({
        ...prev,
        [currentTopic]: [...prev[currentTopic], errorMessage]
      }));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Get welcome message based on topic
  const getWelcomeMessage = () => {
    const topicInfo = topics.find(t => t.id === currentTopic);
    
    const welcomes: Record<TopicType, string> = {
      civil_rights: "Welcome to the Civil Rights Movement. From Rosa Parks to Martin Luther King Jr., this era changed America forever. What would you like to explore?",
      african_empires: "Step back in time to the great African empires - Mali, Songhai, Kush, and ancient Egypt. These civilizations were centers of wealth, learning, and power. What interests you?",
      slavery_resistance: "This is the story of resistance, resilience, and the fight for freedom. From Harriet Tubman to Nat Turner, learn about those who refused to accept bondage. What do you want to know?",
      harlem_renaissance: "Welcome to the Harlem Renaissance - a cultural explosion of art, music, literature, and pride. Langston Hughes, Zora Neale Hurston, Duke Ellington... Where shall we begin?",
      black_inventors: "From the traffic light to the blood bank, Black inventors and scientists have shaped our world. Ready to discover their incredible contributions?",
      modern_icons: "From Barack Obama to Beyoncé, modern Black icons continue to break barriers and inspire. Who would you like to learn about?",
      hip_hop_culture: "Hip-hop started in the Bronx and became a global movement. It's more than music - it's a culture, a voice, a revolution. What aspect interests you?",
      caribbean_history: "From Toussaint Louverture's revolution to Marcus Garvey's movement, the Caribbean has a rich history of resistance and culture. What would you like to explore?",
      other: "Ask me anything about Black history and culture! I'm here to share knowledge and have a conversation."
    };

    return welcomes[currentTopic] || welcomes.other;
  };

  // Get suggested questions for each topic
  const getSuggestedQuestions = () => {
    const suggestions: Record<TopicType, string[]> = {
      civil_rights: [
        "Who was Martin Luther King Jr.?",
        "What happened on the March on Washington?",
        "Tell me about Rosa Parks",
        "What were the Freedom Riders?"
      ],
      african_empires: [
        "Tell me about the Mali Empire",
        "Who was Mansa Musa?",
        "What was the Kingdom of Kush?",
        "How advanced was ancient Egypt?"
      ],
      slavery_resistance: [
        "Who was Harriet Tubman?",
        "What was the Underground Railroad?",
        "Tell me about slave rebellions",
        "Who was Frederick Douglass?"
      ],
      harlem_renaissance: [
        "Who was Langston Hughes?",
        "What was jazz's role in Harlem?",
        "Tell me about Zora Neale Hurston",
        "How did the Renaissance start?"
      ],
      black_inventors: [
        "Who invented the traffic light?",
        "Tell me about Mae Jemison",
        "What did George Washington Carver create?",
        "Who was Madam C.J. Walker?"
      ],
      modern_icons: [
        "Tell me about Barack Obama",
        "What has Oprah accomplished?",
        "Who is Serena Williams?",
        "Tell me about Black Lives Matter"
      ],
      hip_hop_culture: [
        "How did hip-hop start?",
        "Who are the hip-hop pioneers?",
        "What are the four elements?",
        "How did hip-hop change culture?"
      ],
      caribbean_history: [
        "Who was Toussaint Louverture?",
        "Tell me about Marcus Garvey",
        "What was the Haitian Revolution?",
        "How did reggae start?"
      ],
      other: [
        "What is Juneteenth?",
        "Tell me about Black Wall Street",
        "Who are important Black leaders?",
        "What is the African diaspora?"
      ]
    };

    return suggestions[currentTopic] || suggestions.other;
  };

  // Don't render until hydrated
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
    <div className="newspaper-section p-0 overflow-hidden relative">
      {/* Voice Selection Warning Popup - Fixed center of screen */}
      <AnimatePresence>
        {showVoiceWarning && (
          <>
            {/* Dark overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={() => setShowVoiceWarning(false)}
            />
            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] bg-[var(--paper-cream)] text-[var(--ink-black)] px-8 py-6 border-4 border-[var(--ink-black)]"
              style={{ boxShadow: '8px 8px 0px var(--ink-black)' }}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="text-5xl">🎙️</span>
                <div>
                  <p className="font-bold text-xl headline mb-2">SELECT A VOICE!</p>
                  <p className="body-text opacity-80">Choose a voice style before sending your message.</p>
                </div>
                <motion.button
                  onClick={() => setShowVoiceWarning(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 px-6 py-2 bg-[var(--ink-black)] text-[var(--paper-cream)] font-bold border-2 border-[var(--ink-black)] hover:bg-[var(--accent-gold)] hover:text-[var(--ink-black)] transition-colors"
                >
                  OK, GOT IT
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chat Header */}
      <div className="bg-[var(--ink-black)] text-[var(--paper-cream)] p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: getTopicColor(currentTopic) }}
            ></div>
            <span className="headline text-lg md:text-xl">LEARN BLACK HISTORY</span>
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
              title={isMuted ? 'Turn on voice' : 'Turn off voice'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
        
        {/* Voice & Topic Selector */}
        <ModeSelector 
          currentVoice={currentVoice} 
          currentTopic={currentTopic}
          onVoiceChange={setCurrentVoice}
          onTopicChange={setCurrentTopic}
        />
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-6 bg-[var(--paper-aged)]">
        {messages.length === 0 && (
          <motion.div
            key={`${currentVoice}-${currentTopic}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="speech-bubble p-4 max-w-[95%] md:max-w-[85%]">
              <div 
                className="w-full h-1 mb-3 rounded"
                style={{ backgroundColor: getTopicColor(currentTopic) }}
              ></div>
              <p className="body-text">{getWelcomeMessage()}</p>
              
              {/* Suggested Questions */}
                <div className="mt-4 pt-4 border-t-2 border-[var(--ink-faded)]">
                <p className="text-xs typewriter mb-3 opacity-75">★ SUGGESTED QUESTIONS:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getSuggestedQuestions().map((question, index) => (
                      <motion.button
                        key={index}
                      onClick={() => setInput(question)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      className="text-left p-3 border-2 border-[var(--ink-black)] bg-[var(--paper-cream)] hover:bg-[var(--accent-gold)] hover:text-[var(--ink-black)] transition-all text-sm"
                        style={{ boxShadow: '2px 2px 0px var(--ink-black)' }}
                      >
                      {question}
                      </motion.button>
                    ))}
                  </div>
                </div>
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
                    style={{ backgroundColor: getTopicColor(message.topic) }}
                  ></div>
                  <p className="body-text whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Voice Status */}
                  {message.voiceData && (
                    <div className="mt-3 pt-3 border-t border-[var(--ink-faded)]">
                      {message.voiceData.status === 'generating' ? (
                        <div className="flex items-center gap-2 text-xs text-[var(--ink-faded)]">
                          <Loader2 className="animate-spin" size={14} />
                          <span>Generating voice...</span>
                        </div>
                      ) : message.voiceData.status === 'playing' ? (
                        <div className="flex items-center gap-2">
                          <Volume2 size={14} className="text-[var(--accent-gold)]" />
                          <span className="text-xs text-[var(--accent-gold)] font-bold">Playing...</span>
                          <div className="flex gap-1">
                            {[...Array(4)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-[var(--accent-gold)] rounded"
                                animate={{
                                  height: ['8px', '16px', '8px'],
                                }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : message.voiceData.status === 'error' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-500">{message.voiceData.error}</span>
                          <motion.button
                            onClick={() => generateVoice(message.id, message.content, message.voice)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1 px-2 py-1 bg-[var(--ink-faded)] text-white text-xs rounded"
                          >
                            <RefreshCw size={12} />
                            Retry
                          </motion.button>
                        </div>
                      ) : null}
                    </div>
                  )}
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
            placeholder="Ask a question..."
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
