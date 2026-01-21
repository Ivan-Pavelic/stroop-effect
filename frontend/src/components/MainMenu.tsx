import { Button } from './ui/button';

interface MainMenuProps {
  onStart: () => void;
  onMultiplayer: () => void;
  onSettings: () => void;
  onLeaderboard: () => void;
  onLogout: () => void;
}

export function MainMenu({ onStart, onMultiplayer, onSettings, onLeaderboard, onLogout }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 md:px-8 bg-gradient-to-b from-white to-gray-50">
      {/* Title */}
      <h1 className="text-gray-900 mb-8 sm:mb-12 md:mb-16 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
        Stroop Test
      </h1>

      {/* Main Buttons */}
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full max-w-md px-2">
        <Button
          onClick={onStart}
          className="w-full h-14 sm:h-16 md:h-20 bg-blue-600 hover:bg-blue-700 text-white text-xl sm:text-2xl md:text-3xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
        >
          POČNI
        </Button>
        
        <Button
          onClick={onMultiplayer}
          variant="outline"
          className="w-full h-12 sm:h-14 md:h-16 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 text-lg sm:text-xl md:text-2xl rounded-xl touch-manipulation"
        >
          Multiplayer
        </Button>

        <div className="mt-2 sm:mt-4">
          <Button
            onClick={onLeaderboard}
            variant="outline"
            className="w-full h-11 sm:h-12 border-2 border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl text-sm sm:text-base touch-manipulation"
          >
            Ljestvica
          </Button>
        </div>
      </div>

      {/* Info Text */}
      <p className="mt-8 sm:mt-10 md:mt-12 text-gray-400 text-xs sm:text-sm px-4">
        Testirajte svoje kognitivne sposobnosti Stroop testom
      </p>

      {/* Logout Button */}
      <div className="mt-6 sm:mt-8">
        <Button
          onClick={onLogout}
          variant="outline"
          className="px-5 sm:px-6 py-2 border-2 border-red-300 hover:bg-red-50 text-red-600 rounded-lg text-xs sm:text-sm font-medium touch-manipulation"
        >
          Odjavi se
        </Button>
      </div>
    </div>
  );
}