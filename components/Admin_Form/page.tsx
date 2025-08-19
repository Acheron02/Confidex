"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Eye, EyeClosed } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { VerificationForm } from "../Verification_form/page";

interface LoginProps {
  onSwitchToLogin: () => void;
}

export function AdminLogin({ onSwitchToLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerificationSubmit = (code: string) => {
    console.log("Verification code entered:", code);
    // later: verify OTP logic
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    console.log("Submitting:", { email, password });

    try {
      const res = await fetch("/api/auth/adminLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Admin login response:", data);

      if (res.ok) {
        setOpen(true); // open OTP modal
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form className="flex flex-col flex-grow" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          className="mb-7"
          required
          placeholder="Enter email"
        />
      </div>

      <div className="grid gap-2 relative">
        <Label htmlFor="password">Password</Label>
        <div className="relative w-full">
          <Input
            name="password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            required
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full"
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}

      <div className="grid gap-5 mt-3 mb-1">
        <p className="text-sm text-gray-500 text-center ml-0.5">
          I'm not an Admin.{""}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-blue-600 ml-1 hover:underline hover:decoration-2 hover:cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>

      <div className="mt-auto flex justify-end gap-2">
        <DialogClose asChild>
          <Button
            variant="outline"
            type="button"
            formNoValidate
            className="hover:cursor-pointer"
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          type="submit"
          className="hover:cursor-pointer"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* OTP Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader className="flex justify-center items-center">
              <DialogTitle>Account Verification</DialogTitle>
              <DialogDescription>
                Please enter the OTP sent to your email.
              </DialogDescription>
            </DialogHeader>

            <VerificationForm
              onSubmit={handleVerificationSubmit}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </form>
  );
}
