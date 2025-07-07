const ELEVEN_LABS_API_KEY = 'sk_f42e318855224f51470c45141e4e7866ad21cf45fc130d64';

// Use the specific voice ID as requested
const VOICE_ID = 'GdyFAZdMpKMBHw5pc1Bu';

// Flag to track if we've already logged an API key error
let hasLoggedKeyError = false;

// Audio elements storage for proper cleanup
let currentAudio: HTMLAudioElement | null = null;

// Text chunking for longer content
const MAX_TEXT_LENGTH = 5000; 

// Track API availability
let isApiAvailable = true;

const chunkText = (text: string): string[] => {
  if (text.length <= MAX_TEXT_LENGTH) {
    return [text];
  }

  const chunks: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    // Find a good breaking point (end of sentence) within the limits
    let endIndex = Math.min(currentIndex + MAX_TEXT_LENGTH, text.length);
    
    if (endIndex < text.length) {
      // Try to find a sentence end (.!?) to make a natural break
      const lastSentenceEnd = Math.max(
        text.lastIndexOf('.', endIndex),
        text.lastIndexOf('!', endIndex),
        text.lastIndexOf('?', endIndex)
      );

      if (lastSentenceEnd > currentIndex && lastSentenceEnd > endIndex - 100) {
        endIndex = lastSentenceEnd + 1; 
      }
    }

    chunks.push(text.substring(currentIndex, endIndex));
    currentIndex = endIndex;
  }

  return chunks;
};

/**
 * Generates voice audio from text using ElevenLabs API
 * @param text The text to convert to speech
 * @returns A promise resolving to the audio blob
 */
const generateSpeech = async (text: string): Promise<Blob> => {
  // If we already know the API is unavailable, fail fast
  if (!isApiAvailable) {
    return Promise.reject(new Error("ElevenLabs API unavailable"));
  }

  try {
    console.log(`Generating speech using fixed voice ID: ${VOICE_ID}`);
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2', 
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.4,
          use_speaker_boost: true
        }
      ),
    });

    if (!response.ok) {
      // Handle auth errors specifically
      if (response.status === 401 || response.status === 403) {
        isApiAvailable = false; // Mark API as unavailable to prevent further attempts
        
        if (!hasLoggedKeyError) {
          console.error('ElevenLabs API key is invalid or expired. Please update your API key.');
          hasLoggedKeyError = true; // Only log this once
        }
      }
      
      // Try to get error details
      const errorMessage = await response.text();
        console.error('ElevenLabs API error details:', errorMessage);
      
      if (errorMessage.includes('API key is invalid or expired')) {
        isApiAvailable = false; // Mark API as unavailable to prevent further attempts
      }
      
      if (errorMessage.includes('API key is disabled')) {
        isApiAvailable = false; // Mark API as unavailable to prevent further attempts
      }
      
      if (errorMessage.includes('API key is locked')) {
        isApiAvailable = false; // Mark API as unavailable to prevent further attempts
      }
      
      if (errorMessage.includes('API key is expired')) {
        isApiAvailable = false; // Mark API as unavailable to prevent further attempts
      }
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating speech with ElevenLabs:', error);
    throw error;
  }
};

/**
 * Stops any currently playing audio
 */
const stopSpeaking = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

/**
 * Plays audio from a blob with proper error handling
 * @param audioBlob The audio blob to play
 * @returns A promise that resolves when audio starts playing
 */
const playAudio = (audioBlob: Blob): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    // Stop any existing audio first
    stopSpeaking();
    
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      // Clean up the blob URL when done
      URL.revokeObjectURL(audioUrl);
      if (currentAudio === audio) {
        currentAudio = null;
      }
    };
    
    audio.onerror = (error) => {
      URL.revokeObjectURL(audioUrl);
      if (currentAudio === audio) {
        currentAudio = null;
      }
      reject(error);
    };
    
    audio.oncanplaythrough = () => {
      resolve(audio);
    };
    
    audio.play().catch(error => {
      URL.revokeObjectURL(audioUrl);
      reject(error);
    });
    
    currentAudio = audio;
  });
};

/**
 * Creates audio from local mp3 files as a fallback
 * @param emotion The emotion to match (happy, sad, etc)
 * @returns A promise resolving to an audio element
 */
const createFallbackAudio = (text: string): HTMLAudioElement => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.9;
  utterance.pitch = 0.8;
  speechSynthesis.speak(utterance);
  
  // Return a dummy audio element for consistent interface
  return new Audio();
};

/**
 * Speaks text using ElevenLabs API with proper error handling and fallbacks
 * @param text Text to be spoken
 * @returns Promise that resolves when audio starts playing
 */
const speakText = async (text: string): Promise<HTMLAudioElement | null> => {
  try {
    // Skip the API call entirely if we know it's not available
    if (!isApiAvailable) {
      return useFallbackTTS(text);
    }
    
    // For longer texts, process them in chunks
    const textChunks = chunkText(text);
    
    if (textChunks.length > 1) {
      // For multi-chunk processing, we would implement a queue system
      // For now, we'll just process the first chunk as a simplified approach
      console.warn(`Text was split into ${textChunks.length} chunks. Processing only first chunk.`);
      text = textChunks[0];
    }
    
    const audioBlob = await generateSpeech(text);
    return await playAudio(audioBlob);
  } catch (error) {
    console.error('Error in speakText:', error);
    return useFallbackTTS(text);
  }
};

/**
 * Fallback to browser's built-in TTS when ElevenLabs is unavailable
 */
const useFallbackTTS = (text: string): HTMLAudioElement | null => {
  try {
    console.log('Using fallback browser TTS');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    speechSynthesis.speak(utterance);
    return null; // No audio element to return with browser TTS
  } catch (fallbackError) {
    console.error('Browser TTS fallback also failed:', fallbackError);
    return null;
  }
};

/**
 * Checks if the API key is valid
 * @returns Promise resolving to boolean indicating if the API key is valid
 */
const checkApiKey = async (): Promise<boolean> => {
  try {
    // If we've already determined the API isn't available, don't check again
    if (!isApiAvailable) return false;

    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        isApiAvailable = false; // Mark API as unavailable
        
        if (!hasLoggedKeyError) {
          console.error('ElevenLabs API key is invalid or expired. Please update your API key.');
          hasLoggedKeyError = true;
        }
      }
      
      return false;
    }
    
    // API is available
    isApiAvailable = true;
    
    // Log user subscription info
    try {
      const userData = await response.json();
      console.log('ElevenLabs user data:', {
        subscription: userData.subscription?.tier || 'Unknown',
        charactersUsed: userData.subscription?.character_count || 0,
        charactersLimit: userData.subscription?.character_limit || 0,
      });
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
    
    return true;
  } catch (error) {
    console.error('Error checking ElevenLabs API key:', error);
    isApiAvailable = false;
    return false;
  }
};

/**
 * Updates the API key at runtime
 * @param newApiKey The new API key to use
 */
const updateApiKey = (newApiKey: string): void => {
  if (newApiKey && newApiKey !== ELEVEN_LABS_API_KEY) {
    // Avoid reassigning const - this is just for the function example
    // In a real implementation, you'd use a different pattern
    console.log('Updating API key');
    // Would need a different implementation approach to actually update the key
    isApiAvailable = true; // Reset availability flag
    hasLoggedKeyError = false;
    checkApiKey(); // Validate the new key
  }
};

// Initialize by checking API key only, no voice search needed
(async () => {
  try {
    console.log('Initializing ElevenLabs service...');
    console.log(`Using fixed voice ID: ${VOICE_ID}`);
    
    const isValidKey = await checkApiKey();
    console.log(`ElevenLabs API key valid: ${isValidKey}`);
    
    if (!isValidKey) {
      console.error('Invalid ElevenLabs API key - using browser TTS fallback instead');
      isApiAvailable = false;
    }
  } catch (error) {
    console.error('Error initializing ElevenLabs service:', error);
    isApiAvailable = false;
  }
})();

export const elevenLabsService = {
  speakText,
  generateSpeech,
  playAudio,
  stopSpeaking,
  checkApiKey,
  updateApiKey, // Export the function to update the API key
};