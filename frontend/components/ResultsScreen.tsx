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
        <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 space-y-6">
          {/* Check if roadmap is an object or string */}
          {typeof roadmap === 'string' ? (
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {roadmap}
            </p>
          ) : roadmap && typeof roadmap === 'object' ? (
            <div className="space-y-6">
              {/* Roadmap Overview */}
              <div>
                <h4 className="text-lg font-semibold text-primary mb-2">Roadmap Overview</h4>
                <p className="text-gray-300">
                  <strong>Duration:</strong> {roadmap.duration_days} days |
                  <strong className="ml-2">Starting Level:</strong> {roadmap.skill_level_start} |
                  <strong className="ml-2">Target Level:</strong> {roadmap.skill_level_end}
                </p>
                {roadmap.personalization_notes && (
                  <p className="text-gray-400 text-sm mt-2 italic">{roadmap.personalization_notes}</p>
                )}
              </div>

              {/* Phase 1 */}
              {roadmap.phase_1 && (
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">{roadmap.phase_1.title}</h4>
                  <p className="text-gray-300 mb-2">{roadmap.phase_1.overview}</p>
                  <div className="text-sm text-gray-400">
                    <p><strong>Checkpoint:</strong> {roadmap.phase_1.checkpoint}</p>
                  </div>
                </div>
              )}

              {/* Phase 2 */}
              {roadmap.phase_2 && (
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">{roadmap.phase_2.title}</h4>
                  <p className="text-gray-300 mb-2">{roadmap.phase_2.overview}</p>
                  <div className="text-sm text-gray-400">
                    <p><strong>Checkpoint:</strong> {roadmap.phase_2.checkpoint}</p>
                  </div>
                </div>
              )}

              {/* Phase 3 */}
              {roadmap.phase_3 && (
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-lg font-semibold text-green-400 mb-2">{roadmap.phase_3.title}</h4>
                  <p className="text-gray-300 mb-2">{roadmap.phase_3.overview}</p>
                  <div className="text-sm text-gray-400">
                    <p><strong>Checkpoint:</strong> {roadmap.phase_3.checkpoint}</p>
                  </div>
                </div>
              )}

              {/* Phase 4 */}
              {roadmap.phase_4 && (
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-2">{roadmap.phase_4.title}</h4>
                  <p className="text-gray-300 mb-2">{roadmap.phase_4.overview}</p>
                  <div className="text-sm text-gray-400">
                    <p><strong>Checkpoint:</strong> {roadmap.phase_4.checkpoint}</p>
                  </div>
                </div>
              )}

              {/* Job Roles */}
              {roadmap.job_roles && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-lg font-semibold text-gradient mb-3">💼 Career Paths</h4>
                  <div className="space-y-3">
                    {roadmap.job_roles.junior_developer && (
                      <div>
                        <p className="font-semibold text-green-400">{roadmap.job_roles.junior_developer.title}</p>
                        <p className="text-sm text-gray-400">{roadmap.job_roles.junior_developer.estimated_experience}</p>
                      </div>
                    )}
                    {roadmap.job_roles.mid_level && (
                      <div>
                        <p className="font-semibold text-blue-400">{roadmap.job_roles.mid_level.title}</p>
                        <p className="text-sm text-gray-400">{roadmap.job_roles.mid_level.estimated_experience}</p>
                      </div>
                    )}
                    {roadmap.job_roles.senior_expert && (
                      <div>
                        <p className="font-semibold text-purple-400">{roadmap.job_roles.senior_expert.title}</p>
                        <p className="text-sm text-gray-400">{roadmap.job_roles.senior_expert.estimated_experience}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Time Commitment */}
              {roadmap.estimated_time_commitment && (
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">⏱️ <strong>Recommended Time:</strong> {roadmap.estimated_time_commitment}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 italic">Loading roadmap...</p>
          )}
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
