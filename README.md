# 🎓 AI Learning Coach

> An intelligent, personalized learning system powered by AI that assesses your knowledge, provides targeted coaching, and creates comprehensive learning roadmaps.

[![Node.js](https://img.shields.io/badge/Node.js-v24.14.0-green)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-v15.0.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-v19.0.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.3.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Quick Start](#quick-start)
4. [Environment Setup](#environment-setup)
5. [Architecture & Workflow](#architecture--workflow)
6. [AI Capabilities](#ai-capabilities)
7. [API Endpoints](#api-endpoints)
8. [Project Structure](#project-structure)
9. [Technologies Used](#technologies-used)
10. [Challenges Faced](#challenges-faced)
11. [Future Improvements](#future-improvements)
12. [Contributing](#contributing)
13. [License](#license)

---

## 📖 Project Overview

AI Learning Coach is a full-stack web application that revolutionizes personalized learning through artificial intelligence. The system intelligently assesses learner knowledge across any topic, provides adaptive coaching, and generates comprehensive 60-day learning roadmaps tailored to individual needs.

### Key Vision
- **Democratize Education**: Make high-quality personalized learning accessible to everyone
- **Adaptive Learning**: Adjust content difficulty based on user performance
- **Career Guidance**: Connect learning goals with job market information and career paths
- **Comprehensive Planning**: Provide realistic, actionable 60-day learning plans with specific topics, projects, and milestones

### Target Users
- Self-learners wanting structured guidance
- Career changers exploring new technologies
- Students preparing for technical interviews
- Professionals upskilling in emerging technologies

---

## ✨ Features

### Core Learning Features
- 🎓 **AI-Generated Quizzes**: Dynamic, topic-specific quiz questions at multiple difficulty levels
- 📊 **Performance Analysis**: Detailed assessment with:
  - Numerical scoring (0-100)
  - Identified strengths and weak areas
  - Personalized summary with actionable insights
- 🎯 **Adaptive Coaching**: Intelligent response based on performance level:
  - Score < 50%: Beginner-friendly explanations with foundational resources
  - Score 50-80%: Intermediate guidance with best practices
  - Score > 80%: Advanced challenges and optimization techniques

### Learning Roadmap
- 📅 **60-Day Comprehensive Roadmap** (replaces 7-day plan):
  - 4 distinct learning phases (15 days each)
  - Phase 1: Foundations & Basics
  - Phase 2: Core Concepts & Practical Application
  - Phase 3: Advanced Topics & Mastery
  - Phase 4: Projects & Career Preparation
  
- 💼 **Career Information**:
  - 7+ relevant job roles with salary ranges ($90k-$220k)
  - Industry applications and use cases
  - Related technologies to learn
  - Specialization paths after completion

- 📍 **Performance Milestones**:
  - Week 2: Foundational understanding
  - Week 4: 2 small projects completed
  - Week 8: Medium-complexity application built
  - Week 12: Advanced patterns mastered
  - Week 16: Portfolio-ready projects

### User Experience
- 🎨 **Modern UI**: Beautiful, responsive dark-themed interface
- 📱 **Fully Responsive**: Works on desktop, tablet, and mobile devices
- ⚡ **Fast & Reliable**: Optimized performance with error handling
- 🔄 **Seamless Integration**: Frontend-backend communication with error recovery
- 🌙 **Dark Mode**: Eye-friendly interface for extended learning sessions

---

## 🚀 Quick Start

### Prerequisites
- Node.js v24.14.0 or higher
- npm or yarn package manager
- HuggingFace API token (for real LLM integration)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# Edit .env and add:
# - PORT=11111
# - HF_TOKEN=your_huggingface_token
# - LLM_MODEL=tiiuae/falcon-7b-instruct
# - NODE_ENV=development

# Start development server
npm run dev

# Backend runs on http://localhost:11111
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Update .env.local with backend URL
# NEXT_PUBLIC_BACKEND_URL=http://localhost:11111

# Start development server
npm run dev -- --port 9000

# Frontend runs on http://localhost:9000
```

### Access the Application

Open your browser and navigate to: **http://localhost:9000**

---

## ⚙️ Environment Setup

### Backend Configuration (.env)

```env
# Server Configuration
PORT=11111
NODE_ENV=development

# AI & LLM Configuration
HF_TOKEN=hf_your_huggingface_token_here
LLM_MODEL=tiiuae/falcon-7b-instruct

# API Rate Limiting
API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX=100

# Request Timeout
REQUEST_TIMEOUT_MS=45000
```

### Frontend Configuration (.env.local)

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:11111
```

### Getting HuggingFace Token

1. Visit [HuggingFace](https://huggingface.co/)
2. Sign up or log in to your account
3. Go to Settings → Access Tokens
4. Create a new token with "read" permissions
5. Copy and paste it in your `.env` file

---

## 🏗️ Architecture & Workflow

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (Frontend)                │
│              Next.js + React + TypeScript                  │
│                   http://localhost:9000                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       │ (Axios)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   API SERVER (Backend)                      │
│            Node.js + Express + TypeScript                  │
│                   http://localhost:11111                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes & Controllers               │  │
│  │  • POST /api/coach/generate-questions              │  │
│  │  • POST /api/coach/evaluate                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            AI Services Layer                        │  │
│  │  • HuggingFace LLM Integration                     │  │
│  │  • Prompt Engineering & Optimization              │  │
│  │  • Intelligent Mock Fallback System               │  │
│  │  • Judge Service (optional verification)          │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Middleware & Utilities                     │  │
│  │  • CORS Support                                    │  │
│  │  • Rate Limiting                                   │  │
│  │  • Error Handling                                  │  │
│  │  • Request Validation                             │  │
│  │  • JSON Parsing & Type Safety                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │ HTTPS/API
                       │
                       ▼
            ┌──────────────────────┐
            │  HuggingFace API     │
            │  (LLM Models)        │
            │  • falcon-7b         │
            │  • llama-2           │
            │  • mistral-7b        │
            └──────────────────────┘
```

### User Workflow

```
START
  │
  ▼
┌─────────────────────────────────────┐
│  User Enters Learning Topic         │
│  (e.g., "React", "Python", etc.)   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  AI Generates 3 Quiz Questions      │
│  • Fundamental concepts             │
│  • Real-world application           │
│  • Advanced critical thinking       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  User Answers All 3 Questions       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  AI Analyzes Answers & Scores       │
│  • Calculates score (0-100)        │
│  • Identifies strengths             │
│  • Identifies weak areas            │
│  • Generates summary                │
└────────────┬────────────────────────┘
             │
         ┌───┴───┐
         │       │
      Score<50% Score≥50%
         │       │
         ▼       ▼
      Beginner Advanced
     Coaching  Challenge
         │       │
         └───┬───┘
             │
             ▼
┌─────────────────────────────────────┐
│  AI Generates 60-Day Roadmap        │
│  • Phase 1: Foundations (Days 1-15) │
│  • Phase 2: Core (Days 16-30)       │
│  • Phase 3: Advanced (Days 31-45)   │
│  • Phase 4: Mastery (Days 46-60)    │
│  • Job roles with salaries          │
│  • Performance milestones           │
│  • Next steps                       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Display Results to User            │
│  • Performance score                │
│  • Strengths & weaknesses           │
│  • Personalized coaching            │
│  • Complete 60-day roadmap          │
└────────────┬────────────────────────┘
             │
             ▼
            END
```

### Data Flow

```
Request:
  {
    "topic": "React",
    "questions": [...],
    "answers": [...]
  }
         │
         ▼
  Backend Processing:
    1. Validate input
    2. Create analysis prompt
    3. Call HuggingFace LLM
    4. Parse LLM response
    5. Generate roadmap
         │
         ▼
Response:
  {
    "success": true,
    "data": {
      "analysis": {
        "score": 85,
        "strengths": [...],
        "weak_topics": [...]
      },
      "coaching": "...",
      "roadmap": "..."
    }
  }
```

---

## 🤖 AI Capabilities

### 1. Natural Language Processing
- **Topic Understanding**: Extracts and analyzes learning topics
- **Question Generation**: Creates contextually relevant, multi-level quiz questions
- **Answer Analysis**: Evaluates answer correctness, depth, and clarity
- **Personalization**: Tailors responses based on learner performance

### 2. LLM Integration

**Primary Provider**: HuggingFace Inference API
```
Models Supported:
- tiiuae/falcon-7b-instruct (Recommended)
- meta-llama/Llama-2-70b-chat-hf
- mistralai/Mistral-7B-Instruct-v0.1
- google/flan-t5-base
```

**LLM Capabilities**:
- Quiz generation with varied difficulty levels
- Answer evaluation and scoring
- Beginner/advanced content generation
- 60-day roadmap creation
- Career guidance and job role matching

### 3. Intelligent Fallback System

If HuggingFace API is unavailable:
- **Intelligent Mock Mode** activates automatically
- Analyzes answer quality using keyword detection
- Generates contextual responses based on topic
- Maintains user experience without interruption

### 4. Prompt Engineering

**Dynamic Prompts** created for each task:

```typescript
// Example: Quiz Generation Prompt
[INST] You are an expert AI curriculum designer. Your task is to create 
3 quiz questions that assess a learner's understanding of "React".

Create questions that test different levels:
1. Question 1: Fundamental concepts and definitions
2. Question 2: Application to real-world scenarios
3. Question 3: Critical thinking and advanced understanding

Return ONLY a valid JSON object:
{
  "questions": [...]
}
[/INST]
```

### 5. Scoring Algorithm

**Multi-Factor Scoring**:
- Answer length (1-20 points)
- Keyword presence (concepts, examples, reasons)
- Structural quality (explanations, examples)
- Domain-specific indicators
- Final score: 0-100 (capped at 95)

---

## 📡 API Endpoints

### 1. Generate Quiz Questions

**Endpoint**: `POST /api/coach/generate-questions`

**Request**:
```json
{
  "topic": "JavaScript Closures"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "topic": "JavaScript Closures",
    "questions": [
      {
        "id": 1,
        "question": "What are the fundamental concepts and core principles of JavaScript Closures?"
      },
      {
        "id": 2,
        "question": "How would you apply JavaScript Closures to a real-world scenario?"
      },
      {
        "id": 3,
        "question": "What are some advanced aspects of JavaScript Closures?"
      }
    ]
  }
}
```

### 2. Evaluate Answers & Get Coaching

**Endpoint**: `POST /api/coach/evaluate`

**Request**:
```json
{
  "topic": "JavaScript Closures",
  "questions": [
    {"id": 1, "question": "What are closures?"},
    {"id": 2, "question": "How do you create a closure?"},
    {"id": 3, "question": "Name a use case for closures"}
  ],
  "answers": [
    "A closure is a function that has access to variables from its parent scope",
    "You create a closure by defining a function inside another function",
    "Closures are used for data encapsulation and creating private variables"
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "analysis": {
      "score": 85,
      "weak_topics": ["practical examples"],
      "strengths": ["conceptual understanding"],
      "summary": "Your answers show excellent understanding at 85%..."
    },
    "coaching": "You've shown good understanding. Ready for a challenge?...",
    "roadmap": "📚 **60-DAY LEARNING ROADMAP**\nPhase 1: Foundations...",
    "judgeEnhancement": null
  }
}
```

### Error Handling

**Example Error Response**:
```json
{
  "status": "fail",
  "error": {
    "statusCode": 400,
    "status": "fail",
    "isOperational": true
  },
  "message": "Topic is required",
  "stack": "..."
}
```

**HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request (validation error)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Server Error
- `502`: Bad Gateway (LLM unavailable)

---

## 📁 Project Structure

```
ai-learning-coach/
├── backend/
│   ├── controllers/
│   │   └── aiCoachController.js      # Request handlers
│   ├── routes/
│   │   └── aiCoachRoutes.js          # API route definitions
│   ├── services/
│   │   ├── huggingFaceService.js     # LLM integration & mock system
│   │   └── judgeService.js           # Optional validation service
│   ├── middleware/
│   │   ├── errorHandler.js           # Global error handling
│   │   ├── rateLimiter.js            # Request rate limiting
│   │   ├── validator.js              # Input validation
│   │   └── timeoutHandler.js         # Request timeout management
│   ├── utils/
│   │   ├── aiPromptUtils.js          # Prompt templates & generation
│   │   ├── ApiError.js               # Custom error class
│   │   ├── asyncHandler.js           # Async middleware wrapper
│   │   └── safeJsonParse.js          # JSON parsing utility
│   ├── tests/
│   │   └── aiCoach.test.js           # Unit tests
│   ├── server.js                     # Express server setup
│   ├── package.json                  # Dependencies
│   ├── .env                          # Environment configuration
│   └── .env.example                  # Example env file
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                  # Main landing page
│   │   ├── layout.tsx                # Root layout
│   │   └── api/
│   │       └── ai-coach/             # API route proxies
│   ├── components/
│   │   ├── QuizScreen.tsx            # Quiz display component
│   │   ├── ResultsScreen.tsx         # Results display component
│   │   └── LoadingSpinner.tsx        # Loading indicator
│   ├── lib/
│   │   ├── api.ts                    # API client & endpoints
│   │   └── hooks.ts                  # Custom React hooks
│   ├── styles/
│   │   └── globals.css               # Global styles
│   ├── public/                       # Static assets
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── .env.local                    # Frontend env
│   └── .env.example                  # Example env file
│
├── README.md                         # This file
├── ARCHITECTURE.md                   # Detailed architecture docs
├── IMPLEMENTATION_GUIDE.md           # Implementation details
├── SECURITY_REVIEW.md                # Security considerations
├── TEST_CASES.md                     # Testing documentation
└── LICENSE                           # ISC License
```

---

## 💻 Technologies Used

### Backend
- **Node.js v24.14.0**: JavaScript runtime
- **Express.js v4.18.2**: Web framework
- **TypeScript v5.3.3**: Type safety
- **Helmet.js v7.1.0**: Security headers
- **CORS v8.x**: Cross-origin resource sharing
- **Morgan v1.10.0**: HTTP request logging
- **Express Rate Limit v7.1.5**: Rate limiting
- **Express Validator v7.0.1**: Input validation
- **Dotenv v16.3.1**: Environment configuration

### Frontend
- **Next.js v15.0.0**: React framework
- **React v19.0.0**: UI library
- **TypeScript v5.3.3**: Type safety
- **Axios v1.6.2**: HTTP client
- **Tailwind CSS v3.4.0**: Utility CSS framework
- **React Hooks**: State management

### AI & LLM
- **HuggingFace Inference API**: LLM provider
- **Falcon-7B**: Recommended language model
- **OpenAI-compatible endpoints**: API integration

### Development Tools
- **Nodemon v3.0.2**: Auto-reload development server
- **Jest v29.7.0**: Testing framework
- **Supertest v6.3.3**: HTTP testing
- **ESLint v8.54.0**: Code linting

---

## 🔴 Challenges Faced

### 1. **HuggingFace API Access & Rate Limiting**
**Challenge**: Not all HuggingFace models are available through the free/Pro tier API
- Some models require specific provider enablement
- Rate limits on inference endpoints
- Model availability varies by region

**Solution**:
- Implemented intelligent fallback system
- Automatic switching to mock mode when API unavailable
- Maintains user experience without interruption
- Tested with multiple models to find optimal availability

### 2. **Port Conflicts & Process Management**
**Challenge**: Multiple Node processes accumulating, causing port binding errors
- Old processes holding ports preventing new deployments
- Environment variables not reloading properly
- Cross-platform (Windows/WSL) process management issues

**Solution**:
- Implemented comprehensive process cleanup
- Used distinct ports for different components
- Force reload environment variables
- Clear caching between restarts

### 3. **Cross-Origin Resource Sharing (CORS)**
**Challenge**: Frontend couldn't communicate with backend due to security headers
- Helmet security middleware blocking cross-origin requests
- OpenAPI policy restrictions

**Solution**:
- Added CORS middleware with proper configuration
- Configured Helmet to allow cross-origin resource policy
- Enabled development-friendly CORS settings
- Proper error handling for failed requests

### 4. **API Endpoint Mismatch**
**Challenge**: Frontend calling wrong API endpoints
- Next.js API routes vs backend Express routes
- Path inconsistencies between frontend and backend
- Hardcoded URLs not matching actual implementation

**Solution**:
- Standardized API paths across codebase
- Created API client wrapper with baseURL
- Updated proxy routes to correct backend endpoints
- Implemented environment-based URL configuration

### 5. **JSON Parsing & LLM Response Handling**
**Challenge**: LLM responses not always valid JSON format
- GPT models sometimes returning partial responses
- Streaming responses difficult to parse
- Timeout issues with large responses

**Solution**:
- Implemented safe JSON parsing utility
- Added response validation and cleanup
- Implemented retry logic with exponential backoff
- Proper error handling and fallback responses

### 6. **Prompt Engineering for Multiple Tasks**
**Challenge**: Creating consistent prompts for diverse AI tasks
- Quiz generation requires different structure than roadmap
- Maintaining consistency across topic domains
- Balancing specificity vs. generalization

**Solution**:
- Created modular prompt templates
- Task-specific prompt builders
- Dynamic prompt generation based on context
- Testing with multiple topics and scenarios

### 7. **Performance & Response Time**
**Challenge**: LLM API calls taking 10-30+ seconds
- User experience degraded with slow responses
- Timeout issues on slower connections
- Need for loading indicators

**Solution**:
- Implemented timeout configuration (45 seconds)
- Added loading spinners and progress indicators
- Optimized prompt length for faster inference
- Implemented request caching where applicable

### 8. **Comprehensive 60-Day Roadmap Generation**
**Challenge**: Generating detailed, structured 60-day plans for any topic
- Ensuring consistency across different topics
- Covering all relevant subtopics
- Including realistic career information
- Providing specific projects and milestones

**Solution**:
- Created detailed roadmap prompt template
- Phase-based structure (4 x 15-day phases)
- Topic-agnostic approach with variables
- Included real salary data and job roles
- Added performance milestones every 2 weeks

---

## 🚀 Future Improvements

### Phase 1: Enhanced Learning Features (Q3 2024)
- [ ] **Interactive Exercises**: Code playgrounds for programming topics
- [ ] **Video Integration**: Embed tutorial videos in roadmaps
- [ ] **Discussion Forum**: Peer-to-peer learning community
- [ ] **Progress Tracking**: Visual progress dashboard
- [ ] **Downloadable Roadmaps**: PDF export of learning plans
- [ ] **Difficulty Adjustment**: Dynamic question difficulty based on user level

### Phase 2: Personalization & Analytics (Q4 2024)
- [ ] **User Accounts**: Save progress, history, and preferences
- [ ] **Learning Analytics**: Track progress over time
- [ ] **Personalized Recommendations**: AI suggests topics based on interests
- [ ] **Learning Style Detection**: Adapt content to visual/kinesthetic/auditory learners
- [ ] **Spaced Repetition**: Intelligent review scheduling
- [ ] **Skill Tree Visualization**: Visual representation of learning progress

### Phase 3: Advanced AI Features (Q1 2025)
- [ ] **Multi-language Support**: Support for non-English topics
- [ ] **Real-time Feedback**: Live coding feedback for programming topics
- [ ] **Mentor Matching**: Connect learners with mentors in community
- [ ] **Career Path Planner**: Extended roadmaps connecting multiple skills
- [ ] **Interview Prep**: Interview question generation and feedback
- [ ] **Advanced Judge Service**: Sophisticated answer validation

### Phase 4: Enterprise Features (Q2 2025)
- [ ] **Admin Dashboard**: Manage users, topics, and content
- [ ] **Team Learning**: Collaborative learning paths for groups
- [ ] **Custom Curriculum**: Organizations can create custom learning paths
- [ ] **Certification Program**: Badges and certificates for completion
- [ ] **API Tier System**: Freemium model with premium features
- [ ] **White Label Option**: Customize branding for enterprise clients

### Phase 5: Infrastructure & Deployment (Ongoing)
- [ ] **Database Integration**: PostgreSQL for persistence
- [ ] **Redis Caching**: Performance optimization
- [ ] **Microservices Architecture**: Scalability improvements
- [ ] **Docker Containerization**: Easy deployment
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Cloud Deployment**: AWS/GCP/Azure deployment guides
- [ ] **Monitoring & Logging**: Application performance monitoring
- [ ] **Load Balancing**: Handle increased traffic

### Phase 6: Mobile App (Q3 2025)
- [ ] **React Native App**: iOS and Android versions
- [ ] **Offline Mode**: Work without internet
- [ ] **Push Notifications**: Learning reminders
- [ ] **Mobile-Optimized UI**: Native mobile experience
- [ ] **Sync Across Devices**: Seamless multi-device experience

### Research Initiatives
- [ ] **Machine Learning Optimization**: Use ML to predict learner success
- [ ] **Adaptive Learning Algorithms**: Personalize learning paths
- [ ] **Natural Language Understanding**: Better answer evaluation
- [ ] **Curriculum Research**: Evidence-based learning effectiveness
- [ ] **Learning Science Integration**: Evidence-based learning strategies

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/ai-learning-coach.git
   cd ai-learning-coach
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Link related issues
   - Request review from maintainers

### Code Standards
- Use TypeScript for type safety
- Follow existing naming conventions
- Add comments for complex logic
- Write unit tests for new features
- Update README for significant changes

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

```
ISC License

Copyright (c) 2024 AI Learning Coach Contributors

Permission to use, copy, modify, and/or distribute this software for any purpose 
with or without fee is hereby granted, provided that the above copyright notice 
and this permission notice appear in all copies.
```

---

## 📞 Support & Contact

- **Issues**: Open a GitHub issue for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- **Security**: Report security issues to security@ailearningcoach.dev

---

## 🙏 Acknowledgments

- **HuggingFace** for providing LLM inference API
- **OpenAI** for prompt engineering inspiration
- **React & Next.js** communities for excellent frameworks
- **Contributors** who help improve this project
- **Learners** who test and provide feedback

---

## 📊 Project Statistics

- **Lines of Code**: 3,000+
- **Components**: 50+
- **API Endpoints**: 2 main routes
- **Test Coverage**: Ongoing
- **Languages**: TypeScript, JavaScript
- **Development Time**: 2-3 months
- **Latest Version**: 1.0.0

---

**Made with ❤️ by the AI Learning Coach Team**

⭐ If this project helped you, please consider giving it a star!
