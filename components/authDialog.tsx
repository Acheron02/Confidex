import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Register } from "./Register_Form/page";
import { Login } from "./Login_Form/page";
import { AdminLogin } from "./Admin_Form/page"; // Adjust path

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

  // Adjust dialog height based on mode
  const dialogHeight =
    mode === "register" ? "65vh" : mode === "login" ? "45vh" : "50vh"; // example height for admin

  // Set title based on mode
  const title =
    mode === "register"
      ? "Create an Account"
      : mode === "login"
      ? "Login to your Account"
      : "Admin Login";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[400px] p-5 flex flex-col"
        style={{ height: dialogHeight }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogClose className="hover:cursor-pointer" />
        </DialogHeader>

        {mode === "register" && <Register onSwitchToLogin={switchToLogin} onSwitchToAdmin={switchToAdmin} />}
        {mode === "login" && <Login onSwitchToRegister={switchToRegister} onSwitchToAdmin={switchToAdmin} />}
        {mode === "admin" && (
          <AdminLogin onSwitchToLogin={switchToLogin} />
        )}
      </DialogContent>
    </Dialog>
  );
}
