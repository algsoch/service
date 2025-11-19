// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navMenu.classList.remove('active');
        }
    });
});

// ===== MOBILE NAVIGATION =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===== CHATBOT FUNCTIONALITY =====
const chatBubble = document.getElementById('chatBubble');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

let chatHistory = [];
let hasProvidedDetails = false; // Track if user has provided initial details

// Toggle chat window
chatBubble.addEventListener('click', () => {
    chatWindow.classList.add('active');
    if (chatHistory.length === 0) {
        // Show welcome message and contact form immediately
        addBotMessage("👋 Welcome to VICKY AI SYSTEMS! Before we begin, I'd love to know who I'm chatting with:");
        setTimeout(() => {
            showInitialContactForm();
        }, 500);
    }
});

// Show initial contact form before conversation starts
function showInitialContactForm() {
    const chatMessages = document.getElementById('chatMessages');
    
    // Check if form already exists
    if (document.getElementById('initial-contact-form')) return;
    
    const formContainer = document.createElement('div');
    formContainer.id = 'initial-contact-form';
    formContainer.className = 'chat-message bot';
    formContainer.style.cssText = `
        background: linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(20, 184, 166, 0.15) 100%);
        border: 2px solid rgba(79, 70, 229, 0.4);
        padding: 1.5rem;
        max-width: 100%;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        margin-left: 0;
    `;
    
    formContainer.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <h4 style="margin: 0 0 0.5rem 0; color: var(--accent-primary); font-size: 1rem;">📝 Quick Introduction</h4>
            <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">This helps us provide you with personalized AI solutions</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <input type="text" id="initial-name" placeholder="Your Name *" required style="
                padding: 0.75rem;
                border-radius: 8px;
                border: 1px solid rgba(79, 70, 229, 0.3);
                background: var(--bg-card);
                color: var(--text-primary);
                font-size: 0.9rem;
                transition: border-color 0.2s ease;
            " />
            
            <input type="email" id="initial-email" placeholder="Email Address *" required style="
                padding: 0.75rem;
                border-radius: 8px;
                border: 1px solid rgba(79, 70, 229, 0.3);
                background: var(--bg-card);
                color: var(--text-primary);
                font-size: 0.9rem;
                transition: border-color 0.2s ease;
            " />
            
            <input type="tel" id="initial-phone" placeholder="Phone Number (Optional)" style="
                padding: 0.75rem;
                border-radius: 8px;
                border: 1px solid rgba(79, 70, 229, 0.3);
                background: var(--bg-card);
                color: var(--text-primary);
                font-size: 0.9rem;
                transition: border-color 0.2s ease;
            " />
            
            <button id="start-chat-btn" style="
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
                🚀 Start Conversation
            </button>
        </div>
    `;
    
    chatMessages.appendChild(formContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add event listener to start chat button
    document.getElementById('start-chat-btn').onclick = () => {
        const name = document.getElementById('initial-name').value.trim();
        const email = document.getElementById('initial-email').value.trim();
        const phone = document.getElementById('initial-phone').value.trim();
        
        if (!name || !email) {
            alert('Please provide your name and email address');
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Save details globally if gemini-chatbot.js is loaded
        if (typeof userDetails !== 'undefined') {
            userDetails.name = name;
            userDetails.email = email;
            if (phone) userDetails.phone = phone;
        }
        
        // Mark as provided
        hasProvidedDetails = true;
        
        // Remove form
        formContainer.remove();
        
        // Show confirmation and start conversation
        addBotMessage(`Perfect! Thanks ${name}! 🎉 Great to meet you!\n\nNow, tell me about your business or project. What kind of AI solution are you looking for? 🤖💡`);
        
        // Enable chat input
        document.getElementById('chatInput').disabled = false;
        document.getElementById('chatInput').placeholder = 'Type your message...';
    };
    
    // Add focus styling
    ['initial-name', 'initial-email', 'initial-phone'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.onfocus = () => {
                input.style.borderColor = 'var(--accent-primary)';
                input.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
            };
            input.onblur = () => {
                input.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                input.style.boxShadow = 'none';
            };
        }
    });
    
    // Disable chat input until details are provided
    document.getElementById('chatInput').disabled = true;
    document.getElementById('chatInput').placeholder = 'Please fill the form above first...';
}

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

// Send message
function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;
    
    // Check if user has provided details first
    if (!hasProvidedDetails) {
        alert('Please fill in your details in the form above before starting the conversation.');
        return;
    }
    
    addUserMessage(message);
    chatInput.value = '';
    
    // Process message and generate response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addBotMessage(response);
    }, 500);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Enhanced Markdown to HTML converter with code highlighting
function parseMarkdown(text) {
    // Code blocks: ```language\ncode\n```
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
    });
    
    // Inline code: `code`
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold: **text** or __text__
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic: *text* or _text_ (but not in URLs or markdown already processed)
    text = text.replace(/(?<![*_])\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');
    text = text.replace(/(?<![*_])_(?!_)([^_]+)_(?!_)/g, '<em>$1</em>');
    
    // Links: [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Bullet points: * item or - item
    text = text.replace(/^\*\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
    
    // Wrap consecutive <li> in <ul>
    text = text.replace(/(<li>.*?<\/li>\s*)+/g, '<ul>$&</ul>');
    
    // Headers: ### Header
    text = text.replace(/^###\s+(.+)$/gm, '<h4 style="margin: 0.5rem 0; color: var(--accent-primary);">$1</h4>');
    text = text.replace(/^##\s+(.+)$/gm, '<h3 style="margin: 0.5rem 0; color: var(--accent-primary);">$1</h3>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Helper function to escape HTML in code blocks
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Add message to chat
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    chatHistory.push({ role: 'user', content: text });
}

function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot';
    messageDiv.innerHTML = parseMarkdown(text); // Changed from textContent to innerHTML with markdown parsing
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    chatHistory.push({ role: 'bot', content: text });
}

// Enhanced conversational chatbot with personality
function generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|yo|sup|greetings|good morning|good afternoon|good evening)/)) {
        const greetings = [
            "Hey there! 👋 I'm Vicky's AI assistant. I help businesses find the perfect AI solution. What brings you here today?",
            "Hello! 😊 Great to meet you! I'm here to help you discover how AI can transform your business. What's on your mind?",
            "Hi! Welcome to Vicky AI Systems! 🚀 I specialize in matching businesses with the right AI solutions. How can I help you today?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Gratitude
    if (lowerMessage.match(/thank|thanks|appreciate|grateful/)) {
        return "You're very welcome! 😊 I'm here anytime you need help. Feel free to ask me anything else about AI solutions, pricing, or Vicky's work!";
    }
    
    // Who/What are you
    if (lowerMessage.match(/who are you|what are you|your name|introduce yourself/)) {
        return `I'm Vicky's AI assistant! 🤖 Think of me as your personal AI consultant. I help people like you understand:

✨ What AI can do for your business
💰 How much it costs (transparent pricing!)
🎯 Which solution fits your needs best
⏱️ How quickly we can build it

Vicky built me to be helpful and honest - no sales fluff, just real solutions. What would you like to know?`;
    }
    
    // Pricing inquiries - More conversational
    if (lowerMessage.match(/price|pricing|cost|budget|how much|expensive|cheap|afford/)) {
        return `Great question! Let me break down the pricing honestly 💰

The investment depends on what you need:

🤖 **AI Agents & Automation**
   Simple: ₹15K-25K | Advanced: ₹70K-1.2L

🧠 **Machine Learning / Deep Learning**
   Model Training: ₹30K-70K | Vision/NLP: ₹50K-1.2L

💻 **Full-Stack AI Apps**
   Dashboard: ₹40K-70K | Complete SaaS: ₹1.5L-3L

⚙️ **Automation Workflows**
   Single: ₹10K-20K | Enterprise Suite: ₹60K-1L

Here's the thing - these are ranges because every project is unique. Tell me what you're trying to build, and I'll give you a realistic estimate. No hidden costs, no surprises! 😊

What kind of project are you considering?`;
    }
    
    // Services - Enthusiastic and detailed
    if (lowerMessage.match(/service|what can you|what do you|capabilities|offer|expertise|specialization/)) {
        return `Ah, you want the full picture! 🎯 Here's what we excel at:

🤖 **AI Agents & Automation**
Think: Autonomous research agents, workflow automation, CRM bots, data processing pipelines

🧠 **Machine Learning & Deep Learning**
Medical imaging (97.94% accuracy!), computer vision, NLP, custom model training, transfer learning

🎤 **Speech & Audio AI**
Whisper integration, multilingual transcription, voice assistants, low-WER systems

👁️ **Computer Vision**
Object detection, image classification, OCR, video analysis, real-time processing

💻 **Full-Stack Development**
React/Next.js, FastAPI/Spring Boot, real-time apps (WebSockets), PWAs, responsive design

📊 **Data Engineering & Analytics**
ETL pipelines, dashboards, data visualization, PostgreSQL/MongoDB optimization

🚀 **DevOps & Deployment**
Docker, CI/CD, cloud deployment (AWS/Azure/Render), monitoring, scaling

What catches your eye? Or tell me your problem and I'll suggest the best approach! 💡`;
    }
    
    // Machine Learning specific
    if (lowerMessage.match(/machine learning|deep learning|neural network|model|training|ai model|tensorflow|pytorch/)) {
        return `Now we're talking! 🧠 ML/DL is my favorite topic!

Here's what Vicky's built:

🏥 **Medical Imaging AI**
- Brain tumor detection: 97.94% accuracy using EfficientNetB3
- X-ray classification, MRI analysis, pathology detection

🐄 **Agriculture & Livestock**
- Cattle breed identification for Indian farms
- Crop disease detection
- Yield prediction models

🎯 **Custom ML Solutions**
- Image classification (transfer learning, fine-tuning)
- NLP models (sentiment, named entity recognition, text classification)
- Time series forecasting
- Recommendation systems
- Anomaly detection

**Tech Stack:**
TensorFlow, PyTorch, Keras, scikit-learn, Hugging Face Transformers, YOLO, EfficientNet

We handle everything: data collection → preprocessing → training → deployment → monitoring

What's your ML challenge? Be specific and I'll tell you exactly how we'd solve it! 💪`;
    }
    
    // Python & Full-Stack
    if (lowerMessage.match(/python|full stack|fullstack|web development|backend|frontend|api/)) {
        return `Python full-stack? That's Vicky's bread and butter! 🐍

**Backend Mastery:**
- FastAPI (async, high-performance REST APIs)
- Django/Flask for complex applications
- Spring Boot (Java) for enterprise systems
- WebSocket servers for real-time features
- Background tasks with Celery
- API design & documentation (OpenAPI/Swagger)

**Frontend Skills:**
- React (with hooks, context, Redux)
- Next.js for SEO-friendly apps
- Vanilla JS for lightweight projects
- Responsive design (mobile-first)
- Real-time UI updates (WebSockets, SSE)

**Database Expertise:**
- PostgreSQL (complex queries, optimization)
- MongoDB (document stores, aggregations)
- Redis (caching, queues)
- Database design & migrations

**Real Projects Built:**
✅ Real-time polling system (handling race conditions)
✅ QR-based queue management with SSE
✅ Learning analytics dashboards
✅ Medical imaging platforms with prediction APIs

What are you looking to build? Web app? API? Dashboard? 🚀`;
    }
    
    // Healthcare/Medical
    if (lowerMessage.match(/health|medical|hospital|doctor|patient|clinic|diagnosis|healthcare/)) {
        return `Healthcare AI is where technology meets lives! 🏥

Vicky's proven track record in medical AI:

🧠 **Brain Tumor Detection**
- 97.94% accuracy on MRI classification
- 4-class tumor type identification
- Production-ready API with FastAPI
- Real-time inference

💊 **What We Can Build for You:**
- Medical image analysis (X-rays, CT, MRI)
- Patient management systems
- Symptom checkers & triage assistants
- Electronic health records (EHR) integration
- Appointment scheduling automation
- Prescription management
- Telemedicine platforms

📊 **Compliance & Quality:**
We understand healthcare data sensitivity. HIPAA-aware development, secure data handling, audit trails.

**Investment:** ₹50K - ₹2.5L depending on complexity

What healthcare challenge are you tackling? Be specific! 🩺`;
    }
    
    // Agriculture
    if (lowerMessage.match(/farm|agricult|crop|cattle|livestock|rural|irrigation|soil/)) {
        return `Agriculture + AI = Amazing possibilities! 🌾

Real systems built for Indian farming:

🐄 **Livestock Management**
- Cattle & buffalo breed identification
- Health monitoring through image analysis
- Milk yield prediction
- Disease detection

🌱 **Crop Intelligence**
- Disease detection from leaf images
- Pest identification
- Yield forecasting
- Soil analysis recommendations

📱 **Farm Management Tools**
- Mobile apps for farmers (Hindi/regional languages)
- Weather-based advisory systems
- Market price tracking
- Irrigation optimization

**Budget:** ₹40K - ₹1.5L

These systems work in low-connectivity areas, are mobile-first, and designed for non-tech-savvy users.

What agricultural problem needs solving? 🚜`;
    }
    
    // E-commerce/Business
    if (lowerMessage.match(/ecommerce|e-commerce|shop|store|retail|business|sales|inventory|product/)) {
        return `Let's boost your business with AI! 📈

**E-commerce AI Solutions:**

🤖 **Intelligent Automation**
- Product data scraping & analysis
- Competitor price monitoring
- Inventory optimization
- Order processing automation
- Customer service chatbots

📊 **Analytics & Insights**
- Sales forecasting
- Customer segmentation
- Recommendation engines
- Churn prediction
- A/B testing frameworks

🎯 **Customer Experience**
- Personalized product recommendations
- Visual search (find products by image)
- Virtual try-on (AR for fashion/furniture)
- Dynamic pricing optimization

**Real Impact:**
One of our automation systems saved a client 40 hours/week on manual data entry!

**Budget:** ₹30K - ₹2.5L based on features

What's your biggest business bottleneck right now? 🎯`;
    }
    
    // Education/EdTech
    if (lowerMessage.match(/educat|student|learning|school|course|teach|tutor|university|college/)) {
        return `EdTech + AI = Future of learning! 📚 (And I'm biased - Vicky's at IIT Madras!)

**AI-Powered Education Solutions:**

🎓 **Learning Management**
- Student progress tracking (like Vicky's IITian Milestone Tracker)
- Personalized learning paths
- Adaptive assessments
- Performance analytics

🤖 **AI Tutoring & Assistance**
- Subject-specific AI tutors
- Doubt resolution chatbots
- Essay scoring & feedback
- Code evaluation for programming courses

📊 **Admin & Analytics**
- Attendance tracking (face recognition)
- Plagiarism detection
- Student at-risk prediction
- Resource optimization

💬 **Engagement Tools**
- Live polling systems (like QuickPoll)
- Interactive quizzes
- Peer collaboration platforms

**Budget:** ₹40K - ₹1.8L

What educational challenge are you solving? 🎯`;
    }
    
    // Contact/Get Started
    if (lowerMessage.match(/contact|email|phone|whatsapp|call|reach|connect|talk to vicky/)) {
        return `Let's make it happen! 🚀 Here's how to reach Vicky directly:

📧 **Email:** npdimagine@gmail.com
📱 **WhatsApp:** +91 83838 48219
💻 **GitHub:** github.com/algsoch
🔗 **LinkedIn:** linkedin.com/in/algsoch
📍 **Location:** New Delhi, India (Remote + On-site available)

**What happens next?**
1. Message Vicky with your project idea
2. Within 24-48 hours, you get a detailed response with:
   ✅ Technical approach & architecture
   ✅ Timeline with milestones
   ✅ Exact cost breakdown
   ✅ Similar project examples

3. If you like it, work begins!

**Or use the contact form** at the bottom of this page - it goes straight to Vicky's inbox.

Ready to start? Drop him a message! 💪`;
    }
    
    // Timeline/Duration
    if (lowerMessage.match(/time|how long|duration|deadline|fast|quick|urgent|when|delivery/)) {
        return `Let's talk timelines! ⏱️ I believe in realistic estimates, not fake promises.

**Typical Timelines:**

⚡ **Quick Wins (1-2 weeks)**
- Simple automation scripts
- Basic dashboards
- API integrations
- Proof of concepts

🔧 **Medium Projects (3-6 weeks)**
- ML model training & deployment
- Full-stack web applications
- Complex automation workflows
- Mobile app (MVP)

🚀 **Large Systems (2-3 months)**
- Enterprise platforms
- Advanced AI systems
- Multi-platform solutions
- Systems with complex integrations

**The Vicky Advantage:**
✅ Clear milestones every week
✅ Regular demos (you see progress)
✅ Agile approach (adapt as we go)
✅ 24-48 hour response time

Got a tight deadline? Tell me the date and what you need - we'll be honest if it's doable! 💯`;
    }
    
    // Technology stack
    if (lowerMessage.match(/tech stack|technology|tools|framework|library|language|software/)) {
        return `You want to see the arsenal? Here's what Vicky masters: ⚡

**Languages:**
Python 🐍 | Java ☕ | JavaScript/TypeScript | SQL | HTML/CSS

**Backend Frameworks:**
FastAPI (⭐ favorite for APIs) | Django | Flask | Spring Boot | Node.js

**Frontend:**
React | Next.js | Vanilla JS | TailwindCSS | WebSockets for real-time

**ML/DL Frameworks:**
TensorFlow | PyTorch | Keras | scikit-learn | Hugging Face | YOLO | EfficientNet

**Databases:**
PostgreSQL | MongoDB | MySQL | Redis | Vector DBs (for AI apps)

**DevOps & Cloud:**
Docker 🐳 | GitHub Actions | AWS | Azure | Render | DigitalOcean | Nginx

**AI/ML Tools:**
OpenAI APIs | LangChain | Whisper | wav2vec2 | OpenCV | NLTK | spaCy

**Other Cool Stuff:**
Celery | RabbitMQ | WebSocket | Server-Sent Events | Cloudflared | Ngrok

Everything is **production-ready**, not just tutorial code. We deploy, monitor, and maintain! 🚀

What technology are you curious about?`;
    }
    
    // Why choose Vicky
    if (lowerMessage.match(/why you|why vicky|why choose|advantage|better than|different from|special/)) {
        return `Great question! Let me be honest about what makes Vicky different: 💫

**1. Real Production Experience**
Not just tutorials - 40+ projects that actually run in production serving real users

**2. End-to-End Execution**
From idea → design → code → deployment → maintenance. One person, full stack, no handoffs

**3. Academic + Practical**
IIT Madras student + professional experience (Outlier, Soul AI, Mercor) = best of both worlds

**4. Transparent Communication**
- Responds in 24-48 hours
- Clear pricing (no hidden costs)
- Weekly progress updates
- Honest about what's possible

**5. Modern Tech Stack**
Uses latest tools & best practices. Your project won't be outdated in 6 months!

**6. Problem Solver Mindset**
Doesn't just code what you ask - suggests better approaches, saves you money, prevents issues

**7. Portfolio Speaks**
97.94% ML accuracy, real-time systems handling concurrency, complex full-stack apps - results matter!

Want to see specific examples of past work? 🎯`;
    }
    
    // NLP / Text AI
    if (lowerMessage.match(/nlp|natural language|text analysis|sentiment|chatbot|language model|gpt|llm/)) {
        return `NLP & Language AI - my jam! 🗣️

**What Vicky Can Build:**

💬 **Chatbots & Assistants**
- Customer service bots (like this one, but better!)
- Domain-specific assistants (legal, medical, technical)
- Multi-turn conversations with context
- Integration with WhatsApp, Slack, Discord

📝 **Text Analysis**
- Sentiment analysis (reviews, social media)
- Named Entity Recognition
- Text classification & categorization
- Content moderation
- Summarization (documents, articles)

🌐 **Multilingual Systems**
- Translation pipelines
- Cross-lingual search
- Regional language support (Hindi, Tamil, etc.)

🔍 **Search & Retrieval**
- Semantic search (understand intent, not just keywords)
- Document Q&A systems
- Knowledge base assistants

**Tech:** Hugging Face Transformers, OpenAI APIs, LangChain, BERT, GPT fine-tuning

**Budget:** ₹35K - ₹1.5L based on complexity

What NLP problem are you trying to solve? 🎯`;
    }
    
    // Computer Vision
    if (lowerMessage.match(/computer vision|image recognition|object detection|video analysis|opencv|yolo|detection/)) {
        return `Computer Vision - teaching machines to see! 👁️

**Proven Capabilities:**

🏥 **Medical Imaging**
- Brain tumor detection (97.94% accuracy!)
- X-ray analysis
- Disease diagnosis from images

🐄 **Agriculture & Livestock**
- Cattle breed identification
- Crop disease detection
- Pest identification

🏭 **Industry Applications**
- Quality control & defect detection
- Inventory counting
- Safety monitoring (PPE detection)

🚗 **Smart Systems**
- License plate recognition
- Face detection & recognition
- People counting & tracking

📄 **Document Processing**
- OCR (extract text from images)
- Document classification
- Signature verification

**Tech Stack:**
TensorFlow, PyTorch, YOLO, EfficientNet, ResNet, OpenCV, PIL

**Real-time Processing:** Can build systems that analyze 30+ frames/second!

**Budget:** ₹50K - ₹1.5L depending on accuracy requirements

What do you need machines to see? 🎯`;
    }
    
    // Deployment & DevOps
    if (lowerMessage.match(/deploy|deployment|devops|ci\/cd|docker|kubernetes|cloud|aws|azure|server|hosting/)) {
        return `Deployment & DevOps - where code meets reality! 🚀

**We Don't Just Code - We Ship!**

🐳 **Containerization**
- Docker for consistent environments
- Docker Compose for local development
- Multi-stage builds (optimized images)

⚙️ **CI/CD Pipelines**
- GitHub Actions (automated testing & deployment)
- Automated testing before deployment
- Zero-downtime deployments

☁️ **Cloud Platforms**
- **Render** (⭐ favorite for Python apps)
- **AWS** (EC2, Lambda, S3, RDS)
- **Azure** (full stack)
- **DigitalOcean** (cost-effective VPS)

📊 **Monitoring & Maintenance**
- Health checks & uptime monitoring
- Error tracking & alerts
- Performance optimization
- Auto-scaling strategies

🔒 **Security**
- HTTPS/SSL setup
- Environment variable management
- Database backups
- CORS & security headers

**Real Examples:**
✅ Deployed ML models serving 1000s of predictions/day
✅ WebSocket servers handling concurrent connections
✅ Background workers for heavy tasks

**Budget:** ₹10K - ₹50K for complete deployment setup

Need help getting your app to production? 💪`;
    }
    
    // Discord/Webhook specific (since user mentioned Discord)
    if (lowerMessage.match(/discord|webhook|notification|alert|integration/)) {
        return `Discord & integrations - smart! 🔔

**Webhook & Integration Solutions:**

💬 **Discord Bots & Webhooks**
- Custom Discord bots
- Automated notifications
- Form submissions → Discord
- Alert systems
- Command-based interactions

🔗 **API Integrations**
- Connect any service to any service
- Webhook handling & routing
- Event-driven architectures
- Real-time notifications

**Common Use Cases:**
✅ Contact form → Discord notification
✅ Payment received → Team alert
✅ System error → Instant notification
✅ User signup → Welcome automation
✅ Data updates → Team dashboard

This website actually uses Discord webhooks for the contact form! When you submit, it goes straight to a Discord channel. 

Want to set up custom integrations? 🎯`;
    }
    
    // Default - More engaging and helpful
    return `I'm here to help you find the perfect AI solution! 😊

Here's what I can tell you about:
• 💰 **Pricing** - transparent costs for your project
• 🎯 **Services** - what AI can do for you
• 🧠 **ML/DL** - machine learning & deep learning
• 💻 **Full-Stack** - complete web applications
• 📱 **Contact** - how to reach Vicky directly

Or just **tell me about your problem** in plain English:
- "I need to automate my business workflows"
- "Can AI help diagnose medical images?"
- "I want a custom chatbot for my website"

**Don't be shy - ask me anything!** I'm here to help, not to sell. 🚀

What's on your mind?`;
}

// ===== CONTACT FORM WITH DISCORD WEBHOOK =====
const contactForm = document.getElementById('contactForm');
const successToast = document.getElementById('successToast');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company') || 'Not provided',
        service: formData.get('service') || 'General Inquiry',
        budget: formData.get('budget') || 'Not specified',
        timeline: formData.get('timeline') || 'Not specified',
        message: formData.get('message')
    };
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Discord webhook URL - loaded from config.js for security
        const discordWebhookUrl = config.discordWebhook;
        
        // Create Discord embed
        const discordPayload = {
            embeds: [{
                title: "🚀 New Contact Form Submission",
                color: 5814783, // Blue color
                fields: [
                    {
                        name: "👤 Name",
                        value: data.name,
                        inline: true
                    },
                    {
                        name: "📧 Email",
                        value: data.email,
                        inline: true
                    },
                    {
                        name: "🏢 Company",
                        value: data.company,
                        inline: true
                    },
                    {
                        name: "🎯 Service",
                        value: data.service,
                        inline: true
                    },
                    {
                        name: "💰 Budget",
                        value: data.budget,
                        inline: true
                    },
                    {
                        name: "⏰ Timeline",
                        value: data.timeline,
                        inline: true
                    },
                    {
                        name: "📝 Message",
                        value: data.message || "No message provided",
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Vicky AI Systems | Contact Form"
                }
            }]
        };
        
        // Send to Discord
        const response = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordPayload)
        });
        
        if (response.ok || response.status === 204) {
            showToast('Message sent successfully! 🎉 Vicky will respond within 24-48 hours.');
            contactForm.reset();
        } else {
            throw new Error('Discord webhook failed');
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        showToast('Oops! Something went wrong. Please email npdimagine@gmail.com directly.');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Show toast notification
function showToast(message) {
    const toastMessage = successToast.querySelector('.toast-message');
    toastMessage.textContent = message;
    successToast.classList.add('show');
    
    setTimeout(() => {
        successToast.classList.remove('show');
    }, 4000);
}

// ===== FORM VALIDATION =====
const formInputs = document.querySelectorAll('input[required], textarea[required]');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.style.borderColor = '#EF4444';
        } else {
            input.style.borderColor = '';
        }
    });
    
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.style.borderColor = '';
        }
    });
});

// Email validation
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#EF4444';
        } else {
            emailInput.style.borderColor = '';
        }
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards, solution cards, etc.
document.querySelectorAll('.service-card, .solution-card, .project-card, .pricing-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===== ACTIVE LINK HIGHLIGHTING =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== INITIALIZE =====
console.log('Vicky AI Systems - Website initialized successfully');
console.log('Contact: npdimagine@gmail.com | +91 83838 48219');
