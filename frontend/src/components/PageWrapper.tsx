"use client";

import React from "react"

import { motion, AnimatePresence } from "framer-motion";
import { pageVariants, smoothTransition, prefersReducedMotion } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "centered" | "full";
}

export function PageWrapper({ 
  children, 
  className,
  variant = "default" 
}: PageWrapperProps) {
  const skipAnimation = prefersReducedMotion();
  
  const variantStyles = {
    default: "min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12",
    centered: "min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12",
    full: "min-h-screen",
  };

  if (skipAnimation) {
    return (
      <div className={cn(variantStyles[variant], className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(variantStyles[variant], className)}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={smoothTransition}
    >
      {children}
    </motion.div>
  );
}

// Animated section for staggered children
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ 
  children, 
  className,
  delay = 0 
}: AnimatedSectionProps) {
  const skipAnimation = prefersReducedMotion();

  if (skipAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

// Animated list container
interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  const skipAnimation = prefersReducedMotion();

  if (skipAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Animated list item
interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedListItem({ children, className }: AnimatedListItemProps) {
  const skipAnimation = prefersReducedMotion();

  if (skipAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
      }}
      transition={smoothTransition}
    >
      {children}
    </motion.div>
  );
}
