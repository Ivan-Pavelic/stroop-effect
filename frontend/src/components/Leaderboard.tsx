"use client";

import { Button } from './ui/button';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  avgTime: number;
  accuracy: number;
}

interface LeaderboardProps {
  onBack: () => void;
}

// Mock data - will be replaced with real API data later
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'CognitiveKing', score: 98, avgTime: 1.2, accuracy: 100 },
  { rank: 2, name: 'SpeedyBrain', score: 95, avgTime: 1.4, accuracy: 95 },
  { rank: 3, name: 'StroopMaster', score: 92, avgTime: 1.5, accuracy: 92 },
  { rank: 4, name: 'QuickThinker', score: 89, avgTime: 1.7, accuracy: 89 },
  { rank: 5, name: 'ColorChamp', score: 87, avgTime: 1.8, accuracy: 90 },
  { rank: 6, name: 'BrainBooster', score: 85, avgTime: 1.9, accuracy: 85 },
  { rank: 7, name: 'FastFocus', score: 83, avgTime: 2.0, accuracy: 87 },
  { rank: 8, name: 'MindMaster', score: 80, avgTime: 2.1, accuracy: 80 },
  { rank: 9, name: 'SwiftMind', score: 78, avgTime: 2.3, accuracy: 82 },
  { rank: 10, name: 'NeuralNinja', score: 75, avgTime: 2.5, accuracy: 75 },
];

export function Leaderboard({ onBack }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="flex flex-col min-h-screen px-8 py-12 bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-gray-900 text-2xl font-semibold">Leaderboard</h2>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 space-y-3 max-w-2xl mx-auto w-full overflow-auto">
        {mockLeaderboard.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${getRankBg(entry.rank)}`}
          >
            {/* Rank */}
            <div className="w-12 flex items-center justify-center text-xl">
              {getRankIcon(entry.rank)}
            </div>

            {/* Player Name */}
            <div className="flex-1">
              <div className="text-gray-900 font-medium">{entry.name}</div>
            </div>

            {/* Stats - Desktop */}
            <div className="hidden sm:flex gap-6 text-sm">
              <div className="text-center">
                <div className="text-gray-400">Score</div>
                <div className="text-gray-900 font-semibold">{entry.score}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Speed</div>
                <div className="text-gray-900 font-semibold">{entry.avgTime}s</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Accuracy</div>
                <div className="text-gray-900 font-semibold">{entry.accuracy}%</div>
              </div>
            </div>

            {/* Stats - Mobile */}
            <div className="sm:hidden">
              <div className="text-gray-900 font-semibold">{entry.score}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="mt-8 max-w-md mx-auto w-full">
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-14 border-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
        >
          Back to Menu
        </Button>
      </div>

      <p className="text-center text-gray-400 mt-6 text-sm">
        Global rankings updated daily
      </p>
    </div>
  );
}