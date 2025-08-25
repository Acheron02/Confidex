"use client";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";
import { AuthDialog } from "../authDialog";
import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { Loader2 } from "lucide-react";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={`${poppins.variable} w-full max-h-[10%] fixed overflow-hidden 
                  grid grid-cols-3 text-[#0D3B66] antialiased 
                  text-center text-lg font-bold z-50 top-0 left-0 right-0 
                  items-center dark:text-[#FAF0CA] inset-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-bold">Logo</h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center justify-center space-x-6 text-[#0D3B66] dark:text-[#FAF0CA]">
        <Link
          href="/"
          className="hover:underline hover:decoration-4 decoration-[#F95738] hover:text-[#EE964B]"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="hover:underline hover:decoration-4 decoration-[#F95738] hover:text-[#EE964B]"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="hover:underline hover:decoration-4 decoration-[#F95738] hover:text-[#EE964B]"
        >
          Contact
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center gap-3">
        {!user ? (
          // Not logged in → show Sign Up button
          <button
            onClick={() => setOpen(true)}
            className="bg-[#0D3B66] text-[#F4D35E] px-4 py-2 rounded-[15px] hover:cursor-pointer
          dark:bg-[#F95738] dark:text-[#FAF0CA]"
          >
            Sign Up
          </button>
        ) : user.role === "admin" ? (
          // Admin logged in → show Admin Dashboard button
          <Link
            href="/admin/dashboard"
            className="bg-[#0D3B66] text-[#F4D35E] px-4 py-2 rounded-[15px] hover:cursor-pointer
          dark:bg-[#F95738] dark:text-[#FAF0CA]"
          >
            Admin
          </Link>
        ) : user._id ? (
          // Normal user logged in → show Profile button
          <Link
            href={`/users/${user._id}`}
            className="bg-[#0D3B66] text-[#F4D35E] px-4 py-2 rounded-[15px] hover:cursor-pointer
          dark:bg-[#F95738] dark:text-[#FAF0CA]"
          >
            Profile
          </Link>
        ) : (
          // While user data is still loading
          <span className="flex items-center gap-2 px-4 py-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </span>
        )}
        <ModeToggle />
      </div>

      {/* Auth Modal */}
      <AuthDialog open={open} onOpenChange={setOpen} />
    </motion.div>
  );
}
