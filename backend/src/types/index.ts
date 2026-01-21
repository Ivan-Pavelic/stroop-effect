export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  ime: string;
  prezime: string;
  username: string;
  dob: Date;
  spol: string;
  email: string;
  lozinka_hash: string;
  role: Role;
  created_at: Date;
}

export interface Game {
  id: number;
  user_id: number;
  datum: Date;
  trajanje: number;
  broj_zadataka: number;
  broj_pogresaka: number;
  prosjecno_vrijeme_odgovora: number;
}

export interface Result {
  id: number;
  game_id: number;
  tocnost: number;
  brzina: number;
  kognitivni_score: number;
}

export interface AITask {
  id: number;
  task_text: string;
  boja_teksta: string;
  tocan_odgovor: string;
  tezina: string;
}

export interface AIAnalysis {
  id: number;
  user_id: number;
  rezultat_ai: string;
  datum: Date;
}

export interface Feedback {
  id: number;
  user_id: number;
  komentar: string;
  ocjena: number;
}

export interface AuthRequest {
  username?: string; // For login with ime.prezime
  email?: string;    // Alternative login method
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  ime: string;
  prezime: string;
  dob: string;
  spol: string;
}

export interface Trial {
  isCongruent: boolean;
  wordText: string;
  displayColor: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  reactionTime: number;
}

export interface GameResult {
  score: number;
  totalRounds: number;
  accuracy: number;
  avgTime: number;
  roundTimes: number[];
  answers: boolean[];
  trials?: Trial[];
  congruentAccuracy?: number;
  incongruentAccuracy?: number;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: Role;
  username: string;
}