import { Button } from './ui/button';

interface MainMenuProps {
  onStart: () => void;
  onMultiplayer: () => void;
  onSettings: () => void;
  onLeaderboard: () => void;
}

export function MainMenu({ onStart, onMultiplayer, onSettings, onLeaderboard }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-8 bg-gradient-to-b from-white to-gray-50">
      {/* Title */}
      <h1 className="text-gray-900 mb-16 text-5xl md:text-7xl font-bold">
        Stroop Effect
      </h1>

      {/* Main Buttons */}
      <div className="flex flex-col gap-6 w-full max-w-md">
        <Button
          onClick={onStart}
          className="w-full h-16 md:h-20 bg-blue-600 hover:bg-blue-700 text-white text-2xl md:text-3xl font-semibold rounded-xl"
        >
          START
        </Button>
        
        <Button
          onClick={onMultiplayer}
          variant="outline"
          className="w-full h-14 md:h-16 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 text-xl md:text-2xl rounded-xl"
        >
          Multiplayer
        </Button>

        <div className="flex gap-4 mt-4">
          <Button
            onClick={onSettings}
            variant="outline"
            className="flex-1 h-12 border-2 border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl"
          >
            Settings
          </Button>
          
          <Button
            onClick={onLeaderboard}
            variant="outline"
            className="flex-1 h-12 border-2 border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl"
          >
            Leaderboard
          </Button>
        </div>
      </div>

      {/* Info Text */}
      <p className="mt-12 text-gray-400 text-sm">
        Test your cognitive abilities with the Stroop Effect
      </p>
    </div>
  );
}