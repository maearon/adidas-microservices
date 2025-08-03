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

  if (!code || !state || !storedState || state !== storedState) {
    return new Response("Invalid OAuth flow", { status: 400 });
  }

  try {
    const codeVerifier = cookies().get("codeVerifier")?.value;

    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const { data: googleUser } = await axiosInstance.get<{
      sub: string;
      email: string;
      name: string;
      given_name: string;
      family_name: string;
      picture: string;
    }>("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const BASE_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:9000/api"
        : "https://adidas-microservices.onrender.com/api";

    const apiRes = await fetch(`${BASE_URL}/social-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session: {
          email: googleUser.email,
          providerId: googleUser.sub, // ✅ dùng sub làm providerId
          provider: "google",
          givenName: googleUser.given_name, // ✅ truyền thêm
          familyName: googleUser.family_name,
        },
      }),
    });

    if (!apiRes.ok) {
      console.error(await apiRes.text());
      return new Response("Failed to login via backend", { status: 401 });
    }

    const { token } = await apiRes.json();

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}