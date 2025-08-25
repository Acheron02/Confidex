import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Register } from "./Register_Form/page";
import { Login } from "./Login_Form/page";
import { AdminLogin } from "./Admin_Form/page"; 

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<"register" | "login" | "admin">("register");

  useEffect(() => {
    if (open) setMode("register");
  }, [open]);

  const switchToLogin = () => setMode("login");
  const switchToRegister = () => setMode("register");
  const switchToAdmin = () => setMode("admin");

  // Set title based on mode
  const title =
    mode === "register"
      ? "Create an Account"
      : mode === "login"
      ? "Login to your Account"
      : "Admin Login";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-5 flex flex-col max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-center mt-1 text-[1.5rem]">
            {title}
          </DialogTitle>
          <DialogClose className="hover:cursor-pointer" />
          <DialogDescription className="text-center text-sm text-gray-500">
            {mode === "register"
              ? "Join us today! It’s quick and easy."
              : mode === "login"
              ? "Welcome back! Please enter your phone number."
              : "Admin access only. Please login."}
          </DialogDescription>
        </DialogHeader>

        {mode === "register" && (
          <Register
            onSwitchToLogin={switchToLogin}
            onSwitchToAdmin={switchToAdmin}
            onClose={() => onOpenChange(false)} // ✅ pass close fn
          />
        )}
        {mode === "login" && (
          <Login
            onSwitchToRegister={switchToRegister}
            onSwitchToAdmin={switchToAdmin}
            onClose={() => onOpenChange(false)}
          />
        )}
        {mode === "admin" && (
          <AdminLogin
            onSwitchToLogin={switchToLogin}
            onClose={() => onOpenChange(false)} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
