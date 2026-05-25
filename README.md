# AI Learning Coach

An intelligent, personalized learning system powered by AI that assesses your knowledge, provides targeted coaching, and creates custom learning roadmaps.

## Features

- 🎓 **AI-Generated Quizzes**: Dynamic quiz questions tailored to any topic
- 📊 **Performance Analysis**: Detailed assessment of strengths and weak areas
- 🎯 **Adaptive Coaching**: Beginner-friendly or advanced based on performance
- 📅 **Personalized Roadmap**: 7-day customized learning plan
- 🎨 **Modern UI**: Beautiful, responsive interface with dark mode
- 🚀 **Production-Ready**: Built with best practices and error handling

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

## Environment Setup

### Backend (.env)
```
PORT=8080
HF_TOKEN=hf_your_token
LLM_MODEL=meta-llama/Meta-Llama-3-8B-Instruct:novita
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

## AI Workflow

1. User enters topic
2. AI generates 3 personalized quiz questions
3. User answers all questions
4. AI analyzes answers and scores (0-100)
5. IF score < 50%: AI generates beginner explanations
   ELSE: AI generates advanced challenges
6. AI creates 7-day personalized learning roadmap
7. Results displayed with recommendations

## API Endpoints

**POST /api/coach/generate-questions**
- Generates quiz questions for a topic

**POST /api/coach/evaluate**
- Analyzes answers and provides coaching

## Technologies

- Node.js + Express (Backend)
- Next.js + React (Frontend)
- HuggingFace Inference API
- Tailwind CSS
- TypeScript

## License

ISC
