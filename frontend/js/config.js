// Configuration file for loading environment variables
// Note: In production, use proper backend to handle sensitive data

const config = {
    // Backend API URL - automatically detects environment
    backendUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : 'https://vicky-ai-backend.onrender.com', // Update this with your Render backend URL
    
    // Discord webhook - IMPORTANT: Move this to backend in production!
    discordWebhook: 'https://discord.com/api/webhooks/1440670389780086947/lhjHNqWENfepDhsQu1L07hYp497zCxkowZm3FsRJjp9XWX-EDZ_39u1Cr4574bNy3kFZ',
    
    // Gemini API for AI Chatbot
    geminiApiKey: 'AIzaSyA6FDeM3RnOu-NNSDfS8AnfolYWtNbDvhQ',
    
    // Contact information
    email: 'npdimagine@gmail.com',
    phone: '+91 83838 48219',
    whatsapp: '918383848219',
    
    // Social links
    github: 'https://github.com/algsoch',
    linkedin: 'https://www.linkedin.com/in/algsoch',
    
    // Location
    location: 'New Delhi, India',
    
    // GitHub repositories showcase
    repositories: [
        {
            name: 'Brain-Tumor-Classification',
            description: 'Medical imaging AI with 97.94% accuracy',
            url: 'https://github.com/algsoch/brain-tumor-detection',
            stars: '⭐ Featured Project',
            tech: ['Python', 'TensorFlow', 'EfficientNet']
        },
        {
            name: 'QuickPoll-Realtime',
            description: 'Real-time polling with WebSockets',
            url: 'https://github.com/algsoch/quickpoll',
            stars: '🚀 Live Demo',
            tech: ['FastAPI', 'React', 'WebSockets']
        },
        {
            name: 'AI-Automation-Workflows',
            description: 'Collection of AI automation scripts',
            url: 'https://github.com/algsoch/ai-workflows',
            stars: '🤖 Open Source',
            tech: ['Python', 'LangChain', 'APIs']
        }
    ]
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
