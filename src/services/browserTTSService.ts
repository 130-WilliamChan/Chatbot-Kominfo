// Browser TTS service - optimized for CCTV information chatbot
// Simple and reliable text-to-speech using browser's built-in capabilities

// Audio elements storage for proper cleanup
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Text chunking for longer content (optimized for web integration)
const MAX_TEXT_LENGTH = 200;

// TTS settings optimized for information delivery
const TTS_SETTINGS = {
  lang: 'id-ID', // Indonesian language
  rate: 0.9,     // Slightly slower for clarity
  pitch: 1.0,    // Normal pitch
  volume: 0.8,   // Slightly lower volume for web integration
};

/**
 * Splits long text into smaller chunks for better TTS delivery
 * @param text The text to chunk
 * @returns Array of text chunks
 */
const chunkText = (text: string): string[] => {
  if (text.length <= MAX_TEXT_LENGTH) {
    return [text];
  }

  const chunks: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    let endIndex = Math.min(currentIndex + MAX_TEXT_LENGTH, text.length);
    
    if (endIndex < text.length) {
      // Try to find a natural break point (sentence end)
      const lastSentenceEnd = Math.max(
        text.lastIndexOf('.', endIndex),
        text.lastIndexOf('!', endIndex),
        text.lastIndexOf('?', endIndex),
        text.lastIndexOf(',', endIndex)
      );

      if (lastSentenceEnd > currentIndex && lastSentenceEnd > endIndex - 50) {
        endIndex = lastSentenceEnd + 1;
      }
    }

    chunks.push(text.substring(currentIndex, endIndex).trim());
    currentIndex = endIndex;
  }

  return chunks.filter(chunk => chunk.length > 0);
};

/**
 * Stops any currently playing speech
 */
const stopSpeaking = (): void => {
  try {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    currentUtterance = null;
    console.log('🔇 TTS dihentikan');
  } catch (error) {
    console.error('Error stopping TTS:', error);
  }
};

/**
 * Speaks a single text chunk
 * @param text Text to speak
 * @returns Promise that resolves when speech starts
 */
const speakChunk = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply TTS settings
      utterance.lang = TTS_SETTINGS.lang;
      utterance.rate = TTS_SETTINGS.rate;
      utterance.pitch = TTS_SETTINGS.pitch;
      utterance.volume = TTS_SETTINGS.volume;
      
      // Event handlers
      utterance.onstart = () => {
        console.log('🎤 TTS dimulai:', text.substring(0, 50) + '...');
      };
      
      utterance.onend = () => {
        console.log('✅ TTS selesai');
        if (currentUtterance === utterance) {
          currentUtterance = null;
        }
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('❌ TTS error:', event.error);
        if (currentUtterance === utterance) {
          currentUtterance = null;
        }
        reject(new Error(`TTS error: ${event.error}`));
      };
      
      // Store current utterance for cleanup
      currentUtterance = utterance;
      
      // Start speaking
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('❌ Error creating utterance:', error);
      reject(error);
    }
  });
};

/**
 * Speaks text using browser TTS with chunking support
 * @param text Text to be spoken
 * @returns Promise that resolves when speech completes
 */
const speakText = async (text: string): Promise<void> => {
  try {
    // Stop any existing speech
    stopSpeaking();
    
    if (!text || text.trim().length === 0) {
      console.warn('⚠️ Text kosong, tidak ada yang diucapkan');
      return;
    }
    
    // Clean and prepare text
    const cleanText = text.trim().replace(/\s+/g, ' ');
    console.log('🔊 Memulai TTS untuk:', cleanText.substring(0, 100) + '...');
    
    // Check if speech synthesis is available
    if (!('speechSynthesis' in window)) {
      throw new Error('Browser TTS tidak didukung');
    }
    
    // Split text into chunks for better delivery
    const textChunks = chunkText(cleanText);
    console.log(`📝 Text dibagi menjadi ${textChunks.length} bagian`);
    
    // Speak each chunk sequentially
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      const isLast = i === textChunks.length - 1;
      
      await speakChunk(chunk);
      
      // Small delay between chunks for natural flow
      if (!isLast) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('✅ Semua bagian TTS selesai');
    
  } catch (error) {
    console.error('❌ Error dalam TTS:', error);
    throw error;
  }
};

/**
 * Checks if browser TTS is available and working
 * @returns Promise resolving to boolean indicating TTS availability
 */
const checkTTSAvailability = async (): Promise<boolean> => {
  try {
    if (!('speechSynthesis' in window)) {
      console.error('❌ SpeechSynthesis tidak tersedia di browser ini');
      return false;
    }
    
    // Check if voices are available
    const voices = speechSynthesis.getVoices();
    const indonesianVoices = voices.filter(voice => 
      voice.lang.startsWith('id') || voice.lang.includes('ID')
    );
    
    console.log('🔍 Status TTS Browser:');
    console.log(`- Total voices: ${voices.length}`);
    console.log(`- Indonesian voices: ${indonesianVoices.length}`);
    console.log(`- Speech synthesis ready: ${speechSynthesis !== undefined}`);
    
    if (indonesianVoices.length > 0) {
      console.log('✅ Voice Indonesia ditemukan:', indonesianVoices[0].name);
    } else {
      console.log('⚠️ Tidak ada voice Indonesia, menggunakan voice default');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error checking TTS availability:', error);
    return false;
  }
};

/**
 * Gets available voices for the current language
 * @returns Array of available voices
 */
const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  try {
    const voices = speechSynthesis.getVoices();
    const indonesianVoices = voices.filter(voice => 
      voice.lang.startsWith('id') || voice.lang.includes('ID')
    );
    
    return indonesianVoices.length > 0 ? indonesianVoices : voices.slice(0, 5);
  } catch (error) {
    console.error('Error getting voices:', error);
    return [];
  }
};

/**
 * Test TTS functionality
 * @param text Text to test with
 */
const testTTS = async (text: string = "Halo, saya adalah asisten virtual untuk informasi CCTV dan layanan publik."): Promise<void> => {
  console.log('🧪 Testing Browser TTS...');
  try {
    const isAvailable = await checkTTSAvailability();
    if (!isAvailable) {
      throw new Error('TTS tidak tersedia');
    }
    
    await speakText(text);
    console.log('✅ TTS test berhasil');
  } catch (error) {
    console.error('❌ TTS test gagal:', error);
    throw error;
  }
};

// Initialize TTS service
const initializeTTS = async (): Promise<void> => {
  try {
    console.log('🚀 Menginisialisasi Browser TTS Service...');
    
    // Wait for voices to load
    if (speechSynthesis.getVoices().length === 0) {
      await new Promise<void>((resolve) => {
        const checkVoices = () => {
          if (speechSynthesis.getVoices().length > 0) {
            resolve();
          } else {
            setTimeout(checkVoices, 100);
          }
        };
        speechSynthesis.onvoiceschanged = () => resolve();
        checkVoices();
      });
    }
    
    const isAvailable = await checkTTSAvailability();
    if (isAvailable) {
      console.log('✅ Browser TTS siap digunakan untuk chatbot CCTV');
    } else {
      console.warn('⚠️ Browser TTS tidak tersedia');
    }
    
  } catch (error) {
    console.error('❌ Error initializing TTS:', error);
  }
};

// Auto-initialize when module loads
initializeTTS();

export const browserTTSService = {
  speakText,
  stopSpeaking,
  checkTTSAvailability,
  getAvailableVoices,
  testTTS,
  // Maintain compatibility with existing code
  playAudio: () => Promise.resolve(null), // Deprecated - not needed for browser TTS
  generateSpeech: () => Promise.reject(new Error('Not supported with browser TTS')), // Deprecated
  checkApiKey: () => Promise.resolve(true), // Always true for browser TTS
  updateApiKey: () => {}, // No-op for browser TTS
};

// Export as default for backward compatibility
export default browserTTSService;
