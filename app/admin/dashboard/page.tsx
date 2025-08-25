"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth(); // <-- include loading from context
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/"); // Redirect to home if not logged in
      } else if (user.role !== "admin") {
        router.replace(`/users/${user._id}`); // Redirect to user dashboard if not admin
      }
    }
  }, [user, loading, router]);

  // Show loading state until auth is resolved
  if (loading || !user || user.role !== "admin") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-lg text-yellow-400 font-semibold">
          Checking authentication...
        </p>
      </div>
    );
  }

  return (
    <div className="z-10 w-full h-full flex mt-50 items-center justify-center flex-col">
      <h1 className="text-[2rem] font-bold h-1/2 text-center text-[#d7c913] drop-shadow-[4px_4px_2px_rgba(32,30,29,0.7)]">
        Welcome, Admin: {user?.email}
      </h1>

      <p className="text-[1.5rem] font-bold h-1/2 text-center text-[#d7c913] drop-shadow-[4px_4px_2px_rgba(32,30,29,0.7)]">
        Role: {user?.role}
      </p>

      <Button
        type="button"
        className="hover:cursor-pointer mt-6"
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  );
}
