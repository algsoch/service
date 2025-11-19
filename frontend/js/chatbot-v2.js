/**
 * VICKY AI SYSTEMS - REAL AI CHATBOT V2
 * Uses backend API with OpenAI for intelligent conversations
 */

// Backend API URL
const BACKEND_URL = 'http://localhost:8000';

// Conversation state
let conversationHistory = [];
let conversationId = `conv_${Date.now()}`;
let userDetails = {
    email: null,
    phone: null,
    industry: null
};

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 Vicky AI Chatbot V2 - Initializing...');
    
    // Wait for sendMessage to be defined by script.js
    setTimeout(() => {
        if (typeof window.sendMessage === 'function') {
            console.log('✅ Overriding sendMessage with AI backend');
            window.sendMessage = sendMessageWithAI;
        } else {
            console.error('❌ sendMessage function not found!');
        }
    }, 1500);
});

/**
 * Main chatbot function - sends message to backend API
 */
async function sendMessageWithAI() {
    const input = document.getElementById('user-input');
    const userMessage = input.value.trim();
    
    if (!userMessage) return;
    
    // Clear input
    input.value = '';
    
    // Add user message to UI
    addUserMessage(userMessage);
    
    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });
    
    // Extract user details from message
    extractUserDetails(userMessage);
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Call backend API
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                conversation_id: conversationId,
                conversation_history: conversationHistory
            })
        });
        
        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot response to UI
        addBotMessage(data.response);
        
        // Add to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: data.response
        });
        
        // Check if user wants to send message to Vicky
        checkForSendRequest(userMessage, data.response);
        
    } catch (error) {
        console.error('Chatbot error:', error);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Friendly fallback
        const fallbackMessage = `Hey! I'm experiencing a small hiccup connecting to my brain 🧠. But don't worry - I can still help! 

Tell me about your project and when you're ready, I'll send everything to Vicky directly. He responds super fast!

What are you looking to build?`;
        
        addBotMessage(fallbackMessage);
    }
}

/**
 * Extract user details from messages
 */
function extractUserDetails(message) {
    const lowerMsg = message.toLowerCase();
    
    // Extract email
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
        userDetails.email = emailMatch[0];
        console.log('📧 Extracted email:', userDetails.email);
    }
    
    // Extract phone
    const phoneMatch = message.match(/(\+91[\s-]?)?\d{10}|\d{5}[\s-]?\d{5}/);
    if (phoneMatch) {
        userDetails.phone = phoneMatch[0];
        console.log('📱 Extracted phone:', userDetails.phone);
    }
    
    // Extract industry keywords
    const industries = ['pharmacy', 'healthcare', 'ecommerce', 'retail', 'education', 'finance', 'real estate', 'logistics', 'manufacturing', 'saas', 'startup', 'IT', 'technology'];
    for (const industry of industries) {
        if (lowerMsg.includes(industry)) {
            userDetails.industry = industry;
            console.log('🏢 Detected industry:', industry);
            break;
        }
    }
}

/**
 * Check if user wants to send conversation to Vicky
 */
async function checkForSendRequest(userMessage, botResponse) {
    const lowerMsg = userMessage.toLowerCase();
    const lowerBot = botResponse.toLowerCase();
    
    // Trigger words/phrases that indicate user wants to connect
    const sendTriggers = [
        'send',
        'contact vicky',
        'reach out',
        'yes send',
        'yes please',
        'go ahead',
        'sure',
        'okay',
        'ok',
        'confirm',
        'book a call',
        'schedule',
        'interested'
    ];
    
    // Check if bot offered to send and user agreed
    const botOfferedToSend = lowerBot.includes('send') && lowerBot.includes('vicky');
    const userAgreed = sendTriggers.some(trigger => lowerMsg.includes(trigger));
    
    // Also auto-send if user shows strong interest
    const strongInterest = lowerMsg.includes('deal') || 
                          lowerMsg.includes('hire') || 
                          lowerMsg.includes('budget is') ||
                          (userDetails.email && conversationHistory.length >= 6);
    
    if ((botOfferedToSend && userAgreed) || strongInterest) {
        console.log('🚀 Sending conversation to Discord...');
        await sendConversationToDiscord('deal_confirmed');
    }
}

/**
 * Send conversation to Discord via backend
 */
async function sendConversationToDiscord(status = 'interested') {
    showTypingIndicator();
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/send-to-discord`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversation_history: conversationHistory,
                user_email: userDetails.email,
                user_phone: userDetails.phone,
                user_industry: userDetails.industry,
                deal_status: status
            })
        });
        
        const data = await response.json();
        
        removeTypingIndicator();
        
        if (data.success) {
            addBotMessage(data.message);
        } else {
            addBotMessage(`I had a small issue sending to Discord, but you can reach Vicky directly:\n\n📧 npdimagine@gmail.com\n📱 +91 83838 48219`);
        }
        
    } catch (error) {
        console.error('Discord send error:', error);
        removeTypingIndicator();
        addBotMessage(`You can reach Vicky directly at:\n\n📧 npdimagine@gmail.com\n📱 +91 83838 48219\n\nHe responds within 24-48 hours!`);
    }
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const chatbox = document.getElementById('chatbox');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span> Vicky AI is thinking...';
    
    chatbox.appendChild(typingDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Add manual "Send to Vicky" button (optional)
 */
function addSendToVickyButton() {
    const chatbox = document.getElementById('chatbox');
    
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'message bot-message';
    buttonDiv.innerHTML = `
        <button onclick="sendConversationToDiscord('contact_requested')" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            📤 Send Conversation to Vicky
        </button>
    `;
    
    chatbox.appendChild(buttonDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Add CSS for typing indicator
const style = document.createElement('style');
style.textContent = `
    .typing-indicator {
        opacity: 0.7;
        font-style: italic;
    }
    
    .typing-dots span {
        animation: typingDot 1.4s infinite;
        opacity: 0;
    }
    
    .typing-dots span:nth-child(1) {
        animation-delay: 0s;
    }
    
    .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typingDot {
        0%, 60%, 100% { opacity: 0; }
        30% { opacity: 1; }
    }
`;
document.head.appendChild(style);

console.log('🚀 Chatbot V2 loaded successfully!');
