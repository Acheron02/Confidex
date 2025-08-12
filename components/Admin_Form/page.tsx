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
        <div className="relative w-full">
          <Input
            name="password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            required
            className="pr-10" // space for the icon
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full px-3"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </Button>
        </div>
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
          <Button variant="outline" type="button" formNoValidate>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">Log In</Button>
      </div>
    </form>
  );
}
