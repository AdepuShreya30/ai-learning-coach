import axios, { AxiosInstance } from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface GenerateQuestionsRequest {
  topic: string;
}

export interface Question {
  id: number;
  question: string;
}

export interface GenerateQuestionsResponse {
  success: boolean;
  data: {
    topic: string;
    questions: Question[];
    judgeValidation?: Record<string, unknown>;
  };
}

export interface EvaluateRequest {
  topic: string;
  questions: Question[];
  answers: string[];
}

export interface Analysis {
  score: number;
  weak_topics: string[];
  strengths: string[];
  summary: string;
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

export const aiCoachApi = {
  generateQuestions: async (topic: string): Promise<GenerateQuestionsResponse> => {
    const response = await apiClient.post<GenerateQuestionsResponse>(
      '/api/coach/generate-questions',
      { topic } as GenerateQuestionsRequest
    );
    return response.data;
  },

  evaluateAnswers: async (
    topic: string,
    questions: Question[],
    answers: string[]
  ): Promise<EvaluateResponse> => {
    const response = await apiClient.post<EvaluateResponse>(
      '/api/coach/evaluate',
      {
        topic,
        questions,
        answers,
      } as EvaluateRequest
    );
    return response.data;
  },
};

export default apiClient;
