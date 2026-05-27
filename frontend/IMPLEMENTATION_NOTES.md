# Frontend Implementation Notes

Technical documentation and implementation details for the AI Learning Coach frontend.

## Architecture Overview

### State Management

The application uses a custom hook-based state management pattern (`useAiCoach`):

```typescript
interface AppState {
  stage: 'topic' | 'loading' | 'quiz' | 'results';
  topic: string;
  questions: Question[];
  answers: string[];
  results?: EvaluationResult;
  error?: string;
}
```

This approach:
- ✅ Keeps state localized to the main page
- ✅ Eliminates complexity of Redux/Context overhead
- ✅ Easy to test and debug
- ✅ Minimal bundle size impact

### Component Hierarchy

```
page.tsx (Main Container)
├── Header (Static Header)
├── TopicInput (Stage 1)
├── LoadingScreen (Stage 2)
├── QuizScreen (Stage 3)
├── ResultsScreen (Stage 4)
└── ErrorAlert (Conditional)
```

Each component is:
- Fully typed with TypeScript
- Self-contained and reusable
- Pure (no side effects beyond rendering)
- Properly memoized for performance

## Data Flow

### Quiz Generation Flow

```
User Input (topic)
    ↓
validateTopic() [lib/utils.ts]
    ↓
generateQuestions() [lib/hooks.ts]
    ↓
aiCoachApi.generateQuestions() [lib/api.ts]
    ↓
POST /api/coach/generate-questions
    ↓
Forward to Backend
    ↓
Update state.questions
    ↓
Render QuizScreen with questions
```

### Evaluation Flow

```
User Answers Quiz
    ↓
submitAnswers() [lib/hooks.ts]
    ↓
aiCoachApi.evaluateAnswers() [lib/api.ts]
    ↓
POST /api/coach/evaluate
    ↓
Forward to Backend
    ↓
Update state.results
    ↓
Render ResultsScreen with analysis
```

## API Integration

### Request Handling

Axios configured with:
- Base URL from environment variables
- 50-second timeout for long operations
- JSON content type headers
- Error response interceptor for logging

```typescript
// All requests include these headers
headers: {
  'Content-Type': 'application/json',
}

// Timeout set to 50 seconds to accommodate:
// - Question generation: 2-3s
// - Answer analysis: 2-3s
// - Coaching: 1-2s
// - Roadmap: 1-2s
// - Network latency: 0.5-2s
// Total: 6-12s (within timeout)
```

### Type Safety

All API responses are fully typed:

```typescript
export interface GenerateQuestionsResponse {
  success: boolean;
  data: {
    topic: string;
    questions: Question[];
    judgeValidation?: Record<string, unknown>;
  };
}

export interface EvaluateResponse {
  success: boolean;
  data: {
    analysis: Analysis;
    coaching: string;
    roadmap: string;
    judgeEnhancement?: Record<string, unknown>;
  };
}
```

## Component Details

### TopicInput Component

Validation rules:
- Minimum length: 3 characters
- Maximum length: 100 characters
- No special validation needed (backend validates)

Features:
- Real-time error clearing
- Submit on Enter key
- Disabled button until valid
- Helpful placeholder and tips

```typescript
// Validates on change and clears errors
onChange={(e) => {
  setTopic(e.target.value);
  setError('');
}}

// Submit on Enter key
onKeyPress={(e) => {
  if (e.key === 'Enter') handleSubmit(e);
}}
```

### QuizScreen Component

Tracks answer state:
- Array of strings (one per question)
- Enables submit only when all answered
- Shows progress counter

```typescript
const allAnswered = answers.every((a) => a.trim().length > 0);

// Only enable submit button when all questions answered
disabled={!allAnswered || isSubmitting}
```

### ResultsScreen Component

Displays comprehensive results:
- Score with color-coded background
- Strengths and weaknesses lists
- Coaching text (beginner or advanced)
- Full learning roadmap
- Print and retry buttons

Color coding:
- 80+: Green (excellent)
- 60-79: Blue (good)
- 40-59: Yellow (okay)
- 0-39: Red (needs improvement)

### Error Handling

Errors are caught and displayed:

```typescript
try {
  const response = await aiCoachApi.generateQuestions(topic);
  // Update state
} catch (error) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : 'Failed to generate questions';
  
  setState((prev) => ({
    ...prev,
    stage: 'topic',  // Return to topic input
    error: errorMessage,
  }));
}
```

Error states automatically clear when:
- Topic is changed
- New quiz is started
- Form input is focused

## Styling System

### Tailwind CSS Setup

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#7c3aed',    // Purple
      secondary: '#3b82f6',  // Blue
      success: '#10b981',    // Green
      warning: '#f59e0b',    // Amber
      error: '#ef4444',      // Red
      dark: '#1f2937',       // Dark gray
      light: '#f3f4f6',      // Light gray
    },
  },
}
```

### Custom Components (in globals.css)

```css
.btn-primary {
  @apply px-6 py-3 bg-gradient-primary text-white font-semibold 
         rounded-lg hover:shadow-lg transition-all duration-200 
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.card {
  @apply bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700;
}

.input-field {
  @apply w-full px-4 py-3 bg-gray-700 border border-gray-600 
         rounded-lg text-white placeholder-gray-400 
         focus:outline-none focus:border-primary 
         focus:ring-2 focus:ring-purple-500/20 
         transition-all duration-200;
}
```

### Responsive Design

Uses Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Example:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* 1 column on mobile, 2 columns on md+ */}
</div>
```

## Performance Optimizations

### Code Splitting

Next.js automatically code splits at:
- Page level (each page is a separate bundle)
- Component level (with dynamic imports)

### Memoization

Components are functional and re-render optimally:
- Props are compared for changes
- Stable callbacks prevent unnecessary renders
- useCallback for event handlers

### Bundle Analysis

Current size estimates:
- Next.js core: ~70KB gzipped
- React: ~40KB gzipped
- Custom code: ~15KB gzipped
- Tailwind CSS: ~30KB gzipped
- **Total**: ~155KB gzipped

Optimize with:
```bash
npm install --save-dev @next/bundle-analyzer

# In next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({...})

# Run analysis
ANALYZE=true npm run build
```

## Testing

### Component Testing

Example using React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import TopicInput from '@/components/TopicInput';

test('displays error for short topic', () => {
  const { getByText } = render(
    <TopicInput onSubmit={jest.fn()} />
  );

  const input = screen.getByPlaceholderText(/Enter your topic/i);
  fireEvent.change(input, { target: { value: 'AI' } });

  expect(getByText(/must be between 3 and 100/i)).toBeInTheDocument();
});
```

### API Testing

Mock axios in tests:

```typescript
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('handles API errors gracefully', async () => {
  mockedAxios.post.mockRejectedValue(
    new Error('Backend unavailable')
  );

  // Test error handling
});
```

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills

No polyfills needed for:
- Fetch API (used by Axios)
- ES2020+ features
- CSS Grid/Flexbox

## Security Considerations

### Frontend Security

1. **No Sensitive Data in Client**
   - Never store API keys or tokens
   - Backend handles authentication
   - Sensitive data stays server-side

2. **Input Validation**
   - Client-side validation for UX only
   - Always validate on backend
   - Never trust user input

3. **CORS**
   - Backend must allow frontend origin
   - Configure in backend server.js

4. **Environment Variables**
   - Use `NEXT_PUBLIC_` only for client-safe variables
   - Sensitive keys must not be exposed
   - Never commit `.env.local` to git

## Debugging

### Development Tools

```bash
# Enable Next.js debug logs
DEBUG=next:* npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build analysis
npm run build -- --debug
```

### Browser DevTools

1. **Console**: Check for JavaScript errors
2. **Network**: Monitor API requests
3. **Elements**: Inspect HTML structure
4. **Application**: Check local storage (if added)

### Common Issues

#### Loading state never resolves
- Check backend is running
- Verify NEXT_PUBLIC_BACKEND_URL is correct
- Check browser console for CORS errors

#### Questions not displaying
- Verify API response structure
- Check Question interface matches backend
- Inspect network response in DevTools

#### Styling broken after deploy
- Ensure Tailwind CSS is built (`npm run build`)
- Check postcss.config.js exists
- Verify tailwind.config.ts is correct

## Future Enhancements

### Planned Features

1. **User Persistence**
   - Save results to localStorage/database
   - Track learning history
   - Export results as PDF

2. **Advanced UI**
   - Dark mode toggle
   - Animations and transitions
   - Mobile-optimized layout

3. **Performance**
   - Implement caching strategy
   - Add service worker for offline support
   - Optimize images and assets

4. **Analytics**
   - Track user behavior
   - Monitor performance metrics
   - Error tracking (Sentry)

## Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Backend API URL correct
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No linting errors: `npm run lint`
- [ ] Test on mobile devices
- [ ] Test all 4 stages of flow
- [ ] Test error scenarios
- [ ] Check browser console for errors
- [ ] Verify CORS configuration on backend
- [ ] Set up monitoring/error tracking
- [ ] Create deployment guide for team

## Maintenance

### Regular Tasks

- Update dependencies: `npm update`
- Security audit: `npm audit`
- Check for deprecations
- Monitor performance metrics
- Review error logs

### Version Management

Current versions:
- Next.js: 15.0.0+
- React: 19.0.0+
- TypeScript: 5.3.3+
- Tailwind CSS: 3.4.0+

Check for updates:
```bash
npm outdated
```

---

**Last Updated**: 2026-05-27  
**Maintained By**: AI Learning Coach Development Team
