"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  _id: string;
  email?: string; // ✅ Add email for consistency
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  role?: string; // ✅ Add role (optional for normal users)
}

interface Admin extends User {
  role: "admin"; // ✅ Ensure admin has fixed role
}

interface AuthContextType {
  user: User | Admin | null;
  login: (user: User | Admin) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | Admin | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser._id) {
        setUser(parsedUser); // ✅ valid user
      } else {
        setUser(null); // ✅ ignore invalid objects
      }
    }
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

      // Clear client-side data
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();

      // Clear cache
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Redirect to home
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
