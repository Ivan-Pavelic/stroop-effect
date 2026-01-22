"use client";

import { useState, useEffect } from 'react';
import { MainMenu } from '@/components/MainMenu';
import { ModeSelection } from '@/components/ModeSelection';
import { GameScreen } from '@/components/GameScreen';
import { MemoryChainScreen } from '@/components/MemoryChainScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { Leaderboard } from '@/components/Leaderboard';
import { Login } from '@/components/Login';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

type Screen = 'login' | 'menu' | 'modeSelection' | 'game' | 'results' | 'leaderboard' | 'admin';
type GameMode = 'single' | 'multiplayer';
type GameType = 'stroop' | 'memory';

interface User {
  id: number;
  username: string;
  role: string;
  ime: string;
  prezime: string;
}

interface Trial {
  isCongruent: boolean;
  wordText: string;
  displayColor: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  reactionTime: number;
}

interface StroopGameState {
  trials: Trial[];
  currentBatch: number;
  trialInBatch: number;
  timeRemaining: number;
  gameStartTime: number;
  isGameActive: boolean;
}

interface MemoryGameState {
  currentRound: number;
  score: number;
  streak: number;
  answers: boolean[];
  startTime: number;
  roundTimes: number[];
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [gameType, setGameType] = useState<GameType>('stroop');
  
  // Stroop game state (60s timer, batches)
  const [stroopGameState, setStroopGameState] = useState<StroopGameState>({
    trials: [],
    currentBatch: 1,
    trialInBatch: 1,
    timeRemaining: 60,
    gameStartTime: 0,
    isGameActive: false,
  });

  // Memory game state (rounds-based)
  const [memoryGameState, setMemoryGameState] = useState<MemoryGameState>({
    currentRound: 1,
    score: 0,
    streak: 0,
    answers: [],
    startTime: Date.now(),
    roundTimes: [],
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const savedUser = JSON.parse(userStr);
        setUser(savedUser);
        // Redirect based on role
        if (savedUser.role === 'ADMIN') {
          setScreen('admin');
        } else {
          setScreen('menu');
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'ADMIN') {
      setScreen('admin');
    } else {
      setScreen('menu');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setScreen('login');
  };

  // Show mode selection screen
  const showModeSelection = (type: GameType) => {
    setGameType(type);
    setScreen('modeSelection');
  };

  // Start Stroop game (60s timer, batches)
  const startStroopGame = () => {
    setStroopGameState({
      trials: [],
      currentBatch: 1,
      trialInBatch: 1,
      timeRemaining: 60,
      gameStartTime: Date.now(),
      isGameActive: true,
    });
    setScreen('game');
  };

  // Start Memory game (rounds-based)
  const startMemoryGame = (mode: GameMode) => {
    setGameMode(mode);
    setMemoryGameState({
      currentRound: 1,
      score: 0,
      streak: 0,
      answers: [],
      startTime: Date.now(),
      roundTimes: [],
    });
    setScreen('game');
  };

  // Timer effect for Stroop game
  useEffect(() => {
    if (gameType !== 'stroop' || !stroopGameState.isGameActive || screen !== 'game') return;

    const interval = setInterval(() => {
      setStroopGameState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        if (newTimeRemaining <= 0) {
          clearInterval(interval);
          return { ...prev, timeRemaining: 0, isGameActive: false };
        }
        
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stroopGameState.isGameActive, screen, gameType]);

  const handleStroopTrialComplete = (trial: Trial) => {
    setStroopGameState(prev => {
      const newTrials = [...prev.trials, trial];
      let newTrialInBatch = prev.trialInBatch + 1;
      let newCurrentBatch = prev.currentBatch;
      
      // Check if batch is complete (10 trials) or time is up
      if (newTrialInBatch > 10 || prev.timeRemaining <= 0) {
        if (prev.timeRemaining <= 0) {
          return {
            ...prev,
            trials: newTrials,
            isGameActive: false,
            timeRemaining: 0,
          };
        } else {
          newTrialInBatch = 1;
          newCurrentBatch = prev.currentBatch + 1;
        }
      }
      
      if (prev.timeRemaining <= 0) {
        return {
          ...prev,
          trials: newTrials,
          isGameActive: false,
          timeRemaining: 0,
        };
      }
      
      return {
        ...prev,
        trials: newTrials,
        trialInBatch: newTrialInBatch,
        currentBatch: newCurrentBatch,
      };
    });
  };

  // Handle Memory game answer
  const handleMemoryAnswer = (correct: boolean) => {
    const roundTime = Date.now() - memoryGameState.startTime;
    const newStreak = correct ? memoryGameState.streak + 1 : 0;
    const newScore = correct ? memoryGameState.score + 1 : memoryGameState.score;
    const totalRounds = 10; // Fixed rounds for memory game
    
    if (memoryGameState.currentRound >= totalRounds) {
      setMemoryGameState(prev => ({
        ...prev,
        score: newScore,
        streak: newStreak,
        answers: [...prev.answers, correct],
        roundTimes: [...prev.roundTimes, roundTime],
      }));
      setScreen('results');
    } else {
      setMemoryGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        score: newScore,
        streak: newStreak,
        answers: [...prev.answers, correct],
        roundTimes: [...prev.roundTimes, roundTime],
        startTime: Date.now(),
      }));
    }
  };

  // Check if Stroop game should end
  useEffect(() => {
    if (gameType === 'stroop' && screen === 'game' && !stroopGameState.isGameActive && stroopGameState.trials.length > 0) {
      setTimeout(() => {
        setScreen('results');
      }, 500);
    }
  }, [stroopGameState.isGameActive, stroopGameState.trials.length, screen, gameType]);

  const returnToMenu = () => {
    setScreen('menu');
  };

  const playAgain = () => {
    if (gameType === 'stroop') {
      startStroopGame();
    } else {
      startMemoryGame(gameMode);
    }
  };

  return (
    <main className={`min-h-screen bg-white ${inter.className}`}>
      {screen === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {screen === 'admin' && user?.role === 'ADMIN' && (
        <AdminDashboard onLogout={handleLogout} />
      )}

      {screen === 'menu' && user?.role === 'USER' && (
        <MainMenu
          onSelectStroop={() => showModeSelection('stroop')}
          onSelectMemory={() => showModeSelection('memory')}
          onLeaderboard={() => setScreen('leaderboard')}
          onLogout={handleLogout}
        />
      )}

      {screen === 'modeSelection' && (
        <ModeSelection
          gameName={gameType === 'stroop' ? 'Stroop Effect' : 'Lanac Pamćenja'}
          onSelectSingle={() => {
            if (gameType === 'stroop') {
              startStroopGame();
            } else {
              startMemoryGame('single');
            }
          }}
          onSelectMultiplayer={() => {
            // Multiplayer not implemented yet
            if (gameType === 'stroop') {
              startStroopGame();
            } else {
              startMemoryGame('multiplayer');
            }
          }}
          onBack={() => setScreen('menu')}
        />
      )}
      
      {screen === 'game' && gameType === 'stroop' && (
        <GameScreen
          onTrialComplete={handleStroopTrialComplete}
          timeRemaining={stroopGameState.timeRemaining}
          currentBatch={stroopGameState.currentBatch}
          trialInBatch={stroopGameState.trialInBatch}
        />
      )}
      
      {screen === 'game' && gameType === 'memory' && (
        <MemoryChainScreen
          round={memoryGameState.currentRound}
          totalRounds={10}
          difficulty="easy"
          onAnswer={handleMemoryAnswer}
          streak={memoryGameState.streak}
        />
      )}
      
      {screen === 'results' && gameType === 'stroop' && (
        <ResultsScreen
          trials={stroopGameState.trials}
          gameStartTime={stroopGameState.gameStartTime}
          onReturnToMenu={returnToMenu}
          onPlayAgain={playAgain}
        />
      )}

      {screen === 'results' && gameType === 'memory' && (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 bg-gradient-to-b from-white to-gray-50">
          <h1 className="text-gray-900 mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
            Rezultati testa
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 w-full max-w-md">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Točnost</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                  {memoryGameState.answers.length > 0 
                    ? Math.round((memoryGameState.answers.filter(a => a).length / memoryGameState.answers.length) * 100)
                    : 0}%
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Bodovi</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                  {memoryGameState.score}/{10}
                </div>
              </div>
            </div>
            {memoryGameState.streak > 0 && (
              <div className="border-t border-gray-100 pt-3 sm:pt-4 mt-3 sm:mt-4">
                <div className="text-gray-500 text-xs sm:text-sm mb-1">Najduži niz</div>
                <div className="text-lg sm:text-xl md:text-2xl font-semibold text-orange-600">
                  🔥 {memoryGameState.streak}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-md px-2">
            <Button
              onClick={playAgain}
              className="w-full h-12 sm:h-14 md:h-16 bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg md:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
            >
              Igraj ponovno
            </Button>
            <Button
              onClick={returnToMenu}
              className="w-full h-12 sm:h-14 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 text-base sm:text-lg rounded-xl bg-white touch-manipulation"
            >
              Povratak na izbornik
            </Button>
          </div>
        </div>
      )}
      
      {screen === 'leaderboard' && (
        <Leaderboard onBack={returnToMenu} />
      )}
    </main>
  );
}
