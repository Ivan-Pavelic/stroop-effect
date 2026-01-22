"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

// Components
import { Login } from "@/components/Login";
import { MainMenu } from "@/components/MainMenu";
import { ModeSelection } from "@/components/ModeSelection";
import { GameScreen } from "@/components/GameScreen";
import { MemoryChainScreen } from "@/components/MemoryChainScreen";
import { FeedbackScreen } from "@/components/FeedbackScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { Leaderboard } from "@/components/Leaderboard";
import { AdminDashboard } from "@/components/AdminDashboard";

// Types
type Screen =
  | "login"
  | "menu"
  | "mode-stroop"
  | "mode-memory"
  | "game-stroop"
  | "game-memory"
  | "feedback"
  | "results"
  | "leaderboard"
  | "admin";

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

export default function Home() {
  // App state
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<User | null>(null);

  // Game state
  const [trials, setTrials] = useState<Trial[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [currentBatch, setCurrentBatch] = useState<number>(1);
  const [trialInBatch, setTrialInBatch] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lastCorrect, setLastCorrect] = useState<boolean>(false);

  // Memory chain state
  const [memoryRound, setMemoryRound] = useState<number>(1);
  const [memoryDifficulty] = useState<"easy" | "medium" | "hard">("easy");

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setScreen(parsedUser.role === "ADMIN" ? "admin" : "menu");
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Timer for Stroop game
  useEffect(() => {
    if (screen !== "game-stroop" || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setScreen("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, timeRemaining]);

  // Auth handlers
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setScreen(loggedInUser.role === "ADMIN" ? "admin" : "menu");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setScreen("login");
    resetGameState();
  };

  // Game state reset
  const resetGameState = () => {
    setTrials([]);
    setGameStartTime(0);
    setTimeRemaining(60);
    setCurrentBatch(1);
    setTrialInBatch(1);
    setScore(0);
    setStreak(0);
    setLastCorrect(false);
    setMemoryRound(1);
  };

  // Stroop game handlers
  const startStroopGame = () => {
    resetGameState();
    setGameStartTime(Date.now());
    setScreen("game-stroop");
  };

  const handleTrialComplete = (trial: Trial) => {
    setTrials((prev) => [...prev, trial]);

    if (trial.isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setLastCorrect(true);
    } else {
      setStreak(0);
      setLastCorrect(false);
    }

    // Move to next trial
    if (trialInBatch >= 10) {
      setCurrentBatch((prev) => prev + 1);
      setTrialInBatch(1);
    } else {
      setTrialInBatch((prev) => prev + 1);
    }

    // Show feedback briefly then continue
    setScreen("feedback");
  };

  const handleFeedbackNext = useCallback(() => {
    if (timeRemaining <= 0) {
      setScreen("results");
    } else {
      setScreen("game-stroop");
    }
  }, [timeRemaining]);

  // Memory chain handlers
  const startMemoryGame = () => {
    resetGameState();
    setMemoryRound(1);
    setScreen("game-memory");
  };

  const handleMemoryAnswer = (correct: boolean) => {
    if (correct) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    if (memoryRound >= 10) {
      // Game complete
      setScreen("menu");
    } else {
      setMemoryRound((prev) => prev + 1);
    }
  };

  // Navigation handlers
  const handleSelectStroop = () => setScreen("mode-stroop");
  const handleSelectMemory = () => setScreen("mode-memory");
  const handleLeaderboard = () => setScreen("leaderboard");
  const handleBackToMenu = () => {
    resetGameState();
    setScreen("menu");
  };

  const handlePlayAgain = () => {
    if (screen === "results") {
      startStroopGame();
    }
  };

  // Render current screen
  const renderScreen = () => {
    switch (screen) {
      case "login":
        return <Login onLoginSuccess={handleLoginSuccess} />;

      case "menu":
        return (
          <MainMenu
            onSelectStroop={handleSelectStroop}
            onSelectMemory={handleSelectMemory}
            onLeaderboard={handleLeaderboard}
            onLogout={handleLogout}
          />
        );

      case "mode-stroop":
        return (
          <ModeSelection
            gameName="Stroop Effect"
            onSelectSingle={startStroopGame}
            onSelectMultiplayer={() => {
              // Multiplayer not implemented yet
              alert("Multiplayer dolazi uskoro!");
            }}
            onBack={handleBackToMenu}
          />
        );

      case "mode-memory":
        return (
          <ModeSelection
            gameName="Lanac Pamćenja"
            onSelectSingle={startMemoryGame}
            onSelectMultiplayer={() => {
              alert("Multiplayer dolazi uskoro!");
            }}
            onBack={handleBackToMenu}
          />
        );

      case "game-stroop":
        return (
          <GameScreen
            onTrialComplete={handleTrialComplete}
            timeRemaining={timeRemaining}
            currentBatch={currentBatch}
            trialInBatch={trialInBatch}
          />
        );

      case "game-memory":
        return (
          <MemoryChainScreen
            round={memoryRound}
            totalRounds={10}
            difficulty={memoryDifficulty}
            onAnswer={handleMemoryAnswer}
            streak={streak}
          />
        );

      case "feedback":
        return (
          <FeedbackScreen
            correct={lastCorrect}
            score={score}
            streak={streak}
            onNext={handleFeedbackNext}
          />
        );

      case "results":
        return (
          <ResultsScreen
            trials={trials}
            gameStartTime={gameStartTime}
            onReturnToMenu={handleBackToMenu}
            onPlayAgain={handlePlayAgain}
          />
        );

      case "leaderboard":
        return <Leaderboard onBack={handleBackToMenu} />;

      case "admin":
        return <AdminDashboard onLogout={handleLogout} />;

      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>
    </main>
  );
}
