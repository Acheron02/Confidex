"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { VerificationForm } from "../Verification_form/page";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

interface LoginProps {
  onSwitchToLogin: () => void;
  onClose: () => void; // for closing all dialogs
}

export function AdminLogin({ onSwitchToLogin, onClose }: LoginProps) {
  const { login } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState<string | null>(null);
  const [adminData, setAdminData] = useState<any>(null);

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleResendOTP = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    console.log("Resent OTP:", newOtp);
  };

  /** OTP Verification */
  const handleVerificationSubmit = async (code: string) => {
    if (code === otp && adminData) {
      console.log("✅ OTP verified for admin:", adminData.email);
      setOtpStatus("Admin successfully verified!");
      setOpen(false);

      // Store admin session
      login({
        _id: adminData._id,
        email: adminData.email,
        role: "admin",
      });

      // Close dialogs
      onClose();

      // Redirect to dashboard
      router.push(`/admin/dashboard`);
    } else {
      console.log("❌ Incorrect OTP");
      setOtpStatus("Incorrect OTP, try again.");
    }
  };

  /** Handles login form submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const inputEmail = String(formData.get("email") || "").trim();
    const inputPassword = String(formData.get("password") || "").trim();

    const newErrors: { email?: string; password?: string } = {};
    if (!inputEmail) newErrors.email = "Email is required";
    if (!inputPassword) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setLoading(false);
      return;
    }

    setEmail(inputEmail);
    setPassword(inputPassword);

    try {
      const res = await fetch("/api/auth/adminLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail, password: inputPassword }),
      });

      const data = await res.json();

      if (res.ok && data?.admin?.email) {
        setEmail(data.admin.email);
        setAdminData(data.admin); // save admin info for OTP verification

        // Generate OTP (Demo)
        const generatedOtp = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        setOtp(generatedOtp);
        console.log("Generated OTP:", generatedOtp);

        setOpen(true);
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="flex flex-col flex-grow" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            className="mb-1"
            placeholder="Enter email"
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email)
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-[0.875rem] px-1">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-2 relative mt-6">
          <Label htmlFor="password">Password</Label>
          <div className="relative w-full">
            <Input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="pr-10"
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password)
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-full hover:cursor-pointer"
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </Button>
          </div>
          {fieldErrors.password && (
            <p className="text-red-500 text-[0.875rem] px-1">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        {/* Switch to user login */}
        <div className="grid gap-5 mt-3 mb-5">
          <p className="text-sm text-gray-500 text-center ml-0.5">
            I'm not an Admin.
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm text-blue-600 ml-1 hover:underline hover:decoration-2 hover:cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-auto flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            formNoValidate
            className="hover:cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="hover:cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
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
        status={otpStatus}
      />
    </>
  );
}
