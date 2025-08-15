// /app/api/sessions/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  // Call Java backend to get session user info
  const BASE_URL = process.env.NODE_ENV === "development"
      ? "http://localhost:9000/api"
      : "https://adidas-microservices.onrender.com/api"

  const res = await fetch(`${BASE_URL}/sessions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Invalid token" }, { status: res.status });
  }

  const user = await res.json();
  return NextResponse.json(user);
}
