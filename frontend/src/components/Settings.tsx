"use client";

import { useState } from 'react';
import { Button } from './ui/button';

interface GameSettings {
  rounds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'en';
}

interface SettingsProps {
  settings: GameSettings;
  onSave: (settings: GameSettings) => void;
  onBack: () => void;
}

export function Settings({ settings, onSave, onBack }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
  };

  return (
    <div className="flex flex-col min-h-screen px-8 py-12 bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-gray-900 text-2xl font-semibold">Settings</h2>
      </div>

      {/* Settings Options */}
      <div className="flex-1 space-y-8 max-w-md mx-auto w-full">
        {/* Number of Rounds */}
        <div>
          <label className="block text-gray-700 text-lg font-medium mb-3">
            Number of Rounds
          </label>
          <div className="flex gap-3 flex-wrap">
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                onClick={() => setLocalSettings({ ...localSettings, rounds: num })}
                className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                  localSettings.rounds === num
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-gray-700 text-lg font-medium mb-3">
            Difficulty
          </label>
          <div className="flex gap-3 flex-wrap">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setLocalSettings({ ...localSettings, difficulty: level })}
                className={`px-6 py-3 rounded-full transition-all duration-300 capitalize font-medium ${
                  localSettings.difficulty === level
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-gray-500 mt-3 text-sm">
            {localSettings.difficulty === 'easy' && '🟢 More time to answer, slower pace'}
            {localSettings.difficulty === 'medium' && '🟡 Balanced timing and pace'}
            {localSettings.difficulty === 'hard' && '🔴 Less time, faster pace'}
          </p>
        </div>

        {/* Language */}
        <div>
          <label className="block text-gray-700 text-lg font-medium mb-3">
            Language
          </label>
          <div className="flex gap-3">
            <button
              className="px-6 py-3 rounded-full bg-blue-500 text-white shadow-lg font-medium"
            >
              English
            </button>
            <button
              disabled
              className="px-6 py-3 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed font-medium"
            >
              More coming soon
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex gap-4 max-w-md mx-auto w-full">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-14 border-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}