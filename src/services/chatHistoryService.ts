import type { Message } from '../types/chatbot';

export class ChatHistoryService {
  private static readonly STORAGE_KEY = 'chatbot_history';
  private static readonly MAX_MESSAGES = 100; // Limit storage size

  static saveMessages(messages: Message[]): void {
    try {
      // Keep only the latest MAX_MESSAGES
      const messagesToSave = messages.slice(-this.MAX_MESSAGES);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messagesToSave));
    } catch (error) {
      console.warn('Failed to save chat history:', error);
    }
  }

  static loadMessages(): Message[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const messages = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return messages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load chat history:', error);
    }
    return [];
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear chat history:', error);
    }
  }

  static exportHistory(): string {
    const messages = this.loadMessages();
    const exportData = {
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages
    };
    return JSON.stringify(exportData, null, 2);
  }
}