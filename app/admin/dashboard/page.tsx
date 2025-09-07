"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import CheckAuth from "@/components/checkAuth";

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/"); 
      } else if (user.role !== "admin") {
        router.replace(`/users/${user._id}`);
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <CheckAuth />
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
