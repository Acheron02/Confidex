"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  _id: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  role?: string;
}

interface Admin extends User {
  role: "admin";
}

interface AuthContextType {
  user: User | Admin | null;
  loading: boolean; // <-- NEW
  login: (user: User | Admin) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | Admin | null>(null);
  const [loading, setLoading] = useState(true); // <-- NEW

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser._id) {
          setUser(parsedUser);
        }
      } catch {
        console.error("Failed to parse user from localStorage");
      }
    }
    setLoading(false); // done checking localStorage
  }, []);

  const login = (userData: User | Admin) => {
    if (userData && userData._id) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      localStorage.clear();
      sessionStorage.clear();

      // Clear caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Redirect after state clears
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
