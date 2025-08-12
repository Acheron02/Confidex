import { Button } from "@/components/ui/button";
import { PhoneInput } from "../ui/phone-input";
import { Label } from "../ui/label";
import { DialogClose } from "@/components/ui/dialog";



interface LoginProps {
  onSwitchToRegister: () => void;
  onSwitchToAdmin: () => void; 
}

export function Login({ onSwitchToRegister, onSwitchToAdmin }: LoginProps) {
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

      <div className="mt-auto flex justify-end gap-2">
        <DialogClose asChild>
          <Button variant="outline" type="button" formNoValidate className="hover:cursor-pointer">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="hover:cursor-pointer">Send OTP</Button>
      </div>
    </form>
  );
}
