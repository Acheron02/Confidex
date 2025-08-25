"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardPage({ params }: { params: { id: string } }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark when client is ready
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Avoid SSR mismatch
    if (!user) {
      router.replace("/");
      return;
    }
    if (user.role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }
    if (user._id !== params.id) {
      router.replace(`/users/${user._id}`);
    }
  }, [isClient, user, params.id, router]);

  if (!isClient || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-yellow-400 font-semibold">
          Checking authentication...
        </p>
      </div>
    );
  }

  return (
    <div className="z-10 w-full h-full flex mt-50 items-center justify-center flex-col">
      <h1 className="text-[2rem] font-bold text-center text-[#d7c913]">
        Phone Number: {user.phoneNumber ?? "N/A"}
      </h1>
      <p className="text-[1.5rem] font-bold text-center text-[#d7c913]">
        Gender: {user.gender ?? "N/A"}
      </p>
      <p className="text-[1.5rem] font-bold text-center text-[#d7c913]">
        Date of Birth:{" "}
        {user.dob ? new Date(user.dob).toLocaleDateString("en-US") : "N/A"}
      </p>
      <Button type="button" className="hover:cursor-pointer" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
