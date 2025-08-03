import { google } from "@/lib/social-login/google";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();

  const url = await google.createAuthorizationURL(state, {
    scopes: ["profile", "email"],
  });

  const secure = process.env.NODE_ENV === "production";

  // ✅ Chỉ lưu state
  cookies().set("state", state, {
    path: "/",
    secure,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}