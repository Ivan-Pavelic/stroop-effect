"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { leaderboardAPI } from '@/services/api';

interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  score: number;
  avgTime: number;
  accuracy: number;
}

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await leaderboardAPI.getLeaderboard(50); // Get top 50
        setLeaderboard(response.leaderboard || []);
      } catch (err: any) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Neuspješno učitavanje ljestvice');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);
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
    <div className="flex flex-col items-center min-h-screen text-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 bg-gradient-to-b from-white to-gray-50">
      {/* Title */}
      <h1 className="text-gray-900 mb-8 sm:mb-10 md:mb-12 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
        Ljestvica
      </h1>

      {/* Leaderboard List */}
      <div className="space-y-2 sm:space-y-3 max-w-2xl w-full overflow-auto mb-6 sm:mb-8 px-2">
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-lg">Učitavanje...</div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-lg">
            Još nema rezultata na ljestvici
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${getRankBg(entry.rank)}`}
            >
              {/* Rank */}
              <div className="w-10 sm:w-12 flex items-center justify-center text-lg sm:text-xl font-bold">
                {getRankIcon(entry.rank)}
              </div>

              {/* Player Name */}
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 font-semibold text-sm sm:text-base truncate">{entry.name}</div>
              </div>

              {/* Stats - Desktop */}
              <div className="hidden sm:flex gap-4 md:gap-6 text-xs sm:text-sm">
                <div className="text-center min-w-[60px]">
                  <div className="text-gray-400 mb-1">Score</div>
                  <div className="text-gray-900 font-bold">{entry.score}</div>
                </div>
                <div className="text-center min-w-[70px]">
                  <div className="text-gray-400 mb-1">Vrijeme</div>
                  <div className="text-gray-900 font-bold">{Math.round(entry.avgTime)}ms</div>
                </div>
                <div className="text-center min-w-[70px]">
                  <div className="text-gray-400 mb-1">Točnost</div>
                  <div className="text-gray-900 font-bold">{Math.round(entry.accuracy)}%</div>
                </div>
              </div>

              {/* Stats - Mobile */}
              <div className="sm:hidden flex flex-col items-end">
                <div className="text-gray-900 font-bold text-base">{entry.score}</div>
                <div className="text-gray-500 text-xs">{Math.round(entry.accuracy)}%</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Back Button */}
      <div className="max-w-md w-full px-2">
        <Button
          onClick={onBack}
          className="w-full h-12 sm:h-14 md:h-16 bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl md:text-2xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
        >
          Natrag na izbornik
        </Button>
      </div>

      <p className="text-center text-gray-400 mt-6 sm:mt-8 text-xs sm:text-sm px-4">
        Globalne ljestvice ažuriraju se dnevno
      </p>
    </div>
  );
}