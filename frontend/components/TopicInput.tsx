'use client';

import { useState } from 'react';
import { validateTopic } from '@/lib/utils';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
}

export default function TopicInput({ onSubmit }: TopicInputProps) {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateTopic(topic)) {
      setError('Topic must be between 3 and 100 characters');
      return;
    }

    onSubmit(topic);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-hover">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">What do you want to learn?</h2>
          <p className="text-gray-300">
            Enter any topic and our AI will create personalized quiz questions to assess your knowledge.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-3">
              Learning Topic
            </label>
            <input
              id="topic"
              type="text"
              className="input-field"
              placeholder="e.g., Machine Learning, Python Basics, Quantum Computing"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSubmit(e);
              }}
            />
            {error && <p className="text-error text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={!validateTopic(topic)}
          >
            Generate Quiz Questions
          </button>

          <p className="text-center text-gray-400 text-sm">
            💡 Tip: Be specific for better questions (e.g., &quot;React Hooks&quot; instead of just &quot;React&quot;)
          </p>
        </form>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-3">🎓</div>
          <h3 className="font-semibold mb-2">AI-Generated Quiz</h3>
          <p className="text-gray-400 text-sm">
            Get 3 customized questions tailored to your topic
          </p>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold mb-2">Performance Analysis</h3>
          <p className="text-gray-400 text-sm">
            Receive detailed feedback on strengths and weaknesses
          </p>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-semibold mb-2">Learning Roadmap</h3>
          <p className="text-gray-400 text-sm">
            Get a 7-day personalized study plan
          </p>
        </div>
      </div>
    </div>
  );
}
