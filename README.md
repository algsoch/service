# 🤖 Vicky AI Systems - Professional AI Business Website

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://service-1-kqhn.onrender.com/)
[![Backend API](https://img.shields.io/badge/API-Live-blue)](https://service-y5ld.onrender.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, AI-powered business website featuring an intelligent chatbot, contact forms, and Discord integration. Built with **FREE** Gemini AI and deployed on Render.

## ✨ Features

### 🤖 AI Chatbot
- **FREE Gemini 2.0 Flash API** - No paid subscriptions!
- Real-time conversation with intelligent responses
- Conversation history tracking
- Pre-conversation contact form
- Discord notification on lead qualification

### 💬 Smart Interactions
- Code syntax highlighting in chat
- Markdown rendering (headers, lists, links, code blocks)
- Typing indicators
- Message animations
- Mobile-responsive design

### 📧 Contact System
- Multi-step contact form
- Email validation
- Automatic Discord notifications
- Lead status tracking (interested, deal_confirmed, contact_requested)

### 🎨 Modern UI
- Glassmorphism effects
- Gradient animations
- Floating chat bubble with pulsing glow
- Smooth transitions
- Dark/light theme support

## 🚀 Live Deployment

- **Frontend:** https://service-1-kqhn.onrender.com/
- **Backend API:** https://service-y5ld.onrender.com/
- **Health Check:** https://service-y5ld.onrender.com/health

## 📁 Project Structure

```
vicky-ai-systems/
├── backend/
│   ├── backend.py              # FastAPI server
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables (not in git)
│   └── render.yaml            # Render deployment config
├── frontend/
│   ├── index.html             # Main page
│   ├── css/
│   │   └── styles.css         # All styling
│   ├── js/
│   │   ├── script.js          # Main logic + contact forms
│   │   ├── gemini-chatbot.js  # AI chatbot functionality
│   │   └── config.js          # Frontend configuration
│   └── images/                # Assets
├── tests/
│   └── test_api.sh            # API testing script
├── render.yaml                # Main Render config
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Gemini AI** - FREE Google AI API
- **Discord Webhooks** - Real-time notifications
- **Python 3.10+**

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **HTML5 + CSS3** - Modern web standards
- **Markdown Parser** - Custom implementation with syntax highlighting
- **Responsive Design** - Mobile-first approach

### Deployment
- **Render** - Both frontend (static) and backend (web service)
- **Docker** - Containerized backend
- **GitHub** - Version control and CI/CD

## 📦 Installation

### Prerequisites
- Python 3.10+
- Git
- Gemini API Key (free from [Google AI Studio](https://makersuite.google.com/app/apikey))
- Discord Webhook URL (optional)

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/algsoch/service.git
cd service
```

2. **Backend Setup:**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your API keys
```

3. **Environment Variables (.env):**
```bash
GEMINI_API_KEY=your_gemini_api_key_here
DISCORD_WEBHOOK=your_discord_webhook_url_here
```

4. **Run Backend:**
```bash
uvicorn backend:app --reload --port 8000
```

5. **Run Frontend:**
```bash
cd ../frontend
python -m http.server 5500
```

6. **Open in browser:**
- Frontend: http://localhost:5500
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🧪 Testing

Run the automated test suite:

```bash
# Test all endpoints
bash tests/test_api.sh

# Test specific endpoint
curl https://service-y5ld.onrender.com/health
curl -X POST https://service-y5ld.onrender.com/api/chat-gemini \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!","conversation_history":[]}'
```

## 🚢 Deployment

### Deploy to Render

#### Backend (Web Service):
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. New Web Service → Connect GitHub repo: `algsoch/service`
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `GEMINI_API_KEY`
   - `DISCORD_WEBHOOK`
5. Deploy!

#### Frontend (Static Site):
1. New Static Site → Connect same GitHub repo
2. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** *(leave empty)*
   - **Publish Directory:** `.`
3. Deploy!

4. Update `frontend/js/config.js` with your backend URL and redeploy.

## 📡 API Endpoints

### Health Check
```bash
GET /health
Response: {"status":"healthy","timestamp":"2025-11-19T..."}
```

### Chat with AI
```bash
POST /api/chat-gemini
Body: {
  "message": "Hello!",
  "conversation_history": []
}
Response: {
  "response": "AI response here",
  "conversation_id": "conv_123...",
  "timestamp": "2025-11-19T..."
}
```

### Send to Discord
```bash
POST /api/send-to-discord
Body: {
  "conversation_history": [{"role": "user", "content": "..."}],
  "user_email": "user@example.com",
  "user_phone": "+1234567890",
  "deal_status": "interested"
}
Response: {
  "success": true,
  "message": "Perfect! ✅ I've sent your conversation..."
}
```

### API Documentation
- Swagger UI: https://service-y5ld.onrender.com/docs
- ReDoc: https://service-y5ld.onrender.com/redoc

## 🔒 Security Features

- ✅ API keys stored in backend environment variables only
- ✅ Frontend NEVER accesses API keys directly
- ✅ All AI requests proxied through backend
- ✅ CORS configured to allow all origins
- ✅ Input validation with Pydantic models
- ✅ No sensitive data in Git repository

## 🎯 Key Features

### For Developers
- Clean, documented code
- Type hints throughout
- Error handling with fallbacks
- Comprehensive logging
- Easy to extend and customize

### For Users
- Fast response times (Gemini 2.0 Flash)
- Natural conversation flow
- Mobile-friendly interface
- Accessible design
- No installation required

## 📊 Performance

- **Backend Response Time:** < 2 seconds
- **Frontend Load Time:** < 1 second
- **Uptime:** 99.9% (Render free tier)
- **Cost:** $0/month (100% FREE!)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vicky Kumar**
- Email: npdimagine@gmail.com
- Phone: +91 83838 48219
- GitHub: [@algsoch](https://github.com/algsoch)
- LinkedIn: [algsoch](https://www.linkedin.com/in/algsoch)

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) - FREE AI API
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Render](https://render.com/) - Easy deployment platform
- [Discord](https://discord.com/) - Webhook notifications

## 📞 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Email: npdimagine@gmail.com
- Chat with the AI on the live website!

---

⭐ **Star this repo if you find it helpful!** ⭐
