# ARIA - Advanced AI Chatbot 🤖

Premium AI chatbot with Gemini API integration and stunning UI.

## 🚀 Features

- **Gemini AI Integration** - Real AI responses using Google's Gemini API
- **Bilingual Support** - Hindi & English language detection
- **Premium UI** - Glassmorphism design with animations
- **Particle Effects** - Floating background animations
- **Smart Fallback** - Local responses when API unavailable
- **Real-time Features** - Typing indicators, timestamps, status

## 📋 Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy your API key

### 2. Configure API
1. Open `config.js`
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
```javascript
API_KEY: 'your-actual-api-key-here'
```

### 3. Run the Chatbot
1. Open `index.html` in any modern browser
2. Start chatting!

## 🎯 API Status

- **🟢 Gemini AI Mode** - When API key is configured
- **🟡 Local Mode** - Fallback with predefined responses

## 🛠️ Files Structure

```
📁 Ai chat bot/
├── 📄 index.html      # Main HTML file
├── 🎨 style.css       # Premium styling
├── ⚡ script.js       # Core functionality
├── ⚙️ config.js       # API configuration
└── 📖 README.md       # This file
```

## 💡 Usage Examples

Try these commands:
- "Hello" / "नमस्ते"
- "What's the time?"
- "Tell me a joke"
- "2+2" (math calculations)
- "What's your name?"

## 🔧 Customization

### Change System Prompt
Edit `SYSTEM_PROMPT` in `config.js` to modify AI behavior.

### Modify UI Colors
Update gradient colors in `style.css` for different themes.

### Add New Responses
Extend the `responses` object in `script.js` for local fallbacks.

## 🚨 Important Notes

- Keep your API key secure and never share it publicly
- The chatbot works offline with local responses as fallback
- Modern browser required for all features to work properly

## 🎨 UI Features

- **Glassmorphism Effects** - Transparent blur backgrounds
- **Gradient Animations** - Color-shifting elements
- **Particle System** - Floating background particles
- **Smooth Transitions** - Cubic-bezier animations
- **Responsive Design** - Works on all screen sizes

Enjoy your premium AI chatbot! 🚀✨