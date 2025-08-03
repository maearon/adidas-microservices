import { google, lucia } from "@/auth";
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
    return new Response(null, { status: 400 });
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

    // Gọi đến Java backend để xác thực hoặc tạo user
    const { data } = await axios.post("http://localhost:8080/api/users/social-login", {
      session: {
      provider: "google",
      providerId,
      email,
      }
    });

    const { token, user } = data;

    // Tạo session với Lucia (dùng user.id từ backend)
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // Có thể set token backend nếu muốn chia sẻ cho frontend gọi API sau này
    cookies().set("backend_token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (err) {
    console.error("Google OAuth error:", err);
    if (err instanceof OAuth2RequestError) {
      return new Response("Invalid OAuth request", { status: 400 });
    }
    return new Response("Internal server error", { status: 500 });
  }
}