"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckAuth from "@/components/checkAuth";
import Sidebar from "@/components/sidebar/sidebar";
import AdminList, { Admin } from "@/components/admin/adminList"

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/");
      else if (user.role !== "admin") router.replace(`/users/${user._id}`);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (selected === "admin") fetchAdmins();
  }, [selected]);

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const res = await fetch("/api/getAdmins");
      const data = await res.json();
      setAdmins(data.admins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleAddAdmin = async (
    name: string,
    email: string,
    password: string
  ) => {
    const res = await fetch("/api/addAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Failed to add admin");
    fetchAdmins();
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    const res = await fetch(`/api/deleteAdmin/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete admin");
    setAdmins(admins.filter((a) => a._id !== id));
  };

  const handleUpdateAdmin = async (
    id: string,
    name: string,
    email: string,
    password?: string
  ) => {
    const res = await fetch(`/api/updateAdmin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Failed to update admin");
    fetchAdmins();
  };

  if (loading || !user || user.role !== "admin") return <CheckAuth />;

  return (
    <div className="flex w-full h-fit overflow-hidden">
      <Sidebar onSelect={setSelected} selected={selected} />
      <div className="flex-1 ml-64 p-6 overflow-auto bg-gray-100 dark:bg-gray-900">
        {!selected && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
            <p>Select an item from the sidebar to view details.</p>
          </div>
        )}

        {selected === "admin" && (
          <AdminList
            admins={admins}
            loading={loadingAdmins}
            onAdd={handleAddAdmin}
            onDelete={handleDeleteAdmin}
            onUpdate={handleUpdateAdmin}
          />
        )}
      </div>
    </div>
  );
}
