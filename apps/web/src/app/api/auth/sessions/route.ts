import { NextResponse } from "next/server";
import { verifyJWT, generateJWT } from "@/lib/jwt";
import { db } from "@/db";
import { user as users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getGravatarUrl } from "@/utils/gravatar";
import { getUiAvatarUrl } from "@/utils/ui-avatar";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId: string | undefined;
    let token: string | undefined;
    let tokenInvalid = false;

    // 🟦 1. Ưu tiên kiểm tra Bearer token nếu có
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];

      try {
        const decoded = verifyJWT(token) as { sub?: string } | null;
        if (decoded?.sub) {
          userId = decoded.sub;
        } else {
          tokenInvalid = true;
        }
      } catch (err) {
        // verifyJWT sẽ throw nếu token hết hạn hoặc sai chữ ký
        tokenInvalid = true;
      }
    }

    // 🟩 2. Nếu token invalid nhưng có thể có session hợp lệ trên server → fallback sang Better Auth
    if ((!userId || tokenInvalid) && !authHeader) {
      const session = await auth.api.getSession({ headers: req.headers });
      if (session?.user) {
        userId = session.user.id;
        // Tạo mới access token dựa trên session hiện có
        token = generateJWT({ sub: userId }, "1h");
        tokenInvalid = false;
      }
    }

    // 🟥 3. Nếu không có token hợp lệ và không có session ⇒ 401
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🧭 4. Nếu token được truyền lên nhưng invalid ⇒ 403 (để client refresh)
    if (tokenInvalid) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
    }

    // 🧭 5. Lấy thông tin user từ DB
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🧩 6. Avatar ưu tiên: image → gravatar → ui-avatar
    const avatar =
      user.image || getGravatarUrl(user.email) || getUiAvatarUrl(user.name);

    // ✅ 7. Trả format giống Rails
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar,
        token, // luôn đảm bảo có token trả về nếu có session hợp lệ
      },
    });
  } catch (err) {
    console.error("Session fetch failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
