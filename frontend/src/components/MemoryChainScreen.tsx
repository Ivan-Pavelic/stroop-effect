"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface MemoryChainScreenProps {
  round: number;
  totalRounds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  onAnswer: (correct: boolean) => void;
  streak?: number;
}

type Phase = "intro" | "display" | "input" | "result";

export function MemoryChainScreen({ round, totalRounds, difficulty, onAnswer, streak }: MemoryChainScreenProps) {
  // ===== GAME STATE =====
  // Početni level ovisi o težini
  const getInitialLevel = () => {
    if (difficulty === 'easy') return 1;
    if (difficulty === 'medium') return 3;
    return 7;
  };
  const [level, setLevel] = useState<number>(getInitialLevel());
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentDisplayDigit, setCurrentDisplayDigit] = useState<number | null>(
    null
  );

  const [checked, setChecked] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [nextLevelPreview, setNextLevelPreview] = useState<number>(1);

  const [startTime, setStartTime] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const cancelRef = useRef(false);
  useEffect(() => {
    cancelRef.current = false;
    return () => {
      cancelRef.current = true;
    };
  }, []);

  // ===== HELPERS =====
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const generateSequence = (len: number) => {
    const s: number[] = [];
    for (let i = 0; i < len; i++) s.push(Math.floor(Math.random() * 10));
    return s;
  };

  useEffect(() => {
    let baseLevel = level;
    let initSeq: number[] = [];

    if (round === 1) {
      baseLevel = getInitialLevel();
      setLevel(baseLevel);
      initSeq = generateSequence(baseLevel);
    } else {
      initSeq = generateSequence(level);
    }

    setSequence(initSeq);
    setUserSequence([]);
    setChecked(false);
    setAccuracy(0);
    setNextLevelPreview(baseLevel);

    if (round === 1 && showIntro) {
      setPhase("intro");
    } else {
      setPhase("display");
      playDisplay(initSeq);
    }
  }, [round, difficulty, showIntro]);

  const playDisplay = async (seq: number[]) => {
    setPhase("display");
    setCurrentDisplayDigit(null);

    await sleep(800);
    if (cancelRef.current) return;

    for (let i = 0; i < seq.length; i++) {
      setCurrentDisplayDigit(seq[i]);
      await sleep(800);
      if (cancelRef.current) return;

      setCurrentDisplayDigit(null);
      await sleep(600);
      if (cancelRef.current) return;
    }

    setPhase("input");
  };

  // ===== ACTIONS =====
  const handleReady = () => {
    setIsGameStarted(true);
    setShowIntro(false);
    playDisplay(sequence);
  };

  const handleDigitClick = (digit: number) => {
    if (phase !== "input") return;
    if (checked) return;
    if (userSequence.length >= sequence.length) return;

    const next = [...userSequence, digit];
    setUserSequence(next);

    if (next.length === sequence.length) {
      const correctCount = next.filter((d, i) => d === sequence[i]).length;
      const acc = sequence.length > 0 ? (correctCount / sequence.length) * 100 : 0;

      // Pravilo levela za sve težine
      let newLevel = level;
      if (acc === 100) newLevel = level + 1;
      else if (acc >= 30) newLevel = level;
      else newLevel = Math.max(1, level - 1);

      setAccuracy(acc);
      setChecked(true);
      setNextLevelPreview(newLevel);
      setLevel(newLevel);

      // Bitno: ostani u "result" dok user ne klikne gumb
      setPhase("result");
    }
  };

  // handleNext više nije potreban, runde se kontroliraju iz parenta
  const handleNext = () => {};

  // Reset se radi iz parenta
  const handleReset = () => {};

  // End se radi iz parenta
  const handleEnd = () => {};

  // ===== LAYOUT “SLOTOVI” =====

  // 2) NASLOV FAZE (UPAMTI / UNESI / REZULTAT)
  const PhaseTitle = () => {
    let title = "";
    if (phase === "intro") {
      title = "LANAC PAMĆENJA";
    } else if (phase === "display") {
      title = "UPAMTI NIZ:";
    } else if (phase === "input") {
      title = "UNESI NIZ:";
    } else if (phase === "result") {
      title = "REZULTAT:";
    }

    return (
      <div className="w-full max-w-5xl">
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-2">{title}</h2>
      </div>
    );
  };

  // 3) SADRŽAJ FAZE (ispod naslova)
  const PhaseContent = () => {
  // INTRO
  if (!isGameStarted && phase === "intro") {
    return (
      <div className="w-full h-full gap-y-20 flex flex-col items-center justify-center">
        <div className="bg-gray-100 rounded-xl shadow-lg p-8 w-4/5 h-70 items-center justify-center flex">
          <div className="flex flex-col gap-5 justify-center h-full w-[90%]">
            <h3 className="text-4xl font-bold text-gray-900 mb-6 text-left">
              UPUTE:
            </h3>

            <ul className="text-2xl text-left space-y-4 ml-6">
              <li className="text-gray-700 leading-relaxed flex items-start">
                <span className="mr-3">•</span>
                <span>
                  Na ekranu će se pojavljivati znamenke koje trebate upamtiti{" "}
                  <strong>u točnom redoslijedu</strong>.
                </span>
              </li>
              <li className="text-gray-700 leading-relaxed flex items-start">
                <span className="mr-3">•</span>
                <span>Nakon prikaza unesite upamćeni niz.</span>
              </li>
              <li className="text-gray-700 leading-relaxed flex items-start">
                <span className="mr-3">•</span>
                <span>Za početak igre kliknite zeleni gumb KRENI.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <Button
            onClick={handleReady}
            className="h-24 w-72 bg-green-600 hover:bg-green-700 text-white text-5xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-shadow
                       focus:outline-none focus:ring-0 focus-visible:ring-0"
          >
            KRENI
          </Button>
        </div>
      </div>
    );
  }

  // DISPLAY
  if (phase === "display") {
    return (
      <div className="w-full h-full flex items-start justify-center">
        <span className="text-[16rem] font-extrabold text-black leading-none">
          {currentDisplayDigit ?? ""}
        </span>
      </div>
    );
  }

  // INPUT
  if (phase === "input") {
    return (
      <div className="w-full max-w-5xl h-full flex flex-col items-center gap-40">
        <div className="flex flex-col justify-center items-center gap-4 flex-wrap mb-12">
          <p className="text-gray-500 text-4xl mb-10">
            {userSequence.length} / {sequence.length}
          </p>

          <div className="flex w-full gap-x-2 justify-center flex-wrap">
            {sequence.map((_, i) => {
              const filled = i < userSequence.length;
              return (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold text-4xl transition-all
                    ${filled ? "bg-gray-300 text-gray-800" : "bg-gray-200 text-gray-400"}`}
                >
                  {filled ? userSequence[i] : "?"}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 10 }, (_, i) => i).map((digit) => (
            <Button
              key={digit}
              onClick={() => handleDigitClick(digit)}
              className="w-20 h-20 bg-gray-600 hover:bg-gray-800 text-white text-4xl font-bold rounded-xl
                         focus:outline-none focus:ring-0 focus-visible:ring-0"
            >
              {digit}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // RESULT
  if (phase === "result") {
    const correctCount = userSequence.filter((d, i) => d === sequence[i]).length;
    const isCorrect = accuracy === 100;

    return (
      <div className="w-full max-w-5xl h-full flex flex-col items-center gap-40">
        <div className="flex flex-col justify-center items-center gap-4 flex-wrap mb-12">
          <p className="text-gray-500 text-4xl mb-10">
            Točnost: {Math.round(accuracy)}% ({correctCount}/{sequence.length})
          </p>

          <div className="flex w-full gap-x-2 justify-center flex-wrap">
            {sequence.map((_, i) => {
              const ok = userSequence[i] === sequence[i];
              return (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold text-4xl transition-all
                    ${ok ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                >
                  {userSequence[i]}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center gap-6">
          <Button
            onClick={() => {
              onAnswer(isCorrect);
            }}
            className="h-24 w-72 bg-green-600 hover:bg-green-700 text-white text-3xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-shadow
                       focus:outline-none focus:ring-0 focus-visible:ring-0"
          >
            SLJEDEĆA RAZINA
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Reset: vrati na početni level, showIntro, očisti sve
              const baseLevel = getInitialLevel();
              setLevel(baseLevel);
              setShowIntro(true);
              setPhase("intro");
              setSequence([]);
              setUserSequence([]);
              setChecked(false);
              setAccuracy(0);
              setNextLevelPreview(baseLevel);
            }}
            className="h-16 w-1/2 px-12 border-2 border-red-300 hover:bg-red-50 text-red-600 text-2xl font-bold rounded-xl
                       focus:outline-none focus:ring-0 focus-visible:ring-0 mt-4"
          >
            ISPOČETKA
          </Button>
        </div>
      </div>
    );
  }

  return null;
};


  // ===== RENDER =====
  return (
    <div className="flex flex-col min-h-screen items-center px-8 bg-gradient-to-b from-white to-gray-50 gap-y-10">
  {/* Progress Bar */}
  <div className="w-full max-w-md">
    <div className="flex justify-between text-gray-500 text-lg mb-2">
      <span>Rudna {round} od {totalRounds}</span>
      {typeof streak === "number" && streak > 1 && (
        <span className="text-orange-500">🔥 {streak} streak!</span>
      )}
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
        style={{ width: `${(round / totalRounds) * 100}%` }}
      />
    </div>
  </div>

  {/* Title */}
  <div className="flex justify-center w-full h-20 items-center">
    <PhaseTitle />
  </div>

  {/* Content (uzima ostatak, ali gap ostaje vidljiv) */}
  <div className="w-full flex grow items-center justify-center">
    <PhaseContent />
  </div>
</div>

  );
}
