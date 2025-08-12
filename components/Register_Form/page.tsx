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
  DialogClose
} from "@/components/ui/dialog";

interface RegisterProps {
  onSwitchToLogin: () => void;
  onSwitchToAdmin: () => void;
}

export function Register({ onSwitchToLogin, onSwitchToAdmin }: RegisterProps) {
  return (
    <form
      className="flex flex-col flex-grow"
      method="POST"
      action="/api/register"
    >
      {/* Your form fields here */}
      <div className="grid gap-1">
        <Label htmlFor="number">Phone Number</Label>
        <PhoneInput
          defaultCountry="PH"
          international
          name="number"
          className="mb-4"
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="gender">Gender</Label>
        <Select name="gender">
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
      <div className="grid gap-1">
        <Label htmlFor="date">Date of Birth</Label>
        <Calendar22 />
      </div>
      <div className="grid gap-5 mt-1 mb-1">
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
            onClick={onSwitchToAdmin}
            className="text-sm text-blue-600 ml-1 hover:underline hover:decoration-2 hover:cursor-pointer"
          >
            Admin?
          </button>
        </p>
      </div>
      <div className="flex flex-initial justify-end gap-2 mt-auto">
        <DialogClose asChild>
          <Button
            variant="outline"
            formNoValidate
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
  );
}
