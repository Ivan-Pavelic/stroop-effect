"use client";

import type { Variants, Transition } from "framer-motion";

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Base transition configs
export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const smoothTransition: Transition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.3,
};

export const fastTransition: Transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15,
};

// Page transition variants
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Fade variants
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Scale variants (for buttons, cards)
export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  tap: { scale: 0.98 },
  hover: { scale: 1.02 },
};

// Slide variants
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDownVariants: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Stagger children animation
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Game-specific animations
export const popInVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition,
  },
  exit: { opacity: 0, scale: 0.8 },
};

export const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

// Digit display animation (for memory chain)
export const digitVariants: Variants = {
  initial: { opacity: 0, scale: 0.3, rotateY: -90 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.3, 
    rotateY: 90,
    transition: { duration: 0.2 },
  },
};

// Feedback animations (correct/wrong)
export const correctVariants: Variants = {
  initial: { scale: 0, rotate: -180 },
  animate: { 
    scale: 1, 
    rotate: 0,
    transition: springTransition,
  },
};

export const wrongVariants: Variants = {
  initial: { x: 0 },
  animate: { 
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};

// Progress bar animation
export const progressVariants: Variants = {
  initial: { scaleX: 0, originX: 0 },
  animate: { scaleX: 1 },
};

// List item animation (for leaderboard)
export const listItemVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Card flip animation
export const cardFlipVariants: Variants = {
  initial: { rotateY: 180, opacity: 0 },
  animate: { rotateY: 0, opacity: 1 },
  exit: { rotateY: -180, opacity: 0 },
};

// Helper to get reduced motion safe variants
export const getMotionProps = (
  variants: Variants,
  skipAnimation = false
): { variants?: Variants; initial?: string; animate?: string; exit?: string } => {
  if (skipAnimation || prefersReducedMotion()) {
    return {};
  }
  return {
    variants,
    initial: "initial",
    animate: "animate",
    exit: "exit",
  };
};
