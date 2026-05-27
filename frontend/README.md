# AI Learning Coach - Frontend

A modern, responsive React/Next.js frontend for the AI Learning Coach application. Built with TypeScript, Tailwind CSS, and powered by a Node.js + Express backend.

## Features

- ✨ **Beautiful UI**: Modern gradient design with dark mode
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- ⚡ **Fast Performance**: Next.js optimizations and efficient state management
- 🎯 **4-Stage Workflow**: Topic → Loading → Quiz → Results
- 🎨 **Dark Mode Ready**: Professional dark theme with Tailwind CSS
- ♿ **Accessible**: Semantic HTML and ARIA labels
- 🔒 **Type-Safe**: Full TypeScript support

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Package Manager**: npm/yarn

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Header component
│   ├── TopicInput.tsx      # Topic input form
│   ├── LoadingScreen.tsx   # Loading animation
│   ├── QuizScreen.tsx      # Quiz questions
│   ├── ResultsScreen.tsx   # Results dashboard
│   └── ErrorAlert.tsx      # Error messages
├── lib/
│   ├── api.ts              # API client and types
│   ├── types.ts            # TypeScript types
│   ├── hooks.ts            # Custom React hooks
│   └── utils.ts            # Utility functions
├── public/                 # Static files
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Configure backend URL if needed
# Edit .env.local and set NEXT_PUBLIC_BACKEND_URL
```

### Development

```bash
# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

## API Integration

The frontend communicates with the backend API via axios through the `lib/api.ts` module:

### Endpoints

**POST /api/coach/generate-questions**
- Request: `{ topic: string }`
- Response: `{ questions: Question[], topic: string }`

**POST /api/coach/evaluate**
- Request: `{ topic: string, questions: Question[], answers: string[] }`
- Response: `{ analysis: Analysis, coaching: string, roadmap: string }`

## Component Overview

### Header
Global application header with branding and description.

### TopicInput
Form component for users to enter their learning topic with validation.

### LoadingScreen
Animated loading state while AI generates questions or processes evaluation.

### QuizScreen
Interactive quiz interface where users answer generated questions.

### ResultsScreen
Comprehensive results dashboard showing:
- Performance score
- Strengths and weaknesses
- AI coaching response
- 7-day learning roadmap
- Print and retry options

### ErrorAlert
Displays error messages to users with helpful context.

## Custom Hooks

### useAiCoach()
Main hook managing application state and API calls.

```typescript
const {
  state,           // Current app state
  setTopic,        // Set topic
  generateQuestions,  // Call API to generate questions
  submitAnswers,   // Submit answers
  reset            // Reset app state
} = useAiCoach();
```

## Styling

Uses Tailwind CSS utility classes with custom components defined in `globals.css`:

- `btn-primary`: Primary action button with gradient
- `btn-secondary`: Secondary action button
- `btn-outline`: Outline button style
- `card`: Base card styling
- `card-hover`: Card with hover effects
- `input-field`: Styled form input
- `text-gradient`: Gradient text effect

## Type Safety

All API responses and component props are fully typed with TypeScript:

```typescript
// API types
interface Question { id: number; question: string }
interface Analysis { score: number; weak_topics: string[]; ... }

// Component props are properly typed
interface TopicInputProps { onSubmit: (topic: string) => void }
```

## Performance Optimizations

- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- CSS-in-JS with Tailwind for minimal bundle size
- Memoization of expensive computations
- Lazy loading of components when needed

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub and connect repository to Vercel
# Vercel will automatically deploy on push
```

### Other Platforms

The frontend can be deployed to any Node.js hosting:

```bash
# Build
npm run build

# Start
npm start
```

Set environment variables in your hosting platform:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on the correct port (default: 8080)
- Check CORS configuration in backend
- Verify `NEXT_PUBLIC_BACKEND_URL` in `.env.local`

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (requires 18+)

## Future Enhancements

- [ ] User accounts and progress tracking
- [ ] Quiz history and analytics
- [ ] Offline support with PWA
- [ ] Real-time progress indicators
- [ ] Export results to PDF
- [ ] Mobile app (React Native)
- [ ] Multiplayer quiz challenges
- [ ] Integration with learning platforms

## License

ISC

## Support

For issues or questions:
1. Check the main project README
2. Review backend documentation
3. Open an issue in the project repository

---

**Last Updated**: 2026-05-27  
**Status**: Production-Ready
