"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "../ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar22 } from "../birthday-picker";
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

interface RegisterProps {
  onSwitchToLogin: () => void;
  onSwitchToAdmin: () => void;
}

export function Register({ onSwitchToLogin, onSwitchToAdmin }: RegisterProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: "",
    gender: "",
    dob: "",
  });

  const [status, setStatus] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Failed");
      return;
    }

    setStatus("Registered!");
    // Optional: redirect to login or dashboard
    // router.push("/auth/login");
  };

  const handleVerificationSubmit = (code: string) => {
    console.log("Verification code entered:", code);
    // TODO: Call your API or complete registration flow here
    setOpen(false);
  };

  return (
    <>
      <form className="flex flex-col flex-grow" onSubmit={onSubmit}>
        {/* Phone Number */}
        <div className="grid gap-1">
          <Label htmlFor="number">Phone Number</Label>
          <PhoneInput
            defaultCountry="PH"
            international
            value={form.phoneNumber}
            onChange={(value) =>
              setForm((s) => ({ ...s, phoneNumber: value ?? "" }))
            }
            name="phoneNumber"
            className="mb-4"
          />
        </div>

        {/* Gender */}
        <div className="grid gap-1">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={form.gender}
            onValueChange={(value) => setForm((s) => ({ ...s, gender: value }))}
          >
            <SelectTrigger className="w-full hover:cursor-pointer mb-4">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date of Birth */}
        <div className="grid gap-1">
          <Label htmlFor="date">Date of Birth</Label>
          <Calendar22
            value={form.dob}
            onChange={(date: Date | undefined) =>
              setForm((s) => ({ ...s, dob: date ? date.toISOString() : "" }))
            }
          />
        </div>

        {/* Switch to login */}
        <div className="grid gap-5 mt-1 mb-1">
          <p className="text-sm text-gray-500 text-center ml-0.5">
            Already have an account?{""}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm text-blue-600 ml-1 hover:underline hover:decoration-2 hover:cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>

        {/* Admin switch */}
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
              onClick={onSwitchToAdmin}
              className="text-sm text-blue-600 ml-1 hover:underline hover:decoration-2 hover:cursor-pointer"
            >
              Admin?
            </button>
          </p>
        </div>

        {/* Action buttons */}
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
            <DialogTrigger asChild>
              <Button type="submit" className="hover:cursor-pointer">
                Sign Up
              </Button>
            </DialogTrigger>

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
    </>
  );
}
