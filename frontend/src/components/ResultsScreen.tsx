"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { aiAPI, gameAPI } from '@/services/api';

interface Trial {
  isCongruent: boolean;
  wordText: string;
  displayColor: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  reactionTime: number;
}

interface ResultsScreenProps {
  trials: Trial[];
  gameStartTime: number;
  onReturnToMenu: () => void;
  onPlayAgain: () => void;
}

interface AIAnalysis {
  y: number; // 0 = good, 1 = negative condition
  cognitiveScore: number;
  level: string;
  levelColor: string;
  components: {
    accuracy: number;
    speed: number;
    consistency: number;
  };
}

// 5 Croatian feedback messages based on y value and performance
function getFeedbackMessage(y: number, accuracy: number, avgTime: number): string {
  if (y === 1) {
    // Negative condition messages
    if (accuracy < 50) {
      return 'Uočene su značajne promjene u kognitivnim performansama. Preporučujemo konzultaciju s liječnikom za daljnju evaluaciju.';
    } else if (accuracy < 70) {
      return 'Uočene su promjene u kognitivnim performansama. Preporučujemo praćenje i ponovno testiranje za 2-3 tjedna.';
    } else {
      return 'Uočene su blage promjene u kognitivnim performansama. Razmotrite profesionalni savjet ako imate zabrinutosti.';
    }
  } else {
    // Good condition messages
    if (accuracy >= 85 && avgTime < 1500) {
      return 'Vaše kognitivne performanse su odlične. Nastavite s redovitim vježbanjem kognitivnih vještina.';
    } else {
      return 'Vaše kognitivne performanse su unutar normalnog raspona. Ako imate zabrinutosti, razmotrite profesionalni savjet.';
    }
  }
}

export function ResultsScreen({ 
  trials, 
  gameStartTime,
  onReturnToMenu, 
  onPlayAgain 
}: ResultsScreenProps) {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const hasSavedRef = useRef(false);

  // Calculate statistics
  const totalTrials = trials.length;
  const correctTrials = trials.filter(t => t.isCorrect).length;
  const accuracy = totalTrials > 0 ? Math.round((correctTrials / totalTrials) * 100) : 0;
  
  // avgTime only from CORRECT answers
  const correctTimes = trials.filter(t => t.isCorrect).map(t => t.reactionTime);
  const avgTime = correctTimes.length > 0
    ? Math.round(correctTimes.reduce((a, b) => a + b, 0) / correctTimes.length)
    : 0;

  // Congruent/Incongruent stats
  const congruentTrials = trials.filter(t => t.isCongruent);
  const incongruentTrials = trials.filter(t => !t.isCongruent);
  const congruentCorrect = congruentTrials.filter(t => t.isCorrect).length;
  const incongruentCorrect = incongruentTrials.filter(t => t.isCorrect).length;
  const congruentAccuracy = congruentTrials.length > 0
    ? Math.round((congruentCorrect / congruentTrials.length) * 100)
    : 0;
  const incongruentAccuracy = incongruentTrials.length > 0
    ? Math.round((incongruentCorrect / incongruentTrials.length) * 100)
    : 0;

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (totalTrials === 0) {
        setLoading(false);
        hasSavedRef.current = false; // Reset when no trials
        return;
      }

      // Prevent duplicate saves - only save once per game session
      if (hasSavedRef.current) {
        return;
      }

      try {
        setLoading(true);
        
        // Get user data for AI analysis
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        // Calculate age (if available)
        const age = user?.dob ? Math.floor((Date.now() - new Date(user.dob).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 50;
        const sex = user?.spol === 'M' ? 1 : 0;
        const timeOfDay = new Date().getHours() * 60 + new Date().getMinutes();

        const response = await aiAPI.analyzePerformance({
          corr_mean: accuracy / 100, // Convert to 0-1 range
          rt_mean: avgTime,
          age: age,
          sex: sex,
          timeofday: timeOfDay,
          roundTimes: trials.map(t => t.reactionTime),
          answers: trials.map(t => t.isCorrect ? 1 : 0),
          totalRounds: totalTrials
        });
        
        if (response.success && response.analysis) {
          setAiAnalysis(response.analysis);
          
          // Save game result to backend if user is logged in (only once)
          if (user && !hasSavedRef.current) {
            try {
              setSaving(true);
              hasSavedRef.current = true; // Mark as saved before the API call
              await gameAPI.saveResult({
                score: correctTrials,
                totalRounds: totalTrials,
                accuracy: accuracy,
                avgTime: avgTime,
                roundTimes: trials.map(t => t.reactionTime),
                answers: trials.map(t => t.isCorrect),
                // Additional data for new schema
                trials: trials.map(t => ({
                  isCongruent: t.isCongruent,
                  wordText: t.wordText,
                  displayColor: t.displayColor,
                  correctAnswer: t.correctAnswer,
                  userAnswer: t.userAnswer,
                  isCorrect: t.isCorrect,
                  reactionTime: t.reactionTime,
                })),
                congruentAccuracy: congruentAccuracy,
                incongruentAccuracy: incongruentAccuracy,
              });
            } catch (err) {
              console.error('Failed to save game result:', err);
              hasSavedRef.current = false; // Reset on error so it can retry
            } finally {
              setSaving(false);
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to get AI analysis:', err);
        setError('Neuspješno učitavanje AI analize');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
    // Only depend on trials.length - when it changes, it's a new game
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trials.length]);

  // AI analysis is still fetched and saved, but not displayed to users
  // yValue and cognitiveScore are kept for internal use but not shown in UI

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 bg-gradient-to-b from-white to-gray-50">
      {/* Title */}
      <h1 className="text-gray-900 mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
        Rezultati testa
      </h1>

      {/* Stats Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 w-full max-w-md">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Točnost</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
              {accuracy}%
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Prosječno vrijeme</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
              {avgTime}ms
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 sm:pt-4 mt-3 sm:mt-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <div className="text-gray-500 mb-1">Kongruentni</div>
              <div className="font-semibold text-gray-900 text-base sm:text-lg">{congruentAccuracy}%</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Nekongruentni</div>
              <div className="font-semibold text-gray-900 text-base sm:text-lg">{incongruentAccuracy}%</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 sm:pt-4 mt-3 sm:mt-4">
          <div className="text-gray-500 text-xs sm:text-sm mb-1">Ukupno zadataka</div>
          <div className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">{totalTrials}</div>
        </div>
      </div>

      {/* Saving indicator */}
      {saving && (
        <div className="bg-blue-50 rounded-2xl p-4 mb-6 w-full max-w-md">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-600 text-sm">Spremanje rezultata...</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-md px-2">
        <Button
          onClick={onPlayAgain}
          className="w-full h-12 sm:h-14 md:h-16 bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg md:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
        >
          Igraj ponovno
        </Button>
        
        <Button
          onClick={onReturnToMenu}
          className="w-full h-12 sm:h-14 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 text-base sm:text-lg rounded-xl bg-white touch-manipulation"
        >
          Povratak na izbornik
        </Button>
      </div>
    </div>
  );
}
