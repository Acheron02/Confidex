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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.startsWith("/admin/dashboard")) {
    return null;
  }

  // default theme to light for SSR
  const currentTheme = mounted
    ? theme === "system"
      ? systemTheme
      : theme
    : "light";

    if (!mounted) return null;

  return (
    <motion.div
      key={user ? user._id : "guest"}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={`${poppins.variable} w-full max-h-[15%] fixed overflow-hidden 
                  grid grid-cols-3 text-[#0D3B66] antialiased 
                  text-center text-lg font-bold z-50 top-0 left-0 right-0 
                  items-center dark:text-[#FAF0CA]`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-full">
        {mounted ? (
          <Image
            src={
              currentTheme === "dark"
                ? "/confidex_light_logo.png"
                : "/confidex_logo.png"
            }
            alt="Logo"
            width={500}
            height={100}
            className="w-[220px] h-auto"
          />
        ) : (
          // placeholder during SSR to avoid hydration mismatch
          <div className="w-[220px] h-[40px]" />
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex items-center h-full justify-center space-x-6 text-[#0D3B66] dark:text-[#FAF0CA] relative">
        {[
          { href: "/", label: "Home" },
          {
            href: "/analytics",
            label: "Analytics",
            auth: true,
            roleNotAdmin: true,
          },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ].map((link) => {
          if (link.href === "/analytics" && (!user || user.role === "admin"))
            return null;

          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-1 text-[#0D3B66] dark:text-[#FAF0CA] hover:text-[#EE964B]"
            >
              <span>{link.label}</span>
              {isActive && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 bottom-0 h-[4px] bg-[#F95738] rounded"
                  style={{ width: "100%" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center gap-3 h-full">
        {!user ? (
          <button
            onClick={() => setOpen(true)}
            className="bg-[#0D3B66] text-[#F4D35E] px-4 py-2 rounded-[15px] hover:cursor-pointer
            dark:bg-[#F95738] dark:text-[#FAF0CA]"
          >
            Sign Up
          </button>
        ) : user.role === "admin" ? (
          pathname === "/admin/dashboard" ? (
            <button
              onClick={logout}
              className="bg-[#F95738] text-white px-4 py-2 rounded-[15px] hover:cursor-pointer
              dark:bg-[#0D3B66] dark:text-[#FAF0CA]"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/admin/dashboard"
              className="bg-[#0D3B66] text-[#F4D35E] px-4 py-2 rounded-[15px] hover:cursor-pointer
            dark:bg-[#F95738] dark:text-[#FAF0CA]"
            >
              Admin
            </Link>
          )
        ) : user._id ? (
          pathname === `/users/${user._id}` ? (
            <button
              onClick={logout}
              className="bg-[#F95738] text-white px-4 py-2 rounded-[15px] hover:cursor-pointer
              dark:bg-[#0D3B66] dark:text-[#FAF0CA]"
            >
              Logout
            </button>
          ) : (
            <Link
              href={`/users/${user._id}`}
              className="bg-[#0D3B66] text-[#F4D35E] px-4 py-2 rounded-[15px] hover:cursor-pointer
              dark:bg-[#F95738] dark:text-[#FAF0CA]"
            >
              Profile
            </Link>
          )
        ) : (
          <span className="flex items-center gap-2 px-4 py-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </span>
        )}
      </div>

      <div className="fixed top-10 right-5 z-[9999]">
        <ModeToggle />
      </div>

      {/* Auth Modal */}
      <AuthDialog open={open} onOpenChange={setOpen} />
    </motion.div>
  );
}
