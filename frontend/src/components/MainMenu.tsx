"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageWrapper, AnimatedSection } from "@/components/PageWrapper";
import { prefersReducedMotion, springTransition, staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Brain, Palette, Trophy, LogOut } from "lucide-react";

interface MainMenuProps {
  onSelectStroop: () => void;
  onSelectMemory: () => void;
  onLeaderboard: () => void;
  onLogout: () => void;
}

export function MainMenu({
  onSelectStroop,
  onSelectMemory,
  onLeaderboard,
  onLogout,
}: MainMenuProps) {
  const skipAnimation = prefersReducedMotion();

  const gameButtons = [
    {
      id: "stroop",
      label: "Stroop Effect",
      description: "Test inhibicije i pažnje",
      icon: Palette,
      onClick: onSelectStroop,
      variant: "primary" as const,
    },
    {
      id: "memory",
      label: "Lanac Pamćenja",
      description: "Test radnog pamćenja",
      icon: Brain,
      onClick: onSelectMemory,
      variant: "accent" as const,
    },
  ];

  const MotionButton = skipAnimation ? "div" : motion.div;

  return (
    <PageWrapper variant="centered" className="bg-background gap-10 md:gap-16">
      {/* Title */}
      <AnimatedSection className="text-center" delay={0}>
        <motion.h1
          className="text-foreground text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          initial={skipAnimation ? undefined : { opacity: 0, y: -20 }}
          animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
          transition={springTransition}
        >
          Kognitivne Igre
        </motion.h1>
      </AnimatedSection>

      {/* Game Selection Buttons */}
      <motion.div
        className="flex flex-col gap-4 w-full max-w-md"
        variants={skipAnimation ? undefined : staggerContainerVariants}
        initial={skipAnimation ? undefined : "initial"}
        animate={skipAnimation ? undefined : "animate"}
      >
        {gameButtons.map((game, index) => (
          <MotionButton
            key={game.id}
            variants={skipAnimation ? undefined : staggerItemVariants}
            whileHover={skipAnimation ? undefined : { scale: 1.02 }}
            whileTap={skipAnimation ? undefined : { scale: 0.98 }}
          >
            <Button
              onClick={game.onClick}
              className={cn(
                "w-full h-20 md:h-24 rounded-2xl",
                "flex items-center justify-start gap-4 px-6",
                "text-left font-semibold",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-300",
                "btn-press",
                game.variant === "primary"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-accent hover:bg-accent/90 text-accent-foreground"
              )}
            >
              <game.icon className="h-8 w-8 md:h-10 md:w-10 shrink-0" />
              <div className="flex flex-col items-start">
                <span className="text-xl md:text-2xl">{game.label}</span>
                <span className="text-sm md:text-base opacity-80 font-normal">
                  {game.description}
                </span>
              </div>
            </Button>
          </MotionButton>
        ))}

        {/* Leaderboard Button */}
        <MotionButton
          variants={skipAnimation ? undefined : staggerItemVariants}
          whileHover={skipAnimation ? undefined : { scale: 1.02 }}
          whileTap={skipAnimation ? undefined : { scale: 0.98 }}
          className="mt-2"
        >
          <Button
            onClick={onLeaderboard}
            variant="outline"
            className={cn(
              "w-full h-14 md:h-16 rounded-xl",
              "flex items-center justify-center gap-3",
              "border-2 border-border hover:bg-secondary",
              "text-foreground font-semibold text-lg md:text-xl",
              "transition-all duration-300",
              "btn-press"
            )}
          >
            <Trophy className="h-5 w-5 md:h-6 md:w-6" />
            <span>Ljestvica</span>
          </Button>
        </MotionButton>
      </motion.div>

      {/* Info Text */}
      <AnimatedSection delay={0.3}>
        <p className="text-muted-foreground text-sm md:text-base">
          Testirajte svoje kognitivne sposobnosti
        </p>
      </AnimatedSection>

      {/* Logout Button */}
      <AnimatedSection delay={0.4}>
        <Button
          onClick={onLogout}
          variant="outline"
          className={cn(
            "px-6 py-2 h-auto rounded-lg",
            "border-2 border-destructive/30 hover:bg-destructive/10",
            "text-destructive font-medium text-sm",
            "transition-all duration-300",
            "btn-press"
          )}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Odjavi se
        </Button>
      </AnimatedSection>
    </PageWrapper>
  );
}
