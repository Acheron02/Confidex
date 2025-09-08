"use client";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";
import { AuthDialog } from "../authDialog";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <motion.div
      key={user ? user._id : "guest"}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={`${poppins.variable} 
        w-64 h-screen fixed left-0 top-0 flex flex-col 
        border-r p-4 z-50 dark:bg-[#080807] bg-[#F8F8F8]
        text-[#0D3B66] dark:text-[#FAF0CA]`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-3 border">
        {mounted ? (
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
        ) : (
          <></>
        )}
      </div>

      <div className="border w-full h-30 flex flex-row items-center">
        <div className="border w-15 h-15 mr-1"></div>
        <div className="border w-fit h-15"><h1 className="p-1 text-[1rem] text-left">Welcome admin, Acheron42</h1></div>
      </div>

      <div className="border w-full h-full mt-5 mb-5"></div>

      <div className="mt-auto space-y-4">
        <button
          onClick={logout}
          className="w-full bg-[#F95738] text-white px-4 py-2 rounded-[10px]
                dark:bg-[#0D3B66] dark:text-[#FAF0CA] hover:cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="fixed top-10 right-5 z-[9999]">
        <ModeToggle />
      </div>

      {/* Auth Modal */}
      <AuthDialog open={open} onOpenChange={setOpen} />
    </motion.div>
  );
}
