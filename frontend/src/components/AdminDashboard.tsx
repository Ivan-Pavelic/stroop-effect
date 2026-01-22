"use client";

import React from "react"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { adminAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageWrapper, AnimatedSection } from "@/components/PageWrapper";
import { UserDetail } from "@/components/UserDetail";
import { prefersReducedMotion, springTransition, staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { LogOut, Plus, X, Eye, Trash2, Users } from "lucide-react";

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
    ime: "",
    prezime: "",
    email: "",
    password: "",
    dob: "",
    spol: "M",
    role: "USER",
  });
  const skipAnimation = prefersReducedMotion();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      const filteredUsers = response.users.filter(
        (user: User) => user.username !== "admin"
      );
      setUsers(filteredUsers);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Neuspješno učitavanje korisnika";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Jeste li sigurni da želite obrisati ovog korisnika?")) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      await loadUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Neuspješno brisanje korisnika";
      alert(errorMessage);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.createUser(newUser);
      setShowAddUser(false);
      setNewUser({
        ime: "",
        prezime: "",
        email: "",
        password: "",
        dob: "",
        spol: "M",
        role: "USER",
      });
      await loadUsers();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Neuspješno kreiranje korisnika";
      alert(errorMessage);
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
    <PageWrapper variant="default" className="bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <AnimatedSection delay={0}>
            <motion.h1
              className="text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              initial={skipAnimation ? undefined : { opacity: 0, x: -20 }}
              animate={skipAnimation ? undefined : { opacity: 1, x: 0 }}
              transition={springTransition}
            >
              Admin Dashboard
            </motion.h1>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Button
              onClick={onLogout}
              variant="outline"
              className={cn(
                "px-6 py-2 h-auto rounded-lg",
                "border-2 border-destructive/30 hover:bg-destructive/10",
                "text-destructive font-medium",
                "transition-all duration-300",
                "btn-press"
              )}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Odjavi se
            </Button>
          </AnimatedSection>
        </div>

        {/* Add User Section */}
        <AnimatedSection delay={0.2} className="mb-8">
          {showAddUser ? (
            <Card className="shadow-lg border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Dodaj novog korisnika
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddUser(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUser} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ime" className="text-foreground font-semibold">
                        Ime
                      </Label>
                      <Input
                        id="ime"
                        type="text"
                        required
                        value={newUser.ime}
                        onChange={(e) =>
                          setNewUser({ ...newUser, ime: e.target.value })
                        }
                        className="h-12 border-2 border-input rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prezime" className="text-foreground font-semibold">
                        Prezime
                      </Label>
                      <Input
                        id="prezime"
                        type="text"
                        required
                        value={newUser.prezime}
                        onChange={(e) =>
                          setNewUser({ ...newUser, prezime: e.target.value })
                        }
                        className="h-12 border-2 border-input rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-semibold">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        className="h-12 border-2 border-input rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground font-semibold">
                        Lozinka
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        className="h-12 border-2 border-input rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-foreground font-semibold">
                        Datum rođenja
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        required
                        value={newUser.dob}
                        onChange={(e) =>
                          setNewUser({ ...newUser, dob: e.target.value })
                        }
                        className="h-12 border-2 border-input rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-semibold">Spol</Label>
                      <Select
                        value={newUser.spol}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, spol: value })
                        }
                      >
                        <SelectTrigger className="h-12 border-2 border-input rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Muški</SelectItem>
                          <SelectItem value="Ž">Ženski</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-semibold">Uloga</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger className="h-12 border-2 border-input rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">Korisnik</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      className={cn(
                        "flex-1 h-14",
                        "bg-primary hover:bg-primary/90 text-primary-foreground",
                        "text-lg font-semibold rounded-xl",
                        "shadow-lg hover:shadow-xl",
                        "transition-all duration-300",
                        "btn-press"
                      )}
                    >
                      Kreiraj korisnika
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowAddUser(false)}
                      variant="outline"
                      className={cn(
                        "flex-1 h-14",
                        "border-2 border-border hover:bg-secondary",
                        "text-foreground text-lg font-semibold rounded-xl",
                        "transition-all duration-300",
                        "btn-press"
                      )}
                    >
                      Odustani
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Button
              onClick={() => setShowAddUser(true)}
              className={cn(
                "h-14 px-8",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "text-lg font-semibold rounded-xl",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-300",
                "btn-press"
              )}
            >
              <Plus className="h-5 w-5 mr-2" />
              Dodaj korisnika
            </Button>
          )}
        </AnimatedSection>

        {/* Users Table */}
        <AnimatedSection delay={0.3}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8 text-primary" />
              <span className="ml-3 text-muted-foreground">Učitavanje...</span>
            </div>
          ) : error ? (
            <Card className="p-6 bg-destructive/10 border-destructive/20">
              <p className="text-destructive text-center font-medium">{error}</p>
            </Card>
          ) : users.length === 0 ? (
            <Card className="p-12 text-center shadow-lg">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                Nema korisnika za prikaz
              </p>
            </Card>
          ) : (
            <Card className="shadow-lg border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold text-foreground">
                        Korisnik
                      </TableHead>
                      <TableHead className="font-bold text-foreground">
                        Email
                      </TableHead>
                      <TableHead className="font-bold text-foreground">
                        Uloga
                      </TableHead>
                      <TableHead className="font-bold text-foreground">
                        Igre
                      </TableHead>
                      <TableHead className="font-bold text-foreground text-right">
                        Akcije
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-semibold text-foreground">
                              {user.ime} {user.prezime}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.username}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.role === "ADMIN" ? "default" : "secondary"}
                            className={cn(
                              user.role === "ADMIN"
                                ? "bg-primary/20 text-primary border-primary/30"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {user._count.games}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.role !== "ADMIN" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Detalji
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Obriši
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </AnimatedSection>
      </div>
    </PageWrapper>
  );
}
