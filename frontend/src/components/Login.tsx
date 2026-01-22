"use client";

import React from "react"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCode } from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
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
  const [showQRPopup, setShowQRPopup] = useState(true);
  const skipAnimation = prefersReducedMotion();

  // Show QR popup on mount
  useEffect(() => {
    setShowQRPopup(true);
  }, []);

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

  const qrUrl = "https://stroop-frontend.onrender.com/";

  return (
    <>
      {/* QR Code Popup */}
      <AnimatePresence>
        {showQRPopup && (
          <Dialog open={showQRPopup} onOpenChange={setShowQRPopup}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={springTransition}
            >
              <DialogContent className="max-w-md">
                <DialogClose onClose={() => setShowQRPopup(false)} />
                <DialogHeader>
                  <DialogTitle className="text-2xl md:text-3xl font-bold text-center">
                    📱 Skeniraj QR kod
                  </DialogTitle>
                </DialogHeader>
                
                <div className="flex flex-col items-center gap-6 py-4">
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-xl shadow-lg flex justify-center">
                    <QRCode
                      value={qrUrl}
                      size={200}
                      level="H"
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>

                  {/* Demo Credentials */}
                  <div className="w-full space-y-4">
                    <div className="bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                      <p className="text-center text-sm md:text-base text-muted-foreground mb-3">
                        Pozivamo vas na demonstraciju i isprobavanje igre:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-background rounded-lg">
                          <span className="text-sm font-semibold text-foreground">Korisničko ime:</span>
                          <span className="text-sm font-mono text-primary font-bold">demo.digobr</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-background rounded-lg">
                          <span className="text-sm font-semibold text-foreground">Lozinka:</span>
                          <span className="text-sm font-mono text-primary font-bold">digobr123</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-center text-xs md:text-sm text-muted-foreground">
                      Skenirajte QR kod ili posjetite:{" "}
                      <a
                        href={qrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-semibold"
                      >
                        stroop-frontend.onrender.com
                      </a>
                    </p>
                  </div>

                  {/* Close Button */}
                  <Button
                    onClick={() => setShowQRPopup(false)}
                    className={cn(
                      "w-full h-12",
                      "bg-primary hover:bg-primary/90 text-primary-foreground",
                      "text-base font-semibold rounded-xl",
                      "shadow-lg hover:shadow-xl",
                      "transition-all duration-300",
                      "btn-press"
                    )}
                  >
                    Zatvori
                  </Button>
                </div>
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>

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
    </>
  );
}
