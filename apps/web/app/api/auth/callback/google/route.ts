import { google } from "@/lib/social-login/google";
import axios from "axios";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const storedState = cookies().get("state")?.value;
  const codeVerifier = cookies().get("code_verifier")?.value;

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return new Response("Invalid state or code", { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    // Lấy thông tin user từ Google
    const { data: googleUser } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const { id: providerId, email } = googleUser;

    // Gửi thông tin đến backend Java
    const response = await axios.post("http://localhost:8080/api/users/social-login", {
      session: {
        provider: "google",
        providerId,
        email,
      },
    });

    const { token, user } = response.data;

    // Ghi token BE vào cookie
    cookies().set("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    // Optional: ghi user JSON (nếu cần dùng client-side nhanh)
    cookies().set("user", JSON.stringify(user), {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/", // Redirect về trang chủ hoặc dashboard
      },
    });
  } catch (err) {
    console.error("Google OAuth Error:", err);

    if (err instanceof OAuth2RequestError) {
      return new Response("OAuth2 request failed", { status: 400 });
    }

    return new Response("Internal server error", { status: 500 });
  }
}