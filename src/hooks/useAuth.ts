"use client";
import { useState, useEffect } from "react";
import { AuthService, UserInfo } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  useEffect(() => {
    const storedUser = AuthService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.login({ userName, password });
      const storedUser = AuthService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    userName: string,
    password: string,
    gender: string,
    age: number,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.createMentee({
        userName,
        password,
        mentee: { gender, age },
      });
      const storedUser = AuthService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    router.push("/");
    setUser(null);
  };

  const userRole = user?.role || "guest";

  return {
    user,
    loading,
    error,
    setUser,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    userRole,
  };
}
