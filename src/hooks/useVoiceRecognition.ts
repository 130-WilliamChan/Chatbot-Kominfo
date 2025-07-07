import { useState, useEffect, useRef, useCallback } from 'react';
import type { VoiceRecognitionOptions } from '../types/chatbot';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStartingRef = useRef(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      try {
        recognitionRef.current = new SpeechRecognition();
        console.log('✅ Speech recognition initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize speech recognition:', error);
        setIsSupported(false);
        setError('Failed to initialize speech recognition');
      }
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
      console.warn('❌ Speech recognition not supported in this browser');
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error('Error cleaning up speech recognition:', error);
        }
      }
    };
  }, []);

  // Cleanup when listening state changes
  useEffect(() => {
    if (!isListening && recognitionRef.current) {
      isStartingRef.current = false;
    }
  }, [isListening]);

  const startListening = useCallback(async (options?: Partial<VoiceRecognitionOptions>) => {
    if (!recognitionRef.current || isListening || isStartingRef.current) {
      console.log('Cannot start: recognition not available or already listening');
      return;
    }

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      console.log('✅ Microphone permission granted');
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      setError('Microphone access denied. Please allow microphone access and try again.');
      return;
    }

    const recognition = recognitionRef.current;
    isStartingRef.current = true;
    setError(null);
    
    try {
      // Configure recognition
      recognition.continuous = options?.continuous ?? false;
      recognition.interimResults = options?.interimResults ?? true;
      recognition.lang = options?.lang ?? 'id-ID';

      // Set up event handlers
      recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
        setIsListening(true);
        setTranscript('');
        isStartingRef.current = false;
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update transcript with final result or interim if no final result
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        
        if (finalTranscript) {
          console.log('📝 Final transcript:', finalTranscript);
        }
      };

      recognition.onend = () => {
        console.log('🛑 Speech recognition ended');
        setIsListening(false);
        isStartingRef.current = false;
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('❌ Speech recognition error:', event.error, event.message);
        setIsListening(false);
        isStartingRef.current = false;
        
        // Handle specific errors with user-friendly messages
        switch (event.error) {
          case 'no-speech':
            setError('No speech detected. Please try speaking closer to your microphone.');
            break;
          case 'network':
            setError('Network error. Please check your internet connection.');
            break;
          case 'not-allowed':
            setError('Microphone access denied. Please allow microphone access in your browser settings.');
            break;
          case 'service-not-allowed':
            setError('Speech recognition service not allowed. Please check your browser settings.');
            break;
          case 'bad-grammar':
            setError('Speech recognition grammar error.');
            break;
          case 'language-not-supported':
            setError('Language not supported for speech recognition.');
            break;
          default:
            setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.start();
      console.log('🚀 Starting speech recognition...');
      
    } catch (error) {
      console.error('❌ Error starting speech recognition:', error);
      setIsListening(false);
      isStartingRef.current = false;
      setError('Failed to start speech recognition. Please try again.');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && (isListening || isStartingRef.current)) {
      try {
        recognitionRef.current.stop();
        console.log('⏹️ Stopping speech recognition...');
      } catch (error) {
        console.error('❌ Error stopping speech recognition:', error);
      }
      setIsListening(false);
      isStartingRef.current = false;
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};