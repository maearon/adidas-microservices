import { google } from "@/lib/social-login/google";
import axiosInstance from "@/lib/axios";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { OAuth2RequestError } from "arctic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const storedState = cookies().get("state")?.value;
  const codeVerifier = cookies().get("code_verifier")?.value;

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return new Response("Invalid OAuth flow", { status: 400 });
  }

  try {
    // Exchange code for tokens
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    // Fetch user info from Google
    const googleUser = await axiosInstance
      .get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      .json<{ id: string; email: string; name: string }>();

    // Check if user already exists (by googleId or email)
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleUser.id },
          { email: googleUser.email ?? undefined },
        ],
      },
    });

    if (!user) {
      // Create new user if not exists
      const now = new Date().toISOString();
      user = await prisma.user.create({
        data: {
          googleId: googleUser.id,
          email: googleUser.email,
          displayName: googleUser.name,
          username: googleUser.email?.split("@")[0] ?? `user-${googleUser.id.slice(0, 5)}`,
          created_at: now,
          updated_at: now,
        },
      });
    } else if (!user.googleId) {
      // If user exists but missing googleId, update it
      await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.id,
          updated_at: new Date().toISOString(),
        },
      });
    }

    // Call Java backend to get JWT
    const BASE_URL = process.env.NODE_ENV === "development"
      ? "http://localhost:9000/api"
      : "https://adidas-microservices.onrender.com/api"
    
    const apiRes = await fetch(`${BASE_URL}/social-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: googleUser.email,
        googleId: googleUser.id,
      }),
    });

    if (!apiRes.ok) {
      console.error(await apiRes.text());
      return new Response("Failed to login via backend", { status: 401 });
    }

    const { token, user: javaUser } = await apiRes.json();

    // Save token to HttpOnly cookie (optional: or localStorage from frontend)
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // ✅ Redirect to home or dashboard
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (err) {
    console.error("OAuth error:", err);
    if (err instanceof OAuth2RequestError) {
      return new Response("OAuth2 failed", { status: 400 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
