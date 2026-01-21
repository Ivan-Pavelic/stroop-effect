"use client";

import { useState, useEffect } from 'react';
import { adminAPI } from '@/services/api';
import { Button } from './ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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
  aiAnalysis?: any;
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

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, feedbackData] = await Promise.all([
        adminAPI.getUserStats(user.id),
        adminAPI.getUserAIFeedback(user.id).catch(() => null)
      ]);
      setStats(statsData);
      setAiFeedback(feedbackData);
    } catch (err: any) {
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshFeedback = async () => {
    try {
      setLoadingFeedback(true);
      const feedbackData = await adminAPI.getUserAIFeedback(user.id);
      setAiFeedback(feedbackData);
    } catch (err: any) {
      console.error('Error loading AI feedback:', err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Format chart data for recharts
  const formatChartData = () => {
    if (!stats || stats.chartData.length === 0) {
      return [];
    }

    // Remove duplicates based on date and key values
    const seen = new Set<string>();
    const uniqueData = stats.chartData.filter(point => {
      const key = `${point.date}-${point.cognitiveScore}-${point.accuracy}`;
      if (seen.has(key)) {
        return false; // Duplicate
      }
      seen.add(key);
      return true;
    });

    // Format dates to be more readable (DD.MM.YYYY or "Igra N" if multiple games same day)
    return uniqueData.map((point, index) => {
      const date = new Date(point.date);
      // Use gameNumber if available, otherwise use date
      const label = point.gameNumber 
        ? `Igra ${point.gameNumber}` 
        : date.toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      
      return {
        date: label,
        dateKey: `${point.date}-${index}`, // Unique key
        'Točnost (%)': Math.round(point.accuracy),
        'Kognitivni Score': point.cognitiveScore,
        'Prosječno vrijeme (ms)': Math.round(point.avgTime),
        'Kongruentni (%)': Math.round(point.congruentAccuracy),
        'Nekongruentni (%)': Math.round(point.incongruentAccuracy)
      };
    });
  };

  const chartData = formatChartData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12 text-gray-500 text-lg">Učitavanje...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-gray-900 text-5xl md:text-7xl font-bold mb-2">
              {user.ime} {user.prezime}
            </h1>
            <p className="text-gray-500 text-lg">{user.email} • {user.username}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={onBack} 
              className="px-6 py-3 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl font-semibold bg-white transition-all duration-300"
            >
              Natrag
            </Button>
            <Button
              onClick={() => onDelete(user.id)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Obriši
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        {stats && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-gray-900 text-3xl font-bold mb-6">Statistike</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Ukupno igara</div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalGames}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Prosječna točnost</div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgAccuracy.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Prosječni kognitivni score</div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgCognitiveScore.toFixed(1)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-gray-900 text-2xl sm:text-3xl font-bold mb-6">Graf performansi kroz vrijeme</h2>
          {chartData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Nema podataka za prikaz</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px] sm:min-w-0" style={{ height: '350px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 15, left: 0, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={10}
                      width={50}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                      iconSize={12}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Točnost (%)" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Kognitivni Score" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Kongruentni (%)" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      strokeDasharray="5 5"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Nekongruentni (%)" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* AI Feedback */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-900 text-3xl font-bold">AI Analiza i Povratna Informacija</h2>
            <Button
              onClick={refreshFeedback}
              disabled={loadingFeedback}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {loadingFeedback ? 'Učitavanje...' : 'Osvježi'}
            </Button>
          </div>

          {aiFeedback ? (
            aiFeedback.hasData ? (
              <div className="space-y-4">
                {aiFeedback.gameDate && (
                  <div className="text-sm text-gray-500">
                    Posljednja igra: {new Date(aiFeedback.gameDate).toLocaleDateString('hr-HR')}
                  </div>
                )}
                
                {aiFeedback.aiAnalysis && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">Kognitivni Score</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {aiFeedback.aiAnalysis.cognitiveScore}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Razina</div>
                        <div className="text-lg font-semibold text-gray-700">
                          {aiFeedback.aiAnalysis.level}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Y vrijednost</div>
                        <div className={`text-2xl font-bold ${aiFeedback.yValue === 1 ? 'text-red-600' : 'text-green-600'}`}>
                          {aiFeedback.yValue}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {aiFeedback.feedback && (
                  <div className={`p-4 rounded-lg ${
                    aiFeedback.yValue === 1 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className={`font-semibold mb-2 ${
                      aiFeedback.yValue === 1 ? 'text-red-800' : 'text-green-800'
                    }`}>
                      Povratna informacija:
                    </div>
                    <p className={`${
                      aiFeedback.yValue === 1 ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {aiFeedback.feedback}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {aiFeedback.message || 'Korisnik još nije odigrao igru'}
              </div>
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              Učitavanje AI analize...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
