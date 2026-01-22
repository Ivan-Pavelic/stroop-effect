"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
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

// All available colors - more will be added as series progress
const ALL_COLORS = [
  { name: "CRVENA", value: "#EF4444", bgClass: "bg-red-500 hover:bg-red-600 active:bg-red-700" },
  { name: "PLAVA", value: "#3B82F6", bgClass: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700" },
  { name: "ZELENA", value: "#10B981", bgClass: "bg-green-500 hover:bg-green-600 active:bg-green-700" },
  { name: "ŽUTA", value: "#EAB308", bgClass: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700" },
  { name: "LJUBIČASTA", value: "#A855F7", bgClass: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700" },
  { name: "SMEĐA", value: "#A16207", bgClass: "bg-amber-700 hover:bg-amber-800 active:bg-amber-900" },
  { name: "NARANČASTA", value: "#F97316", bgClass: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700" },
  { name: "ROZA", value: "#EC4899", bgClass: "bg-pink-500 hover:bg-pink-600 active:bg-pink-700" },
];

// Get available colors based on current batch (series)
const getAvailableColors = (batch: number) => {
  // Series 1: 4 colors (basic)
  if (batch === 1) return ALL_COLORS.slice(0, 4);
  // Series 2: 5 colors (add ljubičasta)
  if (batch === 2) return ALL_COLORS.slice(0, 5);
  // Series 3: 6 colors (add smeđa)
  if (batch === 3) return ALL_COLORS.slice(0, 6);
  // Series 4: 7 colors (add narančasta)
  if (batch === 4) return ALL_COLORS.slice(0, 7);
  // Series 5+: All 8 colors
  return ALL_COLORS;
};

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
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const skipAnimation = prefersReducedMotion();

  const availableColors = getAvailableColors(currentBatch);
  
  // Calculate difficulty: reduce congruent percentage as series progress
  const getCongruentChance = () => {
    if (currentBatch === 1) return 0.3; // 30% congruent in series 1
    if (currentBatch === 2) return 0.25; // 25% in series 2
    if (currentBatch === 3) return 0.2; // 20% in series 3
    if (currentBatch === 4) return 0.15; // 15% in series 4
    return 0.1; // 10% in series 5+
  };

  const generateTrial = () => {
    const wordColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    const isCongruent = Math.random() < getCongruentChance();

    let displayColor;
    if (isCongruent) {
      displayColor = wordColor;
    } else {
      const otherColors = availableColors.filter((c) => c.name !== wordColor.name);
      displayColor = otherColors[Math.floor(Math.random() * otherColors.length)];
    }

    setWord({
      text: wordColor.name,
      color: displayColor.value,
      correctColor: displayColor.name,
      isCongruent,
    });

    // Show all available colors as options (shuffled)
    const shuffled = [...availableColors].sort(() => Math.random() - 0.5);
    setOptions(shuffled.map((c) => c.name));
    setTrialStartTime(Date.now());
  };

  useEffect(() => {
    if (isGameStarted && !showIntro) {
      generateTrial();
    }
  }, [trialInBatch, currentBatch, isGameStarted, showIntro]);

  const handleReady = () => {
    setIsGameStarted(true);
    setShowIntro(false);
    generateTrial();
  };

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
    const color = ALL_COLORS.find((c) => c.name === colorName);
    return color?.bgClass || "bg-muted hover:bg-muted/90";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressValue = (timeRemaining / 60) * 100;

  // Intro Screen
  if (!isGameStarted || showIntro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-background gap-8 md:gap-12">
        <motion.div
          className="w-full max-w-2xl flex flex-col items-center gap-8 md:gap-12"
          initial={skipAnimation ? undefined : { opacity: 0, y: 20 }}
          animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
          transition={springTransition}
        >
          <Card className="w-full shadow-lg">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Stroop Effect - Upute:
              </h3>
              <ul className="space-y-4 text-base md:text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>
                    Na ekranu će se pojavljivati <strong className="text-foreground">riječi boja</strong> ispisane u <strong className="text-foreground">različitim bojama</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>
                    Vaš zadatak je odabrati <strong className="text-foreground">boju teksta</strong>, ne riječ koju vidite!
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>
                    Kako napredujete kroz serije, igra postaje teža - pojavljuje se više boja i manje kongruentnih zadataka.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>
                    Imate <strong className="text-foreground">60 sekundi</strong> da odgovorite na što više zadataka.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Button
            onClick={handleReady}
            className={cn(
              "h-16 md:h-20 px-12 md:px-16",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "text-2xl md:text-3xl font-bold rounded-2xl",
              "shadow-xl hover:shadow-2xl",
              "transition-all duration-300",
              "btn-press"
            )}
          >
            KRENI
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!word) return null;

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

      {/* Answer Buttons - Dynamic grid based on number of colors */}
      <motion.div
        className={cn(
          "w-full max-w-2xl",
          availableColors.length <= 4 ? "grid grid-cols-2" : 
          availableColors.length <= 6 ? "grid grid-cols-3" : "grid grid-cols-4",
          "gap-3 sm:gap-4"
        )}
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
              "text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold",
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
