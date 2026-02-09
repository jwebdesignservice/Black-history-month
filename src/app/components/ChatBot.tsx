'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Volume2, VolumeX, Trash2, Play, Pause, RefreshCw } from 'lucide-react';
import ModeSelector, { ChatMode } from './ModeSelector';

interface VoiceData {
  status: 'idle' | 'generating' | 'ready' | 'playing' | 'error';
  audioUrl?: string;
  error?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode: ChatMode;
  voiceData?: VoiceData;
}

type ChatHistory = Record<ChatMode, Message[]>;

const STORAGE_KEY = 'blackHistoryChronicle_chatHistory';

// Default empty history for all modes
const getDefaultHistory = (): ChatHistory => ({
  historian: [],
  streetwise: [],
  morgan: [],
  jamaican: [],
  grandma: [],
  barbershop: [],
  hiphop: [],
  preacher: []
});

export default function ChatBot() {
  const [chatHistory, setChatHistory] = useState<ChatHistory>(getDefaultHistory());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<ChatMode>('historian');
  const [isMuted, setIsMuted] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get current messages for the active mode - with fallback to empty array
  const messages = chatHistory[currentMode] || [];

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved history with default to ensure all modes exist
        const defaultHistory = getDefaultHistory();
        const mergedHistory: ChatHistory = {
          ...defaultHistory,
          ...parsed
        };
        // Ensure each mode has an array and regenerate IDs to avoid duplicates
        for (const mode of Object.keys(defaultHistory) as ChatMode[]) {
          if (!Array.isArray(mergedHistory[mode])) {
            mergedHistory[mode] = [];
          } else {
            // Regenerate IDs for old messages to ensure uniqueness
            mergedHistory[mode] = mergedHistory[mode].map((msg, index) => ({
              ...msg,
              id: `${msg.role}-${mode}-${index}-${Math.random().toString(36).substr(2, 9)}`
            }));
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

  // Generate Morgan Freeman voice for a message
  const generateVoice = async (messageId: string, textContent: string) => {
    // Update message to show generating status
    setChatHistory(prev => ({
      ...prev,
      [currentMode]: prev[currentMode].map(msg => 
        msg.id === messageId 
          ? { ...msg, voiceData: { status: 'generating' as const } }
          : msg
      )
    }));

    try {
      // First, we need to convert text to speech using a TTS service
      // For ModelsLab voice_cover, we need an audio URL as input
      // We'll use the browser's SpeechSynthesis API to generate base audio first
      const utterance = new SpeechSynthesisUtterance(textContent);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      
      // Create audio context for recording
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const dest = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(dest.stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      // Use a promise to handle the async nature
      const audioBlob = await new Promise<Blob>((resolve, reject) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          resolve(blob);
        };

        utterance.onend = () => {
          setTimeout(() => mediaRecorder.stop(), 100);
        };

        utterance.onerror = (e) => {
          reject(new Error(`Speech synthesis error: ${e.error}`));
        };

        mediaRecorder.start();
        window.speechSynthesis.speak(utterance);
        
        // Timeout fallback
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 30000);
      });

      // Convert blob to base64 for API
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // Call our voice API
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioUrl: base64Audio,
          text: textContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const data = await response.json();
      
      // Check response for audio URL
      const audioUrl = data.output?.[0] || data.audio_url || data.output;
      
      if (audioUrl) {
        setChatHistory(prev => ({
          ...prev,
          [currentMode]: prev[currentMode].map(msg => 
            msg.id === messageId 
              ? { ...msg, voiceData: { status: 'ready' as const, audioUrl } }
              : msg
          )
        }));
      } else if (data.status === 'processing' || data.status === 'queued') {
        // API is still processing, poll for result
        pollForVoiceResult(messageId, data.id || data.request_id);
      } else {
        throw new Error('No audio URL in response');
      }
    } catch (error) {
      console.error('Voice generation error:', error);
      setChatHistory(prev => ({
        ...prev,
        [currentMode]: prev[currentMode].map(msg => 
          msg.id === messageId 
            ? { ...msg, voiceData: { status: 'error' as const, error: error instanceof Error ? error.message : 'Failed to generate voice' } }
            : msg
        )
      }));
    }
  };

  // Poll for voice generation result
  const pollForVoiceResult = async (messageId: string, requestId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setChatHistory(prev => ({
          ...prev,
          [currentMode]: prev[currentMode].map(msg => 
            msg.id === messageId 
              ? { ...msg, voiceData: { status: 'error' as const, error: 'Voice generation timed out' } }
              : msg
          )
        }));
        return;
      }

      try {
        const response = await fetch(`/api/voice/status?id=${requestId}`);
        const data = await response.json();

        if (data.status === 'completed' || data.status === 'success') {
          const audioUrl = data.output?.[0] || data.audio_url || data.output;
          setChatHistory(prev => ({
            ...prev,
            [currentMode]: prev[currentMode].map(msg => 
              msg.id === messageId 
                ? { ...msg, voiceData: { status: 'ready' as const, audioUrl } }
                : msg
            )
          }));
        } else if (data.status === 'failed' || data.status === 'error') {
          throw new Error(data.message || 'Voice generation failed');
        } else {
          // Still processing, poll again
          attempts++;
          setTimeout(poll, 2000);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setChatHistory(prev => ({
          ...prev,
          [currentMode]: prev[currentMode].map(msg => 
            msg.id === messageId 
              ? { ...msg, voiceData: { status: 'error' as const, error: error instanceof Error ? error.message : 'Polling failed' } }
              : msg
          )
        }));
      }
    };

    await poll();
  };

  // Auto-generate and play voice for Morgan Freeman mode
  const autoGenerateAndPlayVoice = async (messageId: string, textContent: string) => {
    // Update message to show generating status
    setChatHistory(prev => ({
      ...prev,
      [currentMode]: prev[currentMode].map(msg => 
        msg.id === messageId 
          ? { ...msg, voiceData: { status: 'generating' as const } }
          : msg
      )
    }));

    try {
      // Call our voice API
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const data = await response.json();
      
      // Check response for audio URL
      const audioUrl = data.output?.[0] || data.audio_url || data.output;
      
      if (audioUrl) {
        setChatHistory(prev => ({
          ...prev,
          [currentMode]: prev[currentMode].map(msg => 
            msg.id === messageId 
              ? { ...msg, voiceData: { status: 'ready' as const, audioUrl } }
              : msg
          )
        }));

        // Auto-play the audio
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        setCurrentlyPlayingId(messageId);
        
        setChatHistory(prev => ({
          ...prev,
          [currentMode]: prev[currentMode].map(msg => 
            msg.id === messageId && msg.voiceData
              ? { ...msg, voiceData: { ...msg.voiceData, status: 'playing' as const } }
              : msg
          )
        }));

        audio.onended = () => {
          setCurrentlyPlayingId(null);
          setChatHistory(prev => ({
            ...prev,
            [currentMode]: prev[currentMode].map(msg => 
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
            [currentMode]: prev[currentMode].map(msg => 
              msg.id === messageId && msg.voiceData
                ? { ...msg, voiceData: { ...msg.voiceData, status: 'error' as const, error: 'Failed to play audio' } }
                : msg
            )
          }));
        };

        audio.play().catch((error) => {
          console.error('Audio autoplay error:', error);
          setCurrentlyPlayingId(null);
        });

      } else if (data.status === 'processing' || data.status === 'queued') {
        // API is still processing, poll for result then auto-play
        pollForVoiceResultAndPlay(messageId, data.id || data.request_id);
      } else {
        throw new Error('No audio URL in response');
      }
    } catch (error) {
      console.error('Voice generation error:', error);
      setChatHistory(prev => ({
        ...prev,
        [currentMode]: prev[currentMode].map(msg => 
          msg.id === messageId 
            ? { ...msg, voiceData: { status: 'error' as const, error: error instanceof Error ? error.message : 'Failed to generate voice' } }
            : msg
        )
      }));
    }
  };

  // Poll for voice result and auto-play when ready
  const pollForVoiceResultAndPlay = async (messageId: string, requestId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setChatHistory(prev => ({
          ...prev,
          [currentMode]: prev[currentMode].map(msg => 
            msg.id === messageId 
              ? { ...msg, voiceData: { status: 'error' as const, error: 'Voice generation timed out' } }
              : msg
          )
        }));
        return;
      }

      try {
        const response = await fetch(`/api/voice/status?id=${requestId}`);
        const data = await response.json();

        if (data.status === 'completed' || data.status === 'success') {
          const audioUrl = data.output?.[0] || data.audio_url || data.output;
          setChatHistory(prev => ({
            ...prev,
            [currentMode]: prev[currentMode].map(msg => 
              msg.id === messageId 
                ? { ...msg, voiceData: { status: 'ready' as const, audioUrl } }
                : msg
            )
          }));

          // Auto-play
          if (audioUrl) {
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            setCurrentlyPlayingId(messageId);
            audio.play().catch(console.error);
          }
        } else if (data.status === 'failed' || data.status === 'error') {
          throw new Error(data.message || 'Voice generation failed');
        } else {
          // Still processing, poll again
          attempts++;
          setTimeout(poll, 2000);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setChatHistory(prev => ({
          ...prev,
          [currentMode]: prev[currentMode].map(msg => 
            msg.id === messageId 
              ? { ...msg, voiceData: { status: 'error' as const, error: error instanceof Error ? error.message : 'Polling failed' } }
              : msg
          )
        }));
      }
    };

    await poll();
  };

  // Play/Pause audio
  const toggleAudio = (messageId: string, audioUrl: string) => {
    if (currentlyPlayingId === messageId && audioRef.current) {
      // Pause current audio
      audioRef.current.pause();
      setCurrentlyPlayingId(null);
      setChatHistory(prev => ({
        ...prev,
        [currentMode]: prev[currentMode].map(msg => 
          msg.id === messageId && msg.voiceData
            ? { ...msg, voiceData: { ...msg.voiceData, status: 'ready' as const } }
            : msg
        )
      }));
    } else {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Play new audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setCurrentlyPlayingId(messageId);
      
      setChatHistory(prev => ({
        ...prev,
        [currentMode]: prev[currentMode].map(msg => 
          msg.id === messageId && msg.voiceData
            ? { ...msg, voiceData: { ...msg.voiceData, status: 'playing' as const } }
            : msg
        )
      }));

      audio.onended = () => {
        setCurrentlyPlayingId(null);
        setChatHistory(prev => ({
          ...prev,
          [currentMode]: prev[currentMode].map(msg => 
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
          [currentMode]: prev[currentMode].map(msg => 
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      
      const messageId = `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // For voice modes, generate voice FIRST, then show text + play audio together
      if (currentMode === 'morgan' || currentMode === 'historian') {
        try {
          // Generate voice before showing the message
          const voiceResponse = await fetch('/api/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: data.response })
          });

          if (voiceResponse.ok) {
            const voiceData = await voiceResponse.json();
            const audioUrl = voiceData.output?.[0] || voiceData.audio_url;
            
            if (audioUrl) {
              // Create audio element and prepare it
              const audio = new Audio(audioUrl);
              audioRef.current = audio;
              
              // Now show the message AND play audio at the same time
              const assistantMessage: Message = {
                id: messageId,
                role: 'assistant',
                content: data.response,
                mode: currentMode,
                voiceData: { status: 'playing' as const, audioUrl }
              };

              setChatHistory(prev => ({
                ...prev,
                [currentMode]: [...prev[currentMode], assistantMessage]
              }));

              setCurrentlyPlayingId(messageId);
              
              audio.onended = () => {
                setCurrentlyPlayingId(null);
                setChatHistory(prev => ({
                  ...prev,
                  [currentMode]: prev[currentMode].map(msg => 
                    msg.id === messageId && msg.voiceData
                      ? { ...msg, voiceData: { ...msg.voiceData, status: 'ready' as const } }
                      : msg
                  )
                }));
              };

              audio.play().catch(console.error);
              return; // Exit early, we've handled everything
            }
          }
        } catch (voiceError) {
          console.error('Voice generation failed:', voiceError);
        }
      }

      // Fallback: show message without voice (for non-voice modes or if voice failed)
      const assistantMessage: Message = {
        id: messageId,
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
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      streetwise: '#1a1a1a',
      morgan: 'var(--accent-gold)',
      jamaican: 'var(--accent-green)',
      grandma: '#D4A574',
      barbershop: '#4A90A4',
      hiphop: '#9333ea',
      preacher: '#7c3aed'
    };
    return colors[mode];
  };

  // Interactive topics for Historian mode
  const historianTopics = [
    { era: "Ancient Africa", years: "3000 BCE - 500 CE", question: "Tell me about the great ancient African civilizations" },
    { era: "Slave Trade Era", years: "1500s - 1800s", question: "What was the transatlantic slave trade and its impact?" },
    { era: "Civil Rights", years: "1954 - 1968", question: "Tell me about the Civil Rights Movement" },
    { era: "Harlem Renaissance", years: "1920s - 1930s", question: "What was the Harlem Renaissance?" },
    { era: "Black Power", years: "1960s - 1970s", question: "Tell me about the Black Power movement" },
    { era: "Modern Era", years: "1990s - Present", question: "What are the major achievements in modern Black history?" }
  ];

  const handleTopicClick = (question: string) => {
    setInput(question);
  };

  const getWelcomeMessage = () => {
    const welcomes: Record<ChatMode, string> = {
      historian: "Greetings, seeker of knowledge. I am your guide through the rich tapestry of Black history. Select an era below to explore, or ask me anything about Black history worldwide.",
      streetwise: "Yo, what's good my G? Real talk, I'ma keep it a hunnid wit you - no cap, no filter, just straight facts from the streets. What you tryna know?",
      morgan: "Well now... *settles into chair* ...I've been waiting for you. There's a story to tell, and every story has a beginning. What shall we discuss?",
      jamaican: "Wagwan mi friend! Bless up and welcome! Mi ready fi reason wit yuh bout anyting. What a gwaan pon yuh mind today?",
      grandma: "Oh baby, come on in and sit down! Let me get you something... Now, what's on your heart today, child?",
      barbershop: "Aye, what's up! Pull up a chair, we debating everything today. Facts only though. What's the topic?",
      hiphop: "Yo, what's poppin'! You already know hip-hop IS Black history. From the Bronx to the globe, we changed the game. What you wanna know about the culture?",
      preacher: "Well, GLORY! Come on in, come on in! The Lord has put something on my heart to share with you today. What wisdom are you seeking, beloved?"
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
            <div className="speech-bubble p-4 max-w-[95%] md:max-w-[85%]">
              <p className="body-text">{getWelcomeMessage()}</p>
              
              {/* Interactive Topics for Historian Mode */}
              {currentMode === 'historian' && (
                <div className="mt-4 pt-4 border-t-2 border-[var(--ink-faded)]">
                  <p className="text-xs typewriter mb-3 opacity-75">★ EXPLORE BY ERA:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {historianTopics.map((topic, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleTopicClick(topic.question)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-left p-3 border-2 border-[var(--ink-black)] bg-[var(--paper-cream)] hover:bg-[var(--accent-gold)] hover:text-[var(--ink-black)] transition-all"
                        style={{ boxShadow: '2px 2px 0px var(--ink-black)' }}
                      >
                        <span className="font-bold text-sm block">{topic.era}</span>
                        <span className="text-xs opacity-75">{topic.years}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
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
                  
                  {/* Voice Status - Auto-plays for Morgan Freeman and Historian modes */}
                  {(message.mode === 'morgan' || message.mode === 'historian') && message.voiceData && (
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
                            onClick={() => generateVoice(message.id, message.content)}
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
