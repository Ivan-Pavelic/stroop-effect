"use client";

import { useEffect } from 'react';
import { Button } from './ui/button';

interface FeedbackScreenProps {
  correct: boolean;
  score: number;
  streak: number;
  onNext: () => void;
}

export function FeedbackScreen({ correct, score, streak, onNext }: FeedbackScreenProps) {
  // Auto-advance after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div 
      className={`flex flex-col items-center justify-center min-h-screen text-center px-8 transition-colors duration-300 ${
        correct ? 'bg-green-50' : 'bg-red-50'
      }`}
    >
      {/* Feedback Icon */}
      <div className="text-8xl mb-8">
        {correct ? '✓' : '✗'}
      </div>

      {/* Feedback Message */}
      <h1 
        className={`mb-8 text-6xl md:text-8xl font-bold ${
          correct ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {correct ? 'Correct!' : 'Wrong!'}
      </h1>

      {/* Streak Display */}
      {correct && streak > 1 && (
        <div className="text-3xl text-orange-500 mb-8">
          🔥 {streak} in a row!
        </div>
      )}

      {/* Score */}
      <div className="text-2xl text-gray-600 mb-12">
        Score: {score}
      </div>

      {/* Manual Next Button (in case auto-advance fails) */}
      <Button
        onClick={onNext}
        className={`w-full max-w-md h-16 text-white text-2xl font-semibold rounded-xl ${
          correct ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        Continue
      </Button>

      <p className="mt-4 text-gray-400">
        Auto-continuing...
      </p>
    </div>
  );
}