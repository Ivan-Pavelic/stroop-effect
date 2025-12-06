"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { aiAPI } from '@/services/api';

interface GameState {
  currentRound: number;
  score: number;
  streak: number;
  answers: boolean[];
  startTime: number;
  roundTimes: number[];
}

interface AIAnalysis {
  cognitiveScore: number;
  level: string;
  levelColor: string;
  components: {
    accuracy: number;
    speed: number;
    consistency: number;
  };
  improvement: number;
  feedback: string;
  recommendations: string[];
}

interface ResultsScreenProps {
  gameState: GameState;
  totalRounds: number;
  gameMode: 'single' | 'multiplayer';
  onReturnToMenu: () => void;
  onPlayAgain: () => void;
}

export function ResultsScreen({ 
  gameState, 
  totalRounds, 
  onReturnToMenu, 
  onPlayAgain 
}: ResultsScreenProps) {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accuracy = Math.round((gameState.score / totalRounds) * 100);
  const avgTime = gameState.roundTimes.length > 0 
    ? Math.round(gameState.roundTimes.reduce((a, b) => a + b, 0) / gameState.roundTimes.length)
    : 0;

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await aiAPI.analyzePerformance({
          accuracy,
          avgTime,
          roundTimes: gameState.roundTimes,
          answers: gameState.answers,
          totalRounds
        });
        
        if (response.success) {
          setAiAnalysis(response.analysis);
        }
      } catch (err) {
        console.error('Failed to get AI analysis:', err);
        setError('Could not load AI analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [accuracy, avgTime, gameState.roundTimes, gameState.answers, totalRounds]);

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { text: "Outstanding! 🏆", color: "text-yellow-500" };
    if (accuracy >= 70) return { text: "Great job! 🌟", color: "text-green-500" };
    if (accuracy >= 50) return { text: "Good effort! 👍", color: "text-blue-500" };
    return { text: "Keep practicing! 💪", color: "text-orange-500" };
  };

  const performance = getPerformanceMessage();

  const getLevelColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-500';
      case 'blue': return 'text-blue-500';
      case 'yellow': return 'text-yellow-500';
      case 'orange': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-8 bg-gradient-to-b from-white to-gray-50">
      {/* Title */}
      <h2 className="text-gray-700 mb-2 text-2xl md:text-4xl font-semibold">
        Game Complete!
      </h2>

      {/* Performance Message */}
      <p className={`text-xl md:text-2xl mb-6 ${performance.color}`}>
        {performance.text}
      </p>

      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 w-full max-w-md">
        {/* Main Score */}
        <div className="mb-4">
          <div className="text-gray-500 text-base mb-1">Your Score</div>
          <div className="text-gray-900 text-5xl md:text-6xl font-bold">
            {gameState.score}/{totalRounds}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <div className="text-gray-400 text-sm">Accuracy</div>
            <div className="text-gray-900 text-xl font-semibold">{accuracy}%</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Avg. Time</div>
            <div className="text-gray-900 text-xl font-semibold">{avgTime}ms</div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      {loading ? (
        <div className="bg-blue-50 rounded-2xl p-6 mb-6 w-full max-w-md">
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-600">Analyzing your performance...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-orange-50 rounded-2xl p-6 mb-6 w-full max-w-md">
          <p className="text-orange-600">{error}</p>
        </div>
      ) : aiAnalysis ? (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 w-full max-w-md">
          <h3 className="text-gray-700 font-semibold mb-3 text-lg">🧠 AI Analysis</h3>
          
          {/* Cognitive Score */}
          <div className="mb-4">
            <div className="text-gray-500 text-sm">Cognitive Score</div>
            <div className={`text-4xl font-bold ${getLevelColor(aiAnalysis.levelColor)}`}>
              {aiAnalysis.cognitiveScore}
            </div>
            <div className={`text-sm ${getLevelColor(aiAnalysis.levelColor)}`}>
              {aiAnalysis.level}
            </div>
          </div>

          {/* Component Scores */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white rounded-lg p-2">
              <div className="text-gray-400 text-xs">Accuracy</div>
              <div className="text-gray-900 font-semibold">{aiAnalysis.components.accuracy}</div>
            </div>
            <div className="bg-white rounded-lg p-2">
              <div className="text-gray-400 text-xs">Speed</div>
              <div className="text-gray-900 font-semibold">{aiAnalysis.components.speed}</div>
            </div>
            <div className="bg-white rounded-lg p-2">
              <div className="text-gray-400 text-xs">Consistency</div>
              <div className="text-gray-900 font-semibold">{aiAnalysis.components.consistency}</div>
            </div>
          </div>

          {/* Feedback */}
          <p className="text-gray-600 text-sm mb-3">{aiAnalysis.feedback}</p>

          {/* Recommendations */}
          {aiAnalysis.recommendations.length > 0 && (
            <div className="text-left">
              <div className="text-gray-500 text-xs mb-1">Recommendations:</div>
              <ul className="text-gray-600 text-sm space-y-1">
                {aiAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        <Button
          onClick={onPlayAgain}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl"
        >
          Play Again
        </Button>
        
        <Button
          onClick={onReturnToMenu}
          className="w-full h-12 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 text-lg rounded-xl bg-white"
        >
          Back to Menu
        </Button>
      </div>
    </div>
  );
}