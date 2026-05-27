'use client';

import { useState } from 'react';
import { useAiCoach } from '@/lib/hooks';
import Header from '@/components/Header';
import TopicInput from '@/components/TopicInput';
import LoadingScreen from '@/components/LoadingScreen';
import QuizScreen from '@/components/QuizScreen';
import ResultsScreen from '@/components/ResultsScreen';
import ErrorAlert from '@/components/ErrorAlert';

export default function Home() {
  const { state, setTopic, generateQuestions, submitAnswers, reset } = useAiCoach();

  const handleTopicSubmit = async (topic: string) => {
    setTopic(topic);
    await generateQuestions(topic);
  };

  const handleQuizSubmit = async (answers: string[]) => {
    await submitAnswers(answers);
  };

  return (
    <main className="min-h-screen bg-gradient-dark">
      <Header />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {state.error && <ErrorAlert message={state.error} />}

        {state.stage === 'topic' && (
          <TopicInput onSubmit={handleTopicSubmit} />
        )}

        {state.stage === 'loading' && (
          <LoadingScreen topic={state.topic} />
        )}

        {state.stage === 'quiz' && (
          <QuizScreen
            topic={state.topic}
            questions={state.questions}
            onSubmit={handleQuizSubmit}
          />
        )}

        {state.stage === 'results' && state.results && (
          <ResultsScreen
            topic={state.topic}
            results={state.results}
            onNewTopic={reset}
          />
        )}
      </div>
    </main>
  );
}
