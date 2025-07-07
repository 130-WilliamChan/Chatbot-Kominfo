export interface Message {
  id: string;
  text: string;
  sender?: 'user' | 'bot'; // Made optional for backward compatibility
  timestamp: Date;
  isVoice?: boolean;
  isUser: boolean; // Add this property to match component usage
  isTyping?: boolean; // Add this property used in components
}

export type ChatMode = 'avatar' | 'text';

export interface ChatbotState {
  isOpen: boolean;
  isListening: boolean;
  isLoading: boolean;
  messages: Message[];
}

export interface VoiceRecognitionOptions {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
}