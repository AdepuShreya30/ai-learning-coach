'use client';

import { useState, useCallback } from 'react';
import { aiCoachApi, Question } from './api';
import { AppState, EvaluationResult } from './types';

export const useAiCoach = () => {
  const [state, setState] = useState<AppState>({
    stage: 'topic',
    topic: '',
    questions: [],
    answers: [],
    error: undefined,
  });

  const setTopic = useCallback((topic: string) => {
    setState((prev) => ({ ...prev, topic, error: undefined }));
  }, []);

  const setAnswers = useCallback((answers: string[]) => {
    setState((prev) => ({ ...prev, answers }));
  }, []);

  const generateQuestions = useCallback(async (topic: string) => {
    setState((prev) => ({ ...prev, stage: 'loading', topic, error: undefined }));
    try {
      const response = await aiCoachApi.generateQuestions(topic);
      setState((prev) => ({
        ...prev,
        stage: 'quiz',
        questions: response.data.questions,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate questions';
      setState((prev) => ({
        ...prev,
        stage: 'topic',
        error: errorMessage,
      }));
    }
  }, []);

  const submitAnswers = useCallback(async (answers: string[]) => {
    setState((prev) => ({ ...prev, stage: 'loading', answers, error: undefined }));
    try {
      const response = await aiCoachApi.evaluateAnswers(state.topic, state.questions, answers);
      setState((prev) => ({
        ...prev,
        stage: 'results',
        results: response.data,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to evaluate answers';
      setState((prev) => ({
        ...prev,
        stage: 'quiz',
        error: errorMessage,
      }));
    }
  }, [state.topic, state.questions]);

  const reset = useCallback(() => {
    setState({
      stage: 'topic',
      topic: '',
      questions: [],
      answers: [],
      error: undefined,
    });
  }, []);

  return {
    state,
    setTopic,
    setAnswers,
    generateQuestions,
    submitAnswers,
    reset,
  };
};
