// Simple rule-based fallback responses
function getSimpleFallbackResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Greetings
    if (lowerMsg.match(/^(hi|hello|hey|yo|sup|greetings)/)) {
        return "Hey there! 👋 I'm Vicky's AI assistant. I help businesses find the perfect AI solution. What brings you here today?";
    }
    
    // Pricing
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('budget')) {
        return "Great question! Our pricing is very competitive:\n\n💰 AI Chatbot: ₹15k-25k\n🤖 ML Model: ₹25k-50k\n⚡ Full AI Agent: ₹50k-1L\n🚀 Full-Stack AI App: ₹75k-2L\n\nWhat type of solution interests you?";
    }
    
    // Services
    if (lowerMsg.includes('service') || lowerMsg.includes('what do you do') || lowerMsg.includes('offer')) {
        return "We specialize in:\n\n🤖 AI Agents & Automation\n🧠 Machine Learning Models\n👁️ Computer Vision\n�� Full-Stack AI Apps\n📊 Data Engineering\n\nWhich area interests you most?";
    }
    
    // Contact
    if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone')) {
        return "You can reach Vicky at:\n\n📧 npdimagine@gmail.com\n📱 +91 83838 48219\n\nOr fill out the contact form below and he'll respond within 24-48 hours! What would you like to discuss?";
    }
    
    // Default
    return "I'd love to help! Could you tell me more about:\n\n1️⃣ Your business/industry\n2️⃣ What problem you're trying to solve\n3️⃣ Your budget range\n\nThis will help me suggest the perfect AI solution for you! 🚀";
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getSimpleFallbackResponse };
}
