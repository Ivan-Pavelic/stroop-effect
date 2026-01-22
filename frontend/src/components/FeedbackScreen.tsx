"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { prefersReducedMotion, correctVariants, wrongVariants, springTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Check, X, Flame } from "lucide-react";

interface FeedbackScreenProps {
  correct: boolean;
  score: number;
  streak: number;
  onNext: () => void;
}

export function FeedbackScreen({
  correct,
  score,
  streak,
  onNext,
}: FeedbackScreenProps) {
  const skipAnimation = prefersReducedMotion();

  // Auto-advance after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen text-center px-6 md:px-8",
        "transition-colors duration-300",
        correct ? "bg-success/10" : "bg-destructive/10"
      )}
    >
      {/* Feedback Icon */}
      <motion.div
        className={cn(
          "w-24 h-24 md:w-32 md:h-32 rounded-full",
          "flex items-center justify-center mb-6 md:mb-8",
          correct ? "bg-success" : "bg-destructive"
        )}
        variants={skipAnimation ? undefined : (correct ? correctVariants : wrongVariants)}
        initial={skipAnimation ? undefined : "initial"}
        animate={skipAnimation ? undefined : "animate"}
      >
        {correct ? (
          <Check className="w-12 h-12 md:w-16 md:h-16 text-success-foreground" />
        ) : (
          <X className="w-12 h-12 md:w-16 md:h-16 text-destructive-foreground" />
        )}
      </motion.div>

      {/* Feedback Message */}
      <motion.h1
        className={cn(
          "mb-6 md:mb-8 text-5xl md:text-6xl lg:text-8xl font-bold",
          correct ? "text-success" : "text-destructive"
        )}
        initial={skipAnimation ? undefined : { opacity: 0, scale: 0.5 }}
        animate={skipAnimation ? undefined : { opacity: 1, scale: 1 }}
        transition={springTransition}
      >
        {correct ? "Točno!" : "Netočno!"}
      </motion.h1>

      {/* Streak Display */}
      {correct && streak > 1 && (
        <motion.div
          className="flex items-center gap-2 text-2xl md:text-3xl text-warning mb-6 md:mb-8"
          initial={skipAnimation ? undefined : { opacity: 0, y: 20 }}
          animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...springTransition }}
        >
          <Flame className="w-8 h-8 md:w-10 md:h-10" />
          <span className="font-bold">{streak} za redom!</span>
        </motion.div>
      )}

      {/* Score */}
      <motion.div
        className="text-xl md:text-2xl text-muted-foreground mb-8 md:mb-12"
        initial={skipAnimation ? undefined : { opacity: 0 }}
        animate={skipAnimation ? undefined : { opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Rezultat: <span className="font-semibold text-foreground">{score}</span>
      </motion.div>

      {/* Manual Next Button */}
      <Button
        onClick={onNext}
        className={cn(
          "w-full max-w-md h-14 md:h-16",
          "text-lg md:text-xl font-semibold rounded-xl",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-300",
          "btn-press",
          correct
            ? "bg-success hover:bg-success/90 text-success-foreground"
            : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        )}
      >
        Nastavi
      </Button>

      <p className="mt-4 text-muted-foreground text-sm">
        Automatski nastavlja...
      </p>
    </div>
  );
}
