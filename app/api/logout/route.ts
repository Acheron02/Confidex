// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the auth_token cookie
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // expire immediately
  });

  return response;
}
