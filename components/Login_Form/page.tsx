'use client'
import { Button } from "@/components/ui/button";
import { PhoneInput } from "../ui/phone-input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { VerificationForm } from "../Verification_form/page";
import { useState } from "react";

interface LoginProps {
  onSwitchToRegister: () => void;
  onSwitchToAdmin: () => void; 
}

export function Login({ onSwitchToRegister, onSwitchToAdmin }: LoginProps) {
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const number = phoneNumber;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log("Server message:", data.message); // ✅ will log "Login successful"
      console.log("User:", data.user); // optional: log the user details
      setOpen(true); // open OTP modal
    } else {
      console.error("Login error:", data.error);
      alert(data.error);
    }
  };

  const handleVerificationSubmit = (code: string) => {
      console.log("Verification code entered:", code);
      // TODO: Call your API or complete registration flow here
      setOpen(false);
    };
  return (
    <form className="flex flex-col flex-grow" onSubmit={handleLogin}>
      <div className="grid gap-1">
        <PhoneInput
          defaultCountry="PH"
          international
          value={phoneNumber}
          onChange={(value) => setPhoneNumber(value)}
          name="number"
          className="mb-4"
        />
      </div>
      <div className="grid gap-5 mt-5 mb-1">
        <p className="text-sm text-gray-500 text-center ml-0.5">
          Don't have an account?{""}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-sm text-blue-600 ml-1 hover:underline hover:decoration-2 hover:cursor-pointer"
          >
            Register
          </button>
        </p>
      </div>

      <div className="flex items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm select-none">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <div className="grid gap-5 mt-1 mb-1">
        <p className="text-sm text-gray-500 text-center ml-0.5">
          Are you an{" "}
          <button
            type="button"
            onClick={onSwitchToAdmin} // use the new prop here
            className="text-sm text-blue-600 ml-1 hover:underline hover:decoration-2 hover:cursor-pointer"
          >
            Admin?
          </button>
        </p>
      </div>

      <div className="flex flex-initial justify-end gap-2 mt-auto">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="hover:cursor-pointer"
          >
            Cancel
          </Button>
        </DialogClose>

        <Dialog open={open} onOpenChange={setOpen}>
          <Button type="submit" className="hover:cursor-pointer">
            Login
          </Button>

          <DialogContent>
            <DialogHeader className="flex justify-center items-center">
              <DialogTitle>Account Verification</DialogTitle>
              <DialogDescription>
                Please enter the OTP sent to your number.
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
