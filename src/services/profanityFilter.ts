// Filter for inappropriate words/profanity
export const profanityFilter = {
  // List of inappropriate words in Indonesian and English
  badWords: [
    // Indonesian profanity
    'anjing', 'bangsat', 'babi', 'kontol', 'memek', 'ngentot', 'bajingan', 'tolol', 
    'bodoh', 'goblok', 'idiot', 'sial', 'brengsek', 'kampret', 'sialan', 'pepek',
    'titit', 'tai', 'bangke', 'jancuk', 'kimak', 'monyet', 'asu', 'njir', 'kampung','kampang',
    // English profanity
    'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard', 'crap', 'hell',
    'piss', 'cock', 'dick', 'pussy', 'whore', 'slut', 'fag', 'nigger',
    // Add more as needed
  ],

  // Check if text contains profanity
  containsProfanity(text: string): boolean {
    const lowercaseText = text.toLowerCase();
    return this.badWords.some(word => 
      lowercaseText.includes(word.toLowerCase())
    );
  },

  // Clean text by replacing profanity with asterisks
  cleanText(text: string): string {
    let cleanedText = text;
    this.badWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      const replacement = '*'.repeat(word.length);
      cleanedText = cleanedText.replace(regex, replacement);
    });
    return cleanedText;
  },

  // Get warning message for profanity detection
  getWarningMessage(): string {
    return "Mohon gunakan bahasa yang sopan. Pesan Anda mengandung kata-kata yang tidak pantas.";
  }
};

export default profanityFilter;