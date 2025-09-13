"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckAuth from "@/components/checkAuth";
import Sidebar from "@/components/sidebar/sidebar";
import AdminList, { Admin } from "@/components/admin/adminList";
import BoothList, { Booth } from "@/components/booths/boothList";
import AddBoothDialog from "@/components/booths/addBoothDialog";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  // Admin state
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // Booth state
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loadingBooths, setLoadingBooths] = useState(false);
  const [showAddBooth, setShowAddBooth] = useState(false);
  const [addingBooth, setAddingBooth] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/");
      else if (user.role !== "admin") router.replace(`/users/${user._id}`);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (selected === "admin") fetchAdmins();
    if (selected === "booths") fetchBooths();
  }, [selected]);

  // ------------------ ADMINS ------------------
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

  // ------------------ BOOTHS ------------------
  const fetchBooths = async () => {
    try {
      setLoadingBooths(true);
      const res = await fetch("/api/getBooths");
      const data = await res.json();
      setBooths(data.booths);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBooths(false);
    }
  };

  const handleAddBooth = async (
  name: string,
  location: string,
  installationDate: Date,
  status: Booth["status"]
) => {
  try {
    const res = await fetch("/api/addBooth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        location,
        installationDate: installationDate.toISOString(),
        status,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to add booth");
    }

    // Update booths state immediately
    setBooths((prev) => [...prev, data.booth]);

    return data.booth; // return the new booth
  } catch (err: any) {
    console.error("Error adding booth:", err);
    throw new Error(err.message || "Failed to add booth");
  }
};


  const handleDeleteBooth = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booth?")) return;
    const res = await fetch(`/api/deleteBooth/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete booth");
    setBooths(booths.filter((b) => b._id !== id));
  };

  const handleUpdateBooth = async (
    id: string,
    name: string,
    location: string,
    installationDate: Date,
    status: Booth["status"]
  ) => {
    try {
      const res = await fetch(`/api/updateBooth/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          location,
          installationDate: installationDate.toISOString(),
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update booth");
      }

      const resData = await res.json();
      const updatedBooth = resData.booth;

      setBooths((prev) =>
        prev.map((b) => (b._id === id ? { ...b, ...updatedBooth } : b))
      );

      return updatedBooth;
    } catch (err) {
      console.error("Failed to update booth", err);
      throw err;
    }
  };

  // ------------------ RENDER ------------------
  if (loading || !user || user.role !== "admin") return <CheckAuth />;

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar onSelect={setSelected} selected={selected} />

      <div className="h-[100vh] w-[100vw] px-6 flex flex-col ml-64 bg-gray-100 dark:bg-gray-900">
        <div className="flex-1 overflow-auto scrollbar-hidden">
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

          {selected === "booths" && (
            <>
              <BoothList
                booths={booths}
                loading={loadingBooths}
                onAdd={handleAddBooth}
                onDelete={handleDeleteBooth}
                onUpdate={handleUpdateBooth}
              />

              {showAddBooth && (
                <AddBoothDialog
                  onClose={() => setShowAddBooth(false)}
                  onAdd={handleAddBooth}
                  adding={addingBooth}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
