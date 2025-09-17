// apps/web/src/app/api/auth/check-email/route.ts
import { db } from "@/db";
import { user as users } from "@/db/schema"; // 👉 đổi alias cho rõ ràng
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({
          exists: false,
          user: null,
          _status: 400,
          error: "Invalid email",
        }),
        { status: 400 }
      );
    }

    // Check trong DB
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        emailVerified: users.emailVerified, // cột trong better-auth
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      return new Response(
        JSON.stringify({
          exists: false,
          user: null,
          _status: 200,
        }),
        { status: 200 }
      );
    }

    const foundUser = result[0]; // 👉 đổi tên ở đây

    return new Response(
      JSON.stringify({
        exists: true,
        user: {
          activated: !!foundUser.emailVerified,
        },
        _status: 200,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("check-email error:", error);
    return new Response(
      JSON.stringify({
        exists: false,
        user: null,
        _status: 500,
        error: "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
