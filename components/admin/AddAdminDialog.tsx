"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "../passwordInput";

interface Props {
  onClose: () => void;
  onAdd: (name: string, email: string, password: string) => void;
  adding?: boolean;
}

const AddAdminDialog: FC<Props> = ({ onClose, onAdd, adding }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = () => {
    if (!name || !email || !password) return;
    onAdd(name, email, password);
  };

  return (
    <div className="fixed inset-0 bg-[#000000e7] flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <input
              id="name"
              type="text"
              placeholder="Full Name"
              className="border px-3 py-2 rounded w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="border px-3 py-2 rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter password"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={adding}
            className="hover:cursor-pointer"
          >
            {adding ? "Adding..." : "Add Admin"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminDialog;
