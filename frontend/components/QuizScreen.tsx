'use client';

import { useState } from 'react';
import { Question } from '@/lib/types';

interface QuizScreenProps {
  topic: string;
  questions: Question[];
  onSubmit: (answers: string[]) => void;
}

export default function QuizScreen({ topic, questions, onSubmit }: QuizScreenProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => !a.trim())) {
      alert('Please answer all questions before submitting');
      return;
    }
    setIsSubmitting(true);
    await onSubmit(answers);
  };

  const allAnswered = answers.every((a) => a.trim().length > 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Quiz: <span className="text-gradient">{topic}</span>
        </h2>
        <p className="text-gray-400">
          Answer all {questions.length} questions honestly. Your answers help us create the best personalized coaching.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="card-hover">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white font-semibold">
                  {index + 1}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
                <textarea
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Enter your answer here..."
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="card bg-gray-800/50 border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">
                Questions answered: <span className="text-primary font-semibold">
                  {answers.filter((a) => a.trim()).length}/{questions.length}
                </span>
              </p>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={!allAnswered || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answers'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
