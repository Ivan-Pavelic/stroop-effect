import { Button } from "./ui/button";

interface ModeSelectionProps {
  gameName: string;
  onSelectSingle: () => void;
  onSelectMultiplayer: () => void;
  onBack: () => void;
}

export function ModeSelection({ gameName, onSelectSingle, onSelectMultiplayer, onBack }: ModeSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 px-4">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Odaberi način igre za <span className="text-blue-600">{gameName}</span>
      </h2>
      <div className="flex gap-8">
        <Button
          className="h-30 w-65 px-12 text-3xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow text-center"
          onClick={onSelectSingle}
        >
          👤 Single Player
        </Button>
        <Button
          className="h-30 w-65 px-12 text-3xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow text-center"
          onClick={onSelectMultiplayer}
        >
          👥 Multiplayer
        </Button>
      </div>
      <Button
        variant="outline"
        className="h-20 w-60 px-12 text-2xl font-bold border-gray-300 text-gray-700 hover:bg-gray-400 rounded-xl shadow-xl hover:shadow-2xl transition-shadow text-center"
        
        onClick={onBack}
      >
        Nazad
      </Button>
    </div>
  );
}
