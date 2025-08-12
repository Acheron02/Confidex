import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react"; 
import { DialogClose } from "@/components/ui/dialog";


interface LoginProps {
  onSwitchToLogin: () => void;
}

export function AdminLogin({ onSwitchToLogin }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <form className="flex flex-col flex-grow" method="POST" action="/api/login">
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
        <Input
          name="password"
          id="password"
          className="mb-3"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-2 -translate-y-1/2 top-[55%] "
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </Button>
      </div>
      <div className="grid gap-5 mt-3 mb-1">
        <p className="text-sm text-gray-500 text-center ml-0.5">
          I'm not an Admin.{" "}
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
          <Button variant="outline" type="button" formNoValidate className="hover:cursor-pointer">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="hover:cursor-pointer">Log In</Button>
      </div>
    </form>
  );
}
