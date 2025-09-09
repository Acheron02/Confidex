"use client";

import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { AuthDialog } from "../authDialog";
import { useState, useEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import Image from "next/image";
import { useTheme } from "next-themes";

interface SidebarProps {
  onSelect: (key: string) => void;
  selected: string | null;
}

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const menuItems = [
  { key: "home", label: "Home", action: () => redirect("/") },
  { key: "booths", label: "Booths" },
  { key: "admin", label: "Admins" },
];

export default function Sidebar({ onSelect, selected }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  const formatName = (fullName: string | undefined) => {
    if (!fullName) return "Admin";
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const middleInitials = parts
      .slice(1, -1)
      .map((n) => n[0].toUpperCase())
      .join("");
    return middleInitials
      ? `${lastName}, ${firstName[0].toUpperCase()}${middleInitials}.`
      : `${lastName}, ${firstName[0].toUpperCase()}.`;
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={`${poppins.variable} w-64 h-screen fixed left-0 top-0 flex flex-col border-r p-4 z-50 dark:bg-[#080807] bg-[#F8F8F8] text-[#0D3B66] dark:text-[#FAF0CA]`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-3">
        <button
          onClick={() => onSelect("adminHome")}
          className="p-0 border-none bg-transparent cursor-pointer"
        >
          <Image
            src={
              currentTheme === "dark"
                ? "/confidex_light_logo.png"
                : "/confidex_logo.png"
            }
            alt="Logo"
            width={160}
            height={50}
            className="h-auto"
          />
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col space-y-4 my-5">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={item.action ? item.action : () => onSelect(item.key)}
            className={`w-full h-fit text-left pl-6 hover:underline decoration-2 cursor-pointer ${
              selected === item.key ? "underline font-semibold" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1"></div>

      {/* Profile & Logout */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src="/gelo.jpg"
              alt="Profile"
              width={56}
              height={56}
              style={{ objectFit: "cover" }}
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-col overflow-hidden w-30">
            <span
              className="font-semibold text-sm"
              title={user?.name || "Admin"}
            >
              {formatName(user?.name)}
            </span>
            <span
              className="text-xs text-gray-500 dark:text-gray-300"
              title="Admin"
            >
              Admin
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="ml-2 py-2 text-sm rounded-lg bg-transparent text-black dark:text-[#fff8da] hover:opacity-90 hover:cursor-pointer hover:underline decoration-2 whitespace-nowrap"
        >
          Logout
        </button>
      </div>

      <AuthDialog open={open} onOpenChange={setOpen} />
    </motion.div>
  );
}
