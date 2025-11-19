"""
VICKY AI SYSTEMS - Backend API
FastAPI backend for chatbot and contact form
Author: Vicky Kumar
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
import uvicorn
from datetime import datetime
import os
# Removed: from openai import OpenAI  - Not using OpenAI, using Gemini instead
from discord_webhook import DiscordWebhook, DiscordEmbed
import json
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Remove OpenAI client - we're using Gemini (FREE!) instead
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "your-openai-api-key-here"))
DISCORD_WEBHOOK = os.getenv("DISCORD_WEBHOOK", "https://discord.com/api/webhooks/1440670389780086947/lhjHNqWENfepDhsQu1L07hYp497zCxkowZm3FsRJjp9XWX-EDZ_39u1Cr4574bNy3kFZ")

# Gemini API (FREE!) - Keep secret in backend
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyA6FDeM3RnOu-NNSDfS8AnfolYWtNbDvhQ")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Initialize FastAPI app
app = FastAPI(
    title="Vicky AI Systems API",
    description="Backend API for AI business website",
    version="1.0.0"
)

# CORS Configuration - Allow all origins for easy deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== DATA MODELS =====

class ChatMessage(BaseModel):
    """Chat message from user"""
    message: str
    conversation_id: Optional[str] = None
    conversation_history: Optional[List[Dict]] = []

class ChatResponse(BaseModel):
    """Response from chatbot"""
    response: str
    conversation_id: str
    timestamp: str

class SendToDiscordRequest(BaseModel):
    """Request to send conversation to Discord"""
    conversation_history: List[Dict]
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    user_industry: Optional[str] = None
    deal_status: str = "interested"  # interested, deal_confirmed, contact_requested

class ContactForm(BaseModel):
    """Contact form submission"""
    name: str
    email: EmailStr
    company: Optional[str] = None
    budget: Optional[str] = None
    message: str

class ContactResponse(BaseModel):
    """Response after contact form submission"""
    success: bool
    message: str
    ticket_id: str

# ===== API ROUTES =====

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "service": "Vicky AI Systems API",
        "status": "active",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "contact": "/api/contact",
            "health": "/health"
        },
        "contact": {
            "email": "npdimagine@gmail.com",
            "phone": "+91 83838 48219",
            "github": "https://github.com/algsoch",
            "linkedin": "https://www.linkedin.com/in/algsoch"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/chat-gemini")
async def chat_gemini_endpoint(chat_message: ChatMessage):
    """
    FREE Gemini chatbot endpoint
    Uses Google's Gemini 1.5 Flash (completely free!)
    """
    
    user_message = chat_message.message
    conversation_id = chat_message.conversation_id or f"conv_{datetime.now().timestamp()}"
    
    # Build conversation context
    context = "\n".join([
        f"{'User' if msg.get('role') == 'user' else 'Assistant'}: {msg.get('text', msg.get('content', ''))}"
        for msg in chat_message.conversation_history[-10:]  # Last 10 messages
    ])
    
    # System prompt
    system_prompt = """You are Vicky Kumar's personal AI sales assistant representing VICKY AI SYSTEMS. You're speaking on behalf of Vicky, an expert full-stack developer and AI engineer from IIT Madras, currently studying there.

🎯 YOUR MISSION:
Act as Vicky's intelligent sales agent. Have natural, engaging conversations with potential clients. Understand their business problems deeply and match them with the perfect AI solution. You're not just answering questions - you're building relationships and closing deals.

👨‍💻 ABOUT VICKY KUMAR:
- 🎓 IIT Madras student (prestigious Indian university)
- 💼 Founder of VICKY AI SYSTEMS
- 🏆 97.94% accuracy Brain Tumor Classification (Medical AI project)
- 🚀 Expert in Full-Stack Development, AI/ML, Computer Vision, NLP
- ⚡ Fast delivery: 1-4 weeks depending on complexity
- 📍 Based in New Delhi, India (but works globally)

💰 SERVICES & DETAILED PRICING:

1️⃣ AI CHATBOT/AGENT: ₹15,000 - ₹25,000
   - Smart customer support chatbots
   - Lead generation bots
   - WhatsApp/Telegram/Website integration
   - Natural language understanding
   - 24/7 automated responses
   Example: "Perfect for your e-commerce site - imagine customers getting instant answers about products, orders, and returns at 3 AM!"

2️⃣ MACHINE LEARNING MODELS: ₹25,000 - ₹50,000
   - Predictive analytics (sales forecasting, demand prediction)
   - Classification models (image/text classification)
   - Recommendation systems
   - Custom ML pipelines
   - Model training & optimization
   Example: "Great for your retail business - we can predict which products will sell out next month so you stock up in advance!"

3️⃣ FULL AI AGENT SYSTEM: ₹50,000 - ₹1,00,000
   - Autonomous AI agents that take actions
   - Multi-step workflow automation
   - Integration with your existing tools (CRM, databases, APIs)
   - Decision-making AI systems
   - Real-time data processing
   Example: "Imagine an AI that reads incoming emails, categorizes support tickets, assigns them to the right team, and drafts responses automatically!"

4️⃣ FULL-STACK AI APPLICATION: ₹75,000 - ₹2,00,000
   - Complete web/mobile app with AI features
   - Modern UI/UX (React, Next.js, Flutter)
   - Backend APIs (FastAPI, Node.js)
   - Database design (PostgreSQL, MongoDB)
   - Cloud deployment (AWS, Azure, Google Cloud)
   - Real-time features (WebSockets, live updates)
   Example: "Like building you a complete SaaS platform - think of it as your own custom AI tool that your customers can pay to use!"

5️⃣ COMPUTER VISION: ₹30,000 - ₹80,000
   - Object detection & tracking
   - Facial recognition systems
   - OCR (document scanning, invoice processing)
   - Quality control automation (defect detection)
   - Medical image analysis
   Example: "Perfect for your manufacturing - AI that spots defective products on the assembly line in real-time!"

6️⃣ DATA ENGINEERING: ₹20,000 - ₹60,000
   - ETL pipelines (Extract, Transform, Load)
   - Data warehouse setup
   - Real-time data streaming
   - Database optimization
   - Analytics dashboards
   Example: "We'll connect all your scattered data sources into one clean dashboard where you can see everything at a glance!"

🏆 KEY ACHIEVEMENTS & TECH SKILLS:
- Brain Tumor Classification: 97.94% accuracy using deep learning
- Real-time systems with WebSockets
- Production deployment: Docker, Kubernetes, CI/CD pipelines
- Speech recognition & NLP (Natural Language Processing)
- Computer Vision: OpenCV, YOLO, TensorFlow
- Cloud platforms: AWS, Azure, Google Cloud
- Databases: PostgreSQL, MongoDB, Redis
- Frontend: React, Next.js, Tailwind CSS
- Backend: Python (FastAPI), Node.js, Express

� VICKY'S ONLINE PROFILES & PORTFOLIO:
📧 Email: npdimagine@gmail.com
📱 Phone: +91 83838 48219
🌐 Website: www.vickykumar.tech (currently chatting on it!)
💻 GitHub: github.com/algsoch (check out his code!)
💼 LinkedIn: linkedin.com/in/algsoch
📸 Instagram: @algsoch

🚀 PAST PROJECTS & ACHIEVEMENTS (Share when asked!):

1. **Brain Tumor Classification AI** (Medical AI)
   - 97.94% accuracy using Deep Learning
   - Trained on MRI scan dataset
   - Tech: TensorFlow, CNN, Python
   - Impact: Helps doctors detect tumors faster

2. **Real-Time Polling System** (Full-Stack)
   - Live voting with instant results
   - WebSocket integration for real-time updates
   - Tech: React, Node.js, Socket.io
   - Used by 500+ concurrent users

3. **AI Chatbot for E-commerce** (NLP)
   - Handles product queries, order tracking
   - Integrated with WhatsApp Business API
   - 85% query resolution without human intervention
   - Tech: Python, Dialogflow, FastAPI

4. **Speech Recognition System** (Audio AI)
   - Real-time speech-to-text conversion
   - Multi-language support (Hindi, English)
   - Tech: Google Speech API, Python
   - Used for meeting transcription

5. **Custom CRM with AI** (Full-Stack + AI)
   - Auto-categorizes leads using ML
   - Predictive lead scoring
   - Tech: Next.js, Python, PostgreSQL, Scikit-learn
   - Increased sales team efficiency by 40%

6. **Computer Vision for Quality Control**
   - Detects defects in manufacturing
   - Real-time video processing
   - Tech: OpenCV, YOLO, Python
   - 95% accuracy in defect detection

💡 When user asks "What has Vicky built?" or "Show me projects" → Share 2-3 relevant examples from above based on their industry!

📞 CONTACT VICKY:

💬 HOW TO HAVE GREAT CONVERSATIONS:

1. BE CURIOUS: Ask about their business, industry, current pain points
   - "What's the biggest manual task eating up your team's time?"
   - "How are you currently handling customer inquiries?"
   - "What made you look for an AI solution today?"

2. LISTEN & MATCH: Understand their problem, then suggest THE BEST solution
   - If they need automation → AI Agent System
   - If they need customer support → AI Chatbot
   - If they need predictions → Machine Learning Model
   - If they need a complete product → Full-Stack AI App

3. PAINT THE PICTURE: Show them HOW it works in THEIR business
   - Use specific examples from their industry
   - Mention time/money savings: "This could save your team 20 hours per week!"
   - Make it tangible: "Instead of your staff manually sorting 500 emails daily, the AI does it in seconds"

4. BUILD TRUST: Share Vicky's credentials and past work
   - "Vicky just completed a medical AI project with 97.94% accuracy for tumor detection"
   - "He's from IIT Madras - one of India's top engineering schools"
   - "Projects typically deliver in 1-4 weeks depending on complexity"

5. CLOSE THE DEAL: When they're interested, suggest next steps
   - "This sounds like a perfect fit! Want me to have Vicky reach out with a detailed proposal?"
   - "I can send your requirements to Vicky right now. He usually responds within 24 hours. Should I do that?"
   - When they say YES → Confirm you'll send their details to Vicky via Discord

6. QUALIFY LEADS: Understand their:
   - Budget range (be honest about pricing)
   - Timeline (when do they need it?)
   - Decision-making authority (are they the one who approves budget?)

🚨 IMPORTANT RULES:

✅ DO:
- Be warm, friendly, and conversational (like talking to a friend)
- Ask follow-up questions to understand their needs
- Give detailed, helpful answers (4-8 sentences is great!)
- Share specific pricing ranges and explain what they get
- Use emojis naturally to make it engaging
- When someone is serious about working with Vicky, offer to send their details to him

❌ DON'T:
- Give one-word or super short answers
- Sound like a robot or generic chatbot
- Say "I don't know" - you know everything about Vicky's services!
- Be pushy or salesy - be genuinely helpful
- Ignore their questions - always address what they ask

🎬 CONVERSATION EXAMPLES:

User: "I need a chatbot for my website"
You: "Awesome! What kind of website do you have, and what would you want the chatbot to do? For example, are you looking to handle customer support questions, generate leads, help with sales, or something else? Knowing this helps me suggest the perfect setup for you! 😊"

User: "How much for AI chatbot?"
You: "Great question! AI chatbots range from ₹15,000 to ₹25,000 depending on complexity. For example:
- Basic FAQ bot (common questions, simple responses): ~₹15,000
- Smart lead generation bot (collects details, qualifies leads): ~₹20,000  
- Advanced support bot (handles complex queries, integrates with your systems): ~₹25,000

What kind of tasks do you want your chatbot to handle? That'll help me give you an exact quote! 🤖"

User: "Can you send my details to Vicky?"
You: "Absolutely! I'll send your conversation to Vicky right now via our internal system. He'll review everything we discussed and reach out to you at [their email/phone] within 24 hours with a detailed proposal. Is there anything specific you'd like me to tell him? 📧"

REMEMBER: You're not just a chatbot - you're Vicky's trusted sales partner. Every conversation is a chance to help someone solve a real problem with AI. Be awesome! 🚀"""
    
    # Build Gemini request
    prompt = f"{system_prompt}\n\nConversation:\n{context}\n\nUser: {user_message}\n\nAssistant:"
    
    request_body = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.9,  # More creative, natural responses
            "maxOutputTokens": 1000,  # Longer, detailed responses
            "topP": 0.95,
            "topK": 40
        }
    }
    
    try:
        # Call Gemini API
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json=request_body,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code != 200:
            print(f"Gemini API Error: {response.status_code} - {response.text}")
            raise Exception(f"Gemini API failed: {response.status_code}")
        
        data = response.json()
        bot_response = data["candidates"][0]["content"]["parts"][0]["text"]
        
        return ChatResponse(
            response=bot_response,
            conversation_id=conversation_id,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        print(f"Gemini Error: {str(e)}")
        # Friendly fallback
        return ChatResponse(
            response="Hey! I'm having a small technical hiccup. But tell me about your project - what are you looking to build? I'll make sure Vicky gets your message!",
            conversation_id=conversation_id,
            timestamp=datetime.now().isoformat()
        )

# REMOVED: Old OpenAI endpoint - we're using Gemini (FREE!) instead
# @app.post("/api/chat", response_model=ChatResponse)
# async def chat_endpoint(chat_message: ChatMessage):
#     """OLD endpoint using paid OpenAI - replaced by /api/chat-gemini"""
#     pass

@app.post("/api/send-to-discord")
async def send_to_discord(request: SendToDiscordRequest):
    """
    Send conversation to Discord webhook
    User can trigger this when they want to contact Vicky
    """
    
    try:
        # Create Discord webhook
        webhook = DiscordWebhook(url=DISCORD_WEBHOOK)
        
        # Determine lead quality
        lead_quality = "🔥 HOT LEAD" if request.deal_status == "deal_confirmed" else "💼 NEW LEAD"
        
        # Create embed
        embed = DiscordEmbed(
            title=f"{lead_quality} - New Client Inquiry",
            description="A potential client wants to connect!",
            color='03b2f8'
        )
        
        # Add user details
        if request.user_email:
            embed.add_embed_field(name="📧 Email", value=request.user_email, inline=False)
        if request.user_phone:
            embed.add_embed_field(name="📱 Phone", value=request.user_phone, inline=False)
        if request.user_industry:
            embed.add_embed_field(name="🏢 Industry", value=request.user_industry, inline=False)
        
        embed.add_embed_field(name="Status", value=request.deal_status.upper(), inline=False)
        
        # Add conversation transcript
        conversation_text = "\n\n".join([
            f"**{'User' if msg.get('role') == 'user' else 'AI'}**: {msg.get('content', '')[:200]}"
            for msg in request.conversation_history[-10:]  # Last 10 messages
        ])
        
        embed.add_embed_field(
            name="💬 Conversation Excerpt",
            value=conversation_text[:1000] if len(conversation_text) > 1000 else conversation_text,
            inline=False
        )
        
        embed.set_footer(text=f"Vicky AI Systems • {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        embed.set_timestamp()
        
        webhook.add_embed(embed)
        response = webhook.execute()
        
        if response.status_code == 200:
            return {
                "success": True,
                "message": "Perfect! ✅ I've sent your conversation to Vicky. He'll reach out within 24-48 hours with a detailed plan and next steps!"
            }
        else:
            raise Exception(f"Discord webhook failed: {response.status_code}")
            
    except Exception as e:
        print(f"Discord webhook error: {str(e)}")
        return {
            "success": False,
            "message": "I had a small issue sending to Discord, but you can reach Vicky directly at npdimagine@gmail.com or +91 83838 48219"
        }

@app.post("/api/contact", response_model=ContactResponse)
async def contact_endpoint(contact_form: ContactForm):
    """
    Contact form endpoint - handles inquiries
    
    TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    TODO: Store in database for tracking
    """
    
    # Generate ticket ID
    ticket_id = f"TICKET_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    # TODO: Send email notification
    # Example:
    # send_email(
    #     to="npdimagine@gmail.com",
    #     subject=f"New Contact: {contact_form.name}",
    #     body=format_contact_email(contact_form)
    # )
    
    # TODO: Store in database
    # db.contacts.insert_one(contact_form.dict())
    
    print(f"\n{'='*50}")
    print(f"NEW CONTACT FORM SUBMISSION - {ticket_id}")
    print(f"{'='*50}")
    print(f"Name: {contact_form.name}")
    print(f"Email: {contact_form.email}")
    print(f"Company: {contact_form.company or 'N/A'}")
    print(f"Budget: {contact_form.budget or 'N/A'}")
    print(f"Message: {contact_form.message}")
    print(f"{'='*50}\n")
    
    return ContactResponse(
        success=True,
        message="Thank you! I'll respond within 24-48 hours with a concrete plan.",
        ticket_id=ticket_id
    )

# ===== HELPER FUNCTIONS =====

def generate_response(user_message: str) -> str:
    """
    Generate chatbot response based on user message
    TODO: Replace with actual LLM integration
    """
    
    # Pricing inquiries
    if any(word in user_message for word in ['price', 'pricing', 'cost', 'budget']):
        return """Great question! My pricing varies based on project complexity:

🤖 AI Agents: ₹15K - ₹1.2L
⚙️ Automation: ₹10K - ₹1L
💻 Full-Stack Apps: ₹40K - ₹3L
🧠 ML Systems: ₹30K - ₹1.2L
🚀 Deployment: ₹10K - ₹50K

Tell me about your specific needs and I'll provide an accurate estimate."""
    
    # Services
    if any(word in user_message for word in ['service', 'what can you', 'what do you']):
        return """I specialize in production-ready AI systems:

✅ AI Agents & Automation
✅ Machine Learning (97.94% accuracy)
✅ Full-Stack Web Applications
✅ Speech Recognition & Computer Vision
✅ Data Tools & Analytics
✅ Complete Deployment & DevOps

What interests you most?"""
    
    # Contact
    if any(word in user_message for word in ['contact', 'email', 'phone', 'whatsapp']):
        return """Let's connect directly!

📧 Email: npdimagine@gmail.com
📱 WhatsApp: +91 83838 48219
💻 GitHub: github.com/algsoch
🔗 LinkedIn: linkedin.com/in/algsoch

I respond within 24-48 hours with a technical plan and quote."""
    
    # Default
    return """I can help you build powerful AI solutions!

🤖 AI Agents & Automation
🧠 Machine Learning
💻 Full-Stack Applications
🚀 Production Deployment

Tell me about your project, and I'll suggest the best solution with accurate pricing.

Or contact me directly:
📧 npdimagine@gmail.com
📱 +91 83838 48219"""

# ===== MAIN =====

if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║           VICKY AI SYSTEMS - Backend Server              ║
    ║                                                          ║
    ║  API Running on: http://localhost:8000                   ║
    ║  Documentation: http://localhost:8000/docs               ║
    ║                                                          ║
    ║  Contact: npdimagine@gmail.com | +91 83838 48219        ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "backend:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )
