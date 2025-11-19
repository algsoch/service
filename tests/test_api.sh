#!/bin/bash

# API Testing Script for Vicky AI Systems
# Tests all endpoints on the deployed backend

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend URL
BACKEND_URL="https://service-y5ld.onrender.com"

echo "========================================="
echo "🧪 Testing Vicky AI Systems API"
echo "Backend: $BACKEND_URL"
echo "========================================="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check Endpoint"
echo "GET $BACKEND_URL/health"
response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Health check successful"
    echo "Response: $body"
else
    echo -e "${RED}❌ FAIL${NC} - Health check failed (HTTP $http_code)"
    echo "Response: $body"
fi
echo ""

# Test 2: Root Endpoint
echo "Test 2: Root API Info Endpoint"
echo "GET $BACKEND_URL/"
response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Root endpoint successful"
    echo "Response: $body"
else
    echo -e "${RED}❌ FAIL${NC} - Root endpoint failed (HTTP $http_code)"
    echo "Response: $body"
fi
echo ""

# Test 3: Gemini Chat Endpoint
echo "Test 3: Gemini AI Chat Endpoint"
echo "POST $BACKEND_URL/api/chat-gemini"
response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/chat-gemini" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello! Can you help me build an AI chatbot for my business?",
    "conversation_history": []
  }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Chat endpoint successful"
    echo "Response preview:"
    echo "$body" | python3 -m json.tool | head -n 10
    echo "..."
else
    echo -e "${RED}❌ FAIL${NC} - Chat endpoint failed (HTTP $http_code)"
    echo "Response: $body"
fi
echo ""

# Test 4: Chat with Conversation History
echo "Test 4: Chat with Conversation History"
echo "POST $BACKEND_URL/api/chat-gemini (with history)"
response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/chat-gemini" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What services do you offer?",
    "conversation_history": [
      {"role": "user", "content": "Hello!"},
      {"role": "assistant", "content": "Hi! How can I help you today?"}
    ]
  }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Chat with history successful"
    echo "Response preview:"
    echo "$body" | python3 -m json.tool | head -n 10
    echo "..."
else
    echo -e "${RED}❌ FAIL${NC} - Chat with history failed (HTTP $http_code)"
    echo "Response: $body"
fi
echo ""

# Test 5: Discord Integration
echo "Test 5: Discord Notification Endpoint"
echo "POST $BACKEND_URL/api/send-to-discord"
response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/send-to-discord" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_history": [
      {"role": "user", "content": "I need an AI chatbot for customer support"},
      {"role": "assistant", "content": "Great! I can help with that. What features do you need?"},
      {"role": "user", "content": "24/7 support with FAQ handling"}
    ],
    "user_email": "test@example.com",
    "user_phone": "+1234567890",
    "user_industry": "E-commerce",
    "deal_status": "interested"
  }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Discord notification successful"
    echo "Response: $body"
else
    echo -e "${RED}❌ FAIL${NC} - Discord notification failed (HTTP $http_code)"
    echo "Response: $body"
fi
echo ""

# Test 6: Invalid Endpoint (404 Test)
echo "Test 6: Invalid Endpoint (Error Handling)"
echo "GET $BACKEND_URL/invalid-endpoint"
response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/invalid-endpoint")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 404 ]; then
    echo -e "${GREEN}✅ PASS${NC} - 404 error handled correctly"
    echo "Response: $body"
else
    echo -e "${YELLOW}⚠️  WARN${NC} - Expected 404, got HTTP $http_code"
    echo "Response: $body"
fi
echo ""

# Test 7: Missing Required Fields (Validation Test)
echo "Test 7: Input Validation (Missing Fields)"
echo "POST $BACKEND_URL/api/chat-gemini (missing message field)"
response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/chat-gemini" \
  -H "Content-Type: application/json" \
  -d '{"conversation_history": []}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 422 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Validation error handled correctly (422)"
    echo "Response: $body"
else
    echo -e "${YELLOW}⚠️  WARN${NC} - Expected 422, got HTTP $http_code"
    echo "Response: $body"
fi
echo ""

# Test 8: CORS Headers
echo "Test 8: CORS Configuration"
echo "OPTIONS $BACKEND_URL/api/chat-gemini"
response=$(curl -s -I -X OPTIONS "$BACKEND_URL/api/chat-gemini" \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST")

if echo "$response" | grep -q "access-control-allow-origin"; then
    echo -e "${GREEN}✅ PASS${NC} - CORS headers present"
    echo "$response" | grep -i "access-control"
else
    echo -e "${RED}❌ FAIL${NC} - CORS headers missing"
fi
echo ""

# Summary
echo "========================================="
echo "📊 Test Summary"
echo "========================================="
echo "Backend URL: $BACKEND_URL"
echo "Tests completed!"
echo ""
echo "Check your Discord server for test notification"
echo "Visit API docs: $BACKEND_URL/docs"
echo "========================================="
