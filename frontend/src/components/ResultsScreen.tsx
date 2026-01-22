"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PageWrapper, AnimatedSection } from "@/components/PageWrapper";
import { aiAPI, gameAPI } from "@/services/api";
import { prefersReducedMotion, springTransition, staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { RotateCcw, Home, Target, Clock, CheckCircle, XCircle } from "lucide-react";

interface Trial {
  isCongruent: boolean;
  wordText: string;
  displayColor: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  reactionTime: number;
}

interface ResultsScreenProps {
  trials: Trial[];
  gameStartTime: number;
  onReturnToMenu: () => void;
  onPlayAgain: () => void;
}

interface AIAnalysis {
  y: number;
  cognitiveScore: number;
  level: string;
  levelColor: string;
  components: {
    accuracy: number;
    speed: number;
    consistency: number;
  };
}

export function ResultsScreen({
  trials,
  gameStartTime,
  onReturnToMenu,
  onPlayAgain,
}: ResultsScreenProps) {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const hasSavedRef = useRef(false);
  const skipAnimation = prefersReducedMotion();

  // Calculate statistics
  const totalTrials = trials.length;
  const correctTrials = trials.filter((t) => t.isCorrect).length;
  const accuracy = totalTrials > 0 ? Math.round((correctTrials / totalTrials) * 100) : 0;

  const correctTimes = trials.filter((t) => t.isCorrect).map((t) => t.reactionTime);
  const avgTime = correctTimes.length > 0
    ? Math.round(correctTimes.reduce((a, b) => a + b, 0) / correctTimes.length)
    : 0;

  const congruentTrials = trials.filter((t) => t.isCongruent);
  const incongruentTrials = trials.filter((t) => !t.isCongruent);
  const congruentCorrect = congruentTrials.filter((t) => t.isCorrect).length;
  const incongruentCorrect = incongruentTrials.filter((t) => t.isCorrect).length;
  const congruentAccuracy = congruentTrials.length > 0
    ? Math.round((congruentCorrect / congruentTrials.length) * 100)
    : 0;
  const incongruentAccuracy = incongruentTrials.length > 0
    ? Math.round((incongruentCorrect / incongruentTrials.length) * 100)
    : 0;

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (totalTrials === 0) {
        setLoading(false);
        hasSavedRef.current = false;
        return;
      }

      if (hasSavedRef.current) return;

      try {
        setLoading(true);

        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        const age = user?.dob
          ? Math.floor((Date.now() - new Date(user.dob).getTime()) / (1000 * 60 * 60 * 24 * 365))
          : 50;
        const sex = user?.spol === "M" ? 1 : 0;
        const timeOfDay = new Date().getHours() * 60 + new Date().getMinutes();

        const response = await aiAPI.analyzePerformance({
          corr_mean: accuracy / 100,
          rt_mean: avgTime,
          age,
          sex,
          timeofday: timeOfDay,
          roundTimes: trials.map((t) => t.reactionTime),
          answers: trials.map((t) => (t.isCorrect ? 1 : 0)),
          totalRounds: totalTrials,
        });

        if (response.success && response.analysis) {
          setAiAnalysis(response.analysis);

          if (user && !hasSavedRef.current) {
            try {
              setSaving(true);
              hasSavedRef.current = true;
              await gameAPI.saveResult({
                score: correctTrials,
                totalRounds: totalTrials,
                accuracy,
                avgTime,
                roundTimes: trials.map((t) => t.reactionTime),
                answers: trials.map((t) => t.isCorrect),
                trials: trials.map((t) => ({
                  isCongruent: t.isCongruent,
                  wordText: t.wordText,
                  displayColor: t.displayColor,
                  correctAnswer: t.correctAnswer,
                  userAnswer: t.userAnswer,
                  isCorrect: t.isCorrect,
                  reactionTime: t.reactionTime,
                })),
                congruentAccuracy,
                incongruentAccuracy,
              });
            } catch (err) {
              console.error("Failed to save game result:", err);
              hasSavedRef.current = false;
            } finally {
              setSaving(false);
            }
          }
        }
      } catch (err) {
        console.error("Failed to get AI analysis:", err);
        setError("Neuspješno učitavanje AI analize");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [trials.length]);

  const stats = [
    {
      label: "Točnost",
      value: `${accuracy}%`,
      icon: Target,
      color: "text-primary",
    },
    {
      label: "Prosječno vrijeme",
      value: `${avgTime}ms`,
      icon: Clock,
      color: "text-accent",
    },
  ];

  const detailedStats = [
    { label: "Kongruentni", value: `${congruentAccuracy}%`, icon: CheckCircle },
    { label: "Nekongruentni", value: `${incongruentAccuracy}%`, icon: XCircle },
  ];

  return (
    <PageWrapper variant="centered" className="bg-background gap-6 md:gap-8">
      {/* Title */}
      <AnimatedSection delay={0}>
        <motion.h1
          className="text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center"
          initial={skipAnimation ? undefined : { opacity: 0, y: -20 }}
          animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
          transition={springTransition}
        >
          Rezultati testa
        </motion.h1>
      </AnimatedSection>

      {/* Stats Card */}
      <AnimatedSection delay={0.1} className="w-full max-w-md">
        <Card className="shadow-lg border-border/50">
          <CardContent className="p-6 md:p-8">
            {/* Main Stats */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-6"
              variants={skipAnimation ? undefined : staggerContainerVariants}
              initial={skipAnimation ? undefined : "initial"}
              animate={skipAnimation ? undefined : "animate"}
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  variants={skipAnimation ? undefined : staggerItemVariants}
                >
                  <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
                  <div className="text-muted-foreground text-xs sm:text-sm mb-1">
                    {stat.label}
                  </div>
                  <div className={cn("text-2xl sm:text-3xl md:text-4xl font-bold", stat.color)}>
                    {stat.value}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Detailed Stats */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {detailedStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <stat.icon className="w-4 h-4" />
                      {stat.label}
                    </div>
                    <div className="font-semibold text-foreground text-base sm:text-lg">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Trials */}
            <div className="border-t border-border pt-4 mt-4 text-center">
              <div className="text-muted-foreground text-xs sm:text-sm mb-1">
                Ukupno zadataka
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
                {totalTrials}
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Saving Indicator */}
      {saving && (
        <motion.div
          className="bg-primary/10 rounded-2xl p-4 w-full max-w-md"
          initial={skipAnimation ? undefined : { opacity: 0, y: 10 }}
          animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Spinner className="h-4 w-4 text-primary" />
            <span className="text-primary text-sm">Spremanje rezultata...</span>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <AnimatedSection delay={0.2} className="flex flex-col gap-3 w-full max-w-md">
        <Button
          onClick={onPlayAgain}
          className={cn(
            "w-full h-14 sm:h-16",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "text-base sm:text-lg md:text-xl font-semibold rounded-xl",
            "shadow-lg hover:shadow-xl",
            "transition-all duration-300",
            "btn-press"
          )}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Igraj ponovno
        </Button>

        <Button
          onClick={onReturnToMenu}
          variant="outline"
          className={cn(
            "w-full h-12 sm:h-14",
            "border-2 border-border hover:bg-secondary",
            "text-foreground text-base sm:text-lg rounded-xl",
            "transition-all duration-300",
            "btn-press"
          )}
        >
          <Home className="mr-2 h-5 w-5" />
          Povratak na izbornik
        </Button>
      </AnimatedSection>
    </PageWrapper>
  );
}
