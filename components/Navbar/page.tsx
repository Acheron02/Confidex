"use client";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";
import { AuthDialog } from "../authDialog"; // import the new component
import { useState } from "react";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={`${poppins.variable} w-full max-h-[10%] fixed overflow-hidden 
                  grid grid-cols-3 text-[#0D3B66] antialiased 
                  text-center text-lg font-bold z-50 top-0 left-0 right-0 
                  items-center  dark:text-[#FAF0CA] inset-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-bold">Logo</h1>
      </div>

      {/* Navigation */}
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

      {/* Button + Mode Toggle */}
      <div className="flex items-center justify-center gap-3">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="bg-[#0D3B66] text-[#F4D35E] px-4 py-2 rounded-[15px] hover:cursor-pointer
          dark:bg-[#F95738] dark:text-[#FAF0CA]"
          >
            Sign Up
          </button>
        )}
        <ModeToggle />
      </div>

      {/* Auth Dialog (Register or Login based on state) */}
      <AuthDialog open={open} onOpenChange={setOpen} />
    </motion.div>
  );
}
