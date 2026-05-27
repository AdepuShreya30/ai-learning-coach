export interface Question {
  id: number;
  question: string;
}

export interface Analysis {
  score: number;
  weak_topics: string[];
  strengths: string[];
  summary: string;
}

export interface EvaluationResult {
  analysis: Analysis;
  coaching: string;
  roadmap: string;
}

export type AppStage = 'topic' | 'loading' | 'quiz' | 'results';

export interface AppState {
  stage: AppStage;
  topic: string;
  questions: Question[];
  answers: string[];
  results?: EvaluationResult;
  error?: string;
}
