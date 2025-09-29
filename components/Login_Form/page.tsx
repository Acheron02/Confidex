"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "../ui/phone-input";
import { DialogClose } from "@/components/ui/dialog";
import { VerificationForm } from "../Verification_form/page";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

interface LoginProps {
  onSwitchToRegister: () => void;
  onSwitchToAdmin: () => void;
  onClose: () => void;
}

export function Login({
  onSwitchToRegister,
  onSwitchToAdmin,
  onClose,
}: LoginProps) {
  const { login } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ phoneNumber: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState("");
  const [tempPhone, setTempPhone] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // 🔹 validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof typeof form) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleResendOTP = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    alert(`Resent OTP: ${newOtp}`);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // ✅ Call backend to check if phone exists
    const res = await fetch("/api/checkPhone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: form.phoneNumber }),
    });

    const data = await res.json();
    if (!res.ok) {
      setErrors({ phoneNumber: data.error || "Phone number not registered" });
      return;
    }

    // ✅ Generate OTP locally (mock), later replace with backend SMS service
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generated);
    setTempPhone(form.phoneNumber);
    alert(`Generated OTP (Login): ${generated}`);

    // Open OTP dialog
    setOpen(true);
  };

  const handleVerificationSubmit = async (code: string) => {
    if (code === otp && tempPhone) {
      // ✅ Call login API after OTP verification
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: tempPhone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Login failed");
        return;
      }

      setStatus("Login successful!");
      setOpen(false);
      login(data.user);
      onClose();

      // ✅ redirect to user profile/dashboard
      router.push(`/pages/users/${data.user._id}`);
    } else {
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

        {/* Switch to Register / Admin */}
        <div className="grid">
          <p className="text-sm text-gray-500 text-center ml-0.5">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-sm text-blue-600 ml-1 hover:underline hover:decoration-2 hover:cursor-pointer"
            >
              Register
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
            Login
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
