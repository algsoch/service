// Configuration file for loading environment variables
// Note: In production, use proper backend to handle sensitive data

const config = {
    // Backend API URL - automatically detects environment
    backendUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : 'https://service-y5ld.onrender.com', // Your Render backend URL
    
    // NOTE: API keys and webhooks are ONLY stored in backend/.env
    // Frontend NEVER accesses them directly - all requests go through backend
    
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
