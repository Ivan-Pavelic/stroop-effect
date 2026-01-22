"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { prefersReducedMotion, digitVariants, springTransition, correctVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { RotateCcw, ArrowRight, Check, X } from "lucide-react";

interface MemoryChainScreenProps {
  round: number;
  totalRounds: number;
  difficulty: "easy" | "medium" | "hard";
  onAnswer: (correct: boolean) => void;
  streak?: number;
}

type Phase = "intro" | "display" | "input" | "result";

export function MemoryChainScreen({
  round,
  totalRounds,
  difficulty,
  onAnswer,
  streak,
}: MemoryChainScreenProps) {
  const skipAnimation = prefersReducedMotion();

  const getInitialLevel = () => {
    if (difficulty === "easy") return 1;
    if (difficulty === "medium") return 3;
    return 7;
  };

  const [level, setLevel] = useState<number>(getInitialLevel());
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentDisplayDigit, setCurrentDisplayDigit] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [nextLevelPreview, setNextLevelPreview] = useState<number>(1);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const cancelRef = useRef(false);

  useEffect(() => {
    cancelRef.current = false;
    return () => {
      cancelRef.current = true;
    };
  }, []);

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

  const handleReady = () => {
    setIsGameStarted(true);
    setShowIntro(false);
    playDisplay(sequence);
  };

  const handleDigitClick = (digit: number) => {
    if (phase !== "input" || checked || userSequence.length >= sequence.length) return;

    const next = [...userSequence, digit];
    setUserSequence(next);

    if (next.length === sequence.length) {
      const correctCount = next.filter((d, i) => d === sequence[i]).length;
      const acc = sequence.length > 0 ? (correctCount / sequence.length) * 100 : 0;

      let newLevel = level;
      if (acc === 100) newLevel = level + 1;
      else if (acc >= 30) newLevel = level;
      else newLevel = Math.max(1, level - 1);

      setAccuracy(acc);
      setChecked(true);
      setNextLevelPreview(newLevel);
      setLevel(newLevel);
      setPhase("result");
    }
  };

  const handleReset = () => {
    const baseLevel = getInitialLevel();
    setLevel(baseLevel);
    setShowIntro(true);
    setPhase("intro");
    setSequence([]);
    setUserSequence([]);
    setChecked(false);
    setAccuracy(0);
    setNextLevelPreview(baseLevel);
    setIsGameStarted(false);
  };

  const progressValue = (round / totalRounds) * 100;

  // Intro Phase
  const IntroContent = () => (
    <motion.div
      className="w-full max-w-2xl flex flex-col items-center gap-8 md:gap-12"
      initial={skipAnimation ? undefined : { opacity: 0, y: 20 }}
      animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
      transition={springTransition}
    >
      <Card className="w-full shadow-lg">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Upute:
          </h3>
          <ul className="space-y-4 text-base md:text-lg text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">1.</span>
              <span>
                Na ekranu će se pojavljivati znamenke koje trebate upamtiti{" "}
                <strong className="text-foreground">u točnom redoslijedu</strong>.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">2.</span>
              <span>Nakon prikaza unesite upamćeni niz.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">3.</span>
              <span>Za početak igre kliknite zeleni gumb KRENI.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Button
        onClick={handleReady}
        className={cn(
          "h-16 md:h-20 px-12 md:px-16",
          "bg-success hover:bg-success/90 text-success-foreground",
          "text-2xl md:text-3xl font-bold rounded-2xl",
          "shadow-xl hover:shadow-2xl",
          "transition-all duration-300",
          "btn-press"
        )}
      >
        KRENI
      </Button>
    </motion.div>
  );

  // Display Phase
  const DisplayContent = () => (
    <div className="w-full flex items-center justify-center min-h-[200px] md:min-h-[300px]">
      <AnimatePresence mode="wait">
        {currentDisplayDigit !== null && (
          <motion.span
            key={currentDisplayDigit}
            className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-extrabold text-foreground leading-none"
            variants={skipAnimation ? undefined : digitVariants}
            initial={skipAnimation ? undefined : "initial"}
            animate={skipAnimation ? undefined : "animate"}
            exit={skipAnimation ? undefined : "exit"}
          >
            {currentDisplayDigit}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );

  // Input Phase
  const InputContent = () => (
    <motion.div
      className="w-full max-w-xl flex flex-col items-center gap-8 md:gap-12"
      initial={skipAnimation ? undefined : { opacity: 0 }}
      animate={skipAnimation ? undefined : { opacity: 1 }}
      transition={springTransition}
    >
      {/* Progress indicator */}
      <div className="text-center">
        <p className="text-muted-foreground text-xl md:text-2xl mb-4">
          {userSequence.length} / {sequence.length}
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          {sequence.map((_, i) => {
            const filled = i < userSequence.length;
            return (
              <motion.div
                key={i}
                className={cn(
                  "w-12 h-12 md:w-16 md:h-16 rounded-xl",
                  "flex items-center justify-center",
                  "font-bold text-xl md:text-2xl",
                  "transition-all duration-200",
                  filled
                    ? "bg-secondary text-foreground"
                    : "bg-muted text-muted-foreground"
                )}
                initial={skipAnimation || !filled ? undefined : { scale: 0.8 }}
                animate={skipAnimation || !filled ? undefined : { scale: 1 }}
              >
                {filled ? userSequence[i] : "?"}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 10 }, (_, i) => i).map((digit) => (
          <Button
            key={digit}
            onClick={() => handleDigitClick(digit)}
            className={cn(
              "w-14 h-14 md:w-18 md:h-18",
              "bg-secondary hover:bg-secondary/80 text-foreground",
              "text-2xl md:text-3xl font-bold rounded-xl",
              "transition-all duration-150",
              "active:scale-95",
              "btn-press"
            )}
          >
            {digit}
          </Button>
        ))}
      </div>
    </motion.div>
  );

  // Result Phase
  const ResultContent = () => {
    const correctCount = userSequence.filter((d, i) => d === sequence[i]).length;
    const isCorrect = accuracy === 100;

    return (
      <motion.div
        className="w-full max-w-xl flex flex-col items-center gap-8 md:gap-12"
        initial={skipAnimation ? undefined : { opacity: 0 }}
        animate={skipAnimation ? undefined : { opacity: 1 }}
        transition={springTransition}
      >
        {/* Result display */}
        <div className="text-center">
          <p className="text-muted-foreground text-xl md:text-2xl mb-4">
            Točnost: {Math.round(accuracy)}% ({correctCount}/{sequence.length})
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {sequence.map((_, i) => {
              const ok = userSequence[i] === sequence[i];
              return (
                <motion.div
                  key={i}
                  className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-xl",
                    "flex items-center justify-center",
                    "font-bold text-xl md:text-2xl text-white",
                    "transition-all duration-200",
                    ok ? "bg-success" : "bg-destructive"
                  )}
                  initial={skipAnimation ? undefined : { scale: 0, rotate: -180 }}
                  animate={skipAnimation ? undefined : { scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.05, ...springTransition }}
                >
                  {userSequence[i]}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={() => onAnswer(isCorrect)}
            className={cn(
              "h-16 md:h-20 px-10 md:px-14",
              "bg-success hover:bg-success/90 text-success-foreground",
              "text-xl md:text-2xl font-bold rounded-2xl",
              "shadow-xl hover:shadow-2xl",
              "transition-all duration-300",
              "btn-press"
            )}
          >
            <ArrowRight className="mr-2 h-6 w-6" />
            SLJEDEĆA RAZINA
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            className={cn(
              "h-12 md:h-14 px-8",
              "border-2 border-destructive/30 hover:bg-destructive/10",
              "text-destructive font-bold text-lg md:text-xl rounded-xl",
              "transition-all duration-300",
              "btn-press"
            )}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            ISPOČETKA
          </Button>
        </div>
      </motion.div>
    );
  };

  const getPhaseTitle = () => {
    if (phase === "intro") return "Lanac Pamćenja";
    if (phase === "display") return "Upamti niz:";
    if (phase === "input") return "Unesi niz:";
    return "Rezultat:";
  };

  return (
    <div className="flex flex-col min-h-screen items-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-background gap-6 md:gap-10">
      {/* Progress Bar */}
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center text-sm md:text-base mb-2">
          <span className="text-muted-foreground">
            Runda {round} od {totalRounds}
          </span>
          {typeof streak === "number" && streak > 1 && (
            <span className="text-warning font-semibold">
              {streak} streak!
            </span>
          )}
        </div>
        <Progress value={progressValue} className="h-2 md:h-3" />
      </div>

      {/* Phase Title */}
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center"
        key={phase}
        initial={skipAnimation ? undefined : { opacity: 0, y: -10 }}
        animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
        transition={springTransition}
      >
        {getPhaseTitle()}
      </motion.h2>

      {/* Phase Content */}
      <div className="flex-1 flex items-center justify-center w-full py-4">
        {!isGameStarted && phase === "intro" && <IntroContent />}
        {phase === "display" && <DisplayContent />}
        {phase === "input" && <InputContent />}
        {phase === "result" && <ResultContent />}
      </div>
    </div>
  );
}
