import { google } from "@/lib/social-login/google";
import { generateState, generateCodeVerifier } from "arctic";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, {
    scopes: ["profile", "email"],
    codeVerifier,
  });

  const secure = process.env.NODE_ENV === "production";

  // ✅ Lưu cả `state` và `codeVerifier` vào cookie
  cookies().set("state", state, {
    path: "/",
    secure,
    httpOnly: true,
    maxAge: 600,
    sameSite: "lax",
  });

  cookies().set("codeVerifier", codeVerifier, {
    path: "/",
    secure,
    httpOnly: true,
    maxAge: 600,
    sameSite: "lax",
  });

  return Response.redirect(url);
}