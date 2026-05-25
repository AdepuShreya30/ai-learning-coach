# AI Learning Coach - Implementation Guide

## Project Overview

This is a full-stack AI Learning Coach application that provides personalized learning assessments and coaching.

## Backend Architecture

### File Structure
```
backend/
├── controllers/
│   └── aiCoachController.js       (2 endpoints: generateQuestions, processEvaluation)
├── services/
│   └── huggingFaceService.js      (LLM integration with mock mode)
├── routes/
│   └── aiCoachRoutes.js           (Route definitions)
├── middleware/
│   ├── validator.js               (Input validation)
│   ├── errorHandler.js            (Global error handler)
│   ├── rateLimiter.js             (Rate limiting)
│   └── timeoutHandler.js          (Request timeout)
├── utils/
│   ├── aiPromptUtils.js           (5 prompt templates)
│   ├── asyncHandler.js            (Async error wrapper)
│   ├── safeJsonParse.js           (Safe JSON parsing)
│   └── ApiError.js                (Custom error class)
├── server.js                       (Entry point)
└── package.json
```

### API Endpoints

#### 1. POST /api/coach/generate-questions
**Purpose**: Generate 3 AI-powered quiz questions for a topic

**Flow**:
- Receives: `{ topic: string }`
- Calls: HF LLM with quiz generation prompt
- Returns: `{ success: true, data: { topic, questions: [...] } }`

**Validation**: Topic must be 3-100 characters

#### 2. POST /api/coach/evaluate
**Purpose**: Analyze answers and provide comprehensive coaching

**Flow**:
- Receives: `{ topic, questions, answers }`
- CALL 1: Analyzes answers → scores learner (0-100)
- CALL 2A (if score < 50): Generates beginner explanations
- CALL 2B (if score ≥ 50): Generates advanced challenges
- CALL 3: Creates 7-day personalized roadmap
- Returns: `{ success: true, data: { analysis, coaching, roadmap } }`

## Frontend Architecture

### File Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                   (Main UI - 4 stages)
│   │   ├── layout.tsx                 (Root layout)
│   │   └── api/
│   │       └── ai-coach/
│   │           ├── generate/route.ts  (Forward to backend)
│   │           └── evaluate/route.ts  (Forward to backend)
│   └── types/
│       └── index.ts                   (TypeScript types)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

### UI Stages

1. **Topic Selection**: User enters a topic
2. **Loading**: AI generates personalized questions
3. **Quiz**: User answers 3 questions
4. **Results**: Display score, coaching, and roadmap

## Key Implementation Details

### Error Handling
- 400: Bad Request (validation)
- 422: Unprocessable Entity (validation errors)
- 502: Bad Gateway (JSON parsing)
- 503: Service Unavailable (API errors)
- 504: Gateway Timeout (timeout)

### Mock Mode
- Triggered when: NODE_ENV=development AND HF_TOKEN doesn't start with "hf_"
- Provides: Sample responses for testing without API key
- Includes: Quiz generation, analysis, beginner explanation, advanced challenge, roadmap

### Prompts (in aiPromptUtils.js)

1. **createQuizGenerationPrompt**: Generates 3 questions (basics, application, advanced)
2. **createAnalysisPrompt**: Analyzes answers, returns JSON with score/strengths/weaknesses
3. **createBeginnerExplanationPrompt**: Explains weak topics in simple language
4. **createAdvancedChallengePrompt**: Creates advanced problems for strong areas
5. **createRoadmapPrompt**: Creates 7-day personalized learning plan

### Service Integration (huggingFaceService.js)

```javascript
invokeModel(prompt, taskDescription)
  ├─ Mock Mode Check
  │  └─ Return mock response if development + invalid token
  └─ API Call
     ├─ POST to https://router.huggingface.co/v1/chat/completions
     ├─ Parse response
     └─ Handle errors
```

## Data Flow

```
Frontend (User Input)
  ↓
Next.js API Route (/api/ai-coach/generate or /api/ai-coach/evaluate)
  ↓
Backend API (/api/coach/generate-questions or /api/coach/evaluate)
  ↓
Middleware (Validation, Error Handling, Rate Limiting)
  ↓
Controller (Business Logic)
  ↓
Service (HF LLM Integration)
  ↓
HuggingFace API or Mock Mode
  ↓
Response Processing (JSON Parse, Validation)
  ↓
Frontend (Display Results)
```

## Configuration

### Environment Variables

**Backend (.env)**:
- PORT: Server port (8080)
- HF_TOKEN: HuggingFace API token
- LLM_MODEL: Model name (default: mistralai/Mistral-7B-Instruct-v0.1)
- NODE_ENV: Environment (development/production)
- REQUEST_TIMEOUT_MS: Timeout in ms (45000)
- API_RATE_LIMIT_WINDOW_MS: Rate limit window (900000)
- API_RATE_LIMIT_MAX: Max requests (100)

**Frontend (.env.local)**:
- NEXT_PUBLIC_BACKEND_URL: Backend URL (http://localhost:8080)

## Security Features

- ✅ Helmet: HTTP headers protection
- ✅ Rate Limiting: 100 requests/15 min per IP
- ✅ Request Timeout: 45 second default
- ✅ Input Validation: express-validator
- ✅ Error Recovery: Safe JSON parsing
- ✅ No Secrets: API key not exposed in frontend

## Testing

### Test with Mock Mode
1. Leave HF_TOKEN as placeholder value (not starting with "hf_")
2. Set NODE_ENV=development
3. Backend automatically returns mock responses
4. Perfect for UI/UX testing without API costs

### Test with Real API
1. Set HF_TOKEN to actual HuggingFace token
2. Backend calls real LLM API
3. Full end-to-end testing

## Performance Considerations

- Quiz generation: ~2-3 seconds
- Answer analysis: ~2-3 seconds
- Coaching generation: ~1-2 seconds
- Roadmap generation: ~1-2 seconds
- **Total time**: ~6-10 seconds for full workflow

## Deployment

### Backend Deployment (Heroku, Railway, etc.)
```bash
cd backend
npm install
npm start
```

### Frontend Deployment (Vercel, etc.)
```bash
cd frontend
npm install
npm run build
npm start
```

### Environment Variables
Set all variables in deployment platform's config/secrets.

## Troubleshooting

### "Missing required environment variables"
- Solution: Check .env file has HF_TOKEN and LLM_MODEL

### "401 Unauthorized"
- Solution: HF_TOKEN is invalid; use mock mode for testing

### "Failed to get a response from the AI coach"
- Solution: Check backend is running on port 8080
- Check NEXT_PUBLIC_BACKEND_URL is correct
- Check HuggingFace API status

### "Request timed out"
- Solution: Increase REQUEST_TIMEOUT_MS or check network
- LLM might be slow with large model

## Best Practices

1. **Always validate input** at middleware level
2. **Use async/await** properly with error handling
3. **Log important events** for debugging
4. **Return consistent JSON** structure
5. **Handle errors gracefully** with meaningful messages
6. **Use mock mode** for development and testing
7. **Test rate limiting** before production
8. **Monitor API costs** if using paid HF API

---

Last Updated: 2026-05-25
