// Gemini API Configuration
const GEMINI_CONFIG = {
    API_KEY: 'AIzaSyBD9JIoFBuXptBslKkX29D9kSsnuWD3w0E',
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    
    // Default system prompt for better responses
    SYSTEM_PROMPT: `You are ARIA, an Advanced Responsive Intelligence Assistant. You are helpful, friendly, and engaging. Keep responses conversational. Use emojis appropriately.`,
    
    // Request configuration
    REQUEST_CONFIG: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        topP: 0.8,
        topK: 40
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GEMINI_CONFIG;
}