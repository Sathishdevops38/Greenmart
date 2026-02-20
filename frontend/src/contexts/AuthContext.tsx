"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_KEY = "greenmart_token";
const USER_KEY = "greenmart_user";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "buyer" | "seller";
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, role: "buyer" | "seller") => Promise<void>;
  logout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    if (!token || !userJson) {
      setState({ user: null, token: null, loading: false });
      return;
    }
    const user = JSON.parse(userJson) as User;
    setState({ user, token, loading: false });
  }, []);

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = state.token ?? (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
    const headers = new Headers(options.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(url, { ...options, headers });
  }, [state.token]);

  const login = async (email: string, password: string) => {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch (e) {
      throw new Error(
        `Cannot connect to server. Make sure the backend is running at ${API_URL} (e.g. \`cd backend && uvicorn app.main:app --reload\`)`
      );
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail ?? "Login failed");
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setState({ user: data.user, token: data.access_token, loading: false });
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    role: "buyer" | "seller"
  ) => {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          role,
        }),
      });
    } catch (e) {
      throw new Error(
        `Cannot connect to server. Make sure the backend is running at ${API_URL} (e.g. \`cd backend && uvicorn app.main:app --reload\`)`
      );
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail ?? "Signup failed");
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setState({ user: data.user, token: data.access_token, loading: false });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ user: null, token: null, loading: false });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    fetchWithAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
