const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: (userData: {
    ime: string;
    prezime: string;
    email: string;
    password: string;
    dob: string;
    spol: string;
  }) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials: { username?: string; email?: string; password: string }) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () => fetchAPI('/auth/profile'),
};

// Game API
export const gameAPI = {
  saveResult: (gameData: {
    score: number;
    totalRounds: number;
    accuracy: number;
    avgTime: number;
    roundTimes: number[];
    answers: boolean[];
    trials?: Array<{
      isCongruent: boolean;
      wordText: string;
      displayColor: string;
      correctAnswer: string;
      userAnswer: string;
      isCorrect: boolean;
      reactionTime: number;
    }>;
    congruentAccuracy?: number;
    incongruentAccuracy?: number;
  }) => fetchAPI('/game/result', {
    method: 'POST',
    body: JSON.stringify(gameData),
  }),

  getHistory: () => fetchAPI('/game/history'),

  getStats: () => fetchAPI('/game/stats'),
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: (limit = 10) => fetchAPI(`/leaderboard?limit=${limit}`),

  getMyRank: () => fetchAPI('/leaderboard/my-rank'),
};

// AI API
export const aiAPI = {
  analyzePerformance: (gameData: {
    corr_mean?: number;
    rt_mean?: number;
    age?: number;
    sex?: number;
    timeofday?: number;
    roundTimes: number[];
    answers: number[]; // 0 or 1 for incorrect/correct
    totalRounds: number;
  }) => fetchAPI('/ai/analyze', {
    method: 'POST',
    body: JSON.stringify(gameData),
  }),

  generateTasks: (config: {
    difficulty: string;
    count: number;
    userPerformance?: { accuracy: number; avgTime: number };
  }) => fetchAPI('/ai/generate-tasks', {
    method: 'POST',
    body: JSON.stringify(config),
  }),

  getInsights: (gameHistory: Array<{
    cognitiveScore: number;
    accuracy: number;
    avgTime: number;
  }>) => fetchAPI('/ai/insights', {
    method: 'POST',
    body: JSON.stringify({ gameHistory }),
  }),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => fetchAPI('/admin/users'),
  
  createUser: (userData: {
    ime: string;
    prezime: string;
    email: string;
    password: string;
    dob: string;
    spol: string;
    role?: string;
  }) => fetchAPI('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  deleteUser: (userId: number) => fetchAPI(`/admin/users/${userId}`, {
    method: 'DELETE',
  }),

  getUserStats: (userId: number) => fetchAPI(`/admin/users/${userId}/stats`),

  getUserAIFeedback: (userId: number) => fetchAPI(`/admin/users/${userId}/ai-feedback`),
};