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
  
    const handleVerificationSubmit = (code: string) => {
      console.log("Verification code entered:", code);
      // TODO: Call your API or complete registration flow here
      setOpen(false);
    };
  return (
    <form className="flex flex-col flex-grow" method="POST" action="/api/login">
      <div className="grid gap-1">
        <Label htmlFor="number">Phone Number</Label>
        <PhoneInput
          defaultCountry="PH"
          international
          name="number"
          className="mb-4"
        />
      </div>
      <div className="grid gap-5 mt-5 mb-1">
        <p className="text-sm text-gray-500 text-center ml-0.5">
          Don't have an account?{" "}
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
          <Button type="button" variant="outline" className="hover:cursor-pointer">
            Cancel
          </Button>
        </DialogClose>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" className="hover:cursor-pointer">
              Login
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
  );
}
