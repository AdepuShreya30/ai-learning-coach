export const validateTopic = (topic: string): boolean => {
  return topic.length >= 3 && topic.length <= 100;
};

export const formatScore = (score: number): string => {
  return `${Math.round(score)}%`;
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-blue-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-red-500';
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-blue-100';
  if (score >= 40) return 'bg-yellow-100';
  return 'bg-red-100';
};

export const getPerformanceMessage = (score: number): string => {
  if (score >= 80) return 'Excellent work! You have a strong understanding.';
  if (score >= 60) return 'Good job! You understand most concepts.';
  if (score >= 40) return 'Not bad, but there\'s room for improvement.';
  return 'Keep practicing! You\'ll improve with more effort.';
};
