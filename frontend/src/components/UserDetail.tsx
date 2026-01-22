"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PageWrapper, AnimatedSection } from "@/components/PageWrapper";
import { prefersReducedMotion, springTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Trash2,
  RefreshCw,
  Gamepad2,
  Target,
  Brain,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface User {
  id: number;
  ime: string;
  prezime: string;
  username: string;
  email: string;
  role: string;
}

interface ChartDataPoint {
  date: string;
  gameNumber?: number;
  accuracy: number;
  cognitiveScore: number;
  avgTime: number;
  totalTrials: number;
  correctTrials: number;
  congruentAccuracy: number;
  incongruentAccuracy: number;
}

interface UserStats {
  userId: number;
  totalGames: number;
  avgAccuracy: number;
  avgCognitiveScore: number;
  chartData: ChartDataPoint[];
}

interface AIFeedback {
  hasData: boolean;
  gameDate?: string;
  aiAnalysis?: {
    cognitiveScore: number;
    level: string;
  };
  yValue?: number;
  feedback?: string;
  message?: string;
}

interface UserDetailProps {
  user: User;
  onBack: () => void;
  onDelete: (userId: number) => void;
}

export function UserDetail({ user, onBack, onDelete }: UserDetailProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const skipAnimation = prefersReducedMotion();

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, feedbackData] = await Promise.all([
        adminAPI.getUserStats(user.id),
        adminAPI.getUserAIFeedback(user.id).catch(() => null),
      ]);
      setStats(statsData);
      setAiFeedback(feedbackData);
    } catch (err) {
      console.error("Error loading user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshFeedback = async () => {
    try {
      setLoadingFeedback(true);
      const feedbackData = await adminAPI.getUserAIFeedback(user.id);
      setAiFeedback(feedbackData);
    } catch (err) {
      console.error("Error loading AI feedback:", err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const formatChartData = () => {
    if (!stats || stats.chartData.length === 0) {
      return [];
    }

    const seen = new Set<string>();
    const uniqueData = stats.chartData.filter((point) => {
      const key = `${point.date}-${point.cognitiveScore}-${point.accuracy}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    // Sort by date to ensure lines connect properly
    const sortedData = [...uniqueData].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });

    return sortedData.map((point, index) => {
      const date = new Date(point.date);
      const label = point.gameNumber
        ? `Igra ${point.gameNumber}`
        : date.toLocaleDateString("hr-HR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

      return {
        date: label,
        dateKey: `${point.date}-${index}`,
        "Točnost (%)": Math.round(point.accuracy),
        "Kognitivni Score": Math.round(point.cognitiveScore * 10) / 10,
        "Prosječno vrijeme (ms)": Math.round(point.avgTime),
        "Kongruentni (%)": Math.round(point.congruentAccuracy),
        "Nekongruentni (%)": Math.round(point.incongruentAccuracy),
      };
    });
  };

  const chartData = formatChartData();

  const statCards = stats
    ? [
        {
          label: "Ukupno igara",
          value: stats.totalGames,
          icon: Gamepad2,
          color: "text-primary",
        },
        {
          label: "Prosječna točnost",
          value: `${stats.avgAccuracy.toFixed(1)}%`,
          icon: Target,
          color: "text-accent",
        },
        {
          label: "Prosječni kognitivni score",
          value: stats.avgCognitiveScore.toFixed(1),
          icon: Brain,
          color: "text-success",
        },
      ]
    : [];

  if (loading) {
    return (
      <PageWrapper variant="centered" className="bg-background">
        <Spinner className="h-8 w-8 text-primary" />
        <span className="ml-3 text-muted-foreground">Učitavanje...</span>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper variant="default" className="bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 md:mb-12">
          <AnimatedSection delay={0}>
            <motion.div
              initial={skipAnimation ? undefined : { opacity: 0, x: -20 }}
              animate={skipAnimation ? undefined : { opacity: 1, x: 0 }}
              transition={springTransition}
            >
              <h1 className="text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
                {user.ime} {user.prezime}
              </h1>
              <p className="text-muted-foreground text-base md:text-lg">
                {user.email} • {user.username}
              </p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="flex gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              className={cn(
                "px-6 h-12 rounded-xl",
                "border-2 border-border hover:bg-secondary",
                "text-foreground font-semibold",
                "transition-all duration-300",
                "btn-press"
              )}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Natrag
            </Button>
            <Button
              onClick={() => onDelete(user.id)}
              className={cn(
                "px-6 h-12 rounded-xl",
                "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                "font-semibold",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-300",
                "btn-press"
              )}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Obriši
            </Button>
          </AnimatedSection>
        </div>

        {/* Summary Stats */}
        {stats && (
          <AnimatedSection delay={0.2} className="mb-8">
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Statistike
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {statCards.map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-4 rounded-xl bg-muted/30"
                    >
                      <stat.icon
                        className={cn("w-8 h-8 mx-auto mb-2", stat.color)}
                      />
                      <div className="text-sm text-muted-foreground mb-1">
                        {stat.label}
                      </div>
                      <div
                        className={cn("text-2xl md:text-3xl font-bold", stat.color)}
                      >
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        )}

        {/* Chart */}
        <AnimatedSection delay={0.3} className="mb-8">
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Graf performansi kroz vrijeme
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Nema podataka za prikaz
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <div
                    className="min-w-[600px] sm:min-w-0"
                    style={{ height: "400px", width: "100%" }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.5}
                        />
                        <XAxis
                          dataKey="date"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                          interval="preserveStartEnd"
                          tick={{ fill: "hsl(var(--muted-foreground))" }}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                          width={50}
                          tick={{ fill: "hsl(var(--muted-foreground))" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            padding: "12px",
                            fontSize: "13px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                          labelStyle={{
                            color: "hsl(var(--foreground))",
                            fontWeight: "bold",
                            marginBottom: "8px",
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            paddingTop: "20px",
                            fontSize: "12px",
                          }}
                          iconSize={12}
                        />
                        <Line
                          type="monotone"
                          dataKey="Točnost (%)"
                          stroke="#4f46e5"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: "#4f46e5" }}
                          activeDot={{ r: 6, fill: "#4f46e5" }}
                          connectNulls={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Kognitivni Score"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: "#10b981" }}
                          activeDot={{ r: 6, fill: "#10b981" }}
                          connectNulls={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Kongruentni (%)"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#8b5cf6" }}
                          activeDot={{ r: 5, fill: "#8b5cf6" }}
                          strokeDasharray="5 5"
                          connectNulls={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Nekongruentni (%)"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#f59e0b" }}
                          activeDot={{ r: 5, fill: "#f59e0b" }}
                          strokeDasharray="5 5"
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* AI Feedback */}
        <AnimatedSection delay={0.4}>
          <Card className="shadow-lg border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                AI Analiza i Povratna Informacija
              </CardTitle>
              <Button
                onClick={refreshFeedback}
                disabled={loadingFeedback}
                variant="outline"
                className={cn(
                  "px-4 h-10 rounded-lg",
                  "border-2 border-primary/30 hover:bg-primary/10",
                  "text-primary font-semibold",
                  "transition-all duration-300",
                  "btn-press"
                )}
              >
                {loadingFeedback ? (
                  <Spinner className="h-4 w-4 mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Osvježi
              </Button>
            </CardHeader>
            <CardContent>
              {aiFeedback ? (
                aiFeedback.hasData ? (
                  <div className="space-y-6">
                    {aiFeedback.gameDate && (
                      <div className="text-sm text-muted-foreground">
                        Posljednja igra:{" "}
                        {new Date(aiFeedback.gameDate).toLocaleDateString("hr-HR")}
                      </div>
                    )}

                    {aiFeedback.aiAnalysis && (
                      <div className="bg-primary/5 rounded-xl p-6">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">
                              Kognitivni Score
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-primary">
                              {aiFeedback.aiAnalysis.cognitiveScore}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">
                              Razina
                            </div>
                            <div className="text-lg md:text-xl font-semibold text-foreground">
                              {aiFeedback.aiAnalysis.level}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">
                              Y vrijednost
                            </div>
                            <div
                              className={cn(
                                "text-2xl md:text-3xl font-bold",
                                aiFeedback.yValue === 1
                                  ? "text-destructive"
                                  : "text-success"
                              )}
                            >
                              {aiFeedback.yValue}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {aiFeedback.feedback && (
                      <div
                        className={cn(
                          "p-6 rounded-xl border-2",
                          aiFeedback.yValue === 1
                            ? "bg-destructive/5 border-destructive/20"
                            : "bg-success/5 border-success/20"
                        )}
                      >
                        <div
                          className={cn(
                            "font-semibold mb-2",
                            aiFeedback.yValue === 1
                              ? "text-destructive"
                              : "text-success"
                          )}
                        >
                          Povratna informacija:
                        </div>
                        <p
                          className={cn(
                            aiFeedback.yValue === 1
                              ? "text-destructive/90"
                              : "text-success/90"
                          )}
                        >
                          {aiFeedback.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    {aiFeedback.message || "Korisnik još nije odigrao igru"}
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center py-12">
                  <Spinner className="h-6 w-6 text-primary" />
                  <span className="ml-3 text-muted-foreground">
                    Učitavanje AI analize...
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </PageWrapper>
  );
}
