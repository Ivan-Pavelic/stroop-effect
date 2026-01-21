"use client";

import { useState, useEffect } from 'react';
import { MainMenu } from '@/components/MainMenu';
import { GameScreen } from '@/components/GameScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { Button } from '@/components/ui/button';
import { Leaderboard } from '@/components/Leaderboard';
import { Login } from '@/components/Login';
import { AdminDashboard } from '@/components/AdminDashboard';

type Screen = 'login' | 'menu' | 'game' | 'results' | 'settings' | 'leaderboard' | 'admin';

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

interface GameState {
  trials: Trial[];
  currentBatch: number;
  trialInBatch: number;
  timeRemaining: number;
  gameStartTime: number;
  isGameActive: boolean;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    trials: [],
    currentBatch: 1,
    trialInBatch: 1,
    timeRemaining: 60,
    gameStartTime: 0,
    isGameActive: false,
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

  const startGame = () => {
    setGameState({
      trials: [],
      currentBatch: 1,
      trialInBatch: 1,
      timeRemaining: 60,
      gameStartTime: Date.now(),
      isGameActive: true,
    });
    setScreen('game');
  };

  // Timer effect
  useEffect(() => {
    if (!gameState.isGameActive || screen !== 'game') return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        if (newTimeRemaining <= 0) {
          // Time's up - end game
          clearInterval(interval);
          return { ...prev, timeRemaining: 0, isGameActive: false };
        }
        
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isGameActive, screen]);

  const handleTrialComplete = (trial: Trial) => {
    setGameState(prev => {
      const newTrials = [...prev.trials, trial];
      let newTrialInBatch = prev.trialInBatch + 1;
      let newCurrentBatch = prev.currentBatch;
      
      // Check if batch is complete (10 trials) or time is up
      if (newTrialInBatch > 10 || prev.timeRemaining <= 0) {
        if (prev.timeRemaining <= 0) {
          // Time's up - end game
          return {
            ...prev,
            trials: newTrials,
            isGameActive: false,
            timeRemaining: 0,
          };
        } else {
          // Batch complete, start new batch
          newTrialInBatch = 1;
          newCurrentBatch = prev.currentBatch + 1;
        }
      }
      
      // Check if time is up
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

  // Check if game should end
  useEffect(() => {
    if (screen === 'game' && !gameState.isGameActive && gameState.trials.length > 0) {
      // Small delay to ensure last trial is recorded
      setTimeout(() => {
        setScreen('results');
      }, 500);
    }
  }, [gameState.isGameActive, gameState.trials.length, screen]);

  const returnToMenu = () => {
    setScreen('menu');
  };

  return (
    <main className="min-h-screen bg-white">
      {screen === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {screen === 'admin' && (
        <AdminDashboard onLogout={handleLogout} />
      )}

      {screen === 'menu' && (
        <MainMenu
          onStart={startGame}
          onMultiplayer={() => {/* Multiplayer not implemented */}}
          onSettings={() => {/* Settings removed for end users */}}
          onLeaderboard={() => setScreen('leaderboard')}
          onLogout={handleLogout}
        />
      )}
      
      {screen === 'game' && (
        <GameScreen
          onTrialComplete={handleTrialComplete}
          timeRemaining={gameState.timeRemaining}
          currentBatch={gameState.currentBatch}
          trialInBatch={gameState.trialInBatch}
        />
      )}
      
      {screen === 'results' && (
        <ResultsScreen
          trials={gameState.trials}
          gameStartTime={gameState.gameStartTime}
          onReturnToMenu={returnToMenu}
          onPlayAgain={startGame}
        />
      )}
      
      {screen === 'settings' && (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 md:px-8 bg-gradient-to-b from-white to-gray-50">
          <h1 className="text-gray-900 mb-8 sm:mb-10 md:mb-12 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
            Postavke
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 max-w-md w-full mx-2">
            <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
              Igra je standardizirana: 60 sekundi, serije od 10 zadataka.
              Postavke nisu dostupne.
            </p>
            <Button
              onClick={() => setScreen('menu')}
              className="w-full h-12 sm:h-14 md:h-16 bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl md:text-2xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
            >
              Natrag na izbornik
            </Button>
          </div>
        </div>
      )}
      
      {screen === 'leaderboard' && (
        <Leaderboard onBack={() => setScreen('menu')} />
      )}
    </main>
  );
}