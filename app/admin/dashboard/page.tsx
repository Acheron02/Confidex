"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckAuth from "@/components/checkAuth";
import Sidebar from "@/components/sidebar/sidebar";

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // adjust depending on how many "pages" you want

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
    return <CheckAuth />;
  }

  return (
    <div className="max-h-[98vh] w-full overflow-y-auto scrollbar-hidden flex flex-row">
        <Sidebar/>
      <div className="w-full h-[97vh] mr-5">

      </div>
    </div>
  );
}
