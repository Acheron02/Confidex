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
import { DialogClose } from "@/components/ui/dialog";
import { VerificationForm } from "../Verification_form/page";
import { redirect } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

interface RegisterProps {
  onSwitchToLogin: () => void;
  onSwitchToAdmin: () => void;
  onClose: () => void; 
}

export function Register({ onSwitchToLogin, onSwitchToAdmin, onClose }: RegisterProps) {
  const { login } = useAuth();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: "",
    gender: "",
    dob: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(""); 
  const [tempForm, setTempForm] = useState<typeof form | null>(null); 

  const handleResendOTP = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(newOtp); // 🔄 replace the old OTP
    alert(`Resent OTP: ${newOtp}`);
  };

  // 🔹 validation helper
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!form.gender.trim()) {
      newErrors.gender = "Gender is required";
    }
    if (!form.dob.trim()) {
      newErrors.dob = "Date of birth is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 clear errors as user types/selects
  const clearError = (field: keyof typeof form) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const res = await fetch("/api/checkPhone", {
      // 🔄 match API filename
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: form.phoneNumber }),
    });

    const data = await res.json();

    if (data.exists) {
      setErrors({ phoneNumber: "This phone number is already registered." });
      setStatus("This phone number is already registered.");
      return;
    }

    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generated);
    setTempForm(form);
    alert(`Generated OTP: ${generated}`);
    setOpen(true);

  };

  const router = useRouter();

  const handleVerificationSubmit = async (code: string) => {
    if (code === otp && tempForm) {
      console.log("✅ OTP Verified!");

      setStatus("Submitting...");
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Failed");
        return;
      }

      setStatus("Registered!");
      setOpen(false);
      login(data.user);

      onClose();

      router.push(`/pages/users/${data.user._id}`);
    } else {
      alert("❌ Incorrect OTP");
      setStatus("Incorrect OTP, try again.");
    }
  };


  return (
    <>
      <form className="grid grid-cols-1 gap-5 flex-grow" onSubmit={onSubmit}>
        {/* Phone Number */}
        <div className="grid gap-1">
          <Label htmlFor="number">Phone Number</Label>
          <PhoneInput
            defaultCountry="PH"
            international
            value={form.phoneNumber}
            onChange={(value) => {
              setForm((s) => ({ ...s, phoneNumber: value ?? "" }));
              clearError("phoneNumber");
            }}
            name="phoneNumber"
            className="mb-1"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Gender */}
        <div className="grid gap-1">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={form.gender}
            onValueChange={(value) => {
              setForm((s) => ({ ...s, gender: value }));
              clearError("gender");
            }}
          >
            <SelectTrigger className="w-full hover:cursor-pointer">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="grid gap-1">
          <Label htmlFor="date">Date of Birth</Label>
          <Calendar22
            value={form.dob}
            onChange={(date: Date | undefined) => {
              setForm((s) => ({ ...s, dob: date ? date.toISOString() : "" }));
              clearError("dob");
            }}
          />
          {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
        </div>

        {/* Switch to login / admin */}
        <div className="grid">
          <p className="text-sm text-gray-500 text-center ml-0.5">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm text-blue-600 ml-1 hover:underline hover:decoration-2 hover:cursor-pointer"
            >
              Login
            </button>
          </p>

          <div className="flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm select-none">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="grid">
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
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-auto">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button type="submit" className="hover:cursor-pointer">
            Sign Up
          </Button>
        </div>
      </form>

      {/* OTP Dialog */}
      <VerificationForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleVerificationSubmit}
        onCancel={() => setOpen(false)}
        onResend={handleResendOTP}
        status={status}
      />
    </>
  );
}
