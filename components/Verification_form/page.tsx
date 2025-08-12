"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTPPattern } from "../inputOTP";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";


interface VerificationFormProps {
  onSubmit: (code: string) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  defaultCode?: string;
}

export function VerificationForm({
  onSubmit,
  onCancel,
  title = "Verification",
  description = "Please verify your details before proceeding.",
  defaultCode = "",
}: VerificationFormProps) {
  const [code, setCode] = useState(defaultCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid justify-center items-center">
        <Label
          htmlFor="verificationCode"
          className="items-center justify-center my-3"
        >
          Verification Code
        </Label>
        <InputOTPPattern />
      </div>
      <div>
        <p className="text-sm text-gray-500 text-center ml-0.5">
          Didn't receive a Code?{""}
          <button
            type="button"
            className="text-sm text-blue-600 ml-1 hover:underline hover:decoration-2 hover:cursor-pointer"
          >
            Resend
          </button>
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {onCancel && (
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel} className="hover:cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
        )}
        <Button type="submit" className="hover:cursor-pointer">Verify</Button>
      </div>
    </form>
  );
}
