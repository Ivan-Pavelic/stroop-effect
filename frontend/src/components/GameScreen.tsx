"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface GameScreenProps {
  round: number;
  totalRounds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onAnswer: (correct: boolean) => void;
  streak: number;
}

const COLORS = [
  { name: 'RED', value: '#EF4444' },
  { name: 'BLUE', value: '#3B82F6' },
  { name: 'GREEN', value: '#10B981' },
  { name: 'YELLOW', value: '#EAB308' },
];

interface WordDisplay {
  text: string;
  color: string;
  correctColor: string;
}

export function GameScreen({ round, totalRounds, difficulty, onAnswer, streak }: GameScreenProps) {
  const [word, setWord] = useState<WordDisplay | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  const generateRound = () => {
    // Pick a random word (color name)
    const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    // Pick a random display color (may or may not match)
    const displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    setWord({
      text: wordColor.name,
      color: displayColor.value,
      correctColor: displayColor.name,
    });

    // Create answer options (shuffle the colors)
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    setOptions(shuffled.map(c => c.name));
  };

  useEffect(() => {
    generateRound();
  }, [round]);

  const handleAnswer = (selectedColor: string) => {
    if (!word) return;
    const isCorrect = selectedColor === word.correctColor;
    onAnswer(isCorrect);
  };

  const getButtonColor = (colorName: string) => {
    switch (colorName) {
      case 'RED': return 'bg-red-500 hover:bg-red-600';
      case 'BLUE': return 'bg-blue-500 hover:bg-blue-600';
      case 'GREEN': return 'bg-green-500 hover:bg-green-600';
      case 'YELLOW': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (!word) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-12 bg-gradient-to-b from-white to-gray-50">
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-gray-500 text-lg mb-2">
          <span>Round {round} of {totalRounds}</span>
          {streak > 1 && <span className="text-orange-500">🔥 {streak} streak!</span>}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(round / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* Instructions */}
      <p className="text-gray-600 text-xl mb-8">
        What COLOR is this word displayed in?
      </p>

      {/* Word Display */}
      <div className="flex-1 flex items-center justify-center mb-12">
        <div
          className="text-center select-none text-7xl md:text-9xl font-bold"
          style={{ color: word.color }}
        >
          {word.text}
        </div>
      </div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {options.map((colorName) => (
          <Button
            key={colorName}
            onClick={() => handleAnswer(colorName)}
            className={`h-16 md:h-20 text-white text-xl md:text-2xl font-semibold rounded-xl ${getButtonColor(colorName)}`}
          >
            {colorName}
          </Button>
        ))}
      </div>
    </div>
  );
}