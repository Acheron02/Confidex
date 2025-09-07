"use client";

import { AuthProvider } from "./AuthContext";

export const AuthProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};
