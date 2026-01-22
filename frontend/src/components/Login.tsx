"use client";

import React from "react"

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { PageWrapper, AnimatedSection } from "@/components/PageWrapper";
import { authAPI } from "@/services/api";
import { prefersReducedMotion, springTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface LoginProps {
  onLoginSuccess: (user: {
    id: number;
    username: string;
    role: string;
    ime: string;
    prezime: string;
  }) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const skipAnimation = prefersReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        onLoginSuccess(response.user);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Neuspješna prijava. Provjerite korisničko ime i lozinku.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper variant="centered" className="bg-background gap-8 md:gap-12">
      {/* Header Section */}
      <AnimatedSection className="text-center space-y-4" delay={0}>
        <motion.h1
          className="text-foreground text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
          initial={skipAnimation ? undefined : { opacity: 0, y: -20 }}
          animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
          transition={springTransition}
        >
          Kognitivne Igre
        </motion.h1>
        <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-md mx-auto text-pretty">
          Testirajte svoje kognitivne sposobnosti Stroop testom i igrom Lanac
          Pamćenja
        </p>
      </AnimatedSection>

      {/* Login Card */}
      <AnimatedSection delay={0.1} className="w-full max-w-sm sm:max-w-md">
        <Card className="shadow-lg border-border/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-card-foreground">
              Prijava
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-base sm:text-lg font-semibold text-foreground"
                  >
                    Korisničko ime
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={cn(
                      "h-12 sm:h-14 text-base sm:text-lg px-4",
                      "border-2 border-input rounded-xl",
                      "focus:ring-2 focus:ring-ring focus:border-primary",
                      "transition-all duration-200"
                    )}
                    placeholder="ime.prezime"
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-base sm:text-lg font-semibold text-foreground"
                  >
                    Lozinka
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={cn(
                      "h-12 sm:h-14 text-base sm:text-lg px-4",
                      "border-2 border-input rounded-xl",
                      "focus:ring-2 focus:ring-ring focus:border-primary",
                      "transition-all duration-200"
                    )}
                    placeholder="Unesite lozinku"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={skipAnimation ? undefined : { opacity: 0, y: -10 }}
                  animate={skipAnimation ? undefined : { opacity: 1, y: 0 }}
                  className="bg-destructive/10 border-2 border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-medium"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full h-14 sm:h-16",
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  "text-lg sm:text-xl font-semibold rounded-xl",
                  "shadow-lg hover:shadow-xl",
                  "transition-all duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "btn-press"
                )}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-5 w-5" />
                    <span>Prijava...</span>
                  </span>
                ) : (
                  "Prijavi se"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </AnimatedSection>
    </PageWrapper>
  );
}
