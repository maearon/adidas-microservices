import { NextResponse } from "next/server";
import { verifyJWT, generateJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refresh token" }, { status: 400 });
    }

    // 🧠 Xác minh refresh token
    const decoded = verifyJWT(refreshToken) as { sub: string } | null;

    if (!decoded?.sub) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    const userId = decoded.sub;
    const now = Date.now();

    // 🧾 Sinh token mới
    const accessExpiresInMs = 3600 * 1000; // 1h
    const refreshExpiresInMs = 24 * 3600 * 1000; // 1d

    const newAccessToken = generateJWT({ sub: userId }, "1h");
    const newRefreshToken = generateJWT({ sub: userId }, "1d");

    return NextResponse.json({
      tokens: {
        access: {
          token: newAccessToken,
          expires: new Date(now + accessExpiresInMs).toISOString(),
        },
        refresh: {
          token: newRefreshToken,
          expires: new Date(now + refreshExpiresInMs).toISOString(),
        },
      },
    });
  } catch (err) {
    console.error("Refresh token failed", err);
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }
}
