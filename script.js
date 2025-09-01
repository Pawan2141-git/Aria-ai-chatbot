// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const typingIndicator = document.getElementById('typingIndicator');
const sendBtn = document.getElementById('sendBtn');
const charCount = document.getElementById('charCount');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const clearChat = document.getElementById('clearChat');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

// State Management
let isFirstMessage = true;
let messageHistory = [];

// Gemini API Integration
async function callGeminiAPI(message) {
    try {
        const response = await fetch(GEMINI_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': GEMINI_CONFIG.API_KEY
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${GEMINI_CONFIG.SYSTEM_PROMPT}\n\nUser: ${message}`
                    }]
                }],
                generationConfig: GEMINI_CONFIG.REQUEST_CONFIG
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        return null;
    }
}

// Local Fallback Responses
const localResponses = {
    greetings: ['Hello! How can I help you today?', 'Hi there! What can I do for you?', 'Hey! Great to see you!'],
    help: ['I can help you with various tasks. What do you need?', 'Feel free to ask me anything!'],
    thanks: ['You\'re welcome!', 'Happy to help!', 'Anytime!'],
    default: [
        'That\'s interesting! Tell me more.',
        'I understand. What else would you like to know?',
        'Thanks for sharing that with me.',
        'Could you elaborate on that?'
    ]
};

function getLocalResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return localResponses.greetings[Math.floor(Math.random() * localResponses.greetings.length)];
    }
    if (msg.includes('help')) {
        return localResponses.help[Math.floor(Math.random() * localResponses.help.length)];
    }
    if (msg.includes('thank')) {
        return localResponses.thanks[Math.floor(Math.random() * localResponses.thanks.length)];
    }
    if (msg.includes('time')) {
        return `The current time is ${new Date().toLocaleTimeString()}.`;
    }
    if (msg.includes('date')) {
        return `Today is ${new Date().toLocaleDateString()}.`;
    }
    
    return localResponses.default[Math.floor(Math.random() * localResponses.default.length)];
}

async function getAIResponse(message) {
    // Try Gemini API first
    if (GEMINI_CONFIG.API_KEY && GEMINI_CONFIG.API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
        const geminiResponse = await callGeminiAPI(message);
        if (geminiResponse) {
            return geminiResponse;
        }
    }
    
    // Fallback to local responses
    return getLocalResponse(message);
}

// Message Management
function getTimeStamp() {
    return new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function addMessage(message, isUser = false) {
    // Remove welcome message on first user message
    if (isFirstMessage && isUser) {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        isFirstMessage = false;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper';
    wrapper.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    // Handle code blocks and formatting
    if (message.includes('```')) {
        messageDiv.innerHTML = formatCodeBlocks(message);
    } else {
        messageDiv.textContent = message;
    }
    
    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    timestamp.textContent = getTimeStamp();
    
    wrapper.appendChild(messageDiv);
    wrapper.appendChild(timestamp);
    chatMessages.appendChild(wrapper);
    
    // Store in history
    messageHistory.push({ message, isUser, timestamp: new Date() });
    
    // Auto-scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatCodeBlocks(text) {
    return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Typing Indicator
function showTyping() {
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    typingIndicator.style.display = 'none';
}

// Auto-resize textarea
function autoResize() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// Send Message Function
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || sendBtn.disabled) return;

    sendBtn.disabled = true;
    addMessage(message, true);
    messageInput.value = '';
    autoResize();
    updateCharCount();

    showTyping();
    
    try {
        const aiResponse = await getAIResponse(message);
        hideTyping();
        addMessage(aiResponse);
    } catch (error) {
        console.error('Error getting AI response:', error);
        hideTyping();
        addMessage('Sorry, I encountered an error. Please try again.');
    } finally {
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

// Character Counter
function updateCharCount() {
    const count = messageInput.value.length;
    charCount.textContent = `${count}/2000`;
    
    if (count > 1800) {
        charCount.style.color = 'var(--error)';
    } else if (count > 1500) {
        charCount.style.color = 'var(--warning)';
    } else {
        charCount.style.color = 'var(--text-secondary)';
    }
}

// Quick Action Buttons
function initQuickActions() {
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-text');
            messageInput.value = text;
            autoResize();
            updateCharCount();
            messageInput.focus();
        });
    });
}

// Settings Modal
function initSettings() {
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
    
    closeSettings.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });
    
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });
    
    // Temperature slider
    const tempSlider = document.getElementById('temperatureSlider');
    const tempValue = document.getElementById('temperatureValue');
    
    tempSlider.addEventListener('input', () => {
        tempValue.textContent = tempSlider.value;
        GEMINI_CONFIG.REQUEST_CONFIG.temperature = parseFloat(tempSlider.value);
    });
    
    // Max tokens slider
    const tokensSlider = document.getElementById('maxTokensSlider');
    const tokensValue = document.getElementById('maxTokensValue');
    
    tokensSlider.addEventListener('input', () => {
        tokensValue.textContent = tokensSlider.value;
        GEMINI_CONFIG.REQUEST_CONFIG.maxOutputTokens = parseInt(tokensSlider.value);
    });
}

// Clear Chat
function initClearChat() {
    clearChat.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the chat?')) {
            chatMessages.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <h2>Welcome to ARIA</h2>
                    <p>Your advanced AI assistant powered by Gemini 2.0</p>
                    <div class="quick-actions">
                        <button class="quick-btn" data-text="Tell me a joke">
                            <i class="fas fa-laugh"></i> Joke
                        </button>
                        <button class="quick-btn" data-text="What's the weather like?">
                            <i class="fas fa-cloud-sun"></i> Weather
                        </button>
                        <button class="quick-btn" data-text="Help me with coding">
                            <i class="fas fa-code"></i> Code Help
                        </button>
                        <button class="quick-btn" data-text="Explain quantum physics">
                            <i class="fas fa-atom"></i> Science
                        </button>
                    </div>
                </div>
            `;
            messageHistory = [];
            isFirstMessage = true;
            initQuickActions();
        }
    });
}

// Sidebar Toggle
function initSidebar() {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Particle Animation
function createParticles() {
    const particles = document.getElementById('particles');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particles.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 10000);
    }
    
    setInterval(createParticle, 400);
}

// Voice Input (placeholder)
function initVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn');
    voiceBtn.addEventListener('click', () => {
        // Placeholder for voice input functionality
        alert('Voice input feature coming soon!');
    });
}

// Initialize API Status
function initAPIStatus() {
    const apiStatus = document.getElementById('apiStatus');
    const botStatus = document.getElementById('botStatus');
    
    if (GEMINI_CONFIG.API_KEY && GEMINI_CONFIG.API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
        apiStatus.innerHTML = '<i class="fas fa-circle"></i><span>Gemini 2.0</span>';
        botStatus.innerHTML = '<i class="fas fa-circle online"></i><span>Online • Gemini 2.0</span>';
    } else {
        apiStatus.innerHTML = '<i class="fas fa-circle" style="color: var(--warning)"></i><span>Local Mode</span>';
        botStatus.innerHTML = '<i class="fas fa-circle" style="color: var(--warning)"></i><span>Local Mode</span>';
    }
}

// Event Listeners
messageInput.addEventListener('input', () => {
    autoResize();
    updateCharCount();
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initQuickActions();
    initSettings();
    initClearChat();
    initSidebar();
    initVoiceInput();
    initAPIStatus();
    createParticles();
    
    messageInput.focus();
    updateCharCount();
    
    // Initial typing simulation
    setTimeout(() => {
        showTyping();
        setTimeout(hideTyping, 2000);
    }, 1000);
});