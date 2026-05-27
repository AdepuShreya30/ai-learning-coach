'use client';

import { EvaluationResult } from '@/lib/types';
import { formatScore, getScoreColor, getScoreBgColor, getPerformanceMessage } from '@/lib/utils';

interface ResultsScreenProps {
  topic: string;
  results: EvaluationResult;
  onNewTopic: () => void;
}

export default function ResultsScreen({ topic, results, onNewTopic }: ResultsScreenProps) {
  const { analysis, coaching, roadmap } = results;
  const scoreColor = getScoreColor(analysis.score);
  const scoreBgColor = getScoreBgColor(analysis.score);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          Your Results for <span className="text-gradient">{topic}</span>
        </h2>
        <p className="text-gray-400">
          Here&apos;s your personalized analysis and learning plan
        </p>
      </div>

      {/* Score Card */}
      <div className={`card-hover ${scoreBgColor} border-2 border-transparent`}>
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Overall Score</p>
          <div className={`text-7xl font-bold ${scoreColor} mb-6`}>
            {formatScore(analysis.score)}
          </div>
          <p className="text-lg text-gray-300">
            {getPerformanceMessage(analysis.score)}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="card-hover">
        <h3 className="text-2xl font-bold mb-4 text-gradient">Performance Summary</h3>
        <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="card-hover">
          <h3 className="text-xl font-bold mb-4 text-success flex items-center">
            <span className="text-2xl mr-2">✓</span> Strengths
          </h3>
          {analysis.strengths.length > 0 ? (
            <ul className="space-y-3">
              {analysis.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="text-success font-bold mt-1">•</span>
                  <span className="text-gray-300">{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No specific strengths identified yet</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="card-hover">
          <h3 className="text-xl font-bold mb-4 text-warning flex items-center">
            <span className="text-2xl mr-2">⚠</span> Areas to Improve
          </h3>
          {analysis.weak_topics.length > 0 ? (
            <ul className="space-y-3">
              {analysis.weak_topics.map((weakness, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="text-warning font-bold mt-1">•</span>
                  <span className="text-gray-300">{weakness}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No specific weaknesses identified</p>
          )}
        </div>
      </div>

      {/* Coaching Response */}
      <div className="card-hover">
        <h3 className="text-2xl font-bold mb-4 text-gradient">
          {analysis.score < 50 ? '🎓 Beginner Coaching' : '🚀 Advanced Challenges'}
        </h3>
        <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
            {coaching}
          </p>
        </div>
      </div>

      {/* Learning Roadmap */}
      <div className="card-hover">
        <h3 className="text-2xl font-bold mb-4 text-gradient">📅 Your 60-Day Learning Roadmap</h3>
        <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
            {roadmap}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card bg-gray-800/50 border-gray-600">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.print()}
            className="btn-outline"
          >
            🖨️ Print Results
          </button>
          <button
            onClick={onNewTopic}
            className="btn-primary"
          >
            📚 Learn Another Topic
          </button>
        </div>
      </div>
    </div>
  );
}
