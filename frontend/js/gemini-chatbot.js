// ===== GEMINI AI CHATBOT WITH DISCORD INTEGRATION =====

// Use BACKEND proxy to hide API key (never expose keys in frontend!)
const BACKEND_API_URL = (typeof config !== 'undefined' && config.backendUrl) 
    ? `${config.backendUrl}/api/chat-gemini`
    : 'http://localhost:8000/api/chat-gemini';

let conversationHistory = [];
let userDetails = {};

// System prompt for Gemini
const SYSTEM_PROMPT = `You are a professional AI sales assistant for VICKY AI SYSTEMS, run by Vicky Kumar (IIT Madras student).

Your role: Engage visitors, understand their needs, and convince them to work with us.

Key Points to Emphasize:
- We build production-ready AI solutions (not just demos)
- Expertise: AI agents, ML models, full-stack AI apps, automation
- Student pricing advantage: High quality at affordable rates
- Fast delivery: 24-48h response, 1-4 week projects
- Proven results: 97.94% ML accuracy, real client work

Services & Pricing:
- Simple AI Chatbot: ₹15,000-25,000 ($180-300)
- ML Model: ₹25,000-50,000 ($300-600)
- Full AI Agent: ₹50,000-1,00,000 ($600-1,200)
- Full-Stack AI App: ₹75,000-2,00,000 ($900-2,400)
- Enterprise: Custom pricing

Your approach:
1. Ask about their business/industry
2. Understand their pain points
3. Suggest specific AI solutions
4. Mention pricing when they show interest
5. Encourage them to fill contact form
6. Be friendly, professional, and persuasive

Contact: npdimagine@gmail.com | +91 83838 48219
GitHub: algsoch | LinkedIn: algsoch

Keep responses concise (2-4 sentences max). Use emojis sparingly. Focus on value.`;

// Send conversation to Discord when user shows interest
async function sendConversationToDiscord(userInfo) {
    const conversationText = conversationHistory.map(msg => 
        `**${msg.role === 'user' ? 'User' : 'Bot'}:** ${msg.text}`
    ).join('\n\n');
    
    // Generate AI summary of conversation
    let summary = "Analyzing conversation...";
    try {
        const summaryResponse = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `Summarize this sales conversation in 3-4 sentences. Focus on: user's needs, budget range mentioned, interest level, and next steps. Conversation:\n\n${conversationText}`,
                conversation_history: []
            })
        });
        
        if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json();
            summary = summaryData.response;
        }
    } catch (error) {
        console.error('Failed to generate summary:', error);
        summary = "Unable to generate summary - see full conversation below.";
    }

    const discordPayload = {
        embeds: [
            {
                title: "🎯 New Lead from AI Chatbot!",
                color: 3066993, // Green
                description: `**📊 AI-Generated Summary:**\n${summary}`,
                fields: [
                    {
                        name: "📧 Email",
                        value: userInfo.email || "❌ Not provided",
                        inline: true
                    },
                    {
                        name: "📱 Phone",
                        value: userInfo.phone || "❌ Not provided",
                        inline: true
                    },
                    {
                        name: "🏢 Industry",
                        value: userInfo.industry || "Not specified",
                        inline: true
                    },
                    {
                        name: "💬 Message Count",
                        value: `${conversationHistory.length} messages`,
                        inline: true
                    },
                    {
                        name: "🔥 Interest Level",
                        value: userInfo.interest || "Clicked Send button",
                        inline: true
                    },
                    {
                        name: "⏰ Time",
                        value: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                        inline: true
                    }
                ],
                footer: {
                    text: "VICKY AI SYSTEMS - Chatbot Lead"
                },
                timestamp: new Date().toISOString()
            },
            {
                title: "💬 Full Conversation Transcript",
                color: 5814783, // Blue
                description: conversationText.substring(0, 4000) + (conversationText.length > 4000 ? "\n\n...[Conversation truncated]" : ""),
                footer: {
                    text: `Total: ${conversationHistory.length} messages`
                }
            }
        ]
    };

    try {
        await fetch(config.discordWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload)
        });
        console.log('Conversation sent to Discord successfully');
        return true;
    } catch (error) {
        console.error('Error sending to Discord:', error);
        throw error;
    }
}

// Call Gemini API
async function callGeminiAPI(userMessage) {
    try {
        // Add user message to history
        conversationHistory.push({
            role: 'user',
            text: userMessage
        });

        // Call backend proxy (keeps API key secret!)
        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                conversationHistory: conversationHistory
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Backend API error: ${response.status}`, errorData);
            throw new Error(`Backend API error: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.response;

        // Add bot response to history
        conversationHistory.push({
            role: 'bot',
            text: botResponse
        });

        // Extract user details if provided
        extractUserDetails(userMessage);

        // Check if user is showing strong interest
        const lowerMsg = userMessage.toLowerCase();
        const showingInterest = lowerMsg.match(/interested|yes|sure|let's go|sounds good|i want|can you|how do i|sign up|contact|email|phone/);
        
        if (showingInterest && conversationHistory.length >= 4) {
            // User is engaged, send conversation to Discord
            await sendConversationToDiscord({
                interest: "High - User showing strong interest",
                email: userDetails.email,
                phone: userDetails.phone,
                industry: userDetails.industry
            });
        }

        return botResponse;

    } catch (error) {
        console.error('Gemini API Error:', error);
        console.log('Error details:', error.message);
        
        // Try to use simple fallback first
        if (typeof getSimpleFallbackResponse !== 'undefined') {
            const fallbackResponse = getSimpleFallbackResponse(userMessage);
            
            // Add to history
            conversationHistory.push({
                role: 'bot',
                text: fallbackResponse + "\n\n_(Note: Using backup response system. For best experience, please try refreshing the page!)_"
            });
            
            return fallbackResponse + "\n\n_(Using backup response system)_";
        }
        
        // If this is the first error, ask for user details
        if (!userDetails.errorShown) {
            userDetails.errorShown = true;
            return "I'm experiencing a small technical hiccup! 😅 But I'm still here to help!\n\nCould you please share your:\n• Name\n• Email\n• Phone (optional)\n• What you're looking for\n\nI'll make sure Vicky gets your message and responds within 24-48 hours!";
        } else {
            // User has already been notified, extract any details they provided
            extractUserDetails(userMessage);
            
            // If we have at least an email, send to Discord
            if (userDetails.email || conversationHistory.length >= 6) {
                await sendConversationToDiscord({
                    interest: "Technical issue - User provided details",
                    email: userDetails.email || "Not provided",
                    phone: userDetails.phone || "Not provided",
                    industry: userDetails.industry || "To be discussed"
                });
                return "Perfect! ✅ I've sent your details to Vicky. He'll reach out within 24-48 hours. In the meantime, feel free to fill out the contact form below for faster response! 🚀";
            }
            
            return "Thank you! Please continue sharing your details, or you can directly fill the contact form at the bottom of this page. Vicky will get back to you very soon! 📧";
        }
    }
}

// Extract user details from conversation
function extractUserDetails(message) {
    const lowerMsg = message.toLowerCase();
    
    // Extract email
    const emailMatch = message.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    if (emailMatch) {
        userDetails.email = emailMatch[0];
    }
    
    // Extract phone
    const phoneMatch = message.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
        userDetails.phone = phoneMatch[0];
    }
    
    // Extract industry hints
    if (lowerMsg.includes('healthcare') || lowerMsg.includes('medical')) userDetails.industry = 'Healthcare';
    if (lowerMsg.includes('ecommerce') || lowerMsg.includes('retail')) userDetails.industry = 'E-commerce';
    if (lowerMsg.includes('education') || lowerMsg.includes('learning')) userDetails.industry = 'Education';
    if (lowerMsg.includes('finance') || lowerMsg.includes('fintech')) userDetails.industry = 'Fintech';
    if (lowerMsg.includes('agriculture') || lowerMsg.includes('farming')) userDetails.industry = 'Agriculture';
}

// Integrate with existing chat UI - Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    let messageCount = 0;
    let detailsRequested = false;
    
    // Override the global sendMessage function after a short delay
    setTimeout(() => {
        window.originalSendMessage = window.sendMessage;
        
        window.sendMessage = async function() {
            const chatInput = document.getElementById('chatInput');
            const chatMessages = document.getElementById('chatMessages');
            
            const message = chatInput.value.trim();
            if (message === '') return;
            
            // Check if initial details form is still showing
            if (document.getElementById('initial-contact-form')) {
                alert('Please fill in your details in the form above before starting the conversation.');
                return;
            }
            
            // Add user message
            addUserMessage(message);
            chatInput.value = '';
            messageCount++;
            
            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot';
            typingDiv.textContent = '💭 Vicky AI is thinking...';
            typingDiv.id = 'typing-indicator';
            typingDiv.style.fontStyle = 'italic';
            typingDiv.style.opacity = '0.7';
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            try {
                // Get Gemini response
                const response = await callGeminiAPI(message);
                
                // Remove typing indicator
                const typingIndicator = document.getElementById('typing-indicator');
                if (typingIndicator) {
                    typingIndicator.remove();
                }
                
                // Add bot response
                addBotMessage(response);
                
                // Only ask for details again if not already provided at start
                const hasInitialDetails = userDetails.email && userDetails.name;
                
                // Check if bot is asking for contact details in response
                const askingForContact = response.toLowerCase().includes('email') || 
                                        response.toLowerCase().includes('phone') || 
                                        response.toLowerCase().includes('contact');
                
                if (askingForContact && !detailsRequested && !hasInitialDetails && (!userDetails.email || !userDetails.phone)) {
                    detailsRequested = true;
                    setTimeout(() => {
                        addInlineContactForm();
                    }, 1000);
                }
                
                // Auto-ask for details after 4 messages if not provided initially
                if (messageCount >= 4 && !detailsRequested && !hasInitialDetails && (!userDetails.email || !userDetails.phone)) {
                    detailsRequested = true;
                    setTimeout(() => {
                        addBotMessage("Great conversation so far! 😊 Let me help you connect with Vicky personally:");
                        setTimeout(() => {
                            addInlineContactForm();
                        }, 500);
                    }, 1500);
                } else if (messageCount >= 6 && hasInitialDetails && !detailsRequested) {
                    // Show send to vicky button after some conversation if details already provided
                    detailsRequested = true;
                    setTimeout(() => {
                        addBotMessage("Would you like me to send this conversation to Vicky for a detailed follow-up? 📧");
                        addSendToVickyButton();
                    }, 1500);
                }
            } catch (error) {
                console.error('Chatbot error:', error);
                
                // Remove typing indicator
                const typingIndicator = document.getElementById('typing-indicator');
                if (typingIndicator) {
                    typingIndicator.remove();
                }
                
                // Show error message and ask for details
                addBotMessage("I'm having a small technical issue connecting to my AI brain! 😅 But no worries - I can still help you!\n\nLet me collect your details and Vicky will personally respond within 24-48 hours. Could you please share:\n\n1️⃣ Your name\n2️⃣ Email address\n3️⃣ What AI solution you're interested in\n\nOr fill out the contact form below! 👇");
                addSendToVickyButton();
            }
        };
        
        console.log('Gemini chatbot initialized successfully!');
    }, 1000);
});

// Add inline contact form for smooth email/phone collection
function addInlineContactForm() {
    const chatMessages = document.getElementById('chatMessages');
    
    // Check if form already exists
    if (document.getElementById('inline-contact-form')) return;
    
    const formContainer = document.createElement('div');
    formContainer.id = 'inline-contact-form';
    formContainer.className = 'chat-message bot';
    formContainer.style.cssText = `
        background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%);
        border: 2px solid rgba(79, 70, 229, 0.3);
        padding: 1.5rem;
        max-width: 100%;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
    `;
    
    formContainer.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <h4 style="margin: 0 0 0.5rem 0; color: var(--accent-primary); font-size: 1rem;">📝 Let's Connect!</h4>
            <p style="margin: 0; font-size: 0.85rem; opacity: 0.8;">Share your details so Vicky can follow up personally</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <input type="text" id="contact-name" placeholder="Your Name *" style="
                padding: 0.75rem;
                border-radius: 8px;
                border: 1px solid rgba(79, 70, 229, 0.3);
                background: var(--bg-card);
                color: var(--text-primary);
                font-size: 0.9rem;
                transition: border-color 0.2s ease;
            " />
            
            <input type="email" id="contact-email" placeholder="Email Address *" style="
                padding: 0.75rem;
                border-radius: 8px;
                border: 1px solid rgba(79, 70, 229, 0.3);
                background: var(--bg-card);
                color: var(--text-primary);
                font-size: 0.9rem;
                transition: border-color 0.2s ease;
            " />
            
            <input type="tel" id="contact-phone" placeholder="Phone Number (Optional)" style="
                padding: 0.75rem;
                border-radius: 8px;
                border: 1px solid rgba(79, 70, 229, 0.3);
                background: var(--bg-card);
                color: var(--text-primary);
                font-size: 0.9rem;
                transition: border-color 0.2s ease;
            " />
            
            <button id="submit-contact-btn" style="
                background: linear-gradient(135deg, #4F46E5 0%, #14B8A6 100%);
                color: white;
                border: none;
                padding: 0.875rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                font-size: 0.95rem;
            ">
                ✅ Submit & Continue Chat
            </button>
        </div>
    `;
    
    chatMessages.appendChild(formContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add event listener to submit button
    document.getElementById('submit-contact-btn').onclick = () => {
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        
        if (!name || !email) {
            alert('Please provide your name and email address');
            return;
        }
        
        // Save details
        userDetails.name = name;
        userDetails.email = email;
        if (phone) userDetails.phone = phone;
        
        // Remove form
        formContainer.remove();
        
        // Show confirmation
        addBotMessage(`Perfect! Thanks ${name}! 🎉 I've saved your details:\n• Email: ${email}\n${phone ? `• Phone: ${phone}` : ''}\n\nVicky will reach out within 24-48 hours. In the meantime, feel free to ask me anything else! 😊`);
        
        // Show send to vicky button
        setTimeout(() => {
            addSendToVickyButton();
        }, 1000);
    };
    
    // Add focus styling
    ['contact-name', 'contact-email', 'contact-phone'].forEach(id => {
        const input = document.getElementById(id);
        input.onfocus = () => {
            input.style.borderColor = 'var(--accent-primary)';
            input.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
        };
        input.onblur = () => {
            input.style.borderColor = 'rgba(79, 70, 229, 0.3)';
            input.style.boxShadow = 'none';
        };
    });
}

// Add "Send to Vicky" button
function addSendToVickyButton() {
    const chatMessages = document.getElementById('chatMessages');
    
    // Check if button already exists
    if (document.getElementById('send-to-vicky-btn')) return;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'chat-message bot';
    buttonContainer.style.background = 'transparent';
    buttonContainer.style.border = 'none';
    buttonContainer.style.padding = '0.5rem 0';
    
    const button = document.createElement('button');
    button.id = 'send-to-vicky-btn';
    button.innerHTML = '📤 Send Conversation to Vicky';
    button.style.cssText = `
        background: linear-gradient(135deg, #4F46E5 0%, #14B8A6 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    `;
    
    button.onmouseover = () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
    };
    
    button.onmouseout = () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
    };
    
    button.onclick = async () => {
        button.disabled = true;
        button.innerHTML = '⏳ Sending...';
        
        try {
            await sendConversationToDiscord({
                interest: "User clicked Send to Vicky button",
                email: userDetails.email || "Not provided",
                phone: userDetails.phone || "Not provided",
                industry: userDetails.industry || "Not specified"
            });
            
            button.innerHTML = '✅ Sent Successfully!';
            button.style.background = '#10B981';
            
            setTimeout(() => {
                addBotMessage("Perfect! 🎉 I've sent our entire conversation to Vicky. He'll review it and reach out to you within 24-48 hours.\n\nIn the meantime, feel free to ask me anything else! 😊");
            }, 1000);
        } catch (error) {
            button.innerHTML = '❌ Failed - Try Again';
            button.disabled = false;
            addBotMessage("Oops! There was an issue sending the message. Please try again or email Vicky directly at npdimagine@gmail.com");
        }
    };
    
    buttonContainer.appendChild(button);
    chatMessages.appendChild(buttonContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Export for use
window.geminiChatbot = {
    callGeminiAPI,
    sendConversationToDiscord,
    conversationHistory
};
