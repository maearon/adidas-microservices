// app/api/jwt/route.ts
import { NextResponse } from "next/server";
import { generateJWT } from "@/lib/jwt";
import { auth } from "@/lib/auth"; // better-auth server instance

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = {
      sub: session.user.id,
      // email: session.user.email,
      // name: session.user.name,
    }

    const token = await generateJWT(payload, "7d");

    return NextResponse.json({ token });
  } catch (err) {
    console.error("JWT generation failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
