import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import api from "@/api/axios";
import type { User, LoginPayload, LoginResponse } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 🔥 MUST start true
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get<User>("/user");
      setUser(res.data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginPayload) => {
    const res = await api.post<LoginResponse>("/login", data);

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🔥 run BEFORE app renders routes
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
