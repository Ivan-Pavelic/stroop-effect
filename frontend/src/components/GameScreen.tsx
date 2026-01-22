"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { prefersReducedMotion, popInVariants, springTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface GameScreenProps {
  onTrialComplete: (trial: {
    isCongruent: boolean;
    wordText: string;
    displayColor: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    reactionTime: number;
  }) => void;
  timeRemaining: number;
  currentBatch: number;
  trialInBatch: number;
}

const COLORS = [
  { name: "CRVENA", value: "#EF4444", bgClass: "bg-game-red hover:bg-game-red/90 active:bg-game-red/80" },
  { name: "PLAVA", value: "#3B82F6", bgClass: "bg-game-blue hover:bg-game-blue/90 active:bg-game-blue/80" },
  { name: "ZELENA", value: "#10B981", bgClass: "bg-game-green hover:bg-game-green/90 active:bg-game-green/80" },
  { name: "ŽUTA", value: "#EAB308", bgClass: "bg-game-yellow hover:bg-game-yellow/90 active:bg-game-yellow/80" },
];

interface WordDisplay {
  text: string;
  color: string;
  correctColor: string;
  isCongruent: boolean;
}

export function GameScreen({
  onTrialComplete,
  timeRemaining,
  currentBatch,
  trialInBatch,
}: GameScreenProps) {
  const [word, setWord] = useState<WordDisplay | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [trialStartTime, setTrialStartTime] = useState<number>(Date.now());
  const skipAnimation = prefersReducedMotion();

  const generateTrial = () => {
    const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const isCongruent = Math.random() < 0.3;

    let displayColor;
    if (isCongruent) {
      displayColor = wordColor;
    } else {
      const otherColors = COLORS.filter((c) => c.name !== wordColor.name);
      displayColor = otherColors[Math.floor(Math.random() * otherColors.length)];
    }

    setWord({
      text: wordColor.name,
      color: displayColor.value,
      correctColor: displayColor.name,
      isCongruent,
    });

    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    setOptions(shuffled.map((c) => c.name));
    setTrialStartTime(Date.now());
  };

  useEffect(() => {
    generateTrial();
  }, [trialInBatch]);

  const handleAnswer = (selectedColor: string) => {
    if (!word) return;

    const reactionTime = Date.now() - trialStartTime;
    const isCorrect = selectedColor === word.correctColor;

    onTrialComplete({
      isCongruent: word.isCongruent,
      wordText: word.text,
      displayColor: word.color,
      correctAnswer: word.correctColor,
      userAnswer: selectedColor,
      isCorrect,
      reactionTime,
    });
  };

  const getButtonStyles = (colorName: string) => {
    const color = COLORS.find((c) => c.name === colorName);
    return color?.bgClass || "bg-muted hover:bg-muted/90";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!word) return null;

  const progressValue = (timeRemaining / 60) * 100;

  return (
    <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-background">
      {/* Timer and Progress */}
      <div className="w-full max-w-lg mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base mb-3 gap-1">
          <span className="font-semibold text-foreground">
            Vrijeme: {formatTime(timeRemaining)}
          </span>
          <span className="text-muted-foreground text-xs sm:text-sm">
            Serija {currentBatch}, Zadatak {trialInBatch}/10
          </span>
        </div>
        <Progress 
          value={progressValue} 
          className="h-2 sm:h-3"
        />
      </div>

      {/* Instructions */}
      <motion.p
        className="text-foreground text-base sm:text-lg md:text-xl mb-6 sm:mb-8 font-medium text-center max-w-md"
        initial={skipAnimation ? undefined : { opacity: 0 }}
        animate={skipAnimation ? undefined : { opacity: 1 }}
      >
        Koja je <span className="font-bold text-primary">BOJA</span> ovog teksta?{" "}
        <span className="text-muted-foreground">(ne riječ!)</span>
      </motion.p>

      {/* Word Display */}
      <div className="flex-1 flex items-center justify-center mb-8 sm:mb-12 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${word.text}-${word.color}-${trialInBatch}`}
            className="text-center select-none"
            variants={skipAnimation ? undefined : popInVariants}
            initial={skipAnimation ? undefined : "initial"}
            animate={skipAnimation ? undefined : "animate"}
            exit={skipAnimation ? undefined : "exit"}
          >
            <span
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold"
              style={{ color: word.color }}
            >
              {word.text}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Answer Buttons */}
      <motion.div
        className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg"
        initial={skipAnimation ? undefined : { opacity: 0, y: 20 }}
        animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
        transition={springTransition}
      >
        {options.map((colorName) => (
          <Button
            key={colorName}
            onClick={() => handleAnswer(colorName)}
            className={cn(
              "h-14 sm:h-16 md:h-20",
              "text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold",
              "rounded-xl shadow-md",
              "transition-all duration-150",
              "active:scale-95",
              "touch-manipulation",
              getButtonStyles(colorName)
            )}
          >
            {colorName}
          </Button>
        ))}
      </motion.div>
    </div>
  );
}
