import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Mic, MicOff, X, Volume2, VolumeX, Settings, RotateCcw, Radio } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ChatHistoryService } from '../services/chatHistoryService';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { profanityFilter } from '../services/profanityFilter';
import { elevenLabsService } from '../services/elevenlabsService';
import type { Message, ChatbotState } from '../types/chatbot';
import VideoAvatar from './VideoAvatar';
import './FullModeChatbot.css';

interface AvatarState {
  current: 'idle' | 'speaking' | 'listening' | 'thinking' | 'happy' | 'sad';
}

type ChatMode = 'avatar' | 'traditional';
type InputMode = 'voice' | 'text' | 'continuous';

const FullModeChatbot: React.FC = () => {
  // Core state management
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    isListening: false,
    isLoading: false,
    messages: [],
  });

  const [avatarState, setAvatarState] = useState<AvatarState>({
    current: 'idle'
  });

  const [chatMode] = useState<ChatMode>('avatar');
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const [isElevenLabsAvailable, setIsElevenLabsAvailable] = useState(false);
  const [continuousInputBuffer, setContinuousInputBuffer] = useState('');
  const [continuousModeActive, setContinuousModeActive] = useState(false);
  
  // Refs for DOM manipulation and cleanup
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const continuousModeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const continuousModeInputTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  

  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useVoiceRecognition();

  // Utility functions
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Check if ElevenLabs API is available on component mount
  useEffect(() => {
    const checkElevenLabsAvailability = async () => {
      try {
        const isAvailable = await elevenLabsService.checkApiKey();
        setIsElevenLabsAvailable(isAvailable);
        console.log(`ElevenLabs API is ${isAvailable ? 'available' : 'not available'}`);
      } catch (error) {
        console.error('Error checking ElevenLabs availability:', error);
        setIsElevenLabsAvailable(false);
      }
    };
    
    checkElevenLabsAvailability();
  }, []);

  // Voice synthesis with ElevenLabs only
  const speakWithRoboticVoice = useCallback((text: string) => {
    if (!isAudioEnabled) {
      console.log('Speech synthesis skipped - audio disabled');
      return;
    }
    
    // Stop any ongoing speech
    elevenLabsService.stopSpeaking();
    
    // Use ElevenLabs for speech
    console.log('Using ElevenLabs for speech synthesis');
    elevenLabsService.speakText(text).catch(error => {
      console.error('ElevenLabs synthesis failed:', error);
      // No fallback to browser TTS - we're only using ElevenLabs now
    });
  }, [isAudioEnabled]);

  // Enhanced subtitle animation with word-by-word display
  const speakWithSubtitle = useCallback(async (text: string) => {
    if (chatMode !== 'avatar') return;

    setAvatarState({ current: 'speaking' });

    // Start TTS if audio is enabled
    if (isAudioEnabled) {
      speakWithRoboticVoice(text);
    }

    // Animate subtitle word by word
    const words = text.split(' ');
    const wordsPerSecond = 2.5;
    const intervalTime = 1000 / wordsPerSecond;

    for (let i = 0; i <= words.length; i++) {
      const currentText = words.slice(0, i).join(' ');
      setCurrentSubtitle(currentText);
      
      if (i < words.length) {
        await new Promise(resolve => setTimeout(resolve, intervalTime));
      }
    }

    // Reset avatar state after subtitle animation
    setTimeout(() => {
      setAvatarState({ current: 'idle' });
      setCurrentSubtitle('');
    }, 1500);
  }, [chatMode, isAudioEnabled, speakWithRoboticVoice]);

  // Enhanced message handling with better error management
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setIsProcessingResponse(true);

    // Profanity check with proper filtering
    if (profanityFilter.containsProfanity(text)) {
      const warningMessage: Message = {
        id: generateMessageId(),
        text: profanityFilter.getWarningMessage(),
        sender: 'bot',
        isUser: false,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, warningMessage],
      }));

      if (chatMode === 'avatar') {
        setAvatarState({ current: 'sad' });
        await speakWithSubtitle(profanityFilter.getWarningMessage());
      }
      
      setIsProcessingResponse(false);
      return;
    }

    const cleanedText = profanityFilter.cleanText(text);
    const userMessage: Message = {
      id: generateMessageId(),
      text: cleanedText,
      sender: 'user',
      isUser: true,
      timestamp: new Date(),
      isVoice: (inputMode === 'voice' || inputMode === 'continuous') && (isListening || transcript === text),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    setInputText('');

    // Show thinking state for avatar mode
    if (chatMode === 'avatar') {
      setAvatarState({ current: 'thinking' });
      setCurrentSubtitle('💭 Sedang berpikir...');
    }

    try {
      const contextualInfo = `
        Platform: Modern AI Chatbot dengan avatar virtual
        Mode: ${chatMode === 'avatar' ? 'Avatar interaktif dengan voice/TTS' : 'Traditional text chat'}
        Input: ${inputMode === 'continuous' ? 'Continuous voice mode aktif' : inputMode}
        Audio: ${isAudioEnabled ? 'Enabled' : 'Disabled'}
        Time: ${new Date().toLocaleString('id-ID')}
      `;

      const botResponse = await geminiService.generateContextualResponse(cleanedText, contextualInfo);
      
      const botMessage: Message = {
        id: generateMessageId(),
        text: botResponse,
        sender: 'bot',
        isUser: false,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false,
      }));

      // Determine emotion based on response sentiment
      let emotion: AvatarState['current'] = 'idle';
      const positiveWords = ['senang', 'bagus', 'hebat', 'baik', 'berhasil', 'sukses'];
      const negativeWords = ['maaf', 'tidak bisa', 'gagal', 'salah', 'error', 'masalah'];
      
      if (positiveWords.some(word => botResponse.toLowerCase().includes(word))) {
        emotion = 'happy';
      } else if (negativeWords.some(word => botResponse.toLowerCase().includes(word))) {
        emotion = 'sad';
      }

      if (chatMode === 'avatar') {
        setAvatarState({ current: emotion });
        await speakWithSubtitle(botResponse);
      }

    } catch (error) {
      console.error('❌ Chat error:', error);
      
      const errorResponse = "Maaf, saya mengalami kendala teknis. Silakan coba lagi dalam beberapa saat.";
      const errorMessage: Message = {
        id: generateMessageId(),
        text: errorResponse,
        sender: 'bot',
        isUser: false,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));

      if (chatMode === 'avatar') {
        setAvatarState({ current: 'sad' });
        await speakWithSubtitle(errorResponse);
      }
    } finally {
      setIsProcessingResponse(false);
    }
  }, [chatMode, inputMode, isAudioEnabled, isListening, transcript, generateMessageId, speakWithSubtitle]);

  // Continuous mode management - Fixed to avoid infinite loops and collect input for 5 seconds
  const toggleContinuousMode = useCallback(() => {
    if (!isSupported) return;
    
    if (inputMode === 'continuous') {
      // Stop continuous mode
      setInputMode('voice');
      stopListening();
      setContinuousModeActive(false);
      setContinuousInputBuffer('');
      
      if (continuousModeTimeoutRef.current) {
        clearTimeout(continuousModeTimeoutRef.current);
        continuousModeTimeoutRef.current = null;
      }
      
      if (continuousModeInputTimeoutRef.current) {
        clearTimeout(continuousModeInputTimeoutRef.current);
        continuousModeInputTimeoutRef.current = null;
      }
    } else {
      // Start continuous mode
      setInputMode('continuous');
      setContinuousModeActive(true);
      startContinuousCycle();
    }
  }, [inputMode, isSupported]);

  // Function to start a new continuous cycle
  const startContinuousCycle = useCallback(() => {
    // First make sure we're not already listening
    if (isListening) {
      stopListening();
    }
    
    // Reset buffer for new cycle
    setContinuousInputBuffer('');
    
    // Add a small delay before starting to listen again
    setTimeout(() => {
      // Only proceed if still in continuous mode
      if (inputMode === 'continuous' && continuousModeActive) {
        // Start listening
        startListening({
          continuous: true,
          interimResults: true,
          lang: 'id-ID'
        });
        
        // Set timeout to process after 5 seconds
        continuousModeInputTimeoutRef.current = setTimeout(() => {
          // Stop listening after 5 seconds
          stopListening();
          
          // Process input if there's anything in the buffer
          if (continuousInputBuffer.trim()) {
            handleSendMessage(continuousInputBuffer);
          }
          
          // Set timeout to start a new cycle after processing completes
          continuousModeTimeoutRef.current = setTimeout(() => {
            // Only restart if still in continuous mode
            if (inputMode === 'continuous' && continuousModeActive && !isProcessingResponse) {
              startContinuousCycle();
            }
          }, 1000); // Wait 1 second before starting new cycle
        }, 5000); // Collect input for 5 seconds
      }
    }, 300); // Small delay before starting to listen again
  }, [startListening, stopListening, continuousInputBuffer, inputMode, isListening, continuousModeActive, isProcessingResponse, handleSendMessage]);

  // Replace the old continuous mode effect with this one to collect transcript for 5 seconds
  useEffect(() => {
    // Only update the buffer if in continuous mode and actively listening
    if (inputMode === 'continuous' && isListening && transcript) {
      setContinuousInputBuffer(transcript);
    }
  }, [inputMode, isListening, transcript]);

  // Clean up all timeouts when component unmounts or mode changes
  useEffect(() => {
    return () => {
      if (continuousModeTimeoutRef.current) {
        clearTimeout(continuousModeTimeoutRef.current);
      }
      if (continuousModeInputTimeoutRef.current) {
        clearTimeout(continuousModeInputTimeoutRef.current);
      }
    };
  }, [inputMode]);

  // Initialize continuous mode when it's first activated
  useEffect(() => {
    if (inputMode === 'continuous' && continuousModeActive) {
      startContinuousCycle();
    }
    return () => {
      if (continuousModeTimeoutRef.current) {
        clearTimeout(continuousModeTimeoutRef.current);
      }
      if (continuousModeInputTimeoutRef.current) {
        clearTimeout(continuousModeInputTimeoutRef.current);
      }
    };
  }, [continuousModeActive, inputMode, startContinuousCycle]);

  // Handle transcript changes for voice input - MODIFIED to not conflict with continuous mode
  useEffect(() => {
    if (transcript && !isListening && transcript.trim() && inputMode === 'voice') {
      handleSendMessage(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript, handleSendMessage, inputMode]);

  // Update avatar state based on voice activity
  useEffect(() => {
    if (chatMode === 'avatar') {
      if (isListening) {
        setAvatarState({ current: 'listening' });
        setCurrentSubtitle(inputMode === 'continuous' ? '🔄 Mode berkelanjutan aktif...' : '🎤 Mendengarkan...');
      } else if (avatarState.current === 'listening' && !state.isLoading) {
        setAvatarState({ current: 'idle' });
        if (!isProcessingResponse) {
          setCurrentSubtitle('');
        }
      }
    }
  }, [isListening, chatMode, inputMode, state.isLoading, isProcessingResponse, avatarState]);

  // Audio state management - Simplified for ElevenLabs only
  useEffect(() => {
    if (!isAudioEnabled) {
      elevenLabsService.stopSpeaking();
      console.log('🔇 Audio muted - ElevenLabs speech stopped');
    }
  }, [isAudioEnabled]);

  // Load and save chat history
  useEffect(() => {
    const savedHistory = ChatHistoryService.loadMessages();
    if (savedHistory.length > 0 && chatMode === 'traditional') {
      setState(prev => ({ ...prev, messages: savedHistory }));
    }
  }, [chatMode]);

  useEffect(() => {
    if (state.messages.length > 0 && chatMode === 'traditional') {
      ChatHistoryService.saveMessages(state.messages);
    }
  }, [state.messages, chatMode]);

  // Component interaction handlers
  const toggleChat = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  // PERBAIKAN: Menambahkan handleVoiceToggle function yang hilang
  const handleVoiceToggle = useCallback(() => {
    if (!isSupported) return;

    if (inputMode === 'continuous') {
      // Stop continuous mode
      setInputMode('voice');
      stopListening();
      setContinuousModeActive(false);
      setContinuousInputBuffer('');
      
      if (continuousModeTimeoutRef.current) {
        clearTimeout(continuousModeTimeoutRef.current);
        continuousModeTimeoutRef.current = null;
      }
      
      if (continuousModeInputTimeoutRef.current) {
        clearTimeout(continuousModeInputTimeoutRef.current);
        continuousModeInputTimeoutRef.current = null;
      }
    } else if (isListening) {
      // Stop current listening
      stopListening();
    } else {
      // Start listening
      startListening({
        continuous: false,
        interimResults: true,
        lang: 'id-ID'
      });
    }
  }, [inputMode, isListening, isSupported, startListening, stopListening]);

  const clearChatHistory = () => {
    setState(prev => ({ ...prev, messages: [] }));
    ChatHistoryService.clearHistory();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleSendMessage(inputText);
    }
  };

  // Cleanup on unmount - Added continuous mode cleanup
  useEffect(() => {
    return () => {
      if (continuousModeTimeoutRef.current) {
        clearTimeout(continuousModeTimeoutRef.current);
      }
      if (continuousModeInputTimeoutRef.current) {
        clearTimeout(continuousModeInputTimeoutRef.current);
      }
      elevenLabsService.stopSpeaking();
    };
  }, []);

  return (
    <div className="modern-fullmode-chatbot">
      {/* PERBAIKAN: Simple Message Icon Toggle Button */}
      {!state.isOpen && (
        <button 
          className="simple-message-toggle-btn"
          onClick={toggleChat}
          aria-label="Open AI Assistant"
        >
          <MessageCircle size={28} />
          <div className="message-notification-dot"></div>
        </button>
      )}

      {/* Enhanced Chat Window */}
      {state.isOpen && (
        <div className={`modern-fullmode-chat-window ${chatMode}-mode`}>
          {/* Enhanced Header */}
          <div className="modern-fullmode-header">
            <div className="header-main-info">
              <div className="header-text-info">
                <h3 className="assistant-title">
                  {chatMode === 'avatar' ? 'Virtual Assistant' : 'AI Assistant'}
                </h3>
              </div>
            </div>
            
            {/* PERBAIKAN: Simplified Control Panel - Hanya 5 tombol utama */}
            <div className="header-control-panel">
              {/* 1. Audio Control (Mute/Unmute) */}
              {chatMode === 'avatar' && (
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={`header-control-btn audio-control ${!isAudioEnabled ? 'muted' : ''}`}
                  title={isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
                >
                  {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              )}
              
              {/* 2. Continuous Mode Toggle */}
              {isSupported && chatMode === 'avatar' && (
                <button
                  onClick={toggleContinuousMode}
                  className={`header-control-btn continuous-control ${inputMode === 'continuous' ? 'active' : ''}`}
                  title={inputMode === 'continuous' ? "Matikan Mode Berkelanjutan" : "Aktifkan Mode Berkelanjutan"}
                >
                  <Radio size={18} />
                </button>
              )}
              
              {/* 3. Text Mode Toggle */}
              <button
                onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}
                className={`header-control-btn text-mode-control ${inputMode === 'text' ? 'active' : ''}`}
                title={inputMode === 'text' ? "Switch to Voice Mode" : "Switch to Text Mode"}
              >
                {inputMode === 'text' ? <Mic size={18} /> : <Settings size={18} />}
              </button>
              
              {/* 4. Clear/Restart Chat */}
              {state.messages.length > 0 && (
                <button
                  onClick={clearChatHistory}
                  className="header-control-btn clear-control"
                  title="Restart Chat / Clear History"
                >
                  <RotateCcw size={18} />
                </button>
              )}
              
              {/* 5. Close Button */}
              <button 
                onClick={toggleChat}
                className="header-control-btn close-control"
                aria-label="Close chat"
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Avatar Section (Avatar Mode Only) */}
          {chatMode === 'avatar' && (
            <div className="modern-avatar-section">
              <div className="main-avatar-container">
                <div className="avatar-display-area">
                  {/* Conditionally render either CSSAvatar or VideoAvatar based on avatarType */}
                  <VideoAvatar state={avatarState.current} size="large" />
                </div>
                
                {/* Status Indicators */}
                <div className="avatar-status-area">
                  <div className="subtitle-display-area">
                    <div className={`enhanced-subtitle ${currentSubtitle ? 'visible' : ''}`}>
                      {currentSubtitle}
                    </div>
                  </div>
                  
                  {/* Enhanced Microphone Button - Dipindahkan ke bawah subtitle */}
                  {isSupported && (inputMode === 'voice' || inputMode === 'continuous') && (
                    <button
                      onClick={handleVoiceToggle}
                      className={`enhanced-microphone-btn ${
                        inputMode === 'continuous' ? 'continuous-active' :
                        isListening ? 'listening-active' : 'idle-state'
                      }`}
                      aria-label={
                        inputMode === 'continuous' ? "Stop continuous mode" :
                        isListening ? "Stop listening" : "Start voice input"
                      }
                      title={
                        inputMode === 'continuous' ? "Mode berkelanjutan aktif - Klik untuk matikan" :
                        isListening ? "Sedang mendengarkan - Klik untuk berhenti" :
                        "Klik untuk mulai voice input"
                      }
                    >
                      <div className="mic-icon-wrapper">
                        {inputMode === 'continuous' ? (
                          <>
                            <Mic size={32} />
                            <div className="continuous-infinity">∞</div>
                          </>
                        ) : isListening ? (
                          <MicOff size={32} />
                        ) : (
                          <Mic size={32} />
                        )}
                      </div>
                      
                      {/* Visual feedback rings */}
                      <div className="mic-feedback-ring-1"></div>
                      <div className="mic-feedback-ring-2"></div>
                      <div className="mic-feedback-ring-3"></div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages Area (Traditional Mode) - Enhanced text mode */}
          <div className={`modern-messages-area ${chatMode}-layout`}>
            {chatMode === 'traditional' && (
              <div className="messages-scroll-container">
                <div className="messages-date-header">
                  <span className="date-divider">{new Date().toLocaleDateString('id-ID', {
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</span>
                </div>

                {state.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`enhanced-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                  >
                    <div className="message-avatar-indicator">
                      {message.sender === 'bot' ? (
                        <VideoAvatar state="idle" size="small" />
                      ) : (
                        <div className="user-avatar">
                          <span className="user-initial">U</span>
                        </div>
                      )}
                    </div>
                    <div className="message-content-area">
                      <div className="message-bubble">
                        {message.text}
                        {message.isVoice && (
                          <div className="voice-message-indicator" title="Pesan suara">
                            <Mic size={14} />
                          </div>
                        )}
                      </div>
                      <div className="message-metadata">
                        <span className="message-time">
                          {message.timestamp.toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.sender === 'user' && (
                          <span className="message-sender">Anda</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {state.isLoading && (
                  <div className="enhanced-message bot-message">
                    <div className="message-avatar-indicator">
                      <VideoAvatar state="thinking" size="small" />
                    </div>
                    <div className="message-content-area">
                      <div className="message-bubble typing-animation">
                        <div className="enhanced-typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area - Improved styling */}
          {inputMode === 'text' && (
            <form onSubmit={handleSubmit} className="modern-input-area">
              <div className="enhanced-input-container">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik pesan Anda disini..."
                  className="enhanced-text-input"
                  disabled={state.isLoading}
                  autoComplete="off"
                />
                
                {inputText.trim() ? (
                  <button
                    type="submit"
                    disabled={!inputText.trim() || state.isLoading}
                    className="enhanced-send-button"
                    aria-label="Send message"
                  >
                    <span className="send-icon">➤</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    disabled={state.isLoading || !isSupported}
                    className="enhanced-mic-button"
                    aria-label="Voice input"
                    title="Gunakan input suara"
                  >
                    <Mic size={18} />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};


export default FullModeChatbot;