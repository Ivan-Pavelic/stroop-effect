import { Button } from './ui/button';

interface GameSelectionProps {
  onSelectStroop: () => void;
  onSelectMemory: () => void;
  onBack: () => void;
}

export function GameSelection({ onSelectStroop, onSelectMemory, onBack }: GameSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-8 bg-gradient-to-b from-white to-gray-50">
      {/* Title */}
      <h1 className="text-gray-900 mb-16 text-5xl md:text-7xl font-bold">
        Odaberi igru
      </h1>

      {/* Game Selection Buttons */}
      <div className="flex flex-col gap-6 w-full max-w-md">
        <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200">
          <Button
            onClick={onSelectStroop}
            className="w-full h-20 md:h-24 bg-blue-600 hover:bg-blue-700 text-white text-2xl md:text-3xl font-semibold rounded-xl"
          >
            Stroop Effect
          </Button>
          <p className="mt-4 text-sm text-gray-600">
            Testiraj svoju pažnju i brzinu razmišljanja
          </p>
        </div>

        <div className="bg-purple-50 p-8 rounded-2xl border-2 border-purple-200">
          <Button
            onClick={onSelectMemory}
            className="w-full h-20 md:h-24 bg-purple-600 hover:bg-purple-700 text-white text-2xl md:text-3xl font-semibold rounded-xl"
          >
            Lanac Pamćenja
          </Button>
          <p className="mt-4 text-sm text-gray-600">
            Sjeti se sve duže sekvence boja
          </p>
        </div>
      </div>

      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="outline"
        className="mt-12 h-12 px-8 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl"
      >
        Natrag
      </Button>
    </div>
  );
}
