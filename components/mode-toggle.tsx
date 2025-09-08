"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-12 h-12 rounded-3xl hover:cursor-pointer"
    >
      <Sun className="h-[1.5rem] w-[1.5rem] dark:hidden" />
      <Moon className="hidden h-[1.5rem] w-[1.5rem] dark:block" />
      <span className="sr-only z-9999999 absolute">Toggle theme</span>
    </Button>
  );
}
