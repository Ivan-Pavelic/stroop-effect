"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface MemoryChainScreenProps {
  onGameEnd: (score: number, level: number, time: number) => void;
}

type Phase = "intro" | "display" | "input" | "result";

export function MemoryChainScreen({ onGameEnd }: MemoryChainScreenProps) {
  // ===== GAME STATE =====
  const [level, setLevel] = useState<number>(1);
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
    const initSeq = generateSequence(1);
    setLevel(1);
    setSequence(initSeq);
    setUserSequence([]);
    setPhase("intro");
    setChecked(false);
    setAccuracy(0);
    setNextLevelPreview(1);
     
  }, []);

  const playDisplay = async (seq: number[]) => {
    setPhase("display");
    setCurrentDisplayDigit(null);

    await sleep(600);
    if (cancelRef.current) return;

    for (let i = 0; i < seq.length; i++) {
      setCurrentDisplayDigit(seq[i]);
      await sleep(450);
      if (cancelRef.current) return;

      setCurrentDisplayDigit(null);
      await sleep(350);
      if (cancelRef.current) return;
    }

    setPhase("input");
  };

  // ===== ACTIONS =====
  const handleReady = () => {
    setIsGameStarted(true);
    if (startTime === 0) setStartTime(Date.now());
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

      setAccuracy(acc);
      setChecked(true);

      let lv = level;
      if (acc === 100) lv = level + 1;
      else if (acc >= 30) lv = level;
      else lv = Math.max(1, level - 1);

      setNextLevelPreview(lv);
      setPhase("result");
    }
  };

  const handleNext = () => {
    const lv = nextLevelPreview;
    const newSeq = generateSequence(lv);

    setLevel(lv);
    setSequence(newSeq);
    setUserSequence([]);
    setChecked(false);
    setAccuracy(0);
    setCurrentDisplayDigit(null);

    playDisplay(newSeq);
  };

  const handleReset = () => {
    setStartTime(0);
    setIsGameStarted(false);

    const newSeq = generateSequence(1);
    setLevel(1);
    setSequence(newSeq);
    setUserSequence([]);
    setChecked(false);
    setAccuracy(0);
    setNextLevelPreview(1);
    setCurrentDisplayDigit(null);
    setPhase("intro");
  };

  const handleEnd = () => {
    const end = Date.now();
    const safeStart = startTime || end;
    const totalTime = (end - safeStart) / 1000;
    onGameEnd(accuracy, level, totalTime);
  };

  // ===== LAYOUT “SLOTOVI” =====
  // 1) HEADER (razina)
  const Header = () => (
    <div className="w-full max-w-5xl h-20 justify-start items-center flex">
      <div className="text-gray-700 text-3xl font-bold">Razina: {level}</div>
    </div>
  );

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
        <div className="bg-gray-100 rounded-xl shadow-lg p-8 w-4/5 h-[60%] items-center justify-center flex">
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
            onClick={handleNext}
            className="h-24 w-72 bg-green-600 hover:bg-green-700 text-white text-3xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-shadow
                       focus:outline-none focus:ring-0 focus-visible:ring-0"
          >
            SLJEDEĆA RAZINA
          </Button>

          <div className="flex items-center justify-center gap-x-5 w-full">
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-16 w-1/2 px-12 border-2 border-red-300 hover:bg-red-50 text-red-600 text-2xl font-bold rounded-xl
                         focus:outline-none focus:ring-0 focus-visible:ring-0"
            >
              RESET
            </Button>

            <Button
              onClick={handleEnd}
              variant="outline"
              className="h-16 w-1/2 px-12 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 text-2xl font-bold rounded-xl
                         focus:outline-none focus:ring-0 focus-visible:ring-0"
            >
              ZAVRŠI
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


  // ===== RENDER =====
  return (
    <div className="h-screen w-full px-8  bg-gradient-to-b from-white to-gray-50">
      <div className="w-full h-full flex flex-col items-center justify-center gap-10">
        {/* 1) Razina */}
        <div className="flex justify-center w-full mt-10">
          <Header />
        </div>

        {/* 2) Naslov faze (UPAMTI/UNESI/REZULTAT) */}
        <div className="flex justify-center w-full ">
          <PhaseTitle />
        </div>



        {/* 4) Sadržaj */}
        <div className="w-full h-full justify-center items-center flex  flex-col ">
          <PhaseContent />
        </div>
      </div>
    </div>

  );
}
