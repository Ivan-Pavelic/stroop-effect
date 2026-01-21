"use client";

import { useState, useEffect } from 'react';
import { adminAPI } from '@/services/api';
import { Button } from './ui/button';
import { UserDetail } from './UserDetail';

interface User {
  id: number;
  ime: string;
  prezime: string;
  username: string;
  email: string;
  dob: string;
  spol: string;
  role: string;
  created_at: string;
  _count: {
    games: number;
    gameSessions: number;
  };
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    ime: '',
    prezime: '',
    email: '',
    password: '',
    dob: '',
    spol: 'M',
    role: 'USER'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      // Filter out the default admin user (username === 'admin')
      const filteredUsers = response.users.filter((user: User) => user.username !== 'admin');
      setUsers(filteredUsers);
    } catch (err: any) {
      setError(err.message || 'Neuspješno učitavanje korisnika');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovog korisnika?')) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      await loadUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    } catch (err: any) {
      alert(err.message || 'Neuspješno brisanje korisnika');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.createUser(newUser);
      setShowAddUser(false);
      setNewUser({
        ime: '',
        prezime: '',
        email: '',
        password: '',
        dob: '',
        spol: 'M',
        role: 'USER'
      });
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Neuspješno kreiranje korisnika');
    }
  };

  if (selectedUser) {
    return (
      <UserDetail
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        onDelete={handleDeleteUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-gray-900 text-5xl md:text-7xl font-bold">
            Admin Dashboard
          </h1>
          <Button
            onClick={onLogout}
            className="px-6 py-3 border-2 border-red-300 hover:bg-red-50 text-red-600 rounded-xl text-base font-semibold bg-white"
          >
            Odjavi se
          </Button>
        </div>

        {/* Add User Section */}
        {showAddUser ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 mb-8">
            <h2 className="text-gray-900 text-3xl font-bold mb-6">Dodaj novog korisnika</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Ime</label>
                  <input
                    type="text"
                    required
                    value={newUser.ime}
                    onChange={(e) => setNewUser({ ...newUser, ime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Prezime</label>
                  <input
                    type="text"
                    required
                    value={newUser.prezime}
                    onChange={(e) => setNewUser({ ...newUser, prezime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Lozinka</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Datum rođenja</label>
                  <input
                    type="date"
                    required
                    value={newUser.dob}
                    onChange={(e) => setNewUser({ ...newUser, dob: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Spol</label>
                  <select
                    value={newUser.spol}
                    onChange={(e) => setNewUser({ ...newUser, spol: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  >
                    <option value="M">Muški</option>
                    <option value="Ž">Ženski</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2">Uloga</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  >
                    <option value="USER">Korisnik</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button 
                  type="submit" 
                  className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Kreiraj korisnika
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 h-14 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl bg-white transition-all duration-300"
                >
                  Odustani
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Button
            onClick={() => setShowAddUser(true)}
            className="mb-8 h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 px-8"
          >
            + Dodaj korisnika
          </Button>
        )}

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-lg">Učitavanje...</div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl text-base font-medium">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">Nema korisnika za prikaz</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Korisnik
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Uloga
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Igre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Akcije
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base font-semibold text-gray-900">
                        {user.ime} {user.prezime}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{user.username}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600 font-medium">
                      {user._count.games}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-base font-medium">
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-800 mr-4 font-semibold transition-colors"
                        >
                          Detalji
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                      >
                        Obriši
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
