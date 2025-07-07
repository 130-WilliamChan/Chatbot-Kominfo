import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

// Use environment variable or fallback to hardcoded key for development
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDbxM-ZUUaOIi5xWmBBTfOtrjzOw6UzRrM';

// Add API key validation
const validateApiKey = (key: string): boolean => {
  // Google AI API keys typically start with 'AIza' and are 39 characters long
  return key.startsWith('AIza') && key.length === 39;
};

// Fallback responses for common queries when offline
const FALLBACK_RESPONSES = {
  greeting: [
    "Halo! Saya adalah asisten AI yang siap membantu Anda. Meskipun saya sedang dalam mode offline, saya tetap dapat memberikan beberapa bantuan dasar.",
    "Selamat datang! Saya di sini untuk membantu Anda. Saat ini saya dalam mode offline, tetapi saya akan melakukan yang terbaik untuk membantu.",
    "Hai! Senang bertemu dengan Anda. Meskipun koneksi sedang bermasalah, saya akan berusaha membantu semampu saya."
  ],
  help: [
    "Saya dapat membantu Anda dengan berbagai pertanyaan umum. Meskipun sedang offline, saya akan mencoba memberikan jawaban yang berguna.",
    "Saya di sini untuk membantu! Dalam mode offline ini, saya dapat memberikan informasi dasar dan bantuan umum.",
    "Saya siap membantu Anda dengan pertanyaan-pertanyaan dasar. Ketika koneksi kembali normal, saya akan dapat memberikan jawaban yang lebih lengkap."
  ],
  default: [
    "Maaf, saat ini saya sedang mengalami masalah koneksi dengan server AI. Silakan coba lagi dalam beberapa saat atau periksa koneksi internet Anda.",
    "Saya sedang dalam mode offline saat ini. Untuk mendapatkan jawaban yang lebih akurat dan lengkap, silakan coba lagi ketika koneksi internet stabil.",
    "Koneksi ke AI sedang bermasalah. Saya akan mencoba memberikan bantuan dasar, tetapi untuk jawaban yang lebih baik, silakan coba lagi nanti."
  ],
  technical: [
    "Untuk pertanyaan teknis yang kompleks, saya memerlukan koneksi ke server AI. Silakan coba lagi ketika koneksi internet Anda stabil.",
    "Pertanyaan teknis memerlukan akses ke database pengetahuan yang lebih lengkap. Silakan coba lagi dalam beberapa saat.",
    "Saya memerlukan koneksi internet untuk menjawab pertanyaan teknis dengan akurat. Mohon coba lagi nanti."
  ]
};

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private isOnline: boolean = true;
  private lastConnectionCheck: number = 0;
  private connectionCheckInterval: number = 5 * 60 * 1000; // 5 minutes

  constructor() {
    if (!API_KEY) {
      throw new Error('API Key tidak ditemukan. Pastikan VITE_GEMINI_API_KEY sudah dikonfigurasi.');
    }
    
    if (!validateApiKey(API_KEY)) {
      console.warn('⚠️ API Key format mungkin tidak valid. Pastikan menggunakan key yang benar dari Google AI Studio.');
    }
    
    this.genAI = new GoogleGenerativeAI(API_KEY);
    // Updated to use the correct model name for the current API version
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateResponse(prompt: string, retryCount: number = 0): Promise<string> {
    const maxRetries = 2;
    
    // Check if we should attempt API call based on recent failures
    if (!this.shouldAttemptAPICall()) {
      return this.getFallbackResponse(prompt);
    }
    
    try {
      console.log(`🚀 Sending prompt to Gemini (attempt ${retryCount + 1}):`, prompt.substring(0, 100) + '...');
      
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Mark as online if successful
      this.isOnline = true;
      this.lastConnectionCheck = Date.now();
      
      console.log('✅ Gemini response received:', text.substring(0, 100) + '...');
      return text;
    } catch (error) {
      console.error(`❌ Error generating response (attempt ${retryCount + 1}):`, error);
      
      // More specific error handling
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('api_key') || errorMessage.includes('invalid key') || errorMessage.includes('api key')) {
          throw new Error('🔑 API Key tidak valid. Silakan periksa konfigurasi API key Anda.');
        } else if (errorMessage.includes('quota') || errorMessage.includes('limit') || errorMessage.includes('exceeded')) {
          throw new Error('📊 Kuota API telah habis. Silakan coba lagi nanti atau periksa billing account Anda.');
        } else if (errorMessage.includes('blocked') || errorMessage.includes('safety') || errorMessage.includes('content policy')) {
          throw new Error('🛡️ Pesan Anda tidak dapat diproses karena alasan keamanan. Silakan coba dengan pertanyaan yang berbeda.');
        } else if (errorMessage.includes('timeout') && retryCount < maxRetries) {
          console.log(`⏱️ Request timeout, retrying... (${retryCount + 1}/${maxRetries})`);
          await this.delay(1000 * (retryCount + 1)); // Exponential backoff
          return this.generateResponse(prompt, retryCount + 1);
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('failed') || errorMessage.includes('connection')) {
          if (retryCount < maxRetries) {
            console.log(`🌐 Network error, retrying... (${retryCount + 1}/${maxRetries})`);
            await this.delay(2000 * (retryCount + 1)); // Longer delay for network issues
            return this.generateResponse(prompt, retryCount + 1);
          } else {
            // Mark as offline and return fallback
            this.isOnline = false;
            this.lastConnectionCheck = Date.now();
            console.log('📱 Switching to offline mode with fallback responses');
            return this.getFallbackResponse(prompt, true);
          }
        }
        
        // Log the actual error for debugging
        console.error('Detailed error:', error);
      }
      
      // For any other error after max retries, use fallback
      if (retryCount >= maxRetries) {
        this.isOnline = false;
        this.lastConnectionCheck = Date.now();
        return this.getFallbackResponse(prompt, true);
      }
      
      throw new Error('🤖 Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi dalam beberapa saat.');
    }
  }

  // Helper method for delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Determine if we should attempt API call based on recent connection status
  private shouldAttemptAPICall(): boolean {
    const now = Date.now();
    // If we haven't checked recently or if we were online, attempt the call
    return this.isOnline || (now - this.lastConnectionCheck) > this.connectionCheckInterval;
  }

  // Generate fallback responses when API is unavailable
  private getFallbackResponse(prompt: string, showOfflineMessage: boolean = false): string {
    const lowerPrompt = prompt.toLowerCase();
    
    let responseCategory = 'default';
    
    // Categorize the prompt to provide more relevant fallback
    if (lowerPrompt.includes('halo') || lowerPrompt.includes('hai') || lowerPrompt.includes('hello') || lowerPrompt.includes('selamat')) {
      responseCategory = 'greeting';
    } else if (lowerPrompt.includes('bantuan') || lowerPrompt.includes('help') || lowerPrompt.includes('tolong') || lowerPrompt.includes('bisa')) {
      responseCategory = 'help';
    } else if (lowerPrompt.includes('code') || lowerPrompt.includes('programming') || lowerPrompt.includes('technical') || lowerPrompt.includes('api')) {
      responseCategory = 'technical';
    }
    
    const responses = FALLBACK_RESPONSES[responseCategory as keyof typeof FALLBACK_RESPONSES];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const offlinePrefix = showOfflineMessage 
      ? "⚠️ Status koneksi: 🌐 Masalah koneksi internet. Silakan periksa koneksi Anda dan coba lagi.. Saya akan menggunakan respons fallback untuk membantu Anda.\n\n" 
      : "";
    
    return offlinePrefix + randomResponse;
  }

  async generateContextualResponse(prompt: string, context: string = ''): Promise<string> {
    // Analyze the prompt to determine if it's website-related or general
    const isWebsiteRelated = this.isWebsiteRelatedQuery(prompt);
    
    let contextualPrompt: string;
    
    if (isWebsiteRelated && context) {
      // Website-specific response with context
      contextualPrompt = `Konteks website: ${context}

Pertanyaan: ${prompt}

Instruksi: Jawab pertanyaan dengan singkat dan jelas (maksimal 2-3 kalimat). Berikan informasi yang paling penting saja. Gunakan bahasa Indonesia yang ramah.`;
    } else if (isWebsiteRelated && !context) {
      // Website-related but no context provided
      contextualPrompt = `Pertanyaan terkait website/layanan: ${prompt}

Instruksi: Berikan jawaban singkat dan profesional (maksimal 2-3 kalimat). Fokus pada informasi inti saja. Gunakan bahasa Indonesia yang ramah.`;
    } else {
      // General question - short and concise
      contextualPrompt = `Pertanyaan: ${prompt}

Instruksi: Berikan jawaban yang singkat dan jelas (maksimal 3-4 kalimat). Langsung ke poin utama tanpa penjelasan panjang. Gunakan bahasa Indonesia yang mudah dipahami.`;
    }
    
    return this.generateResponse(contextualPrompt);
  }

  // Helper method to determine if a query is website/business related
  private isWebsiteRelatedQuery(prompt: string): boolean {
    const lowerPrompt = prompt.toLowerCase();
    
    // Website/business related keywords
    const websiteKeywords = [
      'layanan', 'service', 'produk', 'product', 'harga', 'price', 'biaya', 'cost', 'tarif',
      'kontak', 'contact', 'hubungi', 'email', 'telepon', 'phone', 'alamat', 'address',
      'perusahaan', 'company', 'bisnis', 'business', 'tim', 'team', 'staff',
      'portfolio', 'project', 'klien', 'client', 'customer', 'pelanggan',
      'website', 'web', 'online', 'digital', 'teknologi perusahaan', 'company tech',
      'cara pesan', 'cara order', 'how to order', 'booking', 'appointment',
      'jam kerja', 'working hours', 'operasional', 'operational',
      'pembayaran', 'payment', 'invoice', 'billing', 'quote', 'penawaran',
      'support', 'bantuan teknis', 'technical support', 'help desk',
      'tentang kami', 'about us', 'profil perusahaan', 'company profile',
      'lokasi', 'location', 'kantor', 'office', 'cabang', 'branch'
    ];
    
    return websiteKeywords.some(keyword => lowerPrompt.includes(keyword));
  }

  // Method untuk test koneksi dengan lebih detail
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔍 Testing Gemini API connection...');
      console.log('📊 Debug Info:', this.getDebugInfo());
      
      // Test with a simple prompt first
      const testResponse = await this.generateResponse('Test koneksi - jawab singkat: OK');
      
      if (testResponse && !testResponse.includes('Status koneksi:') && !testResponse.includes('fallback')) {
        console.log('✅ API connection successful');
        this.isOnline = true;
        this.lastConnectionCheck = Date.now();
        return { success: true, message: 'Koneksi ke Gemini AI berhasil' };
      } else {
        console.log('❌ API returned fallback response');
        return { success: false, message: 'API menggunakan respons fallback - koneksi bermasalah' };
      }
    } catch (error) {
      console.error('❌ API connection failed:', error);
      this.isOnline = false;
      this.lastConnectionCheck = Date.now();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: errorMessage };
    }
  }

  // New method: Test API key validity specifically
  async validateApiConnection(): Promise<{ 
    isValid: boolean; 
    keyFormat: boolean; 
    networkOk: boolean; 
    quotaOk: boolean; 
    message: string 
  }> {
    const result = {
      isValid: false,
      keyFormat: validateApiKey(API_KEY),
      networkOk: false,
      quotaOk: false,
      message: ''
    };

    try {
      // Test network connectivity first
      console.log('🌐 Testing network connectivity...');
      await fetch('https://generativelanguage.googleapis.com', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      result.networkOk = true;
      console.log('✅ Network connectivity OK');

      // Test API key with minimal request
      console.log('🔑 Testing API key validity...');
      const testResult = await this.model.generateContent('Hello');
      const response = await testResult.response;
      const text = response.text();
      
      if (text) {
        result.isValid = true;
        result.quotaOk = true;
        result.message = 'API key dan koneksi valid - siap digunakan!';
        console.log('✅ API key valid and working');
      }
    } catch (error) {
      console.error('❌ API validation failed:', error);
      
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        
        if (errorMsg.includes('api_key') || errorMsg.includes('invalid')) {
          result.message = '🔑 API Key tidak valid atau telah expired';
        } else if (errorMsg.includes('quota') || errorMsg.includes('limit')) {
          result.message = '📊 Kuota API habis atau limit terlampaui';
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          result.networkOk = false;
          result.message = '🌐 Masalah koneksi network - cek internet Anda';
        } else {
          result.message = `❌ Error: ${error.message}`;
        }
      }
    }

    return result;
  }

  // Method untuk debug informasi
  getDebugInfo(): object {
    return {
      hasApiKey: !!API_KEY,
      apiKeyLength: API_KEY ? API_KEY.length : 0,
      modelName: 'gemini-1.5-flash',
      isOnline: this.isOnline,
      lastConnectionCheck: new Date(this.lastConnectionCheck).toISOString(),
      timestamp: new Date().toISOString()
    };
  }

  // Method to manually reset connection status
  resetConnectionStatus(): void {
    this.isOnline = true;
    this.lastConnectionCheck = 0;
    console.log('🔄 Connection status reset - will attempt API call on next request');
  }

  // Get current connection status
  getConnectionStatus(): { isOnline: boolean; lastCheck: string } {
    return {
      isOnline: this.isOnline,
      lastCheck: new Date(this.lastConnectionCheck).toISOString()
    };
  }
}

export const geminiService = new GeminiService();