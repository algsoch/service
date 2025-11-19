# 🚀 Deploying VICKY AI SYSTEMS to Render

## Overview
This guide will help you deploy your AI chatbot website to Render for free.

## Architecture
- **Backend**: Python FastAPI (handles Gemini API calls, Discord webhooks)
- **Frontend**: Static HTML/CSS/JS (served separately or via CDN)

---

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **API Keys Ready**:
   - Gemini API Key: `AIzaSyA6FDeM3RnOu-NNSDfS8AnfolYWtNbDvhQ`
   - Discord Webhook: `https://discord.com/api/webhooks/...`

---

## 🔧 Step 1: Prepare Your Code

### 1.1 Create/Update `.gitignore`
```bash
# Make sure .env is in .gitignore
echo ".env" >> .gitignore
echo "__pycache__/" >> .gitignore
echo ".venv/" >> .gitignore
```

### 1.2 Push to GitHub
```bash
cd /path/to/vicky-ai-systems
git init
git add .
git commit -m "Initial commit - Ready for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vicky-ai-systems.git
git push -u origin main
```

---

## 🌐 Step 2: Deploy Backend to Render

### 2.1 Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `vicky-ai-systems` repo

### 2.2 Configure Backend Service
```yaml
Name: vicky-ai-backend
Runtime: Python 3
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn backend:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

### 2.3 Add Environment Variables
Click **"Environment"** tab and add:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | `AIzaSyA6FDeM3RnOu-NNSDfS8AnfolYWtNbDvhQ` |
| `DISCORD_WEBHOOK` | `https://discord.com/api/webhooks/1440670389780086947/...` |
| `ENV` | `production` |
| `PYTHON_VERSION` | `3.11.0` |

### 2.4 Deploy
- Click **"Create Web Service"**
- Wait 5-10 minutes for deployment
- You'll get a URL like: `https://vicky-ai-backend.onrender.com`

### 2.5 Test Backend
```bash
# Test health endpoint
curl https://vicky-ai-backend.onrender.com/health

# Should return: {"status":"healthy","timestamp":"..."}
```

---

## 🎨 Step 3: Deploy Frontend to Render (Option 1: Static Site)

### 3.1 Create Static Site
1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository

### 3.2 Configure Frontend
```yaml
Name: vicky-ai-frontend
Branch: main
Root Directory: frontend
Build Command: (leave empty)
Publish Directory: .
```

### 3.3 Update Frontend Config
Before deploying, update `frontend/js/config.js`:

```javascript
backendUrl: window.location.hostname === 'localhost' 
    ? 'http://localhost:8000'
    : 'https://vicky-ai-backend.onrender.com', // Your actual backend URL
```

### 3.4 Deploy
- Click **"Create Static Site"**
- You'll get a URL like: `https://vicky-ai-frontend.onrender.com`

---

## 🌐 Step 3 (Alternative): Deploy Frontend via Netlify/Vercel

### Option A: Netlify (Recommended for Static Sites)

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Deploy**:
```bash
cd frontend
netlify deploy --prod
```

### Option B: Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel --prod
```

---

## 🔐 Step 4: CORS Configuration

**Good News!** CORS is already configured to allow all origins (`allow_origins=["*"]`).

This means:
- ✅ Works with any frontend URL
- ✅ No need to update CORS settings
- ✅ Deploy and forget!

**Note**: In a high-security production environment, you might want to restrict to specific origins. For most use cases, allowing all origins is perfectly fine.

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend
```bash
# Health check
curl https://vicky-ai-backend.onrender.com/health

# Test chat endpoint
curl -X POST https://vicky-ai-backend.onrender.com/api/chat-gemini \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","conversation_history":[]}'
```

### 5.2 Test Frontend
1. Open `https://vicky-ai-frontend.onrender.com`
2. Click chat bubble
3. Fill contact form
4. Send a message
5. Check if you receive Discord notification

---

## 🎯 Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain to Render
1. Go to your frontend service settings
2. Click **"Custom Domains"**
3. Add your domain: `www.vickyaisystems.com`
4. Update DNS records as shown

### 6.2 Update DNS
Add these records to your domain provider:

```
Type: CNAME
Name: www
Value: vicky-ai-frontend.onrender.com
```

### 6.3 Update Backend CORS
Add your custom domain to `ALLOWED_ORIGINS` env variable

---

## 🔄 Continuous Deployment

Render automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update chatbot responses"
git push origin main

# Render will auto-deploy both services
```

---

## 📊 Monitoring & Logs

### View Logs
1. Go to Render Dashboard
2. Click on your service
3. Click **"Logs"** tab
4. Monitor real-time logs

### Check Metrics
- **Requests**: View in "Metrics" tab
- **Response Times**: Check performance
- **Errors**: Monitor error rates

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: 502 Bad Gateway
```bash
# Check logs for Python errors
# Verify PORT environment variable is used
# Check start command: uvicorn backend:app --host 0.0.0.0 --port $PORT
```

**Problem**: CORS errors
```bash
# Update ALLOWED_ORIGINS environment variable
# Include frontend URL without trailing slash
```

### Frontend Issues

**Problem**: Can't connect to backend
```bash
# Check config.js has correct backend URL
# Verify CORS settings on backend
# Check browser console for errors
```

**Problem**: API calls failing
```bash
# Test backend URL directly
# Check if backend is sleeping (free tier sleeps after 15 min)
# Render free tier: first request may be slow
```

---

## 💡 Performance Tips

### 1. Keep Backend Awake
Free tier services sleep after 15 minutes of inactivity. Solutions:

**Option A**: Use a ping service (UptimeRobot)
```
https://uptimerobot.com
Create monitor: https://vicky-ai-backend.onrender.com/health
Check every 5 minutes
```

**Option B**: Upgrade to paid plan ($7/month)
- No sleep
- Faster response times
- More resources

### 2. Optimize Frontend
```bash
# Minify CSS/JS before deploying
# Optimize images
# Enable caching headers
```

### 3. Use CDN
```bash
# For better global performance
# Cloudflare (free tier)
# Point DNS to Cloudflare
# Enable caching and optimization
```

---

## 🚀 Production Checklist

Before going live:

- [ ] Test all features thoroughly
- [ ] Verify Discord webhooks working
- [ ] Check mobile responsiveness
- [ ] Test chatbot conversations
- [ ] Verify contact form submissions
- [ ] Monitor logs for errors
- [ ] Set up uptime monitoring
- [ ] Configure custom domain (optional)
- [ ] Add SSL certificate (auto on Render)
- [ ] Update README with live URLs
- [ ] Share with users!

---

## 📞 Support

If you encounter issues:
1. Check Render status: https://status.render.com
2. Review deployment logs
3. Test backend health endpoint
4. Verify environment variables

---

## 🎉 Your Deployed URLs

After deployment, you'll have:

- **Backend API**: `https://vicky-ai-backend.onrender.com`
- **Frontend Site**: `https://vicky-ai-frontend.onrender.com`
- **Health Check**: `https://vicky-ai-backend.onrender.com/health`
- **API Docs**: `https://vicky-ai-backend.onrender.com/docs`

---

## 📝 Next Steps

1. **Monitor Performance**: Check Render metrics regularly
2. **Collect Feedback**: Track user interactions via Discord
3. **Iterate**: Update based on user feedback
4. **Scale**: Upgrade to paid plans as needed
5. **Market**: Share your deployed chatbot!

---

**Deployment Time**: ~15-20 minutes
**Cost**: $0 (Free tier) or $7/month (Starter tier)
**Uptime**: 99.9% (Paid) / ~95% (Free with sleep)

Good luck with your deployment! 🚀
