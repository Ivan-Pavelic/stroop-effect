"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';

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
  { name: 'CRVENA', value: '#EF4444', englishName: 'RED' },
  { name: 'PLAVA', value: '#3B82F6', englishName: 'BLUE' },
  { name: 'ZELENA', value: '#10B981', englishName: 'GREEN' },
  { name: 'ŽUTA', value: '#EAB308', englishName: 'YELLOW' },
];

interface WordDisplay {
  text: string;
  color: string;
  correctColor: string;
  isCongruent: boolean;
}

export function GameScreen({ onTrialComplete, timeRemaining, currentBatch, trialInBatch }: GameScreenProps) {
  const [word, setWord] = useState<WordDisplay | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [trialStartTime, setTrialStartTime] = useState<number>(Date.now());

  const generateTrial = () => {
    // Pick a random word (color name)
    const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    // Determine if congruent (50% chance) - for Stroop test, we want more incongruent
    const isCongruent = Math.random() < 0.3; // 30% congruent, 70% incongruent
    
    let displayColor;
    if (isCongruent) {
      // Congruent: word and color match
      displayColor = wordColor;
    } else {
      // Incongruent: word and color don't match
      const otherColors = COLORS.filter(c => c.name !== wordColor.name);
      displayColor = otherColors[Math.floor(Math.random() * otherColors.length)];
    }
    
    setWord({
      text: wordColor.name, // Croatian word displayed
      color: displayColor.value,
      correctColor: displayColor.name, // Croatian name for correct answer
      isCongruent,
    });

    // Create answer options (shuffle the colors)
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    setOptions(shuffled.map(c => c.name)); // Croatian names
    
    // Reset trial start time
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

  const getButtonColor = (colorName: string) => {
    switch (colorName) {
      case 'CRVENA': return 'bg-red-500 hover:bg-red-600 active:bg-red-700';
      case 'PLAVA': return 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700';
      case 'ZELENA': return 'bg-green-500 hover:bg-green-600 active:bg-green-700';
      case 'ŽUTA': return 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700';
      default: return 'bg-gray-500 hover:bg-gray-600 active:bg-gray-700';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!word) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 bg-gradient-to-b from-white to-gray-50">
      {/* Timer and Progress */}
      <div className="w-full max-w-md mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between text-gray-700 text-sm sm:text-base md:text-lg mb-2 gap-1 sm:gap-0">
          <span className="font-semibold">Vrijeme: {formatTime(timeRemaining)}</span>
          <span className="text-gray-600 text-xs sm:text-sm md:text-base">Serija {currentBatch}, Zadatak {trialInBatch}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
          <div 
            className="bg-blue-600 h-2 sm:h-3 rounded-full transition-all duration-300"
            style={{ width: `${(timeRemaining / 60) * 100}%` }}
          />
        </div>
      </div>

      {/* Instructions */}
      <p className="text-gray-700 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 font-medium px-2 text-center">
        Koja je BOJA ovog teksta? (ne riječ!)
      </p>

      {/* Word Display */}
      <div className="flex-1 flex items-center justify-center mb-6 sm:mb-8 md:mb-12 px-4">
        <div
          className="text-center select-none text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold"
          style={{ color: word.color }}
        >
          {word.text}
        </div>
      </div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg px-2">
        {options.map((colorName) => (
          <Button
            key={colorName}
            onClick={() => handleAnswer(colorName)}
            className={`h-14 sm:h-16 md:h-20 text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold rounded-xl touch-manipulation ${getButtonColor(colorName)}`}
          >
            {colorName}
          </Button>
        ))}
      </div>
    </div>
  );
}
