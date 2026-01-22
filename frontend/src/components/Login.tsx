"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { authAPI } from '@/services/api';

interface LoginProps {
  onLoginSuccess: (user: { id: number; username: string; role: string; ime: string; prezime: string }) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        onLoginSuccess(response.user);
      }
    } catch (err: any) {
      setError(err.message || 'Neuspješna prijava. Provjerite korisničko ime i lozinku.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 md:px-8 bg-gradient-to-b from-white to-gray-50 gap-y-20">
      <div className='flex flex-col gap-y-2'>
      {/* Title - Matching MainMenu style */}
      <h1 className="text-gray-900 mb-8 sm:mb-12 md:mb-16 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
        KOGNITIVNE IGRE
      </h1>
      
              {/* Info Text - Matching MainMenu style */}
        <p className="mt-8 sm:mt-10 md:mt-12 text-gray-400 text-lg  px-4">
          Testirajte svoje kognitivne sposobnosti Stroop testom i igrom Lanac Pamćenja
        </p>
        </div>

      {/* Login Form Card */}
      <div className="flex flex-col w-full px-2 sm:px-6 md:px-8 lg:px-10 xl:px-12 min-w-[320px] md:min-w-[400px] max-w-[80%]">
        <div className=" flex flex-col bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 gap-y-10 ">
          <h2 className="text-gray-800 mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-center">
            Prijava
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 space-y-4 sm:space-y-5 md:space-y-6 justify-center items-center">
            <div className="flex flex-col w-[90%] gap-y-6 mx-auto items-center justify-center">
              <div className="flex flex-col gap-y-2  w-full">
                <label htmlFor="username" className="block text-gray-700 text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-left">
                  Korisničko ime
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                      className="w-full px-4 sm:px-5 py-10 sm:py-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg sm:text-xl transition-all"
                    placeholder="ime.prezime"
                  />
              </div>
              <div className="flex flex-col gap-y-2 items-start justify-start w-full">
                <label htmlFor="password" className="block text-gray-700 text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-left">
                  Lozinka
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                    className="w-full px-4 sm:px-5 py-10 sm:py-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg sm:text-xl transition-all"
                  placeholder="Unesite lozinku"
                />
              </div>
            </div>


            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 sm:h-14 md:h-16 bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl md:text-2xl font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
            >
              {loading ? 'Prijava...' : 'Prijavi se'}
            </Button>
          </form>
        </div>


      </div>
    </div>
  );
}
