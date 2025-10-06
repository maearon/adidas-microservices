// lib/jwt.ts
import { SignJWT, jwtVerify, JWTPayload, JWTVerifyResult, errors } from "jose";

// Đảm bảo có secret
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("Missing JWT_SECRET in environment variables");

const JWT_SECRET = new TextEncoder().encode(secret);

/**
 * Sinh JWT (HS512) có thời hạn tùy chọn, mặc định 7 ngày.
 */
export async function generateJWT<T extends JWTPayload>(
  payload: T,
  expiresIn: string = "7d"
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS512" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

/**
 * Xác thực JWT, trả về payload nếu hợp lệ, null nếu sai hoặc hết hạn.
 */
export async function verifyJWT<T extends JWTPayload>(
  token: string
): Promise<T | null> {
  try {
    const { payload }: JWTVerifyResult = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS512"],
    });
    return payload as T;
  } catch (err: unknown) {
    if (err instanceof errors.JWTExpired) {
      console.warn("JWT expired");
    } else if (err instanceof errors.JWTInvalid) {
      console.warn("JWT invalid");
    } else {
      console.error("JWT verification failed:", err);
    }
    return null;
  }
}

