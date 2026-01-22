"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageWrapper, AnimatedSection } from "@/components/PageWrapper";
import { prefersReducedMotion, springTransition, staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { User, Users, ArrowLeft } from "lucide-react";

interface ModeSelectionProps {
  gameName: string;
  onSelectSingle: () => void;
  onSelectMultiplayer: () => void;
  onBack: () => void;
}

export function ModeSelection({
  gameName,
  onSelectSingle,
  onSelectMultiplayer,
  onBack,
}: ModeSelectionProps) {
  const skipAnimation = prefersReducedMotion();

  const modes = [
    {
      id: "single",
      label: "Single Player",
      description: "Igraj sam i prati svoj napredak",
      icon: User,
      onClick: onSelectSingle,
      variant: "primary" as const,
    },
    {
      id: "multiplayer",
      label: "Multiplayer",
      description: "Natječi se s drugim igračima",
      icon: Users,
      onClick: onSelectMultiplayer,
      variant: "accent" as const,
    },
  ];

  const MotionDiv = skipAnimation ? "div" : motion.div;

  return (
    <PageWrapper variant="centered" className="bg-background gap-10 md:gap-12">
      {/* Title */}
      <AnimatedSection className="text-center space-y-2" delay={0}>
        <h2 className="text-muted-foreground text-lg md:text-xl font-medium">
          Odaberi način igre
        </h2>
        <motion.h1
          className="text-primary text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          initial={skipAnimation ? undefined : { opacity: 0, scale: 0.9 }}
          animate={skipAnimation ? undefined : { opacity: 1, scale: 1 }}
          transition={springTransition}
        >
          {gameName}
        </motion.h1>
      </AnimatedSection>

      {/* Mode Selection Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-2xl"
        variants={skipAnimation ? undefined : staggerContainerVariants}
        initial={skipAnimation ? undefined : "initial"}
        animate={skipAnimation ? undefined : "animate"}
      >
        {modes.map((mode) => (
          <MotionDiv
            key={mode.id}
            variants={skipAnimation ? undefined : staggerItemVariants}
            whileHover={skipAnimation ? undefined : { scale: 1.03, y: -4 }}
            whileTap={skipAnimation ? undefined : { scale: 0.98 }}
            className="flex-1"
          >
            <Button
              onClick={mode.onClick}
              className={cn(
                "w-full h-32 sm:h-40 rounded-2xl",
                "flex flex-col items-center justify-center gap-3",
                "font-semibold",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-300",
                "btn-press",
                mode.variant === "primary"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-accent hover:bg-accent/90 text-accent-foreground"
              )}
            >
              <mode.icon className="h-10 w-10 sm:h-12 sm:w-12" />
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl">{mode.label}</span>
                <span className="text-sm sm:text-base opacity-80 font-normal mt-1">
                  {mode.description}
                </span>
              </div>
            </Button>
          </MotionDiv>
        ))}
      </motion.div>

      {/* Back Button */}
      <AnimatedSection delay={0.3}>
        <Button
          onClick={onBack}
          variant="outline"
          className={cn(
            "h-14 px-8 rounded-xl",
            "border-2 border-border hover:bg-secondary",
            "text-foreground font-semibold text-lg",
            "transition-all duration-300",
            "btn-press"
          )}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Nazad
        </Button>
      </AnimatedSection>
    </PageWrapper>
  );
}
