"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTPPattern } from "../inputOTP";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface VerificationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (code: string) => void;
  onCancel?: () => void;
  status?: string | null;
  onResend?: () => void;
}

export function VerificationForm({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  status,
  onResend
}: VerificationFormProps) {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>Account Verification</DialogTitle>
          <DialogDescription>
            Please enter the OTP sent to your number.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* OTP Input */}
          <div className="grid justify-center items-center">
            <Label
              htmlFor="verificationCode"
              className="items-center justify-center my-3"
            >
              Verification Code
            </Label>
            <InputOTPPattern
              value={code}
              onChange={(val: string) => setCode(val)}
            />
            
            {status && (
              <p className="text-sm text-red-500 mt-2 text-center">{status}</p>
            )}
          </div>

          {/* Resend */}
          <p className="text-sm text-gray-500 text-center">
            Didn’t receive a code?{" "}
            <button
              type="button"
              className="text-sm text-blue-600 ml-1 hover:underline hover:cursor-pointer"
              onClick={onResend}
            >
              Resend
            </button>
          </p>

          <div className="flex justify-center gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="hover:cursor-pointer">
              Verify
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
