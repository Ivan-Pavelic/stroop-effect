"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PageWrapper, AnimatedSection, AnimatedList, AnimatedListItem } from "@/components/PageWrapper";
import { leaderboardAPI } from "@/services/api";
import { prefersReducedMotion, springTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { ArrowLeft, Trophy, Medal, Award, Clock, Target } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  score: number;
  avgTime: number;
  accuracy: number;
}

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const skipAnimation = prefersReducedMotion();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await leaderboardAPI.getLeaderboard(50);
        setLeaderboard(response.leaderboard || []);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Neuspješno učitavanje ljestvice");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-muted-foreground font-bold">#{rank}</span>;
  };

  const getRankStyles = (rank: number) => {
    if (rank === 1) return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20";
    if (rank === 2) return "bg-gray-50 border-gray-200 dark:bg-gray-950/20";
    if (rank === 3) return "bg-amber-50 border-amber-200 dark:bg-amber-950/20";
    return "bg-card border-border";
  };

  return (
    <PageWrapper variant="default" className="bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <AnimatedSection delay={0} className="text-center mb-8 md:mb-12">
          <motion.h1
            className="text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            initial={skipAnimation ? undefined : { opacity: 0, y: -20 }}
            animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
            transition={springTransition}
          >
            Ljestvica
          </motion.h1>
        </AnimatedSection>

        {/* Leaderboard List */}
        <div className="mb-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8 text-primary" />
              <span className="ml-3 text-muted-foreground">Učitavanje...</span>
            </div>
          ) : error ? (
            <Card className="p-6 bg-destructive/10 border-destructive/20">
              <p className="text-destructive text-center font-medium">{error}</p>
            </Card>
          ) : leaderboard.length === 0 ? (
            <Card className="p-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                Još nema rezultata na ljestvici
              </p>
            </Card>
          ) : (
            <AnimatedList className="space-y-2 sm:space-y-3">
              {leaderboard.map((entry) => (
                <AnimatedListItem key={entry.userId}>
                  <Card
                    className={cn(
                      "flex items-center gap-3 sm:gap-4 p-3 sm:p-4",
                      "border-2 transition-all duration-300",
                      "hover:shadow-md card-hover",
                      getRankStyles(entry.rank)
                    )}
                  >
                    {/* Rank */}
                    <div className="w-10 sm:w-12 flex items-center justify-center shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Player Name */}
                    <div className="flex-1 min-w-0">
                      <div className="text-foreground font-semibold text-sm sm:text-base truncate">
                        {entry.name}
                      </div>
                    </div>

                    {/* Stats - Desktop */}
                    <div className="hidden sm:flex gap-4 md:gap-6 text-xs sm:text-sm">
                      <div className="text-center min-w-[60px]">
                        <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
                          <Target className="w-3 h-3" />
                          Score
                        </div>
                        <div className="text-foreground font-bold">{entry.score}</div>
                      </div>
                      <div className="text-center min-w-[70px]">
                        <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          Vrijeme
                        </div>
                        <div className="text-foreground font-bold">
                          {Math.round(entry.avgTime)}ms
                        </div>
                      </div>
                      <div className="text-center min-w-[70px]">
                        <div className="text-muted-foreground mb-1">Točnost</div>
                        <div className="text-foreground font-bold">
                          {Math.round(entry.accuracy)}%
                        </div>
                      </div>
                    </div>

                    {/* Stats - Mobile */}
                    <div className="sm:hidden flex flex-col items-end">
                      <div className="text-foreground font-bold text-base">
                        {entry.score}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {Math.round(entry.accuracy)}%
                      </div>
                    </div>
                  </Card>
                </AnimatedListItem>
              ))}
            </AnimatedList>
          )}
        </div>

        {/* Back Button */}
        <AnimatedSection delay={0.2} className="max-w-md mx-auto">
          <Button
            onClick={onBack}
            className={cn(
              "w-full h-14 sm:h-16",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "text-lg sm:text-xl font-semibold rounded-xl",
              "shadow-lg hover:shadow-xl",
              "transition-all duration-300",
              "btn-press"
            )}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Natrag na izbornik
          </Button>
        </AnimatedSection>

        {/* Footer */}
        <p className="text-center text-muted-foreground mt-6 sm:mt-8 text-xs sm:text-sm">
          Globalne ljestvice ažuriraju se dnevno
        </p>
      </div>
    </PageWrapper>
  );
}
