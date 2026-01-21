"use client";

import { useState } from 'react';
import { MainMenu } from '@/components/MainMenu';
import { ModeSelection } from '@/components/ModeSelection';
import { GameScreen } from '@/components/GameScreen';
import { MemoryChainScreen } from '@/components/MemoryChainScreen';
import { FeedbackScreen } from '@/components/FeedbackScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { Settings } from '@/components/Settings';
import { Leaderboard } from '@/components/Leaderboard';

type Screen = 'menu' | 'modeSelection' | 'game' | 'feedback' | 'results' | 'settings' | 'leaderboard';
type GameMode = 'single' | 'multiplayer';
type GameType = 'stroop' | 'memory';

interface GameSettings {
  rounds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'en';
}

interface GameState {
  currentRound: number;
  score: number;
  streak: number;
  answers: boolean[];
  startTime: number;
  roundTimes: number[];
}

const defaultSettings: GameSettings = {
  rounds: 10,
  difficulty: 'medium',
  language: 'en',
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [gameType, setGameType] = useState<GameType>('stroop');
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    score: 0,
    streak: 0,
    answers: [],
    startTime: 0,
    roundTimes: [],
  });
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean>(false);

  // Prikaži screen za odabir mode-a
  const showModeSelection = (type: GameType) => {
    setGameType(type);
    setScreen('modeSelection');
  };

  // Počni igru s odabranim mode-om
  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState({
      currentRound: 1,
      score: 0,
      streak: 0,
      answers: [],
      startTime: Date.now(),
      roundTimes: [],
    });
    setScreen('game');
  };

const handleAnswer = (correct: boolean) => {
    const roundTime = Date.now() - gameState.startTime;
    
    const newStreak = correct ? gameState.streak + 1 : 0;
    const newScore = correct ? gameState.score + 1 : gameState.score;
    
    if (gameState.currentRound >= settings.rounds) {
      setGameState(prev => ({
        ...prev,
        score: newScore,
        streak: newStreak,
        answers: [...prev.answers, correct],
        roundTimes: [...prev.roundTimes, roundTime],
      }));
      setScreen('results');
    } else {
      setGameState(prev => ({
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

  const nextRound = () => {
    if (gameState.currentRound >= settings.rounds) {
      setScreen('results');
    } else {
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        startTime: Date.now(),
      }));
      setScreen('game');
    }
  };

  const returnToMenu = () => {
    setScreen('menu');
  };

  const playAgain = () => {
    // Kreni s novu igru s istim tipom i mode-om
    setGameState({
      currentRound: 1,
      score: 0,
      streak: 0,
      answers: [],
      startTime: Date.now(),
      roundTimes: [],
    });
    setScreen('game');
  };

  return (
    <main className="min-h-screen bg-white">
      {screen === 'menu' && (
        <MainMenu
          onSelectStroop={() => showModeSelection('stroop')}
          onSelectMemory={() => showModeSelection('memory')}
          onSettings={() => setScreen('settings')}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}

      {screen === 'modeSelection' && (
        <ModeSelection
          gameName={gameType === 'stroop' ? 'Stroop Effect' : 'Lanac Pamćenja'}
          onSelectSingle={() => startGame('single')}
          onSelectMultiplayer={() => startGame('multiplayer')}
          onBack={() => setScreen('menu')}
        />
      )}
      
      {screen === 'game' && gameType === 'stroop' && (
        <GameScreen
          round={gameState.currentRound}
          totalRounds={settings.rounds}
          difficulty={settings.difficulty}
          onAnswer={handleAnswer}
          streak={gameState.streak}
        />
      )}
      
      {screen === 'game' && gameType === 'memory' && (
        <MemoryChainScreen
          onGameEnd={(score, level, time) => {
            setGameState(prev => ({
              ...prev,
              score: Math.round(score),
              streak: level,
            }));
            setScreen('results');
          }}
        />
      )}
      
      {screen === 'feedback' && (
        <FeedbackScreen
          correct={lastAnswerCorrect}
          score={gameState.score}
          streak={gameState.streak}
          onNext={nextRound}
        />
      )}
      
      {screen === 'results' && (
        <ResultsScreen
          gameState={gameState}
          totalRounds={settings.rounds}
          gameMode={gameMode}
          onReturnToMenu={returnToMenu}
          onPlayAgain={playAgain}
        />
      )}
      
      {screen === 'settings' && (
        <Settings
          settings={settings}
          onSave={(newSettings) => {
            setSettings(newSettings);
            setScreen('menu');
          }}
          onBack={() => setScreen('menu')}
        />
      )}
      
      {screen === 'leaderboard' && (
        <Leaderboard onBack={() => setScreen('menu')} />
      )}
    </main>
  );
}