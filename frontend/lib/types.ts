export interface Question {
  id: number;
  category?: string;
  question: string;
}

export interface Analysis {
  score: number;
  weak_topics: string[];
  strengths: string[];
  summary: string;
}

export interface RoadmapPhase {
  title?: string;
  overview?: string;
  checkpoint?: string;
  objectives?: string[];
  topics?: string[];
  projects?: string[];
  tools_and_tech?: string[];
  resources?: string[];
  daily_breakdown?: Record<string, string>;
}

export interface JobRole {
  title?: string;
  required_competencies?: string[];
  estimated_experience?: string;
}

export interface Roadmap {
  duration_days?: number;
  skill_level_start?: string;
  skill_level_end?: string;
  personalization_notes?: string;
  phase_1?: RoadmapPhase;
  phase_2?: RoadmapPhase;
  phase_3?: RoadmapPhase;
  phase_4?: RoadmapPhase;
  job_roles?: {
    junior_developer?: JobRole;
    mid_level?: JobRole;
    senior_expert?: JobRole;
  };
  success_metrics?: Record<string, string>;
  estimated_time_commitment?: string;
  next_steps_after_60_days?: string[];
}

export interface EvaluationResult {
  analysis: Analysis;
  coaching: string;
  roadmap: string | Roadmap | Record<string, unknown>;
  full_evaluation?: Record<string, unknown>;
  next_steps?: string[];
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
