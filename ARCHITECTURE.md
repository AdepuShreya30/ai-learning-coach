# Architecture

Detailed overview of AI Learning Coach's system design, component architecture, AI workflow, and security considerations.

## System Overview

The application follows a **decoupled frontend-backend architecture** with a three-tier backend structure.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  4-Stage UI: Topic → Loading → Quiz → Results               │
└────────────────┬──────────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  Next.js API    │
        │  Routes         │
        └────────┬────────┘
                 │
        ┌────────▼──────────────────────────┐
        │     Backend (Node.js + Express)    │
        │  ┌──────────────────────────────┐  │
        │  │   API Routes & Controllers   │  │
        │  ├──────────────────────────────┤  │
        │  │   Middleware Layer           │  │
        │  │  - Validation                │  │
        │  │  - Error Handling            │  │
        │  │  - Rate Limiting             │  │
        │  │  - Request Timeout           │  │
        │  ├──────────────────────────────┤  │
        │  │   Service Layer              │  │
        │  │  - HuggingFace Integration   │  │
        │  │  - Prompt Management         │  │
        │  │  - Mock Mode Support         │  │
        │  └──────────────────────────────┘  │
        └────────┬──────────────────────────┘
                 │
        ┌────────▼────────┐
        │  HuggingFace    │
        │  Inference API  │
        │  (LLM Model)    │
        └─────────────────┘
```

## Architecture Components

### Frontend (Next.js 15+)

**Technology Stack:**
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Client-side state management

**Key Features:**
- **Page (`page.tsx`)**: Single-page with 4-stage flow
  - Stage 1: Topic selection with input validation
  - Stage 2: Loading state with spinner
  - Stage 3: Dynamic quiz with generated questions
  - Stage 4: Results dashboard with comprehensive analytics
  
- **API Routes:**
  - `/api/ai-coach/generate` - Forwards quiz generation requests
  - `/api/ai-coach/evaluate` - Forwards evaluation requests
  
- **Styling:**
  - Gradient backgrounds (purple/blue theme)
  - Dark mode support
  - Responsive grid layout
  - Card-based components

### Backend (Node.js + Express)

**Architecture Layers:**

1. **Routes Layer** (`aiCoachRoutes.js`)
   - `POST /api/coach/generate-questions` - Quiz generation endpoint
   - `POST /api/coach/evaluate` - Evaluation and coaching endpoint

2. **Controller Layer** (`aiCoachController.js`)
   - `generateQuestions()` - Orchestrates quiz generation
   - `processEvaluation()` - Orchestrates 3 LLM calls

3. **Service Layer** (`huggingFaceService.js`)
   - `invokeModel()` - Unified LLM interface
   - Mock mode support for testing
   - Error handling and recovery

4. **Middleware Layer**
   - `validator.js` - Input validation with express-validator
   - `errorHandler.js` - Centralized error handling
   - `rateLimiter.js` - 100 req/15 min per IP
   - `timeoutHandler.js` - 45 second request timeout

5. **Utility Layer**
   - `aiPromptUtils.js` - 5 prompt templates
   - `asyncHandler.js` - Async error wrapper
   - `safeJsonParse.js` - Safe JSON parsing
   - `ApiError.js` - Custom error class

## AI Workflow (4 LLM Calls)

```
User Input (Topic)
    ↓
[CALL 0] Generate Quiz Questions
    └─ Prompt: Create 3 questions (basics, application, advanced)
    └─ Output: { questions: [...] }
    ↓
User Answers Quiz
    ↓
[CALL 1] Analyze Learner Answers
    └─ Input: 3 Q&A pairs
    └─ Analysis: Score, strengths, weaknesses, summary
    └─ Output: { score: 0-100, weak_topics: [...], strengths: [...] }
    ↓
[CALL 2A/2B] Conditional Coaching
    ├─ IF score < 50:
    │   └─ Beginner Explanation (simple language, analogies)
    └─ IF score ≥ 50:
        └─ Advanced Challenges (complex problems)
    └─ Output: Coaching response text
    ↓
[CALL 3] Generate Learning Roadmap
    └─ Input: Performance analysis + topic
    └─ Output: 7-day personalized plan
    ↓
Display Results
    ├─ Score card (visual feedback)
    ├─ Strengths/Weaknesses lists
    ├─ Coaching response
    ├─ Learning roadmap
    └─ Action buttons (print, new topic)
```

## Request Lifecycle

```
Frontend User Action
    ↓
Next.js API Route receives request
    ↓
Request forwarded to Backend API
    ↓
Express Middleware Chain:
    ├─ Logger (Morgan)
    ├─ Validation Middleware
    ├─ Timeout Handler
    ├─ Rate Limiter
    └─ Error Boundary
    ↓
Controller Logic
    ├─ Extract parameters
    ├─ Call service methods
    └─ Return structured response
    ↓
Service Layer
    ├─ Check mock mode
    ├─ Build prompt
    ├─ Call HuggingFace API or return mock
    ├─ Parse response
    └─ Return to controller
    ↓
Error Handler (if error)
    └─ Catch and format error
    ↓
Response sent to Frontend
    ↓
Frontend updates UI state
    ↓
User sees results
```

## Data Flow

### Quiz Generation Flow
```
Topic Input
    ↓
Backend: generateQuestions()
    ├─ Validate input
    ├─ Create prompt
    ├─ Call HF API
    ├─ Parse JSON
    └─ Validate structure
    ↓
Frontend: Display questions
```

### Evaluation Flow
```
Quiz Answers
    ↓
Backend: processEvaluation()
    ├─ [CALL 1] Analyze answers
    │   └─ Get score (0-100)
    ├─ [CALL 2] Generate coaching
    │   ├─ If score < 50: Beginner path
    │   └─ If score ≥ 50: Advanced path
    ├─ [CALL 3] Generate roadmap
    └─ Return all results
    ↓
Frontend: Display results dashboard
```

## Error Handling Strategy

```
Request
    ↓
Validation Middleware
    ├─ Missing fields? → 400 Bad Request
    ├─ Invalid format? → 422 Unprocessable Entity
    └─ Valid? → Continue
    ↓
Service Layer
    ├─ JSON parse error? → 502 Bad Gateway
    ├─ LLM API error? → 503 Service Unavailable
    ├─ Timeout? → 504 Gateway Timeout
    └─ Success? → Return data
    ↓
Error Handler
    └─ Format error response
    ↓
Send to Frontend
    └─ Display user-friendly message
```

## Security Architecture

**Layers:**

1. **Authentication & Authorization**
   - No authentication required (public API)
   - Future: Add JWT/session support

2. **Input Validation**
   - Express-validator on all inputs
   - Topic: 3-100 characters
   - Questions: Array validation
   - Answers: Non-empty strings

3. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Configurable via environment

4. **Request Timeout**
   - 45 seconds default
   - Prevents hanging requests
   - Configurable per environment

5. **API Security**
   - HF_TOKEN stored server-side only
   - Not exposed to frontend
   - Helmet for HTTP headers
   - CORS configured for trusted origins

6. **Error Handling**
   - Centralized error handler
   - No sensitive data in errors
   - Structured error responses
   - Detailed logging for debugging

7. **Mock Mode**
   - Testing without API key
   - Development-only feature
   - Triggered by: NODE_ENV=development && invalid token

## Scalability

### Horizontal Scaling
```
Load Balancer (nginx)
    ├─ Backend Instance 1
    ├─ Backend Instance 2
    └─ Backend Instance 3
```

### Vertical Scaling
- Increase server resources
- Optimize LLM calls
- Cache responses
- Use CDN for static assets

### Database (Future)
- Add PostgreSQL for user history
- Implement caching layer (Redis)
- Archive old assessments

## Performance Characteristics

| Operation | Duration | Notes |
|-----------|----------|-------|
| Quiz Generation | 2-3s | Single LLM call |
| Answer Analysis | 2-3s | Single LLM call |
| Coaching Gen | 1-2s | Conditional path |
| Roadmap Gen | 1-2s | Single LLM call |
| **Total** | 6-10s | Acceptable for async task |

## Deployment Architecture

### Development
- Backend: `localhost:8080`
- Frontend: `localhost:3000`
- LLM: Mock mode or free tier

### Production
- Backend: Cloud provider (Heroku, Railway, etc.)
- Frontend: Vercel or CDN
- LLM: HuggingFace Inference API
- Monitoring: Error tracking (Sentry)
- Logging: Cloud logging (DataDog, CloudWatch)

## Technology Decisions

| Decision | Why |
|----------|-----|
| Node.js + Express | Lightweight, fast, great ecosystem |
| Next.js | SSR, API routes, excellent DX |
| TypeScript | Type safety, better IDE support |
| Tailwind CSS | Utility-first, responsive design |
| HuggingFace API | No infra, managed service, cost-effective |
| Mock mode | Test without API key, fast feedback |
| OpenAI-compatible API | Future flexibility to change models |

## Future Enhancements

- [ ] Database integration (user history)
- [ ] Authentication system
- [ ] Caching layer (Redis)
- [ ] WebSocket support (real-time updates)
- [ ] Multi-language support
- [ ] Batch processing for bulk assessments
- [ ] Admin dashboard
- [ ] Analytics and insights
- [ ] Certificate generation
- [ ] Mobile app (React Native)

---

**Last Updated**: 2026-05-25  
**Status**: Production-Ready
